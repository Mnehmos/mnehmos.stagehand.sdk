/**
 * The whiteboard plugin (FR-228, FR-230, FR-231, FR-234).
 *
 * Owns a `BoardDocument` and turns committed effects into document changes. It provides exactly
 * three things to the core pipeline, none of which is a trust path of its own:
 *
 * 1. **Schemas** — the 15 VC-superset actions.
 * 2. **A contributed entity stage** — target and `content_ref` resolution.
 * 3. **A committer** — the adapter that applies accepted effects to its own document.
 *
 * The committer is the only place the revision moves, which is what makes "a rejected command does
 * not advance the revision" true by construction rather than by remembering.
 */

import { CapabilityRegistry } from '@stagehand/registry';
import { ReadinessGate, type WaitResult } from '@stagehand/readiness';
import type { CanonicalEffect, EffectCommitter, ValidationStage } from '@stagehand/runtime';
import type { EventBus } from '@stagehand/trace';
import { THINKING_ACTIONS, WHITEBOARD_SCHEMAS } from './contracts.js';
import { boardResolutionStage } from './resolve.js';
import {
  elementById,
  EMPTY_BOARD,
  reduce,
  type BoardChange,
  type BoardDocument,
  type BoardElementKind,
  type BoardLayer,
} from './types.js';

/** Actions that hide rather than clear. Named so the distinction is greppable. */
const HIDE = 'whiteboard.hide';
const SHOW = 'whiteboard.show';
const CLEAR = 'whiteboard.clear';
const ERASE = 'whiteboard.erase';
const REVEAL = 'whiteboard.reveal';
const COUNT = 'whiteboard.count';
const HIGHLIGHT = 'whiteboard.highlight';

/** Element kind implied by each creating action. */
const KIND_OF_ACTION: Readonly<Record<string, BoardElementKind>> = {
  'whiteboard.text': 'text',
  'whiteboard.math': 'math',
  'whiteboard.line': 'line',
  'whiteboard.box': 'box',
  'whiteboard.arrow': 'arrow',
  'whiteboard.highlight': 'highlight',
  'whiteboard.scribble': 'scribble',
  'whiteboard.dots': 'dots',
  'whiteboard.shape': 'shape',
  'whiteboard.count': 'count',
};

/**
 * Marks that carry no `id` of their own and are named from the element they annotate.
 *
 * `highlight` is the case: the source gives it `target` and no `id`, because a highlight is a mark
 * *over* an element rather than an element in its own right. The id is therefore derived from the
 * target, deterministically, so re-highlighting the same element replaces its mark rather than
 * accumulating one per call.
 */
const MARK_ID_PREFIX: Readonly<Record<string, string>> = {
  [HIGHLIGHT]: 'highlight',
  [COUNT]: 'count',
};

/**
 * Which layer an action commits to (FR-231).
 *
 * Derived from the recovered contract table rather than restated here. Three actions produce
 * thinking-surface marks, not one: `scribble` ("thinking-surface marks never become truth-surface
 * content"), `highlight` ("a thinking-surface mark over a truth-surface element"), and `count` (its
 * numbering is an annotation over the counted element). An earlier version of this file treated
 * scribble as the sole exception, which is the kind of quiet simplification the source review caught.
 */
function layerFor(action: string): BoardLayer {
  return THINKING_ACTIONS.includes(action) ? 'thinking' : 'truth';
}

/**
 * The content a creating action stores.
 *
 * `content_ref` wins where the action declares it: the source says long prose and anything with
 * braces belongs in the reference rather than inline, so the resolved reference *is* the content and
 * is stored byte for byte. Only when there is no reference does the inline kwarg supply it.
 */
function contentOf(
  action: string,
  payload: Readonly<Record<string, unknown>>,
  resolveRef: (reference: string) => string | undefined,
): string {
  const kwargs = payload['kwargs'];
  if (kwargs === null || typeof kwargs !== 'object') return '';
  const record = kwargs as Record<string, unknown>;

  const reference = record['content_ref'];
  if (typeof reference === 'string' && reference !== '') {
    const resolved = resolveRef(reference);
    if (resolved !== undefined) return resolved;
  }

  // Per-action preference, matching what each contract declares as its payload.
  const preferred: Readonly<Record<string, readonly string[]>> = {
    'whiteboard.text': ['text'],
    'whiteboard.math': ['latex'],
    'whiteboard.scribble': ['points'],
    'whiteboard.shape': ['shape'],
    'whiteboard.dots': ['count'],
    'whiteboard.box': ['label'],
    'whiteboard.arrow': ['label'],
    'whiteboard.line': [],
    'whiteboard.highlight': [],
    'whiteboard.count': [],
  };
  for (const key of preferred[action] ?? []) {
    const value = record[key];
    if (typeof value === 'string' && value !== '') return value;
  }
  return '';
}

function attributesOf(payload: Readonly<Record<string, unknown>>): Record<string, string> {
  const kwargs = payload['kwargs'];
  if (kwargs === null || typeof kwargs !== 'object') return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(kwargs as Record<string, unknown>)) {
    if (typeof value === 'string') out[key] = value;
  }
  return out;
}

/** Options for the board taking ownership of a document. */
export interface WhiteboardPluginOptions {
  /** The plugin name stamped on effects and used as the committer's identity. */
  readonly plugin?: string;
  /** Called after each committed change with the new document. */
  readonly onChange?: (document: BoardDocument, change: BoardChange) => void;
  /**
   * Records `board.revision.committed` on the public channel after each committed change.
   *
   * The event type is `FEAT-005`'s — the plugin is its producer, not its owner — so the bus's channel
   * map must carry it, which `ChannelMap.core()` already does.
   */
  readonly bus?: EventBus;
  /**
   * Readiness gate used to make board targets awaitable.
   *
   * A host that wants to issue `[whiteboard.highlight target=e1]` immediately after committing `e1`
   * should `await plugin.whenReady('e1')` rather than assume the commit has landed. Resolution
   * against a stale document is rejected rather than guessed, so waiting is the alternative to a
   * rejection — and `FEAT-006`'s gate is exactly the primitive for it.
   */
  readonly gate?: ReadinessGate;
}

export class WhiteboardPlugin implements EffectCommitter {
  readonly plugin: string;
  readonly #registry: CapabilityRegistry;
  readonly #onChange: ((document: BoardDocument, change: BoardChange) => void) | undefined;
  readonly #bus: EventBus | undefined;
  readonly #gate: ReadinessGate | undefined;
  #document: BoardDocument = EMPTY_BOARD;

  constructor(options: WhiteboardPluginOptions = {}) {
    this.plugin = options.plugin ?? 'whiteboard';
    this.#onChange = options.onChange;
    this.#bus = options.bus;
    this.#gate = options.gate;
    this.#registry = new CapabilityRegistry(WHITEBOARD_SCHEMAS);
  }

  /** The plugin's own registry, holding its 15 schemas. */
  get registry(): CapabilityRegistry {
    return this.#registry;
  }

  /** The board as it currently stands. */
  get document(): BoardDocument {
    return this.#document;
  }

  get revision(): number {
    return this.#document.revision;
  }

  /**
   * The entity-layer stage to hand to `validateCommand` / `executeStagehandCommand`.
   *
   * Reads the live document rather than a snapshot, so resolution is always against the current
   * board: a sequence that commits `e1` and then erases `e1` must see `e1` on the second command.
   */
  get stage(): ValidationStage {
    return boardResolutionStage(() => this.#document);
  }

  /** Convenience: the stages a caller should pass, wrapped so it cannot be forgotten. */
  get stages(): readonly ValidationStage[] {
    return [this.stage];
  }

  /**
   * Wait until a board element exists, or the deadline elapses.
   *
   * @returns `FEAT-006`'s wait result. Check `resumable` rather than `settled`: a barge-in settles
   *   the gate too, and a caller that treats settled as ready would resolve against a board that a
   *   superseded turn is still writing.
   */
  async whenReady(elementId: string, deadlineMs?: number): Promise<WaitResult> {
    if (this.#gate === undefined) {
      throw new Error('whenReady requires a readiness gate; pass one in WhiteboardPluginOptions');
    }
    if (elementById(this.#document, elementId) !== undefined) {
      return this.#gate.wait([elementId], deadlineMs);
    }
    this.#gate.mark(elementId);
    return this.#gate.wait([elementId], deadlineMs);
  }

  /**
   * Stored content for a reference, or `undefined`. Byte for byte as committed (FR-232).
   *
   * Read from the element rather than from a parallel map: a second copy is a second thing to keep in
   * step, and the one that goes stale is always the one nobody reads directly.
   */
  contentFor(reference: string): string | undefined {
    return elementById(this.#document, reference)?.content;
  }

  /**
   * Apply a batch of committed effects (FR-228, FR-230, FR-231, FR-234).
   *
   * This is the committer's contract from `EffectCommitter`: it is called at most once per command or
   * group, only after everything is authorized, and it owns whether its own write lands whole. It
   * applies the batch in order and advances the revision once per change, so a caller that recorded
   * the revision before a rejected command will find it unchanged — the rejection never reached here.
   */
  commit(effects: readonly CanonicalEffect[]): void {
    for (const effect of effects) {
      const change = this.#changeFor(effect);
      if (change === undefined) continue;
      this.#document = reduce(this.#document, change);

      // Reported after the document moved, so a listener reading the plugin sees the new revision
      // rather than the one it replaced.
      this.#bus?.emitPublic('board.revision.committed', { revision: this.#document.revision });

      // Settling an unmarked key is harmless (FEAT-006), so a commit needs no matching waiter.
      if (change.kind === 'commit') this.#gate?.settle(change.element.id);

      this.#onChange?.(this.#document, change);
    }
  }

  /** Translate one effect into a document change, or `undefined` for an action with no state effect. */
  #changeFor(effect: CanonicalEffect): BoardChange | undefined {
    const payload = effect.payload;
    const kwargs = (payload['kwargs'] ?? {}) as Record<string, unknown>;

    switch (effect.action) {
      case SHOW:
        return { kind: 'show' };
      case HIDE:
        // Occlude. Deliberately its own case rather than falling through to `clear`.
        return { kind: 'hide' };
      case CLEAR: {
        const layer = kwargs['layer'];
        const selected = layer === 'truth' || layer === 'thinking' || layer === 'all' ? layer : 'all';
        return { kind: 'clear', layer: selected };
      }
      case ERASE: {
        const target = kwargs['target'];
        // The reducer also removes marks linked to this element, so a count annotation does not
        // outlive the thing it numbers.
        return typeof target === 'string' ? { kind: 'remove', id: target } : undefined;
      }
      case REVEAL: {
        const target = kwargs['target'];
        return typeof target === 'string' ? { kind: 'reveal', id: target } : undefined;
      }
      default: {
        const kind = KIND_OF_ACTION[effect.action];
        if (kind === undefined) return undefined;

        // A mark names itself from its target when the contract gives it no `id`: `highlight` and
        // `count` both annotate an element rather than being one. `count` accepts an optional id for
        // the annotation group, which wins when supplied.
        const prefix = MARK_ID_PREFIX[effect.action];
        const target = typeof kwargs['target'] === 'string' ? kwargs['target'] : '';
        const declaredId = typeof kwargs['id'] === 'string' ? kwargs['id'] : '';

        let id = declaredId;
        if (id === '' && prefix !== undefined) {
          if (target === '') return undefined;
          id = `${prefix}:${target}`;
        }
        if (id === '') return undefined;

        const attributes = attributesOf(payload);
        // Marks are linked to what they annotate, which is how erasing the target cleans them up.
        if (prefix !== undefined && target !== '') attributes['target'] = target;

        return {
          kind: 'commit',
          element: {
            id,
            kind,
            layer: layerFor(effect.action),
            content: contentOf(effect.action, payload, (reference) => this.contentFor(reference)),
            attributes,
          },
        };
      }
    }
  }
}

/**
 * A committer that owns a board and reports its revision (FR-228).
 *
 * Wraps `WhiteboardPlugin` for callers that only need "apply effects and tell me the revision".
 */
export function whiteboardCommitter(options: WhiteboardPluginOptions = {}): {
  readonly committer: EffectCommitter;
  readonly plugin: WhiteboardPlugin;
} {
  const plugin = new WhiteboardPlugin(options);
  return { committer: plugin, plugin };
}

export { WHITEBOARD_SCHEMAS };

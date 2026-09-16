/**
 * The whiteboard plugin: reducer, committer, and the seams a host injects.
 *
 * Recovered from the pinned reducer (`src/board/document.ts`), validator (`src/stagehand/validator.ts`)
 * and runtime (`src/app/runtime.ts`) at `cd7253608297efd57921c965b7440f4d4081842f` — not from the
 * schema file alone. The behaviors that only the reducer reveals:
 *
 * - **`show` has page semantics.** It creates a named page, reopens one with its content intact, and
 *   updates a title. Accepting those kwargs and discarding them is not parity.
 * - **A no-op does not advance the revision.** An unknown target, an uncountable source, or a clear
 *   that wipes nothing leaves the document — and its revision — untouched.
 * - **`count` computes a total** from the target and `what`, and no-ops when the requested thing is
 *   not countable rather than numbering zero things.
 * - **`highlight` expires.** `duration=0` means permanent until cleared, which is why expiry is
 *   `number | null`.
 * - **`reveal` carries timing**, starting progress at 0 with a duration, not flipping an invented
 *   attribute.
 * - **`content_ref` resolves through an injected lesson-content resolver**, not against the board.
 */

import { CapabilityRegistry } from '@stagehand/registry';
import { ReadinessGate, type WaitResult } from '@stagehand/readiness';
import type { CanonicalEffect, EffectCommitter, ValidationStage } from '@stagehand/runtime';
import type { EventBus } from '@stagehand/trace';
import { THINKING_ACTIONS, WHITEBOARD_SCHEMAS } from './contracts.js';
import { boardRegistryStage, boardResolutionStage, boardSpatialStage, boardStateStage, NULL_CONTENT_RESOLVER, type ContentResolver } from './resolve.js';
import {
  activeElements,
  activePage,
  countableTotal,
  elementById,
  EMPTY_BOARD,
  pageById,
  reduce,
  type BoardBounds,
  type BoardChange,
  type BoardDocument,
  type BoardElementKind,
  type BoardLayer,
} from './types.js';

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
 * Marks named from their target rather than from a declared id.
 *
 * `highlight` and `count` both annotate an element instead of being one, so their id is derived
 * deterministically from the target — which makes annotating the same element twice an update rather
 * than a second mark.
 */
const MARK_ID_PREFIX: Readonly<Record<string, string>> = {
  [HIGHLIGHT]: 'highlight',
  [COUNT]: 'count',
};

/**
 * Preferred content kwarg per action.
 *
 * `text`/`math` are absent because their content comes from `content_ref` or the inline kwarg, which
 * `resolveContent` handles; `count` and `highlight` carry no content at all.
 */
const CONTENT_KEY: Readonly<Record<string, string>> = {
  'whiteboard.text': 'text',
  'whiteboard.math': 'latex',
  'whiteboard.scribble': 'points',
  'whiteboard.shape': 'shape',
  'whiteboard.dots': 'count',
  'whiteboard.box': 'label',
  'whiteboard.arrow': 'label',
};

export interface WhiteboardPluginOptions {
  readonly plugin?: string;
  readonly onChange?: (document: BoardDocument, change: BoardChange) => void;
  /** Records `board.revision.committed` on the public channel after each committed change. */
  readonly bus?: EventBus;
  /** Makes board targets awaitable. */
  readonly gate?: ReadinessGate;
  /**
   * Resolves `content_ref` from the host's lesson content pack.
   *
   * Required for `content_ref` to mean anything: the pin resolves through an injected seam, and a
   * reference the pack does not hold yields empty content rather than a refusal.
   */
  readonly resolveContent?: ContentResolver;
  /** Injected clock, used only for highlight expiry. Defaults to `Date.now`. */
  readonly clock?: () => number;
}

/**
 * Write-on budget per creating action, in milliseconds (document.ts:427-596).
 *
 * "Elements animate in over revealMs" — the pin assigns each action its own pace, so a fraction
 * typesets slower than a word of text appears and a highlight lands near-instantly. `count` is not
 * in this table because its budget scales with the thing counted: `max(400, total * pace)`.
 */
const WRITE_ON_MS: Readonly<Record<string, number>> = {
  'whiteboard.text': 700,
  'whiteboard.math': 1100,
  'whiteboard.line': 500,
  'whiteboard.box': 600,
  'whiteboard.arrow': 600,
  'whiteboard.highlight': 300,
  'whiteboard.scribble': 700,
  'whiteboard.dots': 900,
  'whiteboard.shape': 800,
};

/** Bounds a producer's declared coordinates describe, in the recovered 0-100 space. */
function boundsOf(kwargs: Readonly<Record<string, unknown>>, action: string): BoardBounds {
  const num = (key: string, fallback: number): number => {
    const value = Number(kwargs[key]);
    return Number.isFinite(value) ? value : fallback;
  };
  if (action === 'whiteboard.line' || action === 'whiteboard.arrow') {
    const x1 = num('x1', action === 'whiteboard.arrow' ? 30 : 20);
    const y1 = num('y1', 50);
    const x2 = num('x2', action === 'whiteboard.arrow' ? 70 : 80);
    const y2 = num('y2', 50);
    return { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) };
  }
  if (action === 'whiteboard.box') {
    const centerX = num('x', 50);
    const centerY = num('y', 50);
    const width = num('width', 28);
    const height = num('height', 18);
    return { x: centerX - width / 2, y: centerY - height / 2, width, height };
  }
  // Point-anchored elements. Automatic placement and collision avoidance are renderer-side in the
  // pin; the headless contract carries the point and a nominal box around it. See DIV-012.
  const x = num('x', 50);
  const y = num('y', 50);
  return { x, y, width: 0, height: 0 };
}

export class WhiteboardPlugin implements EffectCommitter {
  readonly plugin: string;
  readonly #registry: CapabilityRegistry;
  readonly #onChange: ((document: BoardDocument, change: BoardChange) => void) | undefined;
  readonly #bus: EventBus | undefined;
  readonly #gate: ReadinessGate | undefined;
  readonly #resolveContent: ContentResolver;
  readonly #clock: () => number;
  #document: BoardDocument = EMPTY_BOARD;

  constructor(options: WhiteboardPluginOptions = {}) {
    this.plugin = options.plugin ?? 'whiteboard';
    this.#onChange = options.onChange;
    this.#bus = options.bus;
    this.#gate = options.gate;
    this.#resolveContent = options.resolveContent ?? NULL_CONTENT_RESOLVER;
    this.#clock = options.clock ?? Date.now;
    this.#registry = new CapabilityRegistry(WHITEBOARD_SCHEMAS);
  }

  get registry(): CapabilityRegistry {
    return this.#registry;
  }

  get document(): BoardDocument {
    return this.#document;
  }

  get revision(): number {
    return this.#document.revision;
  }

  /** Elements on the active page. */
  get elements(): readonly import('./types.js').BoardElement[] {
    return activeElements(this.#document);
  }

  /** The entity-layer stage to hand to `validateCommand` / `executeStagehandCommand`. */
  get stage(): ValidationStage {
    return boardResolutionStage(() => this.#document);
  }

  /** All four contributed stages, in pipeline order. */
  get stages(): readonly ValidationStage[] {
    return [boardRegistryStage(), this.stage, boardStateStage(() => this.#document), boardSpatialStage()];
  }

  /** Resolve a lesson-content reference the way the runtime does. */
  resolveContent(reference: string): string | undefined {
    return this.#resolveContent(reference);
  }

  /**
   * Stored content for a board element, byte for byte.
   *
   * Read from the element rather than a parallel map: a second copy is a second thing to keep in step,
   * and the one that goes stale is always the one nobody reads directly.
   */
  contentFor(elementId: string): string | undefined {
    return elementById(this.#document, elementId)?.content;
  }

  /** Wait until a board element exists, or the deadline elapses. */
  async whenReady(elementId: string, deadlineMs?: number): Promise<WaitResult> {
    if (this.#gate === undefined) {
      throw new Error('whenReady requires a readiness gate; pass one in WhiteboardPluginOptions');
    }
    if (elementById(this.#document, elementId) !== undefined) return this.#gate.wait([elementId], deadlineMs);
    this.#gate.mark(elementId);
    return this.#gate.wait([elementId], deadlineMs);
  }

  /**
   * Advance reveal progress and retire expired marks.
   *
   * Separate from `commit` because the pin drives it from the render loop each frame. A host that
   * never renders never spends a revision here; one that does gets the same retirement behavior.
   */
  advance(elapsedMs: number): BoardDocument {
    const next = reduce(this.#document, { kind: 'advance', deltaMs: elapsedMs }, this.#clock());
    return this.#adopt(next);
  }

  /**
   * Apply a batch of committed effects.
   *
   * Called at most once per command or group, only after everything is authorized. A change that turns
   * out to be a no-op leaves the document — and the revision — exactly as it was, which is what makes
   * the revision count changes rather than commands.
   */
  commit(effects: readonly CanonicalEffect[]): void {
    for (const effect of effects) {
      const change = this.#changeFor(effect);
      if (change === undefined) continue;
      const before = this.#document;
      const next = reduce(before, change, this.#clock());
      // A mark whose derived id is unchanged still needs its expiry refreshed, which `reduce` reports
      // as a change; a genuine no-op returns the same reference and is skipped entirely.
      if (next === before) continue;
      this.#adopt(next);
      this.#bus?.emitPublic('board.revision.committed', { revision: next.revision });
      if (change.kind === 'commit') this.#gate?.settle(change.element.id);
      this.#onChange?.(next, change);
    }
  }

  #adopt(next: BoardDocument): BoardDocument {
    this.#document = next;
    return next;
  }

  /** Translate one effect into a document change, or `undefined` for an action with no state effect. */
  #changeFor(effect: CanonicalEffect): BoardChange | undefined {
    const kwargs = (effect.payload['kwargs'] ?? {}) as Record<string, unknown>;
    const str = (key: string): string => (typeof kwargs[key] === 'string' ? (kwargs[key] as string) : '');

    switch (effect.action) {
      case SHOW: {
        const page = str('page');
        const title = str('title');
        return {
          kind: 'show',
          ...(page === '' ? {} : { page }),
          ...(title === '' ? {} : { title }),
        };
      }
      case HIDE:
        return { kind: 'hide' };
      case CLEAR: {
        const layer = str('layer');
        const selected = layer === 'truth' || layer === 'thinking' || layer === 'all' ? layer : 'all';
        return { kind: 'clear', layer: selected };
      }
      case ERASE: {
        const target = str('target');
        if (target === '') return undefined;
        // A no-op when the target is absent: the reducer returns the document unchanged.
        return { kind: 'remove', id: target };
      }
      case REVEAL: {
        const target = str('target');
        if (target === '') return undefined;
        return { kind: 'reveal', id: target, revealMs: durationOf(kwargs['duration'], 1200) };
      }
      default: {
        const kind = KIND_OF_ACTION[effect.action];
        if (kind === undefined) return undefined;

        const prefix = MARK_ID_PREFIX[effect.action];
        const target = str('target');
        const declaredId = str('id');

        let id = declaredId;
        if (id === '' && prefix !== undefined) {
          if (target === '') return undefined;
          id = `${prefix}:${target}`;
        }
        if (id === '') return undefined;

        const attributes: Record<string, string> = {};
        for (const [key, value] of Object.entries(kwargs)) {
          if (typeof value === 'string') attributes[key] = value;
        }

        const layer: BoardLayer = THINKING_ACTIONS.includes(effect.action) ? 'thinking' : 'truth';
        const bounds = boundsOf(kwargs, effect.action);
        const concealed = str('conceal') === 'true';

        if (effect.action === HIGHLIGHT) {
          // An unknown target is a no-op in the pin, not an error: `if (!target) return doc`.
          if (elementById(this.#document, target) === undefined) return undefined;
          const duration = durationOf(kwargs['duration'], 3000);
          return {
            kind: 'commit',
            element: {
              id,
              kind,
              layer,
              content: '',
              attributes,
              bounds: elementById(this.#document, target)?.bounds ?? bounds,
              targetId: target,
              // `duration=0` means permanent until cleared, which is a different thing from a very
              // short duration and needs `null` to say so.
              expiresAt: duration > 0 ? this.#clock() + duration : null,
              reveal: 0,
              revealMs: WRITE_ON_MS[effect.action] ?? 0,
              ...(concealed ? { concealed } : {}),
            },
          };
        }

        if (effect.action === COUNT) {
          const source = elementById(this.#document, target);
          if (source === undefined) return undefined;
          const what = str('what') === '' ? 'items' : str('what');
          const total = countableTotal(source, what);
          // Numbering nothing is not a count. The pin no-ops rather than committing an annotation
          // that numbers zero things.
          if (total === 0) return undefined;
          const from = Number.isFinite(Number(kwargs['from'])) ? Math.round(Number(kwargs['from'])) : 1;
          // Pace is per item, so counting eight things takes twice as long as counting four — which
          // is what makes it read as counting rather than as a static total.
          const perItem = durationOf(kwargs['pace'], 600);
          return {
            kind: 'commit',
            element: {
              id,
              kind,
              layer,
              content: '',
              attributes: {
                ...attributes,
                target: source.id,
                from: String(from),
                paceMs: String(perItem),
                budgetMs: String(Math.max(400, total * perItem)),
              },
              bounds: source.bounds,
              targetId: source.id,
              total,
              // The count's write-on is per item: counting eight things takes twice as long as
              // counting four, which is what makes it read as counting rather than as a total.
              reveal: 0,
              revealMs: Math.max(400, total * perItem),
              ...(concealed ? { concealed } : {}),
            },
          };
        }

        // Content: a reference resolves through the injected pack, otherwise the inline kwarg. The
        // registry stage has already refused a command carrying both.
        const reference = str('content_ref');
        const content =
          reference !== ''
            ? (this.#resolveContent(reference) ?? '')
            : CONTENT_KEY[effect.action] !== undefined
              ? str(CONTENT_KEY[effect.action] as string)
              : '';

        if (prefix !== undefined && target !== '') attributes['target'] = target;

        return {
          kind: 'commit',
          element: {
            id,
            kind,
            layer,
            content,
            attributes,
            bounds,
            reveal: 0,
            revealMs: WRITE_ON_MS[effect.action] ?? 0,
            ...(prefix !== undefined && target !== '' ? { targetId: target } : {}),
            ...(kind === 'dots' ? { count: Math.max(0, Math.round(Number(kwargs['count'] ?? 1)) || 0) } : {}),
            ...(concealed ? { concealed } : {}),
          },
        };
      }
    }
  }
}

/** Parse `2s` / `500ms` / a bare millisecond count, defaulting when absent. */
function durationOf(raw: unknown, fallback: number): number {
  if (typeof raw !== 'string' || raw.trim() === '') return fallback;
  const match = /^([+-]?(?:\d+\.?\d*|\.\d+))\s*(ms|s|m)?$/i.exec(raw.trim());
  if (match === null) return fallback;
  const magnitude = Number(match[1]);
  if (!Number.isFinite(magnitude)) return fallback;
  const unit = (match[2] ?? 'ms').toLowerCase();
  const factor = unit === 's' ? 1000 : unit === 'm' ? 60_000 : 1;
  return magnitude * factor;
}

export { activePage, pageById };

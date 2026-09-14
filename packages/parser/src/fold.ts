/**
 * Compound folding (FR-170, FR-171, FR-173).
 *
 * A single state machine turns a flat sequence of narration and commands into nested
 * `ScriptSegment`s. Both the batch parser and the streaming parser drive *this* class, which is
 * what makes FR-172's batch/stream equivalence a structural property of the design rather than
 * something that has to be tested into existence.
 *
 * Segments are handed back through a cursor (`takeFinalized`) rather than returned straight from
 * `accept`, so the same object serves a batch caller — which wants everything at the end — and a
 * streaming caller, which wants each piece exactly once as it completes.
 *
 * Recovery lives here too: an opener that never closes is unrolled back into the output in source
 * order, so nothing is dropped and nothing is invented.
 */

import type { CommandSegment, CompoundSegment, ScriptSegment, TextSegment } from './types.js';
import { UNIVERSAL_CLOSE } from './types.js';

/** A segment as produced by scanning, before compound structure is applied. */
export type RoughSegment = TextSegment | CommandSegment;

export interface CompoundSpec {
  readonly type: CompoundSegment['type'];
  readonly close: string;
}

interface Frame {
  readonly spec: CompoundSpec;
  readonly opener: CommandSegment;
  readonly children: ScriptSegment[];
}

export class CompoundFolder {
  readonly #specs: Readonly<Record<string, CompoundSpec>>;
  readonly #universalClose: string;
  readonly #root: ScriptSegment[] = [];
  readonly #stack: Frame[] = [];
  #cursor = 0;

  constructor(specs: Readonly<Record<string, CompoundSpec>>, universalClose: string = UNIVERSAL_CLOSE) {
    this.#specs = specs;
    this.#universalClose = universalClose;
  }

  /** Number of compounds currently open. Non-zero means output is not yet final. */
  get openCompounds(): number {
    return this.#stack.length;
  }

  /** Feed one scanned segment. Finalized output is collected with `takeFinalized`. */
  accept(segment: RoughSegment): void {
    if (segment.type === 'command') {
      const spec = this.#specs[segment.action];
      if (spec !== undefined) {
        this.#stack.push({ spec, opener: segment, children: [] });
        return;
      }
      if (segment.action === this.#universalClose) {
        // `end` closes the innermost compound, whatever kind it is.
        if (this.#stack.length > 0) this.#closeTop(segment.raw);
        return;
      }
      if (segment.action.startsWith('/')) {
        // A typed closer closes to its own match, discarding compounds left open inside it.
        const closerSpec = this.#specs[segment.action.replace(/^\//, '')];
        if (closerSpec !== undefined) {
          const index = this.#lastIndexFor(closerSpec.close);
          if (index >= 0) {
            while (this.#stack.length > index) this.#closeTop(segment.raw);
          }
          return;
        }
      }
    }

    this.#sink().push(segment);
  }

  /** Segments that became final since the previous call. */
  takeFinalized(): ScriptSegment[] {
    const finalized = this.#root.slice(this.#cursor);
    this.#cursor = this.#root.length;
    return finalized;
  }

  /**
   * Unroll anything still open and return the segments that became final.
   *
   * An unclosed compound does not vanish and does not swallow its contents: the opener is emitted
   * as a visible command segment followed by its children, in source order. That is the FR-173
   * fail-closed behaviour — the alternative, dropping it, would hide control the producer sent.
   */
  finish(): ScriptSegment[] {
    while (this.#stack.length > 0) {
      const frame = this.#stack.pop();
      if (frame === undefined) break;
      this.#sink().push(frame.opener, ...frame.children);
    }
    return this.takeFinalized();
  }

  #lastIndexFor(close: string): number {
    for (let i = this.#stack.length - 1; i >= 0; i--) {
      if (this.#stack[i]?.spec.close === close) return i;
    }
    return -1;
  }

  #sink(): ScriptSegment[] {
    const top = this.#stack[this.#stack.length - 1];
    return top === undefined ? this.#root : top.children;
  }

  #closeTop(closerRaw: string): void {
    const frame = this.#stack.pop();
    if (frame === undefined) return;

    const commands: CommandSegment[] = [];
    const narration: string[] = [];
    for (const child of frame.children) {
      if (child.type === 'text') {
        narration.push(child.content);
      } else if (child.type === 'command') {
        commands.push(child);
      } else {
        // Nested compound: its commands promote into this compound's command list.
        commands.push(...child.commands);
      }
    }

    this.#sink().push(this.#buildSegment(frame, `${frame.opener.raw} ${closerRaw}`, commands, narration));
  }

  #buildSegment(
    frame: Frame,
    raw: string,
    commands: readonly CommandSegment[],
    narration: readonly string[],
  ): CompoundSegment {
    const opener = frame.opener;
    switch (frame.spec.type) {
      case 'batch': {
        const mode = opener.args[0] ?? opener.kwargs['mode'] ?? 'atomic';
        return { type: 'batch', raw, commands, mode };
      }
      case 'sequence': {
        const rawPause = opener.kwargs['pause'] ?? opener.kwargs['pause_ms'];
        return rawPause === undefined
          ? { type: 'sequence', raw, commands }
          : { type: 'sequence', raw, commands, pauseMs: Number(rawPause) };
      }
      case 'parallel':
        return { type: 'parallel', raw, commands };
      case 'beat': {
        const beatId = opener.kwargs['id'] ?? opener.args[0] ?? '';
        const visualIntent = opener.kwargs['intent'] ?? '';
        return { type: 'beat', raw, commands, beatId, visualIntent, narration: narration.join('\n') };
      }
    }
  }
}

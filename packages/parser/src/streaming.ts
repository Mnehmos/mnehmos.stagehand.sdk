/**
 * Incremental mixed-stream parsing (FR-172).
 *
 * There is deliberately no second grammar here. The streaming parser buffers text until it can
 * decide, then hands completed spans to the same `parseCommandString` and the same
 * `CompoundFolder` that the batch parser uses. Batch/stream equivalence is therefore a property of
 * the construction: the only way the two can disagree is if the buffer/emit boundary is wrong, and
 * that boundary is exactly what TEST-170 fuzzes.
 *
 * The decision rule is conservative in one direction only — a span is held until it is known to be
 * complete, and never emitted early on the chance that it is:
 *
 * - narration is held until a bracket or the flush arrives, because the next chunk may extend it
 * - a `[` opens a hold that lasts until its `]` arrives
 * - a compound holds everything after its opener until it closes or the stream flushes
 */

import { parseCommandString } from './command.js';
import { CompoundFolder, type CompoundSpec } from './fold.js';
import { tokenizeCommandBody } from './lexer.js';
import { quarantineBareCommands, unterminatedCommandSpan } from './recover.js';
import { resolveSpecs } from './script.js';
import { UNIVERSAL_CLOSE, type ParseScriptOptions, type SchemaLookup, type ScriptSegment } from './types.js';

export class StreamingParser {
  readonly #folder: CompoundFolder;
  readonly #lookup: SchemaLookup | undefined;
  readonly #recover: boolean;
  #pending = '';
  #flushed = false;

  constructor(options: ParseScriptOptions = {}) {
    this.#folder = new CompoundFolder(
      resolveSpecs(options.compoundKeywords) as Record<string, CompoundSpec>,
      options.universalClose ?? UNIVERSAL_CLOSE,
    );
    this.#lookup = options.lookupSchema;
    this.#recover = options.recoverBareCommands ?? options.lookupSchema !== undefined;
  }

  /** True once `flush` has run. A flushed parser accepts no further input. */
  get flushed(): boolean {
    return this.#flushed;
  }

  /**
   * Feed one chunk.
   *
   * @returns Segments that became final as a result of this chunk. May be empty — incomplete input
   *   is held, not guessed at.
   * @throws {Error} when called after `flush`.
   * @throws {StagehandSyntaxError} on malformed command syntax in a completed span.
   */
  feed(chunk: string): ScriptSegment[] {
    if (this.#flushed) throw new Error('StreamingParser.feed called after flush');
    this.#pending += chunk;
    return this.#drain(false);
  }

  /**
   * End the stream and resolve whatever remains.
   *
   * @returns The final segments, then nothing on subsequent calls. Trailing narration is emitted;
   *   an unterminated bracket span becomes a visible command rather than narration; unclosed
   *   compounds are unrolled in source order.
   */
  flush(): ScriptSegment[] {
    if (this.#flushed) return [];
    this.#flushed = true;
    const finalized = this.#drain(true);
    return [...finalized, ...this.#folder.finish()];
  }

  #drain(final: boolean): ScriptSegment[] {
    const emitted: ScriptSegment[] = [];

    for (;;) {
      const openAt = this.#pending.indexOf('[');

      if (openAt === -1) {
        // No bracket in view. On flush this is trailing narration; otherwise the next chunk could
        // still extend it, so it stays buffered.
        if (final) {
          emitted.push(...this.#acceptText(this.#pending));
          this.#pending = '';
        }
        break;
      }

      const closeAt = this.#pending.indexOf(']', openAt + 1);

      if (closeAt === -1) {
        // A bracket is open but not closed: hold it, or resolve it as a recovered span on flush.
        if (final) {
          const before = this.#pending.slice(0, openAt);
          const body = this.#pending.slice(openAt + 1);
          this.#pending = '';
          emitted.push(...this.#acceptText(before));
          const recovered = unterminatedCommandSpan(body);
          if (recovered !== null) this.#folder.accept(recovered);
          emitted.push(...this.#folder.takeFinalized());
        }
        break;
      }

      const before = this.#pending.slice(0, openAt);
      const body = this.#pending.slice(openAt + 1, closeAt);
      this.#pending = this.#pending.slice(closeAt + 1);

      emitted.push(...this.#acceptText(before));
      this.#acceptCommandBody(body);
      emitted.push(...this.#folder.takeFinalized());
    }

    return emitted;
  }

  #acceptText(text: string): ScriptSegment[] {
    const content = text.trim();
    if (content === '') return [];
    if (this.#recover && this.#lookup !== undefined) {
      for (const segment of quarantineBareCommands(content, this.#lookup)) this.#folder.accept(segment);
    } else {
      this.#folder.accept({ type: 'text', content });
    }
    return this.#folder.takeFinalized();
  }

  #acceptCommandBody(body: string): void {
    const trimmed = body.trim();
    if (trimmed === '') return;
    const action = tokenizeCommandBody(trimmed)[0]?.value;
    if (action === undefined) return;
    const command = parseCommandString(trimmed, this.#lookup === undefined ? undefined : this.#lookup(action));
    if (command !== null) this.#folder.accept({ type: 'command', ...command });
  }
}

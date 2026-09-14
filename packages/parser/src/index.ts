/**
 * @stagehand/parser — mixed-stream parsing and syntax.
 *
 * Owner of FEAT-001. Requirement range `FR-168..FR-174`; tasks `T-019..T-024`; parity exits
 * `TEST-168..TEST-170`. See `specs/001-mixed-stream-parser/spec.md`.
 *
 * This is the SDK's first trust boundary. The invariant a caller may rely on is narrow and firm:
 * **a `text` segment is safe to speak; a command that was classified as control never becomes
 * narration.** The parser classifies and does not authorize — whether an action is registered, and
 * whether a target resolves, are later boundaries that reject rather than reparse.
 *
 * @example
 * ```ts
 * const segments = parseScript('Venice grew rich [map.focus id=venice] on trade.');
 * const spoken = segments.filter((s) => s.type === 'text').map((s) => s.content).join(' ');
 * ```
 */

export {
  COMPOUND_KEYWORDS,
  StagehandSyntaxError,
  UNIVERSAL_CLOSE,
  type BatchSegment,
  type BeatSegment,
  type CommandSchemaLike,
  type CommandSegment,
  type CompoundKeyword,
  type CompoundSegment,
  type ParallelSegment,
  type ParseScriptOptions,
  type SchemaLookup,
  type ScriptSegment,
  type SequenceSegment,
  type StagehandCommand,
  type TextSegment,
} from './types.js';

export { tokenizeCommandBody, type RawToken } from './lexer.js';
export { parseCommandString } from './command.js';
export { parseScript } from './script.js';
export { StreamingParser } from './streaming.js';
export { CompoundFolder, type CompoundSpec, type RoughSegment } from './fold.js';
export {
  RECOVERED_RAW_PREFIX,
  quarantineBareCommands,
  unterminatedCommandSpan,
} from './recover.js';

import type { CommandSegment, ScriptSegment } from './types.js';

/**
 * Partition parsed segments into what may be spoken and what must not be.
 *
 * Exists so the trust property is expressible without every host re-deriving it, and so a test can
 * assert on the spoken channel alone.
 */
export function splitChannels(segments: readonly ScriptSegment[]): {
  narration: string[];
  commands: CommandSegment[];
} {
  const narration: string[] = [];
  const commands: CommandSegment[] = [];

  for (const segment of segments) {
    switch (segment.type) {
      case 'text':
        narration.push(segment.content);
        break;
      case 'command':
        commands.push(segment);
        break;
      default:
        commands.push(...segment.commands);
        break;
    }
  }

  return { narration, commands };
}

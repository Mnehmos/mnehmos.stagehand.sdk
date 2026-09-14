/**
 * Batch script compilation (FR-170, FR-171, FR-173).
 *
 * Scans a whole script into narration and command segments, then folds compound structure with the
 * shared `CompoundFolder` that the streaming parser also uses.
 */

import { parseCommandString } from './command.js';
import { CompoundFolder, type CompoundSpec, type RoughSegment } from './fold.js';
import { tokenizeCommandBody } from './lexer.js';
import { quarantineBareCommands, unterminatedCommandSpan } from './recover.js';
import {
  COMPOUND_KEYWORDS,
  type ParseScriptOptions,
  type SchemaLookup,
  type ScriptSegment,
} from './types.js';

/** Bracket span, non-greedy within a line of input: `[action arg key=value]`. */
const BRACKET_SPAN = /\[([^\]]*)\]/g;

/** Resolve the compound vocabulary, honouring an explicit override. */
function resolveSpecs(override?: ParseScriptOptions['compoundKeywords']): Record<string, CompoundSpec> {
  const source = override ?? COMPOUND_KEYWORDS;
  const specs: Record<string, CompoundSpec> = {};
  for (const [keyword, spec] of Object.entries(source)) {
    specs[keyword] = { type: spec.type, close: spec.close };
  }
  return specs;
}

/** Turn completed narration text into segments, quarantining it if it is really lost control. */
function textSegments(
  text: string,
  lookup: SchemaLookup | undefined,
  recover: boolean,
): RoughSegment[] {
  const content = text.trim();
  if (content === '') return [];
  if (recover && lookup !== undefined) return quarantineBareCommands(content, lookup);
  return [{ type: 'text', content }];
}

/**
 * Compile a script into ordered segments.
 *
 * @param script Mixed narration and control source text.
 * @param options Registry lookup and recovery switches. See {@link ParseScriptOptions}.
 * @throws {StagehandSyntaxError} on malformed command syntax. The error aborts the parse; callers
 *   wanting to skip one bad command should pre-split the script or catch per-command.
 */
export function parseScript(script: string, options: ParseScriptOptions = {}): ScriptSegment[] {
  const lookup = options.lookupSchema;
  const recover = options.recoverBareCommands ?? lookup !== undefined;
  const folder = new CompoundFolder(resolveSpecs(options.compoundKeywords));

  const acceptText = (text: string): void => {
    for (const segment of textSegments(text, lookup, recover)) folder.accept(segment);
  };

  const acceptCommandBody = (body: string): void => {
    const trimmed = body.trim();
    if (trimmed === '') return;
    const action = tokenizeCommandBody(trimmed)[0]?.value;
    if (action === undefined) return;
    const command = parseCommandString(trimmed, lookup === undefined ? undefined : lookup(action));
    if (command !== null) folder.accept({ type: 'command', ...command });
  };

  let last = 0;
  let match: RegExpExecArray | null;
  BRACKET_SPAN.lastIndex = 0;
  while ((match = BRACKET_SPAN.exec(script)) !== null) {
    acceptText(script.slice(last, match.index));
    acceptCommandBody(match[1] ?? '');
    last = BRACKET_SPAN.lastIndex;
  }

  // A `[` that never closes would otherwise fall through as narration, which is precisely how
  // control leaks. The span from that `[` onward is treated as control and never spoken.
  const tail = script.slice(last);
  const openAt = tail.indexOf('[');
  if (openAt >= 0) {
    acceptText(tail.slice(0, openAt));
    const recovered = unterminatedCommandSpan(tail.slice(openAt + 1));
    if (recovered !== null) folder.accept(recovered);
  } else {
    acceptText(tail);
  }

  return folder.finish();
}

export { resolveSpecs };

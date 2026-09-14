/**
 * Single-command compilation (FR-169, FR-174).
 *
 * Takes a command body and produces a `StagehandCommand`. With a schema it classifies tokens into
 * positional args and kwargs using the registered key set, which is what makes an unquoted
 * multi-word value recoverable: `text=If exactly one split size=md` only splits correctly if you
 * know `size` is a key and `If`, `exactly`, `one`, `split` are not.
 */

import { tokenizeCommandBody, type RawToken } from './lexer.js';
import type { CommandSchemaLike, StagehandCommand } from './types.js';

/** Join tokens split by `key = value` spacing, and re-attach `key= value` continuations. */
function flatten(tokens: readonly RawToken[]): RawToken[] {
  const flat: RawToken[] = [];
  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === undefined) break;
    let { value, eqAt } = token;
    let next = tokens[i + 1];

    // `key =val` — the `=` was separated from its key by whitespace, so it became its own token.
    if (eqAt === -1 && next !== undefined && next.value.startsWith('=')) {
      value += next.value;
      eqAt = value.indexOf('=');
      i++;
      next = tokens[i + 1];
    }

    // `key= val` — the `=` ended a token, so the value follows in the next one.
    if (eqAt === value.length - 1 && next !== undefined && next.eqAt === -1 && !next.value.startsWith('=')) {
      value += next.value;
      i++;
    }

    flat.push({ value, eqAt });
  }
  return flat;
}

function assign(flat: readonly RawToken[]): Record<string, string> {
  const kwargs: Record<string, string> = {};
  for (const { value, eqAt } of flat) {
    if (eqAt >= 0) kwargs[value.slice(0, eqAt)] = value.slice(eqAt + 1);
  }
  return kwargs;
}

/**
 * Compile one command body.
 *
 * @param raw Command body, with or without surrounding brackets.
 * @param schema Optional registry schema. When present, tokens are classified against the
 *   registered key set and unquoted multi-word values are re-joined; when absent, tokens carrying
 *   `=` become kwargs and all others become positional args.
 * @returns The command, or `null` for empty / whitespace-only input.
 * @throws {StagehandSyntaxError} on unterminated quoting.
 */
export function parseCommandString(
  raw: string,
  schema?: CommandSchemaLike | null,
): StagehandCommand | null {
  const tokens = tokenizeCommandBody(raw);
  const head = tokens[0];
  if (head === undefined) return null;

  const action = head.value;
  const flat = flatten(tokens);
  // `raw` is the source text including framing, so a segment can always be traced back to input.
  const source = `[${raw}]`;

  const known = schema
    ? new Set<string>([
        ...(schema.requiredKwargs ?? []),
        ...Object.keys(schema.optionalKwargs ?? {}),
      ])
    : null;

  if (known === null) {
    const args: string[] = [];
    for (const { value, eqAt } of flat) {
      if (eqAt < 0) args.push(value);
    }
    return { action, args, kwargs: assign(flat), raw: source };
  }

  const args: string[] = [];
  const kwargs: Record<string, string> = {};
  let currentKey: string | null = null;

  for (const { value, eqAt } of flat) {
    if (eqAt >= 0) {
      const key = value.slice(0, eqAt);
      kwargs[key] = value.slice(eqAt + 1);
      currentKey = known.has(key) ? key : null;
      continue;
    }
    // A bare token after a known key continues that key's value — but only while the token is not
    // itself a registered key, which is what keeps `text=If exactly one split size=md` correct.
    if (currentKey !== null && !known.has(value)) {
      const prior = kwargs[currentKey];
      kwargs[currentKey] = prior !== undefined && prior !== '' ? `${prior} ${value}` : value;
      continue;
    }
    args.push(value);
    currentKey = null;
  }

  return { action, args, kwargs, raw: source };
}

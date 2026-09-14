/**
 * Command-body tokenizer.
 *
 * Operates on the inside of a bracketed span, or on a bare command body. It performs no
 * classification — it only breaks the body into tokens and records where the first `=` sits in
 * each, which is the information the command parser needs to split keys from values.
 *
 * Value fidelity is the point of this module (FR-169): quoted values keep their spaces, an
 * apostrophe inside an unquoted value is ordinary text, and backslashes reach the caller
 * untouched so LaTeX survives.
 */

import { StagehandSyntaxError } from './types.js';

export interface RawToken {
  /** Token text, including any `key=` prefix and with quotes already stripped. */
  readonly value: string;
  /** Index of the first `=` in `value`, or -1 when the token carries no assignment. */
  readonly eqAt: number;
}

/**
 * Break a command body into tokens.
 *
 * Whitespace separates tokens. A quote character at the start of a token opens a quoted value that
 * runs to the matching quote; the quote characters are removed and any whitespace inside is kept.
 * An apostrophe that does not begin a token is literal text, which is what lets `Newton's` and
 * `it's` pass through unharmed.
 *
 * @throws {StagehandSyntaxError} when a quote is left open.
 */
export function tokenizeCommandBody(body: string): RawToken[] {
  const tokens: RawToken[] = [];
  let value = '';
  let eqAt = -1;
  let quote: string | null = null;
  let open = false;
  let atValueStart = true;

  const flush = (): void => {
    if (open) tokens.push({ value, eqAt });
    value = '';
    eqAt = -1;
    quote = null;
    open = false;
    atValueStart = true;
  };

  for (const ch of body.trim()) {
    if (quote !== null) {
      if (ch === quote) {
        quote = null;
        atValueStart = false;
      } else {
        value += ch;
      }
      continue;
    }

    if (atValueStart && (ch === '"' || ch === "'")) {
      quote = ch;
      open = true;
      atValueStart = false;
      continue;
    }

    if (/\s/.test(ch)) {
      flush();
      continue;
    }

    if (ch === '=' && eqAt === -1) {
      eqAt = value.length;
      value += ch;
      open = true;
      atValueStart = true;
      continue;
    }

    value += ch;
    open = true;
    atValueStart = false;
  }

  if (quote !== null) throw new StagehandSyntaxError(`Unterminated ${quote} quote`, body);
  flush();
  return tokens;
}

/**
 * Bare-command quarantine (FR-173, DIV-004).
 *
 * When a producer loses its brackets, command text arrives as prose. The recovered rule — hardened
 * from the Virtual Classroom incident — is: *registered* command syntax is control, never
 * narration. This module implements that rule as a distinct pass so the "did we leak?" question has
 * exactly one place to be answered.
 *
 * Two deliberate restrictions keep the pass from doing damage:
 *
 * - **It needs the registry.** Recognising a registered action requires knowing the vocabulary, so
 *   quarantine only runs when a schema lookup is supplied. Without one the parser would be guessing,
 *   and guessing at meaning is what DIV-004 forbids.
 * - **It is a no-op unless a registered action is present.** Ordinary prose is returned byte-identical
 *   rather than round-tripped through whitespace normalization.
 *
 * Within a recovered region the original spacing is not preserved, because the recovered rule is
 * word-based: it cannot tell where the command ended and the narration resumed except by word
 * boundaries. That lossiness is confined to text that actually contained a registered action.
 */

import { tokenizeCommandBody } from './lexer.js';
import type { RoughSegment } from './fold.js';
import type { CommandSegment, SchemaLookup, TextSegment } from './types.js';

/** Marker prefix for the synthetic `raw` of a command whose bracket framing was lost. */
export const RECOVERED_RAW_PREFIX = '<recovered:';

/**
 * A token is control-shaped when it is a `key=value` assignment.
 *
 * This is deliberately lexical. Deciding whether the *key* is meaningful would require meaning,
 * and DIV-004 confines recovery to framing. Whether the key is declared is a question for the
 * registry, and the answer arrives as an `Unknown keyword argument` rejection rather than as a
 * judgement made here.
 */
const CONTROL_SHAPED = /^[A-Za-z_][A-Za-z0-9_.-]*=/;

function isControlShaped(token: string): boolean {
  return CONTROL_SHAPED.test(token);
}

/**
 * Determine whether a text region contains any registered action word.
 *
 * Cheap and conservative: this is only a gate for whether the expensive recovery pass runs.
 */
function containsRegisteredAction(text: string, lookup: SchemaLookup): boolean {
  for (const word of text.split(/\s+/)) {
    if (word === '') continue;
    const candidate = word.replace(/[.,;:!?]+$/, '');
    if (candidate === '') continue;
    if (lookup(candidate) !== undefined && lookup(candidate) !== null) return true;
  }
  return false;
}

/**
 * Split a narration region into recovered commands and the narration that remains.
 *
 * @returns `[segment]` unchanged when there is nothing to recover, otherwise the interleaved
 *   command and narration segments in source order.
 */
export function quarantineBareCommands(text: string, lookup: SchemaLookup): RoughSegment[] {
  if (!containsRegisteredAction(text, lookup)) {
    return [{ type: 'text', content: text }];
  }

  const words = text.trim().split(/\s+/);
  const out: RoughSegment[] = [];
  const spoken: string[] = [];
  /** Control-shaped tokens seen before any command was recovered. */
  let pending: Record<string, string> = {};

  const flushSpoken = (): void => {
    const content = spoken.join(' ').trim();
    if (content !== '') out.push({ type: 'text', content });
    spoken.length = 0;
  };

  const asCommand = (action: string, args: readonly string[], kwargs: Record<string, string>): RoughSegment => ({
    type: 'command',
    action,
    args: [...args],
    kwargs,
    raw: `${RECOVERED_RAW_PREFIX}${action}>`,
  });

  let i = 0;
  while (i < words.length) {
    const word = words[i];
    if (word === undefined) break;
    const schema = lookup(word);

    if (schema !== undefined && schema !== null) {
      flushSpoken();
      const action = word;
      i++;

      const args: string[] = [];
      const maxArgs = schema.maxArgs ?? 0;
      while (
        i < words.length &&
        args.length < maxArgs &&
        !isControlShaped(words[i]!) &&
        lookup(words[i]!) === undefined
      ) {
        args.push(words[i]!);
        i++;
      }

      // Contiguous assignments belong to this command, declared key or not. An undeclared key is
      // recorded rather than discarded so the registry can reject it visibly — a silently dropped
      // token is a swallowed validation error (Article XII).
      const kwargs: Record<string, string> = { ...pending };
      pending = {};
      while (i < words.length && isControlShaped(words[i]!)) {
        const at = words[i]!.indexOf('=');
        kwargs[words[i]!.slice(0, at)] = words[i]!.slice(at + 1);
        i++;
      }

      out.push(asCommand(action, args, kwargs));
      continue;
    }

    if (isControlShaped(word)) {
      // Control-shaped text with no action in scope. It must not be spoken (Article V), so it is
      // held for the next recovered command, or attached to the last one if the region ends first.
      const at = word.indexOf('=');
      const key = word.slice(0, at);
      const value = word.slice(at + 1);
      const last = out[out.length - 1];
      if (last !== undefined && last.type === 'command') {
        out[out.length - 1] = { ...last, kwargs: { ...last.kwargs, [key]: value } };
      } else {
        pending[key] = value;
      }
      i++;
      continue;
    }

    spoken.push(word);
    i++;
  }

  // Control-shaped tokens that never found a command, in a region where one certainly exists.
  if (Object.keys(pending).length > 0) {
    const last = out[out.length - 1];
    if (last !== undefined && last.type === 'command') {
      out[out.length - 1] = { ...last, kwargs: { ...last.kwargs, ...pending } };
    } else {
      flushSpoken();
      out.push(asCommand(Object.keys(pending)[0] ?? '__quarantined__', [], pending));
    }
  }

  flushSpoken();
  return out;
}

/**
 * Parse a command body that never got its closing bracket.
 *
 * Fail-closed: whatever it holds, it is emitted as a command, never as narration, so an unterminated
 * span cannot smuggle control into the spoken channel. The registry rejects it downstream if the
 * action is unknown.
 */
export function unterminatedCommandSpan(body: string): CommandSegment | null {
  const trimmed = body.trim();
  if (trimmed === '') return null;
  const tokens = tokenizeCommandBody(trimmed);
  const head = tokens[0];
  if (head === undefined) return null;

  const kwargs: Record<string, string> = {};
  const args: string[] = [];
  for (const token of tokens.slice(1)) {
    if (token.eqAt >= 0) kwargs[token.value.slice(0, token.eqAt)] = token.value.slice(token.eqAt + 1);
    else args.push(token.value);
  }
  return { type: 'command', action: head.value, args, kwargs, raw: `[${trimmed}` };
}

export type { TextSegment };

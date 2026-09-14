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

  const flushSpoken = (): void => {
    const content = spoken.join(' ').trim();
    if (content !== '') out.push({ type: 'text', content });
    spoken.length = 0;
  };

  let i = 0;
  while (i < words.length) {
    const word = words[i];
    if (word === undefined) break;
    const schema = lookup(word);

    if (schema === undefined || schema === null) {
      spoken.push(word);
      i++;
      continue;
    }

    flushSpoken();
    const action = word;
    i++;

    const args: string[] = [];
    const maxArgs = schema.maxArgs ?? 0;
    while (
      i < words.length &&
      args.length < maxArgs &&
      !words[i]!.includes('=') &&
      lookup(words[i]!) === undefined
    ) {
      args.push(words[i]!);
      i++;
    }

    const allowed = new Set<string>([
      ...(schema.requiredKwargs ?? []),
      ...Object.keys(schema.optionalKwargs ?? {}),
    ]);
    const kwargs: Record<string, string> = {};
    while (i < words.length && words[i]!.includes('=')) {
      const [key, ...rest] = words[i]!.split('=');
      if (key === undefined || !allowed.has(key)) break;
      kwargs[key] = rest.join('=');
      i++;
    }

    const command: CommandSegment = {
      type: 'command',
      action,
      args,
      kwargs,
      raw: `${RECOVERED_RAW_PREFIX}${action}>`,
    };
    out.push(command);

    // Text after a recovered command is narration until the next registered action.
    while (i < words.length && lookup(words[i]!) === undefined) {
      spoken.push(words[i]!);
      i++;
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

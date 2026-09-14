/**
 * The agent-facing Beat object (FR-192, `SURF-165`).
 *
 * `ENT-005` records the shape and why it exists:
 *
 * > Agent-facing object: `beat_id`, `narration`, `visual_intent`, `stagehand_sequence.steps`.
 * > Clio intentionally added WHY + WHAT + HOW.
 *
 * Four fields, no more. The temptation is to add provenance, timing, or a correlation id — and every
 * addition would be a field no producer in the corpus emits and no host in the corpus reads. A beat
 * carries *why* (intent), *what* (narration), and *how* (the steps), and that is the whole vocabulary.
 *
 * Headings are `snake_case` because the corpus records them that way; this is an agent-facing wire
 * shape rather than an internal one, so it keeps the recovered spelling rather than being normalised
 * into the SDK's own conventions.
 */

import type { CompoundNode } from '@stagehand/core';

/** The recovered agent-facing beat object. */
export interface BeatObject {
  readonly beat_id: string;
  readonly narration: string;
  readonly visual_intent: string;
  readonly stagehand_sequence: {
    readonly steps: readonly BeatStep[];
  };
}

/** One step. Mirrors the command it came from, minus the framing text a producer would not re-read. */
export interface BeatStep {
  readonly action: string;
  readonly args: readonly string[];
  readonly kwargs: Readonly<Record<string, string>>;
}

export class NotABeatError extends Error {
  readonly kind: string;

  constructor(kind: string) {
    super(`Cannot build a beat object from a "${kind}" group; expected a beat`);
    this.name = 'NotABeatError';
    this.kind = kind;
  }
}

/**
 * Convert a beat node to the agent-facing object.
 *
 * @throws {NotABeatError} when the node is a different kind of group. Returning a beat-shaped object
 *   for a sequence would produce a document that looks right and describes the wrong thing.
 */
export function toBeatObject(node: CompoundNode): BeatObject {
  if (node.kind !== 'beat') throw new NotABeatError(node.kind);

  return {
    beat_id: node.beatId ?? '',
    narration: node.narration ?? '',
    visual_intent: node.visualIntent ?? '',
    stagehand_sequence: {
      steps: node.commands.map((command) => ({
        action: command.action,
        args: [...command.args],
        kwargs: { ...command.kwargs },
      })),
    },
  };
}

/**
 * Rebuild a beat node from an agent-facing object.
 *
 * The round trip is lossy in exactly one direction and deliberately so: an object carries no source
 * text, so `raw` is gone. Everything the object *does* carry is restored, which is what
 * `TEST-180` asserts — `beat_id`, `narration`, `visual_intent`, and the steps, in order.
 *
 * @param id Node identity to assign. Pass the original node's id to keep a scheduler's reference
 *   valid across the round trip.
 */
export function fromBeatObject(object: BeatObject, id = '0'): CompoundNode {
  const steps = object.stagehand_sequence?.steps ?? [];
  return {
    kind: 'beat',
    id,
    raw: '',
    commands: steps.map((step) => ({
      action: step.action,
      args: [...step.args],
      kwargs: { ...step.kwargs },
      // Synthesised, because the object does not carry source text. Marked as such rather than left
      // looking like a producer's original.
      raw: `[${step.action}]`,
    })),
    beatId: object.beat_id,
    visualIntent: object.visual_intent,
    narration: object.narration,
  };
}

/** A human-readable report of a beat, for authoring output. */
export function describeBeat(node: CompoundNode): string {
  const beat = toBeatObject(node);
  const lines = [
    `beat ${beat.beat_id === '' ? '(unnamed)' : beat.beat_id}`,
    `  intent: ${beat.visual_intent === '' ? '(none)' : beat.visual_intent}`,
    `  says:   ${beat.narration === '' ? '(nothing)' : beat.narration}`,
    `  steps:  ${beat.stagehand_sequence.steps.length}`,
  ];
  for (const [index, step] of beat.stagehand_sequence.steps.entries()) {
    const kwargs = Object.entries(step.kwargs)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');
    lines.push(`    ${index + 1}. ${step.action}${step.args.length > 0 ? ` ${step.args.join(' ')}` : ''}${kwargs === '' ? '' : ` ${kwargs}`}`);
  }
  return lines.join('\n');
}

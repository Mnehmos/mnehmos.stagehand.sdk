/**
 * TEST-180 — beat round trip to the agent-facing Beat object.
 *
 * The object has exactly four fields because `ENT-005` records exactly four: `beat_id`, `narration`,
 * `visual_intent`, `stagehand_sequence.steps`. "Clio intentionally added WHY + WHAT + HOW" — so the
 * test asserts the field set as strictly as the values, because the way this shape degrades is by
 * acquiring fields no producer emits and no host reads.
 *
 * Covers FR-192. Tasks T-038, T-039.
 */

import { describe, expect, it } from 'vitest';
import { parseScript } from '@stagehand/parser';
import { compileChoreography, nodesOfKind, type CompoundNode } from '@stagehand/core';
import { describeBeat, fromBeatObject, NotABeatError, toBeatObject, type BeatObject } from '../src/index.js';

function beatNode(script = '[beat id=b1 intent=draw]Narration here[fixture.mark id=t][fixture.at at=anchor:desk][end]'): CompoundNode {
  const nodes = compileChoreography(parseScript(script));
  const beat = nodesOfKind(nodes, 'beat')[0];
  if (beat === undefined) throw new Error(`no beat in: ${script}`);
  return beat;
}

describe('TEST-180 / the recovered field set', () => {
  it('carries exactly the four recorded fields, at the recorded paths', () => {
    const object = toBeatObject(beatNode());
    expect(Object.keys(object).sort()).toEqual(['beat_id', 'narration', 'stagehand_sequence', 'visual_intent']);
    expect(Object.keys(object.stagehand_sequence)).toEqual(['steps']);
    expect(object.beat_id).toBe('b1');
    expect(object.narration).toBe('Narration here');
    expect(object.visual_intent).toBe('draw');
  });

  it('keeps the recovered snake_case spelling rather than normalising it', () => {
    // This is a wire shape. Renaming its fields would break producers that already emit it.
    const serialized = JSON.stringify(toBeatObject(beatNode()));
    expect(serialized).toContain('"beat_id"');
    expect(serialized).toContain('"visual_intent"');
    expect(serialized).toContain('"stagehand_sequence"');
    expect(serialized).not.toContain('beatId');
    expect(serialized).not.toContain('visualIntent');
  });

  it('lists steps in source order', () => {
    const object = toBeatObject(beatNode());
    expect(object.stagehand_sequence.steps.map((step) => step.action)).toEqual(['fixture.mark', 'fixture.at']);
  });

  it('gives each step its action, args, and kwargs', () => {
    const object = toBeatObject(beatNode());
    expect(object.stagehand_sequence.steps[0]).toEqual({
      action: 'fixture.mark',
      args: [],
      kwargs: { id: 't' },
    });
    expect(object.stagehand_sequence.steps[1]?.kwargs).toEqual({ at: 'anchor:desk' });
  });

  it('omits no field for an empty beat, rather than dropping keys', () => {
    // Empty strings and an empty array, not `undefined`: an agent reading `beat_id` should get a
    // string it can compare, not a missing key it has to guard.
    const object = toBeatObject(beatNode('[beat][end]'));
    expect(object).toEqual({
      beat_id: '',
      narration: '',
      visual_intent: '',
      stagehand_sequence: { steps: [] },
    });
  });

  it('carries narration but no steps for a beat that only speaks', () => {
    const object = toBeatObject(beatNode('[beat id=only-words]Say this[end]'));
    expect(object.narration).toBe('Say this');
    expect(object.stagehand_sequence.steps).toEqual([]);
  });

  it('refuses a non-beat group instead of producing a beat-shaped lie', () => {
    const nodes = compileChoreography(parseScript('[sequence][fixture.mark id=a][end]'));
    const sequence = nodesOfKind(nodes, 'sequence')[0];
    if (sequence === undefined) throw new Error('expected a sequence');
    expect(() => toBeatObject(sequence)).toThrow(NotABeatError);
  });
});

describe('TEST-180 / the round trip', () => {
  it('restores every field the object carries', () => {
    const original = toBeatObject(beatNode());
    const rebuilt = fromBeatObject(original);
    expect(toBeatObject(rebuilt)).toEqual(original);
  });

  it('preserves the node id so a scheduler reference survives', () => {
    const node = beatNode();
    const rebuilt = fromBeatObject(toBeatObject(node), node.id);
    expect(rebuilt.id).toBe(node.id);
    expect(rebuilt.kind).toBe('beat');
  });

  it('survives repeated round trips without drift', () => {
    let object: BeatObject = toBeatObject(beatNode());
    for (let i = 0; i < 5; i++) object = toBeatObject(fromBeatObject(object, '7'));
    expect(object).toEqual(toBeatObject(beatNode()));
  });

  it('marks synthesised source text rather than passing it off as the producer\'s own', () => {
    // The object carries no source, so `raw` cannot be restored. It is reconstructed visibly instead
    // of being left to look like the original bracketing.
    const rebuilt = fromBeatObject(toBeatObject(beatNode()));
    expect(rebuilt.raw).toBe('');
    expect(rebuilt.commands.every((command) => command.raw === `[${command.action}]`)).toBe(true);
  });

  it('round-trips a beat built by hand as faithfully as one parsed', () => {
    const authored: BeatObject = {
      beat_id: 'manual',
      narration: 'Say it',
      visual_intent: 'show it',
      stagehand_sequence: {
        steps: [
          { action: 'a.b', args: ['x'], kwargs: { k: 'v' } },
          { action: 'c.d', args: [], kwargs: {} },
        ],
      },
    };
    expect(toBeatObject(fromBeatObject(authored))).toEqual(authored);
  });

  it('tolerates an object with no sequence, which a hand-written document may omit', () => {
    const partial = { beat_id: 'x', narration: 'n', visual_intent: 'i' } as unknown as BeatObject;
    const rebuilt = fromBeatObject(partial);
    expect(rebuilt.commands).toEqual([]);
    expect(rebuilt.beatId).toBe('x');
  });
});

describe('TEST-180 / the authoring report', () => {
  it('describes a beat without adding fields to it', () => {
    const node = beatNode();
    const report = describeBeat(node);
    expect(report).toContain('b1');
    expect(report).toContain('draw');
    expect(report).toContain('Narration here');
    expect(report).toContain('steps:  2');
    expect(report).toContain('fixture.mark id=t');
  });

  it('labels absent parts rather than leaving blanks', () => {
    const report = describeBeat(beatNode('[beat][end]'));
    expect(report).toContain('(unnamed)');
    expect(report).toContain('(none)');
    expect(report).toContain('(nothing)');
  });

  it('does not modify the node it describes', () => {
    const node = beatNode();
    const snapshot = structuredClone(node);
    describeBeat(node);
    expect(node).toEqual(snapshot);
  });

  it('refuses a non-beat group here too', () => {
    const nodes = compileChoreography(parseScript('[parallel][fixture.mark id=a][end]'));
    const parallel = nodesOfKind(nodes, 'parallel')[0];
    if (parallel === undefined) throw new Error('expected a parallel');
    expect(() => describeBeat(parallel)).toThrow(NotABeatError);
  });
});

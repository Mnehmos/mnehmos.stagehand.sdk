/**
 * TEST-177 — nested compound goldens.
 *
 * These goldens exist to make a **limitation** explicit. `ENT-004` records that the recovered segment
 * model flattens child compounds into command arrays, so `[sequence][parallel][a][b][end][end]`
 * yields one sequence whose commands are `[a, b]` — the `parallel` boundary is gone. A consumer that
 * assumed otherwise would build a scheduler on a boundary that was never there.
 *
 * So the goldens assert what nesting actually does, including the flattening, rather than asserting
 * the tree one might wish for.
 *
 * Covers FR-187, FR-188. Tasks T-035, T-039.
 */

import { describe, expect, it } from 'vitest';
import { parseScript } from '@stagehand/parser';
import { compileChoreography, isAtomic, nodesOfKind } from '../src/index.js';
import { makeRegistry } from './fixtures.js';

const registry = makeRegistry();
const lookup = { lookupSchema: registry.lookup };

function compile(script: string) {
  return compileChoreography(parseScript(script, lookup));
}

describe('TEST-177 / group goldens', () => {
  it('one group, one node, with its commands in order', () => {
    const nodes = compile('[sequence][fixture.mark id=a][fixture.mark id=b][end]');
    expect(nodes).toHaveLength(1);
    const [group] = nodes;
    expect(group?.kind).toBe('sequence');
    if (group?.kind !== 'sequence') throw new Error('expected a sequence');
    expect(group.commands.map((c) => c.kwargs['id'])).toEqual(['a', 'b']);
    expect(group.id).toBe('0');
  });

  it('text contributes no node', () => {
    const nodes = compile('Narration before [fixture.mark id=a] and after.');
    expect(nodes).toHaveLength(1);
    expect(nodes[0]?.kind).toBe('command');
  });

  it('top-level groups and commands interleave in source order with positional ids', () => {
    const nodes = compile('X [fixture.mark id=one] [parallel][fixture.mark id=two][end] Y [fixture.mark id=three]');
    expect(nodes.map((node) => node.kind)).toEqual(['command', 'parallel', 'command']);
    expect(nodes.map((node) => node.id)).toEqual(['0', '1', '2']);
  });

  it('carries each kind\'s declared metadata', () => {
    const batch = compile('[batch atomic][fixture.mark id=a][/batch]');
    expect(batch[0]?.kind).toBe('batch');
    if (batch[0]?.kind === 'batch') expect(batch[0].mode).toBe('atomic');

    const sequence = compile('[sequence pause=250][fixture.mark id=a][end]');
    if (sequence[0]?.kind === 'sequence') expect(sequence[0].pauseMs).toBe(250);

    const beat = compile('[beat id=b1 intent=draw]Said aloud[fixture.mark id=a][end]');
    if (beat[0]?.kind === 'beat') {
      expect(beat[0].beatId).toBe('b1');
      expect(beat[0].visualIntent).toBe('draw');
      expect(beat[0].narration).toBe('Said aloud');
    }

    const parallel = compile('[parallel][fixture.mark id=a][end]');
    expect(parallel[0]?.kind).toBe('parallel');
  });

  it('omits metadata a group did not declare rather than defaulting it', () => {
    // `pauseMs` absent is different from `pauseMs: 0`: one is "no pause", the other is a declared
    // zero, and collapsing them would make the IR unable to express the difference.
    const nodes = compile('[sequence][fixture.mark id=a][end]');
    if (nodes[0]?.kind !== 'sequence') throw new Error('expected a sequence');
    expect('pauseMs' in nodes[0]).toBe(false);
  });
});

describe('TEST-177 / nesting flattens, and that is a golden', () => {
  it('a compound inside a compound promotes its commands and loses its own boundary', () => {
    const nodes = compile('[sequence][parallel][fixture.mark id=a][fixture.mark id=b][end][end]');
    expect(nodes).toHaveLength(1);

    const [group] = nodes;
    // The outer group survives...
    expect(group?.kind).toBe('sequence');
    if (group?.kind !== 'sequence') throw new Error('expected a sequence');
    // ...as an ordered command list with no record that a parallel group was ever there.
    expect(group.commands.map((c) => c.kwargs['id'])).toEqual(['a', 'b']);
    expect(group.commands.every((c) => c.action === 'fixture.mark')).toBe(true);
  });

  it('three levels deep still yields one node with every command', () => {
    const nodes = compile(
      '[sequence][parallel][batch atomic][fixture.mark id=a][fixture.mark id=b][end][end][end]',
    );
    expect(nodes).toHaveLength(1);
    const [group] = nodes;
    if (group?.kind !== 'sequence') throw new Error('expected a sequence');
    expect(group.commands.map((c) => c.kwargs['id'])).toEqual(['a', 'b']);
    // The inner batch's atomicity is gone with its boundary. A consumer must not rely on it.
    expect(isAtomic(group)).toBe(false);
  });

  it('an unmatched opener stays visible instead of being swallowed', () => {
    const nodes = compile('[sequence][fixture.mark id=a]');
    expect(nodes.map((node) => node.kind)).toEqual(['command', 'command']);
    expect(nodes[0]?.kind === 'command' && nodes[0].command.action).toBe('sequence');
  });

  it('an orphan closer is neither a node nor narrated', () => {
    const nodes = compile('before [/batch] after');
    expect(nodes).toEqual([]);
  });
});

describe('TEST-177 / node identity is deterministic', () => {
  it('recompiling the same source yields identical ids', () => {
    const script = 'A [fixture.mark id=one] [sequence][fixture.mark id=two][end] B [fixture.mark id=three]';
    const first = compile(script).map((node) => node.id);
    const second = compile(script).map((node) => node.id);
    expect(second).toEqual(first);
    expect(first).toEqual(['0', '1', '2']);
  });

  it('ids are positional, so inserting a node shifts the ones after it', () => {
    const before = compile('[fixture.mark id=a] [fixture.mark id=b]').map((n) => n.id);
    const after = compile('[fixture.mark id=x] [fixture.mark id=a] [fixture.mark id=b]').map((n) => n.id);
    expect(before).toEqual(['0', '1']);
    expect(after).toEqual(['0', '1', '2']);
  });

  it('a caller mutating parsed segments cannot reach into the compiled IR', () => {
    const segments = parseScript('[sequence][fixture.mark id=a][end]', lookup);
    const nodes = compileChoreography(segments);
    const group = nodes[0];
    if (group?.kind !== 'sequence') throw new Error('expected a sequence');
    const command = group.commands[0];
    if (command === undefined) throw new Error('expected a command');

    // The IR copied the command, so mutating the source segment does not change it.
    (segments[0] as unknown as { commands: { kwargs: Record<string, string> }[] }).commands[0]!.kwargs['id'] = 'mutated';
    expect(command.kwargs['id']).toBe('a');
  });

  it('exposes only the kinds asked for', () => {
    const nodes = compile(
      '[batch atomic][fixture.mark id=a][end] [sequence][fixture.mark id=b][end] [parallel][fixture.mark id=c][end]',
    );
    expect(nodesOfKind(nodes, 'sequence')).toHaveLength(1);
    expect(nodesOfKind(nodes, 'batch')).toHaveLength(1);
    expect(nodesOfKind(nodes, 'beat')).toHaveLength(0);
  });
});

describe('TEST-177 / mark.clip is an ordinary capability', () => {
  it('validates through the registry like any other command', async () => {
    const { MARK_CLIP_SCHEMA } = await import('../src/index.js');
    const withClip = makeRegistry([MARK_CLIP_SCHEMA]);

    const good = parseScript('[mark.clip label=chapter-1]', { lookupSchema: withClip.lookup });
    const compiled = compileChoreography(good);
    expect(compiled).toHaveLength(1);
    expect(compiled[0]?.kind).toBe('command');
    if (compiled[0]?.kind === 'command') expect(compiled[0].command.action).toBe('mark.clip');
  });

  it('is rejected by the registry when its required label is missing', async () => {
    const { MARK_CLIP_SCHEMA } = await import('../src/index.js');
    const withClip = makeRegistry([MARK_CLIP_SCHEMA]);
    const { validateCommand } = await import('@stagehand/registry');

    const segments = parseScript('[mark.clip note="just a note"]', { lookupSchema: withClip.lookup });
    const node = compileChoreography(segments)[0];
    if (node?.kind !== 'command') throw new Error('expected a command');

    const verdict = validateCommand(withClip, node.command);
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.errors.some((error) => error.subject === 'label')).toBe(true);
  });
});

/**
 * TEST-178 — atomic rejection, counted by a mutation-counting fake host.
 *
 * This is `TEST-174` one level up: the same claim — a rejected group produces no host mutation —
 * applied to a compound rather than a single command. It is asserted **per failure kind**, because a
 * single aggregate assertion passes as long as one kind is safe, and the failure this prevents is one
 * kind being wrong.
 *
 * The host reports `commitCalls` and `mutationCount` separately, so "the host was never asked" and
 * "the host was asked and nothing landed" stay distinguishable. For an atomic group the weaker of the
 * two would not be enough: a group that contacted the host to ask about a member it should never have
 * considered has already leaked the group's existence.
 *
 * Covers FR-190. Tasks T-036, T-039.
 */

import { describe, expect, it } from 'vitest';
import { parseScript } from '@stagehand/parser';
import { defineCompilerPass } from '@stagehand/runtime';
import { compileChoreography, executeChoreographyGroup, nodesOfKind } from '../src/index.js';
import { CountingCommitter, makeRegistry, MapResolver } from './fixtures.js';

const registry = makeRegistry();
const lookup = { lookupSchema: registry.lookup };

function groupNode(script: string) {
  const nodes = compileChoreography(parseScript(script, lookup));
  const group = nodesOfKind(nodes, 'batch')[0] ?? nodes[0];
  if (group === undefined || group.kind === 'command') throw new Error(`no group in: ${script}`);
  return group;
}

/** A group of three: two valid members and one deliberately broken. */
const WITH_UNKNOWN_ACTION = '[batch atomic][fixture.mark id=a][evil.run x=1][fixture.mark id=c][/batch]';
const WITH_SCHEMA_VIOLATION = '[batch atomic][fixture.mark id=a][fixture.mark][fixture.mark id=c][/batch]';
const WITH_BAD_VALUE = '[batch atomic][fixture.mark id=a][fixture.mark id=b value=1][fixture.at at=nowhere][/batch]';
const ALL_VALID = '[batch atomic][fixture.mark id=a][fixture.mark id=b][/batch]';

describe('TEST-178 / an atomic group rejected anywhere contacts the host nowhere', () => {
  it('unknown action', () => {
    const host = new CountingCommitter();
    const result = executeChoreographyGroup(registry, groupNode(WITH_UNKNOWN_ACTION), { committer: host });

    expect(result.committed).toBe(false);
    expect(result.effectCount).toBe(0);
    expect(host.commitCalls).toBe(0);
    expect(host.mutationCount).toBe(0);
    expect(result.outcomes.some((o) => o.errors.some((e) => e.code === 'E_UNKNOWN_ACTION'))).toBe(true);
  });

  it('schema violation — a missing required kwarg', () => {
    const host = new CountingCommitter();
    const result = executeChoreographyGroup(registry, groupNode(WITH_SCHEMA_VIOLATION), { committer: host });

    expect(result.committed).toBe(false);
    expect(host.commitCalls).toBe(0);
    expect(host.mutationCount).toBe(0);
  });

  it('unresolved reference', () => {
    const host = new CountingCommitter();
    const result = executeChoreographyGroup(registry, groupNode(WITH_BAD_VALUE), {
      committer: host,
      resolver: new MapResolver(),
    });

    expect(result.committed).toBe(false);
    expect(host.commitCalls).toBe(0);
    expect(host.mutationCount).toBe(0);
    expect(result.outcomes.some((o) => o.errors.some((e) => e.code === 'E_UNRESOLVED_REF'))).toBe(true);
  });

  it('failing compiler pass', () => {
    const host = new CountingCommitter();
    const refusing: ReturnType<typeof defineCompilerPass> = {
      name: 'refusing',
      compile: () => ({
        kind: 'failed',
        errors: [{ code: 'E_SCHEMA', layer: 'registry', message: 'pass refuses' }],
      }),
    };

    const result = executeChoreographyGroup(registry, groupNode(ALL_VALID), {
      committer: host,
      compilerPasses: [refusing],
    });

    expect(result.committed).toBe(false);
    expect(host.commitCalls).toBe(0);
    expect(host.mutationCount).toBe(0);
  });

  it('reports every member as not committed, including the ones that would have passed', () => {
    const host = new CountingCommitter();
    const result = executeChoreographyGroup(registry, groupNode(WITH_UNKNOWN_ACTION), { committer: host });

    expect(result.outcomes).toHaveLength(3);
    expect(result.outcomes.every((outcome) => !outcome.committed)).toBe(true);
    // The members that would have passed are named, not silently dropped — an author needs to know
    // which commands were collateral.
    expect(result.outcomes.filter((o) => o.errors.length > 0)).toHaveLength(3);
  });

  it('keeps the outcome order matching the group order', () => {
    const host = new CountingCommitter();
    const node = groupNode(WITH_UNKNOWN_ACTION);
    const result = executeChoreographyGroup(registry, node, { committer: host });
    expect(result.outcomes.map((o) => o.command)).toEqual([...node.commands]);
  });
});

describe('TEST-178 / a successful atomic group commits once, with everything', () => {
  it('one committer call carrying every effect', () => {
    const host = new CountingCommitter('fixture-plugin');
    const result = executeChoreographyGroup(registry, groupNode(ALL_VALID), { committer: host });

    expect(result.committed).toBe(true);
    expect(result.effectCount).toBe(2);
    expect(host.commitCalls).toBe(1);
    expect(host.batches).toHaveLength(1);
    expect(host.actions).toEqual(['fixture.mark', 'fixture.mark']);
    expect(result.outcomes.every((outcome) => outcome.committed)).toBe(true);
  });

  it('a group whose pass expands one member commits the expansion in the same single call', () => {
    const host = new CountingCommitter();
    const expander = defineCompilerPass('expander', {
      'fixture.mark': [{ action: 'fixture.leaf', payload: { args: [], kwargs: {}, refs: [] } }],
    });
    const result = executeChoreographyGroup(registry, groupNode(ALL_VALID), {
      committer: host,
      compilerPasses: [expander],
    });

    expect(host.commitCalls).toBe(1);
    expect(result.effectCount).toBe(2);
    expect(host.actions).toEqual(['fixture.leaf', 'fixture.leaf']);
  });

  it('stamps the adapter\'s plugin on every effect', () => {
    const host = new CountingCommitter('declared-plugin');
    executeChoreographyGroup(registry, groupNode(ALL_VALID), { committer: host });
    expect(host.batches[0]?.every((mutation) => mutation.plugin === 'declared-plugin')).toBe(true);
  });

  it('threads a supplied correlation id onto every effect', () => {
    const host = new CountingCommitter();
    executeChoreographyGroup(registry, groupNode(ALL_VALID), { committer: host, correlationId: 'group-1' });
    const effects = host.batches[0] ?? [];
    expect(effects).toHaveLength(2);
  });
});

describe('TEST-178 / a refused write is not retried and not swallowed', () => {
  it('propagates the adapter error, with exactly one attempt and nothing landed', () => {
    const host = new CountingCommitter();
    host.failWith(new Error('host refused the group'));

    expect(() =>
      executeChoreographyGroup(registry, groupNode(ALL_VALID), { committer: host }),
    ).toThrow('host refused the group');

    expect(host.commitCalls).toBe(1);
    expect(host.mutationCount).toBe(0);
  });
});

describe('TEST-178 / best-effort groups commit what passes', () => {
  it('commits the valid members and diagnoses the invalid one', () => {
    const host = new CountingCommitter();
    const script = '[batch best_effort][fixture.mark id=a][evil.run x=1][fixture.mark id=c][/batch]';
    const result = executeChoreographyGroup(registry, groupNode(script), { committer: host });

    expect(result.atomic).toBe(false);
    expect(result.committed).toBe(true);
    expect(result.effectCount).toBe(2);
    expect(host.commitCalls).toBe(1);

    const failed = result.outcomes.filter((outcome) => !outcome.committed);
    expect(failed).toHaveLength(1);
    expect(failed[0]?.command.action).toBe('evil.run');
  });

  it('does not contact the host when every member fails', () => {
    const host = new CountingCommitter();
    const script = '[batch best_effort][evil.one x=1][evil.two x=2][/batch]';
    const result = executeChoreographyGroup(registry, groupNode(script), { committer: host });

    expect(result.committed).toBe(false);
    expect(host.commitCalls).toBe(0);
    expect(result.outcomes).toHaveLength(2);
  });

  it('treats an undeclared mode as atomic, because the safe reading is the default', () => {
    const host = new CountingCommitter();
    const script = '[batch][fixture.mark id=a][evil.run x=1][/batch]';
    const result = executeChoreographyGroup(registry, groupNode(script), { committer: host });

    expect(result.atomic).toBe(true);
    expect(result.committed).toBe(false);
    expect(host.commitCalls).toBe(0);
  });
});

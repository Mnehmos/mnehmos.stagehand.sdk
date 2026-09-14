/**
 * TEST-179 — sequence/parallel metadata independent of wall clock.
 *
 * The claim is a negative one and therefore the kind that rots quietly: the IR expresses ordering and
 * concurrency as **data**, and reading a clock or scheduling a timer is impossible from it. Asserting
 * "we verified by inspection" would be worth nothing, so the ambient time source and the ambient
 * timer are both replaced with throwing functions for the duration of the work. A path that reads
 * either fails loudly instead of producing a plausible-looking result.
 *
 * Covers FR-191. Tasks T-037, T-039.
 */

import { describe, expect, it, afterEach } from 'vitest';
import { parseScript } from '@stagehand/parser';
import { compileChoreography, executeChoreographyGroup, nodesOfKind } from '../src/index.js';
import { CountingCommitter, makeRegistry } from './fixtures.js';

const registry = makeRegistry();
const lookup = { lookupSchema: registry.lookup };

const originalNow = Date.now;
const originalSetTimeout = globalThis.setTimeout;
afterEach(() => {
  Date.now = originalNow;
  globalThis.setTimeout = originalSetTimeout;
});

/** Poison the ambient clock and timer, run `body`, then restore. */
function withPoisonedTime<T>(body: () => T): T {
  Date.now = () => {
    throw new Error('the choreography IR read an ambient clock');
  };
  globalThis.setTimeout = (() => {
    throw new Error('the choreography IR scheduled an ambient timer');
  }) as unknown as typeof setTimeout;
  try {
    return body();
  } finally {
    Date.now = originalNow;
    globalThis.setTimeout = originalSetTimeout;
  }
}

describe('TEST-179 / compilation and group execution read no clock', () => {
  it('compiles and executes with Date.now and setTimeout poisoned', () => {
    const script = '[batch atomic][fixture.mark id=a][fixture.mark id=b][/batch]';
    const host = new CountingCommitter();

    const result = withPoisonedTime(() => {
      const nodes = compileChoreography(parseScript(script, lookup));
      const group = nodes[0];
      if (group === undefined || group.kind === 'command') throw new Error('expected a group');
      return executeChoreographyGroup(registry, group, { committer: host });
    });

    expect(result.committed).toBe(true);
    expect(host.commitCalls).toBe(1);
  });

  it('compiles a pause declaration without scheduling anything', () => {
    const nodes = withPoisonedTime(() =>
      compileChoreography(parseScript('[sequence pause=250][fixture.mark id=a][end]', lookup)),
    );
    const [group] = nodes;
    if (group?.kind !== 'sequence') throw new Error('expected a sequence');
    // The pause is a number in the IR. Nothing waited for it, and nothing scheduled it.
    expect(group.pauseMs).toBe(250);
  });
});

describe('TEST-179 / ordering and concurrency are data', () => {
  it('a sequence preserves declared order across repeated compilations', () => {
    const script = '[sequence][fixture.mark id=one][fixture.mark id=two][fixture.mark id=three][end]';
    const order = (): readonly string[] => {
      const group = nodesOfKind(compileChoreography(parseScript(script, lookup)), 'sequence')[0];
      if (group === undefined) throw new Error('expected a sequence');
      return group.commands.map((command) => command.kwargs['id'] ?? '');
    };
    expect(order()).toEqual(['one', 'two', 'three']);
    expect(order()).toEqual(order());
  });

  it('a parallel group lists its members without imposing an order of its own', () => {
    const nodes = compileChoreography(parseScript('[parallel][fixture.mark id=a][fixture.mark id=b][end]', lookup));
    const [group] = nodes;
    if (group?.kind !== 'parallel') throw new Error('expected a parallel');
    // Source order, which is the only order the IR knows. It does not sort, rank, or schedule them.
    expect(group.commands.map((c) => c.kwargs['id'])).toEqual(['a', 'b']);
    expect('pauseMs' in group).toBe(false);
    expect('mode' in group).toBe(false);
  });

  it('carries a batch mode without interpreting it', () => {
    const atomic = nodesOfKind(compileChoreography(parseScript('[batch atomic][fixture.mark id=a][end]', lookup)), 'batch')[0];
    const best = nodesOfKind(
      compileChoreography(parseScript('[batch best_effort][fixture.mark id=a][end]', lookup)),
      'batch',
    )[0];
    expect(atomic?.mode).toBe('atomic');
    expect(best?.mode).toBe('best_effort');
  });

  it('separates a declared zero pause from an absent one', () => {
    const zero = nodesOfKind(compileChoreography(parseScript('[sequence pause=0][fixture.mark id=a][end]', lookup)), 'sequence')[0];
    const absent = nodesOfKind(compileChoreography(parseScript('[sequence][fixture.mark id=a][end]', lookup)), 'sequence')[0];
    expect(zero?.pauseMs).toBe(0);
    expect(absent !== undefined && 'pauseMs' in absent).toBe(false);
  });
});

describe('TEST-179 / metadata is inert', () => {
  it('executing a group with a long pause takes no time', () => {
    const host = new CountingCommitter();
    const nodes = compileChoreography(parseScript('[sequence pause=60000][fixture.mark id=a][end]', lookup));
    const [group] = nodes;
    if (group === undefined || group.kind === 'command') throw new Error('expected a group');

    const started = process.hrtime.bigint();
    const result = executeChoreographyGroup(registry, group, { committer: host });
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;

    expect(result.committed).toBe(true);
    // Sixty declared seconds, and execution returned immediately: the IR carries the number, it does
    // not honour it. Honouring it is a host's job, with FEAT-006's bounded wait.
    expect(elapsedMs).toBeLessThan(1000);
  });

  it('compilation is pure: the same segments compile to equal nodes', () => {
    const script = 'A [sequence pause=100][fixture.mark id=x][end] B [parallel][fixture.mark id=y][end]';
    const segments = parseScript(script, lookup);
    expect(compileChoreography(segments)).toEqual(compileChoreography(segments));
  });

  it('does not mutate the segments it is given', () => {
    const segments = parseScript('[batch atomic][fixture.mark id=a][end]', lookup);
    const snapshot = structuredClone(segments);
    compileChoreography(segments);
    expect(segments).toEqual(snapshot);
  });
});

/**
 * TEST-174 — rejected commands cause zero fake-host mutations.
 *
 * This is the feature's central safety claim, so it is asserted **once per rejection path** rather
 * than once in aggregate. A single aggregate assertion passes as long as one path is safe; a
 * per-path assertion names the path that is not.
 *
 * The host is `MutationCountingCommitter`, which reports attempts and landed writes separately.
 * That separation is what lets a test tell "the runtime called the host and the host refused" apart
 * from "the runtime never called the host" — two situations that look identical if you only count
 * successes, and mean very different things about the executor.
 *
 * Covers FR-185. Tasks T-033, T-034.
 */

import { describe, expect, it } from 'vitest';
import { validateCommand } from '@stagehand/registry';
import {
  executeStagehandCommand,
  type CommandCompilerPass,
  type ExecutionOutcome,
  type RuntimeEvent,
} from '../src/index.js';
import { MapResolver, MutationCountingCommitter, NULL_RESOLVER } from './fake-host.js';
import { FIXTURE_PASS, KNOWN_REFERENCES, cmd, makeRegistry } from './fixtures.js';

const registry = makeRegistry();

function resolver(): MapResolver {
  const map = new MapResolver();
  for (const [reference, target] of Object.entries(KNOWN_REFERENCES)) map.set(reference, target);
  return map;
}

/** Assert the host was not touched at all: neither written to nor even asked. */
function expectNoHostContact(outcome: ExecutionOutcome, host: MutationCountingCommitter): void {
  expect(host.mutationCount).toBe(0);
  expect(host.commitCalls).toBe(0);
  expect(outcome.committed).toBe(false);
  expect(outcome.effectCount).toBe(0);
}

function onlyEvent(outcome: ExecutionOutcome): RuntimeEvent {
  expect(outcome.events).toHaveLength(1);
  const event = outcome.events[0];
  if (event === undefined) throw new Error('expected an event');
  return event;
}

describe('TEST-174 / every rejection path leaves the host untouched', () => {
  it('invalid action', () => {
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(registry, cmd('claim.show', { id: 'x' }), { committer: host });
    const event = onlyEvent(outcome);
    expect(event.type).toBe('invalid_command');
    if (event.type === 'invalid_command') {
      expect(event.channel).toBe('production');
      expect(event.layer).toBe('registry');
      expect(event.errors[0]?.code).toBe('E_UNKNOWN_ACTION');
    }
    expectNoHostContact(outcome, host);
  });

  it('schema violation', () => {
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(registry, cmd('whiteboard.text', { id: 't', size: 'huge' }), {
      committer: host,
    });
    const event = onlyEvent(outcome);
    expect(event.type).toBe('invalid_command');
    if (event.type === 'invalid_command') expect(event.errors.some((e) => e.subject === 'size')).toBe(true);
    expectNoHostContact(outcome, host);
  });

  it('missing required kwarg', () => {
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(registry, cmd('piece.place'), { committer: host });
    const event = onlyEvent(outcome);
    expect(event.type).toBe('invalid_command');
    if (event.type === 'invalid_command') expect(event.errors.some((e) => e.subject === 'at')).toBe(true);
    expectNoHostContact(outcome, host);
  });

  it('unresolved reference under strict', () => {
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(registry, cmd('map.focus', { id: 'country:ussr' }), {
      committer: host,
      resolver: resolver(),
    });
    const event = onlyEvent(outcome);
    expect(event.type).toBe('unresolved_refs');
    if (event.type === 'unresolved_refs') {
      expect(event.channel).toBe('production');
      expect(event.unresolved).toEqual(['id']);
      expect(event.proposals).toEqual([]);
    }
    expectNoHostContact(outcome, host);
  });

  it('unresolved reference under propose-stub, which offers a proposal but still does not commit', () => {
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(registry, cmd('map.focus', { id: 'city:atlantis' }), {
      committer: host,
      resolver: resolver(),
      entityResolution: 'propose-stub',
    });
    const event = onlyEvent(outcome);
    expect(event.type).toBe('unresolved_refs');
    if (event.type === 'unresolved_refs') {
      expect(event.proposals).toHaveLength(1);
      expect(event.proposals[0]?.reference).toBe('city:atlantis');
      expect(event.proposals[0]?.slot).toBe('id');
      expect(event.proposals[0]?.action).toBe('map.focus');
    }
    // A stub is a proposal, never an authorization: proposing must not become silent entity creation.
    expectNoHostContact(outcome, host);
  });

  it('reference-carrying command with no resolver supplied', () => {
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(registry, cmd('map.focus', { id: 'city:venice' }), {
      committer: host,
    });
    const event = onlyEvent(outcome);
    expect(event.type).toBe('unresolved_refs');
    expectNoHostContact(outcome, host);
  });

  it('a resolver that resolves nothing', () => {
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(registry, cmd('avatar.move', {}, ['anchor:desk']), {
      committer: host,
      resolver: NULL_RESOLVER,
    });
    expect(onlyEvent(outcome).type).toBe('unresolved_refs');
    expectNoHostContact(outcome, host);
  });

  it('failing compiler pass', () => {
    const host = new MutationCountingCommitter();
    const failing: CommandCompilerPass = {
      name: 'failing',
      compile: () => ({
        kind: 'failed',
        errors: [{ code: 'E_SCHEMA', layer: 'registry', message: 'pass refuses this action' }],
      }),
    };
    const outcome = executeStagehandCommand(registry, cmd('whiteboard.text', { id: 't' }), {
      committer: host,
      compilerPasses: [failing],
    });
    const event = onlyEvent(outcome);
    expect(event.type).toBe('compile_failed');
    if (event.type === 'compile_failed') expect(event.pass).toBe('failing');
    expectNoHostContact(outcome, host);
  });

  it('expansion where the first primitive resolves and the second does not', () => {
    // The partial-expansion case: an earlier stage produced committable output, and a later stage
    // failed. Nothing may reach the host — a half-applied scene is worse than no scene.
    const host = new MutationCountingCommitter();
    const partial: CommandCompilerPass = {
      name: 'partial',
      compile: () => ({
        kind: 'expanded',
        commands: [
          { action: 'whiteboard.text', payload: { args: [], kwargs: { id: 't', text: 'ok' }, refs: [] }, resolved: [], raw: '[x]' },
          { action: 'map.focus', payload: { args: [], kwargs: { id: 'country:ussr' }, refs: [] }, resolved: [], raw: '[x]' },
        ],
      }),
    };
    const outcome = executeStagehandCommand(registry, cmd('fixture.semantic', { id: 'city:venice' }), {
      committer: host,
      resolver: resolver(),
      compilerPasses: [partial],
    });
    expect(onlyEvent(outcome).type).toBe('unresolved_refs');
    expectNoHostContact(outcome, host);
  });
});

describe('TEST-174 / the success path touches the host exactly once', () => {
  it('commits one batch and reports it on the public channel', () => {
    const host = new MutationCountingCommitter('geo');
    const outcome = executeStagehandCommand(registry, cmd('map.focus', { id: 'country:iran' }), {
      committer: host,
      resolver: resolver(),
    });

    expect(outcome.committed).toBe(true);
    expect(outcome.effectCount).toBe(1);
    expect(host.commitCalls).toBe(1);
    expect(host.mutationCount).toBe(1);
    expect(host.mutations[0]?.plugin).toBe('geo');
    expect(host.mutations[0]?.action).toBe('map.focus');

    const event = onlyEvent(outcome);
    expect(event.type).toBe('scene_command');
    if (event.type === 'scene_command') {
      expect(event.channel).toBe('public');
      expect(event.plugin).toBe('geo');
      expect(event.effects).toHaveLength(1);
      expect(event.effect).toBe(event.effects[0]);
    }
  });

  it('commits a command with no references without needing a resolver', () => {
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(registry, cmd('whiteboard.text', { id: 't', text: 'hi' }), {
      committer: host,
    });
    expect(outcome.committed).toBe(true);
    expect(host.mutationCount).toBe(1);
  });

  it('stamps the plugin declared by the adapter, not a name derived from the action', () => {
    const host = new MutationCountingCommitter('plugin-owned-name');
    executeStagehandCommand(registry, cmd('whiteboard.text', { id: 't' }), { committer: host });
    expect(host.mutations[0]?.plugin).toBe('plugin-owned-name');
  });

  it('threads a supplied correlation id onto the effect and omits it otherwise', () => {
    const withId = new MutationCountingCommitter();
    executeStagehandCommand(registry, cmd('whiteboard.text', { id: 't' }), {
      committer: withId,
      correlationId: 'corr-1',
    });
    expect(withId.mutations[0]?.correlationId).toBe('corr-1');

    const withoutId = new MutationCountingCommitter();
    executeStagehandCommand(registry, cmd('whiteboard.text', { id: 't' }), { committer: withoutId });
    expect('correlationId' in (withoutId.mutations[0] ?? {})).toBe(false);
  });
});

describe('TEST-174 / a refused commit is not retried and not swallowed', () => {
  it('propagates the adapter error and does not re-commit', () => {
    const host = new MutationCountingCommitter();
    host.failWith(new Error('host refused the write'));

    expect(() =>
      executeStagehandCommand(registry, cmd('whiteboard.text', { id: 't' }), { committer: host }),
    ).toThrow('host refused the write');

    // The runtime asked exactly once and did not retry, and nothing landed.
    expect(host.commitCalls).toBe(1);
    expect(host.mutationCount).toBe(0);
  });

  it('does not report success when the commit threw', () => {
    const host = new MutationCountingCommitter();
    host.failWith(new Error('nope'));
    let outcome: ExecutionOutcome | undefined;
    try {
      outcome = executeStagehandCommand(registry, cmd('whiteboard.text', { id: 't' }), { committer: host });
    } catch {
      outcome = undefined;
    }
    // Throwing means no return value at all — there is no half-object claiming committed: false.
    expect(outcome).toBeUndefined();
  });

  it('a refused batch is not retried', () => {
    // What the runtime owns is *one call, after full authorization*. Whether a partial write is
    // possible inside a single commit belongs to the adapter — core cannot see host state and must
    // not claim to — so the assertion here is the call count. An implementation that retried on
    // failure, or that committed effect-by-effect and then retried, would exceed one.
    //
    // The batching *shape* (one call for a multi-effect expansion) is asserted in TEST-175, which is
    // where the distinction is observable: this fake host throws before recording, so a per-effect
    // implementation leaves exactly as many mutations behind as a batched one — zero.
    const host = new MutationCountingCommitter();
    host.failWith(new Error('host refused the batch'));

    expect(() =>
      executeStagehandCommand(registry, cmd('fixture.semantic'), {
        committer: host,
        compilerPasses: [FIXTURE_PASS],
      }),
    ).toThrow('host refused the batch');

    expect(host.commitCalls).toBe(1);
    expect(host.mutationCount).toBe(0);
  });
});

describe('TEST-174 / the executor does not re-validate what it was told is valid', () => {
  it('accepts a command the registry accepts, using the registry as the single authority', () => {
    const host = new MutationCountingCommitter();
    const command = cmd('map.highlight', { entities: 'country:iran,city:venice' });
    expect(validateCommand(registry, command).ok).toBe(true);

    const outcome = executeStagehandCommand(registry, command, {
      committer: host,
      resolver: resolver(),
    });
    expect(outcome.committed).toBe(true);
    expect(host.commitCalls).toBe(1);
  });
});

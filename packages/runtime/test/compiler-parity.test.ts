/**
 * TEST-175 — semantic-command compiler parity.
 *
 * The goldens here pin the *mechanism*: how a pass expands, what ordering does to the result, that
 * expansion never commits partially, and that the output is deterministic. The fixture actions are
 * deliberately named `fixture.semantic` / `fixture.primitive.*` rather than real geo actions,
 * because the real v2→primitive mappings belong to the plugins that own those dialects
 * (`FEAT-007`, `FEAT-008`). Asserting parity against a mapping nobody has written would be inventing
 * a golden, not checking one.
 *
 * Covers FR-184. Tasks T-032, T-034.
 */

import { describe, expect, it } from 'vitest';
import {
  defineCompilerPass,
  executeStagehandCommand,
  runCompilerPasses,
  type TrustedCompilerPass,
  type CompilableCommand,
} from '../src/index.js';
import { MapResolver, MutationCountingCommitter } from './fake-host.js';
import { FIXTURE_PASS, KNOWN_REFERENCES, cmd, makeRegistry } from './fixtures.js';

const registry = makeRegistry();

function resolver(): MapResolver {
  const map = new MapResolver();
  for (const [reference, target] of Object.entries(KNOWN_REFERENCES)) map.set(reference, target);
  return map;
}

const primitive = (action: string, kwargs: Record<string, string> = {}): CompilableCommand => ({
  action,
  payload: { args: [], kwargs, refs: [] },
  resolved: [],
  raw: '[fixture]',
});

describe('TEST-175 / expansion goldens', () => {
  it('expands one semantic command into its primitives in declared order', () => {
    const result = runCompilerPasses(primitive('fixture.semantic'), [FIXTURE_PASS], {
      action: 'fixture.semantic',
      plugin: 'fixture',
    });
    expect(result.ok).toBe(true);
    expect(result.commands.map((c) => c.action)).toEqual([
      'fixture.primitive.begin',
      'fixture.primitive.end',
    ]);
    expect(result.commands.map((c) => c.payload['kwargs'])).toEqual([
      { phase: 'begin' },
      { phase: 'end' },
    ]);
  });

  it('leaves an unrecognised action unchanged', () => {
    const result = runCompilerPasses(primitive('whiteboard.text', { id: 't' }), [FIXTURE_PASS], {
      action: 'whiteboard.text',
      plugin: 'fixture',
    });
    expect(result.ok).toBe(true);
    expect(result.commands).toHaveLength(1);
    expect(result.commands[0]?.action).toBe('whiteboard.text');
    expect(result.commands[0]?.payload['kwargs']).toEqual({ id: 't' });
  });

  it('leaves the command unchanged when no passes are supplied', () => {
    const result = runCompilerPasses(primitive('map.focus', { id: 'x' }), [], {
      action: 'map.focus',
      plugin: 'fixture',
    });
    expect(result.ok).toBe(true);
    expect(result.commands.map((c) => c.action)).toEqual(['map.focus']);
  });

  it('declining is not failing: the command stays committable', () => {
    const decliner: TrustedCompilerPass = { name: 'decliner', compile: () => ({ kind: 'unchanged' }) };
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(registry, cmd('whiteboard.text', { id: 't' }), {
      committer: host,
      compilerPasses: [decliner],
    });
    expect(outcome.committed).toBe(true);
    expect(host.mutations.map((m) => m.action)).toEqual(['whiteboard.text']);
  });
});

describe('TEST-175 / ordering and composition', () => {
  const PASS_A = defineCompilerPass('A', { 'fixture.semantic': [{ action: 'stage.a' }] });
  const PASS_B = defineCompilerPass('B', { 'stage.a': [{ action: 'stage.b' }] });

  it('a later pass sees what an earlier pass produced', () => {
    const ab = runCompilerPasses(primitive('fixture.semantic'), [PASS_A, PASS_B], {
      action: 'fixture.semantic',
      plugin: 'fixture',
    });
    expect(ab.commands.map((c) => c.action)).toEqual(['stage.b']);
  });

  it('reversing dependent passes changes the result, which is why order is declared', () => {
    const ba = runCompilerPasses(primitive('fixture.semantic'), [PASS_B, PASS_A], {
      action: 'fixture.semantic',
      plugin: 'fixture',
    });
    expect(ba.commands.map((c) => c.action)).toEqual(['stage.a']);
  });

  it('independent passes give the same result in either order', () => {
    const expo: TrustedCompilerPass = {
      name: 'expo',
      compile: () => ({
        kind: 'expanded',
        commands: [primitive('x.one'), primitive('x.two')],
      }),
    };
    const decliner: TrustedCompilerPass = { name: 'decliner', compile: () => ({ kind: 'unchanged' }) };

    const forward = runCompilerPasses(primitive('anything'), [expo, decliner], { action: 'a', plugin: 'p' });
    const reverse = runCompilerPasses(primitive('anything'), [decliner, expo], { action: 'a', plugin: 'p' });
    expect(reverse.commands).toEqual(forward.commands);
  });

  it('does not re-enter a pass: an expansion is not itself re-expanded by the same pass', () => {
    // A pass that maps `a.b` to itself would loop forever if passes recursed.
    const selfReferential = defineCompilerPass('self', { 'loop.a': [{ action: 'loop.a' }] });
    const result = runCompilerPasses(primitive('loop.a'), [selfReferential], { action: 'loop.a', plugin: 'p' });
    expect(result.ok).toBe(true);
    expect(result.commands.map((c) => c.action)).toEqual(['loop.a']);
  });
});

describe('TEST-175 / expansion is all-or-nothing', () => {
  it('a failing pass discards the output of passes that already succeeded', () => {
    // Fails only on the primitives the first pass produced, so the first pass has already done work
    // by the time the failure happens.
    const boom: TrustedCompilerPass = {
      name: 'boom',
      compile: (command) =>
        command.action.startsWith('fixture.primitive.')
          ? { kind: 'failed', errors: [{ code: 'E_SCHEMA', layer: 'registry', message: 'refused downstream' }] }
          : { kind: 'unchanged' },
    };
    const result = runCompilerPasses(primitive('fixture.semantic'), [FIXTURE_PASS, boom], {
      action: 'fixture.semantic',
      plugin: 'fixture',
    });
    expect(result.ok).toBe(false);
    expect(result.failedPass).toBe('boom');
    // The expansion produced two commands before the failure; neither is offered as committable.
    expect(result.commands).toEqual([]);
  });

  it('refuses an expansion to zero commands rather than silently committing nothing', () => {
    const annihilator: TrustedCompilerPass = { name: 'annihilator', compile: () => ({ kind: 'expanded', commands: [] }) };
    const result = runCompilerPasses(primitive('fixture.semantic'), [annihilator], {
      action: 'fixture.semantic',
      plugin: 'fixture',
    });
    expect(result.ok).toBe(false);
    expect(result.failedPass).toBe('annihilator');
    expect(result.errors.some((e) => e.message.includes('zero commands'))).toBe(true);
  });
});

describe('TEST-175 / the executor commits an expansion in one batch', () => {
  it('sends every primitive in a single commit call', () => {
    const host = new MutationCountingCommitter('fixture-plugin');
    const outcome = executeStagehandCommand(registry, cmd('fixture.semantic', { id: 'city:venice' }), {
      committer: host,
      resolver: resolver(),
      compilerPasses: [FIXTURE_PASS],
      correlationId: 'corr-expand',
    });

    expect(outcome.committed).toBe(true);
    expect(outcome.effectCount).toBe(2);
    expect(host.commitCalls).toBe(1);
    expect(host.batches).toHaveLength(1);
    expect(host.mutations.map((m) => m.action)).toEqual([
      'fixture.primitive.begin',
      'fixture.primitive.end',
    ]);
    // The correlation id threads through the expansion, so a trace can tie primitives to one command.
    expect(host.mutations.map((m) => m.correlationId)).toEqual(['corr-expand', 'corr-expand']);
    // And every effect is stamped with the adapter's plugin, not the fixture action's prefix.
    expect(host.mutations.every((m) => m.plugin === 'fixture-plugin')).toBe(true);
  });

  it('resolves references on the expanded commands, not on the shape they replaced', () => {
    const host = new MutationCountingCommitter();
    const expander = defineCompilerPass('expander', {
      'fixture.semantic': [{ action: 'map.focus', payload: { args: [], kwargs: { id: 'country:iran' }, refs: [] } }],
    });
    executeStagehandCommand(registry, cmd('fixture.semantic', { id: 'city:venice' }), {
      committer: host,
      resolver: resolver(),
      compilerPasses: [expander],
    });
    // The primitive's own payload named country:iran, so that is what must be committed — not the
    // semantic command's city:venice, which the expansion discarded.
    const refs = host.mutations[0]?.payload['refs'];
    expect(Array.isArray(refs)).toBe(true);
    expect((refs as { raw: string; id: string }[])[0]?.raw).toBe('country:iran');
    expect((refs as { raw: string; id: string }[])[0]?.id).toBe('IRN');
  });

  it('reports the primary effect as the head of the batch', () => {
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(registry, cmd('fixture.semantic'), {
      committer: host,
      compilerPasses: [FIXTURE_PASS],
    });
    const event = outcome.events[0];
    expect(event?.type).toBe('scene_command');
    if (event?.type === 'scene_command') {
      expect(event.effects).toHaveLength(2);
      expect(event.effect).toBe(event.effects[0]);
      expect(event.effect.action).toBe('fixture.primitive.begin');
    }
  });
});

describe('TEST-175 / determinism', () => {
  it('produces byte-identical effects across repeated runs', () => {
    const runs: string[] = [];
    for (let i = 0; i < 5; i++) {
      const host = new MutationCountingCommitter();
      executeStagehandCommand(registry, cmd('fixture.semantic', { id: 'country:iran' }), {
        committer: host,
        resolver: resolver(),
        compilerPasses: [FIXTURE_PASS],
        correlationId: 'fixed',
      });
      runs.push(JSON.stringify(host.mutations));
    }
    expect(new Set(runs).size).toBe(1);
  });

  it('does not consult a clock or randomness in the compile path', () => {
    // A pass that captured a timestamp would make this differ between runs; the runtime itself
    // contributes nothing time- or entropy-dependent.
    const first = runCompilerPasses(primitive('fixture.semantic'), [FIXTURE_PASS], {
      action: 'fixture.semantic',
      plugin: 'p',
    });
    const second = runCompilerPasses(primitive('fixture.semantic'), [FIXTURE_PASS], {
      action: 'fixture.semantic',
      plugin: 'p',
    });
    expect(second).toEqual(first);
  });
});

/**
 * TEST-183 — version mismatch and the migrator registry.
 *
 * Every case here is a *silently wrong* load that the registry must turn into a refusal. The
 * dangerous failures in trace compatibility are not crashes; they are envelopes that load, look
 * complete, and are missing what the reader did not know to ask for — which is exactly the shape of
 * `FIND-005`, where the recovered host shipped traces with no schema version at all.
 *
 * Covers FR-197. Task T-043.
 */

import { describe, expect, it } from 'vitest';
import {
  createEnvelope,
  DuplicateMigratorError,
  EventBus,
  MigratorRegistry,
  parseTrace,
  serializeTrace,
  type EnvelopeRecord,
  type TraceEnvelope,
  type TraceMigrator,
} from '../src/index.js';
import { fakeClock } from './helpers.js';

function sampleEnvelope(protocolVersion: string): TraceEnvelope {
  const clk = fakeClock();
  const bus = new EventBus({ sessionId: 's-legacy', clock: clk.clock });
  bus.emitPublic('caption', { text: 'hello' });
  return createEnvelope({ ...bus.snapshot(), protocolVersion });
}

/**
 * A migrator that bumps the version and nothing else.
 *
 * It deliberately does not add a field: `upgrade` re-validates the migrated record against the
 * envelope schema, which permits only its declared fields, so an added field would be dropped. That
 * is the property `does not let a migrator smuggle a field past the envelope contract` covers; here
 * the concern is purely the chain.
 */
function bumpVersion(from: string, to: string): TraceMigrator {
  return {
    from,
    to,
    description: `bumps ${from} to ${to}`,
    migrate: (record: EnvelopeRecord): EnvelopeRecord => ({ ...record, protocolVersion: to }),
  };
}

describe('TEST-183 / a matching version needs no migration', () => {
  it('loads an envelope already at the target version', () => {
    const registry = new MigratorRegistry();
    const text = serializeTrace(sampleEnvelope('1.0.0'));
    const result = registry.upgrade(text, '1.0.0');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.path).toEqual(['1.0.0']);
    expect(registry.size).toBe(0);
  });

  it('plans a single-version path with no migrators', () => {
    expect(new MigratorRegistry().plan('1.0.0', '1.0.0')).toEqual({ ok: true, path: ['1.0.0'] });
  });
});

describe('TEST-183 / absence of a migrator is a refusal', () => {
  it('refuses an older envelope with no registered migrator, naming the version', () => {
    const registry = new MigratorRegistry();
    const text = serializeTrace(sampleEnvelope('0.9.0'));
    const result = registry.upgrade(text, '1.0.0');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toContain('no migrator registered');
    expect(result.reason).toContain('0.9.0');
  });

  it('refuses a newer envelope rather than reading it forward-compatibly', () => {
    // A forward-compatible read drops fields this build does not know exist — the same failure as
    // reading an old envelope as though it matched, in the other direction.
    const registry = new MigratorRegistry();
    const text = serializeTrace(sampleEnvelope('2.0.0'));
    const result = registry.upgrade(text, '1.0.0');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain('2.0.0');
  });

  it('reports a missing link in a chain rather than partially upgrading', () => {
    const registry = new MigratorRegistry().register(bumpVersion('0.8.0', '0.9.0'));
    const text = serializeTrace(sampleEnvelope('0.9.0'));
    const result = registry.upgrade(text, '1.0.0');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain('0.9.0');
  });
});

describe('TEST-183 / explicit chains upgrade in order', () => {
  it('applies a single migrator and reports the path', () => {
    const registry = new MigratorRegistry().register(bumpVersion('0.9.0', '1.0.0'));
    const text = serializeTrace(sampleEnvelope('0.9.0'));
    const result = registry.upgrade(text, '1.0.0');

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.path).toEqual(['0.9.0', '1.0.0']);
    expect(result.envelope.protocolVersion).toBe('1.0.0');
    // The migrated envelope is not merely well-shaped: it round-trips like a natively recorded one.
    expect(parseTrace(serializeTrace(result.envelope)).ok).toBe(true);
  });

  it('applies a two-step chain in declared order', () => {
    const applied: string[] = [];
    const step = (from: string, to: string): TraceMigrator => ({
      from,
      to,
      migrate: (record) => {
        applied.push(`${from}->${to}`);
        return { ...record, protocolVersion: to };
      },
    });

    const registry = new MigratorRegistry()
      .register(step('0.7.0', '0.8.0'))
      .register(step('0.8.0', '1.0.0'));

    const text = serializeTrace(sampleEnvelope('0.7.0'));
    const result = registry.upgrade(text, '1.0.0');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.path).toEqual(['0.7.0', '0.8.0', '1.0.0']);
    // Both links ran, in order: 0.7.0->0.8.0 before 0.8.0->1.0.0.
    expect(applied).toEqual(['0.7.0->0.8.0', '0.8.0->1.0.0']);
  });

  it('does not let a migrator smuggle a field past the envelope contract', () => {
    // `upgrade` re-validates through the same parser, and the envelope schema permits only its
    // declared fields. So a migrator cannot invent an extension point: anything it adds that is not
    // part of the envelope is dropped, which is what keeps a migrated envelope the same shape as a
    // natively recorded one.
    const smuggler: TraceMigrator = {
      from: '0.9.0',
      to: '1.0.0',
      migrate: (record) => ({ ...record, smuggled: 'value', protocolVersion: '1.0.0' }),
    };
    const registry = new MigratorRegistry().register(smuggler);
    const result = registry.upgrade(serializeTrace(sampleEnvelope('0.9.0')), '1.0.0');
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect((result.envelope as unknown as Record<string, unknown>)['smuggled']).toBeUndefined();

    const ENVELOPE_FIELDS = [
      'adapterVersion',
      'assetManifestHash',
      'pluginVersions',
      'productionEvents',
      'protocolVersion',
      'publicEvents',
      'schemaSetVersion',
      'sessionId',
      'startedAt',
    ];
    for (const key of Object.keys(result.envelope)) {
      expect(ENVELOPE_FIELDS, `unexpected envelope field "${key}"`).toContain(key);
    }
  });

  it('never applies a migrator to a version it does not claim to read', () => {
    const applied: string[] = [];
    const spy: TraceMigrator = {
      from: '0.9.0',
      to: '1.0.0',
      migrate: (record) => {
        applied.push('0.9.0');
        return { ...record, protocolVersion: '1.0.0' };
      },
    };
    // Registered for 0.9.0, but the envelope is 0.8.0 and there is no 0.8.0 migrator.
    const registry = new MigratorRegistry().register(spy);
    const result = registry.upgrade(serializeTrace(sampleEnvelope('0.8.0')), '1.0.0');
    expect(result.ok).toBe(false);
    expect(applied).toEqual([]);
  });

  it('lists the versions it can read', () => {
    const registry = new MigratorRegistry()
      .register(bumpVersion('0.8.0', '0.9.0'))
      .register(bumpVersion('0.7.0', '0.8.0'));
    expect(registry.readableVersions).toEqual(['0.7.0', '0.8.0']);
  });
});

describe('TEST-183 / a bad migrator is caught, not trusted', () => {
  it('refuses a migrator that produces the wrong version', () => {
    const liar: TraceMigrator = {
      from: '0.9.0',
      to: '1.0.0',
      migrate: (record) => ({ ...record, protocolVersion: '0.9.5' }),
    };
    const registry = new MigratorRegistry().register(liar);
    const result = registry.upgrade(serializeTrace(sampleEnvelope('0.9.0')), '1.0.0');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain('0.9.5');
  });

  it('refuses a chain whose output drops a required field', () => {
    // The field-dropping upgrade: it "succeeds" and the envelope is no longer loadable.
    const dropper: TraceMigrator = {
      from: '0.9.0',
      to: '1.0.0',
      migrate: (record) => {
        const { sessionId, ...rest } = record;
        void sessionId;
        return { ...rest, protocolVersion: '1.0.0' };
      },
    };
    const registry = new MigratorRegistry().register(dropper);
    const result = registry.upgrade(serializeTrace(sampleEnvelope('0.9.0')), '1.0.0');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain('migrated envelope is invalid');
  });

  it('refuses to register two migrators for the same source version', () => {
    const registry = new MigratorRegistry().register(bumpVersion('0.9.0', '1.0.0'));
    expect(() => registry.register(bumpVersion('0.9.0', '1.1.0'))).toThrow(DuplicateMigratorError);
  });

  it('refuses a migrator that does not change the version', () => {
    const noop: TraceMigrator = { from: '1.0.0', to: '1.0.0', migrate: (record) => record };
    expect(() => new MigratorRegistry().register(noop)).toThrow(/does not change the version/);
  });

  it('detects a cycle among migrators instead of looping', () => {
    const registry = new MigratorRegistry()
      .register(bumpVersion('a', 'b'))
      .register(bumpVersion('b', 'a'));
    const plan = registry.plan('a', 'c');
    expect(plan.ok).toBe(false);
    if (!plan.ok) expect(plan.reason).toContain('cycles');
  });

  it('refuses a malformed envelope before attempting any migration', () => {
    const registry = new MigratorRegistry().register(bumpVersion('0.9.0', '1.0.0'));
    const result = registry.upgrade('{ not json', '1.0.0');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain('not valid JSON');
  });
});

describe('TEST-183 / migrated envelopes replay like native ones', () => {
  it('produces a replayable envelope through a chain', () => {
    const clk = fakeClock();
    const bus = new EventBus({ sessionId: 'legacy', clock: clk.clock });
    bus.emitPublic('effect.committed', { plugin: 'geo', action: 'map.focus' });
    const legacy = serializeTrace(createEnvelope({ ...bus.snapshot(), protocolVersion: '0.9.0' }));

    const registry = new MigratorRegistry().register(bumpVersion('0.9.0', '1.0.0'));
    const result = registry.upgrade(legacy, '1.0.0');
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.envelope.publicEvents).toHaveLength(1);
    expect(parseTrace(serializeTrace(result.envelope)).ok).toBe(true);
  });
});

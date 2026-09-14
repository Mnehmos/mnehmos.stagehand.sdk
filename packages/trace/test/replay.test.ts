/**
 * TEST-182 — serialize → load → replay, without model access.
 *
 * "Replay must not call a model" (Constitution VIII) and "replay is deterministic" (NFR-002) are
 * asserted here as consequences of the module's shape rather than as good intentions:
 *
 * - **No clock.** `Date.now` is replaced with a throwing function for the duration of the replay, so
 *   a path that read an ambient clock fails loudly instead of drifting silently.
 * - **No seam.** `replayTrace` is handed an envelope and nothing else that could reach a provider.
 *   There is no provider in the dependency closure at all, which `check:boundaries` enforces
 *   separately.
 * - **Public array only.** An envelope containing a rejected command replays to zero effects, which
 *   is the assertion that stops a diagnostic from being resurrected as a committed effect.
 *
 * Covers FR-196, FR-198. Tasks T-041, T-042.
 */

import { describe, expect, it, afterEach } from 'vitest';
import {
  createEnvelope,
  diagnosticsOf,
  EventBus,
  parseTrace,
  replayTrace,
  serializeReplay,
  serializeTrace,
  type TraceEnvelope,
} from '../src/index.js';
import { fakeClock } from './helpers.js';

const originalNow = Date.now;
afterEach(() => {
  Date.now = originalNow;
});

/** Record a session with both channels populated and return the envelope. */
function recordedEnvelope(): TraceEnvelope {
  const clk = fakeClock();
  const bus = new EventBus({ sessionId: 'session-42', clock: clk.clock });

  bus.emitPublic('narration.started', { utteranceId: 'u1' });
  bus.emitPublic('caption', { text: 'Venice grew rich on trade.' });
  bus.emitPublic('effect.committed', { plugin: 'geo', action: 'map.focus', correlationId: 'c1' });
  bus.emitPublic('effect.committed', { plugin: 'geo', action: 'map.highlight' });
  bus.emitPublic('board.revision.committed', { revision: 1 });
  bus.emitPublic('narration.ended', { utteranceId: 'u1' });

  bus.emitProduction('stream.chunk', { bytes: 12 });
  bus.emitProduction('segment.parsed', { kind: 'text' });
  bus.emitProduction('command.accepted', { action: 'map.focus' });
  bus.emitProduction('provider.request', { provider: 'openai', model: 'gpt-4o' });
  bus.emitProduction('provider.response', { provider: 'openai', status: '200' });

  return createEnvelope({
    ...bus.snapshot(),
    pluginVersions: { geo: '1.0.0' },
    adapterVersion: '2.0.0',
  });
}

describe('TEST-182 / round trip', () => {
  it('serializes, parses, and preserves both arrays exactly', () => {
    const envelope = recordedEnvelope();
    const text = serializeTrace(envelope);
    const parsed = parseTrace(text);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.envelope.sessionId).toBe('session-42');
    expect(parsed.envelope.publicEvents).toHaveLength(6);
    expect(parsed.envelope.productionEvents).toHaveLength(5);
    expect(parsed.envelope.publicEvents).toEqual(envelope.publicEvents);
    expect(parsed.envelope.productionEvents).toEqual(envelope.productionEvents);
    expect(parsed.envelope.pluginVersions).toEqual({ geo: '1.0.0' });
    expect(parsed.envelope.adapterVersion).toBe('2.0.0');
  });

  it('serializes deterministically, including plugin key order', () => {
    const envelope = createEnvelope({
      sessionId: 's',
      startedAt: 0,
      publicEvents: [],
      productionEvents: [],
      pluginVersions: { zebra: '1', alpha: '2', mid: '3' },
    });
    const first = serializeTrace(envelope);
    const second = serializeTrace(envelope);
    expect(second).toBe(first);
    // Sorted, so two hosts with the same plugins produce identical text.
    expect(first.indexOf('alpha')).toBeLessThan(first.indexOf('mid'));
    expect(first.indexOf('mid')).toBeLessThan(first.indexOf('zebra'));
  });
});

describe('TEST-182 / replay reproduces the committed effects', () => {
  it('yields the effect sequence in recorded order', () => {
    const parsed = parseTrace(serializeTrace(recordedEnvelope()));
    if (!parsed.ok) throw new Error(parsed.reason);

    const replay = replayTrace(parsed.envelope);
    expect(replay.ok).toBe(true);
    if (!replay.ok) return;

    expect(replay.result.sessionId).toBe('session-42');
    expect(replay.result.effects).toEqual([
      { sequence: 3, plugin: 'geo', action: 'map.focus', correlationId: 'c1' },
      { sequence: 4, plugin: 'geo', action: 'map.highlight' },
    ]);
  });

  it('replays every public event, and only public events', () => {
    const parsed = parseTrace(serializeTrace(recordedEnvelope()));
    if (!parsed.ok) throw new Error(parsed.reason);
    const replay = replayTrace(parsed.envelope);
    if (!replay.ok) throw new Error(replay.reason);

    expect(replay.result.events).toHaveLength(6);
    expect(replay.result.events.every((e) => e.channel === 'public')).toBe(true);
    expect(replay.result.events.map((e) => e.type)).not.toContain('provider.request');
    expect(replay.result.events.map((e) => e.type)).not.toContain('command.accepted');
  });

  it('does not resurrect a rejected command as an effect', () => {
    // The whole point of reading only the public array: a rejection is an audit record, and replay
    // must not be able to manufacture a mutation out of a record of a refusal.
    const clk = fakeClock();
    const bus = new EventBus({ sessionId: 's', clock: clk.clock });
    bus.emitPublic('effect.committed', { plugin: 'geo', action: 'map.focus' });
    bus.emitProduction('command.rejected', { action: 'root.shell', errors: ['Unknown Stagehand action: root.shell'] });
    bus.emitProduction('diagnostic', { level: 'error', message: 'unresolved references in map.focus: id' });

    const envelope = createEnvelope({ ...bus.snapshot() });
    const replay = replayTrace(envelope);
    if (!replay.ok) throw new Error(replay.reason);

    expect(replay.result.effects.map((e) => e.action)).toEqual(['map.focus']);
    expect(JSON.stringify(replay.result)).not.toContain('root.shell');
    expect(JSON.stringify(replay.result)).not.toContain('unresolved references');
  });

  it('keeps production events reachable as audit material, but not as replay', () => {
    const parsed = parseTrace(serializeTrace(recordedEnvelope()));
    if (!parsed.ok) throw new Error(parsed.reason);

    const diagnostics = diagnosticsOf(parsed.envelope);
    expect(diagnostics).toHaveLength(5);
    expect(diagnostics.every((e) => e.channel === 'production')).toBe(true);
    expect(diagnostics.map((e) => e.sequence)).toEqual([7, 8, 9, 10, 11]);
  });

  it('orders by sequence even if the array was stored unsorted', () => {
    const envelope = recordedEnvelope();
    const shuffled: TraceEnvelope = {
      ...envelope,
      publicEvents: [...envelope.publicEvents].reverse(),
    };
    const replay = replayTrace(shuffled);
    if (!replay.ok) throw new Error(replay.reason);
    expect(replay.result.events.map((e) => e.sequence)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(replay.result.effects.map((e) => e.action)).toEqual(['map.focus', 'map.highlight']);
  });
});

describe('TEST-182 / no model access and no clock', () => {
  it('replays with Date.now replaced by a throwing function', () => {
    const parsed = parseTrace(serializeTrace(recordedEnvelope()));
    if (!parsed.ok) throw new Error(parsed.reason);

    Date.now = () => {
      throw new Error('replay read the ambient clock');
    };

    // If replay touched a clock, this throws rather than producing a subtly different result.
    const replay = replayTrace(parsed.envelope);
    expect(replay.ok).toBe(true);
  });

  it('replays with no subscribers and no bus present', () => {
    const parsed = parseTrace(serializeTrace(recordedEnvelope()));
    if (!parsed.ok) throw new Error(parsed.reason);
    const replay = replayTrace(parsed.envelope);
    if (!replay.ok) throw new Error(replay.reason);
    // Nothing was injected that could observe or be observed.
    expect(replay.result.effects).toHaveLength(2);
  });

  it('is deterministic across repeated replays', () => {
    const parsed = parseTrace(serializeTrace(recordedEnvelope()));
    if (!parsed.ok) throw new Error(parsed.reason);
    const first = replayTrace(parsed.envelope);
    const second = replayTrace(parsed.envelope);
    if (!first.ok || !second.ok) throw new Error('replay refused');
    expect(serializeReplay(second.result)).toBe(serializeReplay(first.result));
  });
});

describe('TEST-182 / replay refuses a version it does not understand', () => {
  it('refuses an envelope from another protocol version, and says to migrate first', () => {
    const envelope: TraceEnvelope = { ...recordedEnvelope(), protocolVersion: '0.9.0' };
    const replay = replayTrace(envelope);
    expect(replay.ok).toBe(false);
    if (replay.ok) return;
    expect(replay.reason).toContain('0.9.0');
    expect(replay.reason).toContain('migrate');
  });
});

describe('TEST-182 / malformed envelopes are refused, not repaired', () => {
  const base = recordedEnvelope();

  const cases: readonly { readonly name: string; readonly text: string; readonly expect: string }[] = [
    { name: 'not JSON', text: '{', expect: 'not valid JSON' },
    { name: 'not an object', text: '[]', expect: 'must be a JSON object' },
    { name: 'missing sessionId', text: JSON.stringify({ ...base, sessionId: undefined }), expect: 'sessionId' },
    { name: 'empty protocolVersion', text: JSON.stringify({ ...base, protocolVersion: '' }), expect: 'protocolVersion' },
    { name: 'pluginVersions not an object', text: JSON.stringify({ ...base, pluginVersions: [] }), expect: 'pluginVersions' },
    { name: 'publicEvents not an array', text: JSON.stringify({ ...base, publicEvents: {} }), expect: 'publicEvents' },
    { name: 'productionEvents missing', text: JSON.stringify({ ...base, productionEvents: undefined }), expect: 'productionEvents' },
  ];

  for (const testCase of cases) {
    it(`refuses: ${testCase.name}`, () => {
      const result = parseTrace(testCase.text);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reason).toContain(testCase.expect);
    });
  }

  it('refuses an envelope whose public array holds a production event', () => {
    // The structural check that matters most: this is the shape a channel regression would take.
    const tainted = JSON.parse(serializeTrace(base)) as Record<string, unknown>;
    const production = tainted['productionEvents'] as unknown[];
    const publicList = tainted['publicEvents'] as unknown[];
    publicList.push(production[0]);
    const result = parseTrace(JSON.stringify(tainted));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain('declares channel "production"');
  });

  it('refuses an event missing its payload, sequence, or timestamp', () => {
    for (const field of ['payload', 'sequence', 'at']) {
      const tainted = JSON.parse(serializeTrace(base)) as Record<string, unknown>;
      const publicList = tainted['publicEvents'] as Record<string, unknown>[];
      const victim = publicList[0];
      if (victim === undefined) throw new Error('fixture has no public events');
      delete victim[field];
      const result = parseTrace(JSON.stringify(tainted));
      expect(result.ok, `missing ${field} was accepted`).toBe(false);
    }
  });
});

/**
 * TEST-181 — public/private leakage canary.
 *
 * The property is asserted **once per event type**, not once for the taxonomy. A single aggregate
 * assertion passes as long as one type is safe, and the failure this feature exists to prevent is
 * exactly one type being wrong: a `command.rejected` that renders as user-visible state, a
 * `provider.request` payload on screen.
 *
 * The canary corpus goes further than the type list. Types are the rule; payloads are what actually
 * leaks. Each corpus entry is a realistic payload for a production event, and the assertion is that
 * it appears in the production array and nowhere else.
 *
 * Covers FR-193, FR-194, FR-198. Tasks T-040, T-044.
 */

import { describe, expect, it } from 'vitest';
import {
  ChannelConflictError,
  ChannelMap,
  EventBus,
  PRODUCTION_EVENT_TYPES,
  PUBLIC_EVENT_TYPES,
  UnknownEventTypeError,
  channelOfCoreType,
  type EventPayloads,
  type ProductionEventType,
  type PublicEventType,
} from '../src/index.js';
import { fakeClock } from './helpers.js';

const clock = fakeClock();

function bus(clockOverride = fakeClock()): EventBus {
  return new EventBus({ sessionId: 's-1', clock: clockOverride.clock });
}

describe('TEST-181 / the taxonomy is a partition', () => {
  it('declares 7 public and 7 production types with no overlap', () => {
    expect(PUBLIC_EVENT_TYPES).toHaveLength(7);
    expect(PRODUCTION_EVENT_TYPES).toHaveLength(7);
    const overlap = PUBLIC_EVENT_TYPES.filter((t) =>
      (PRODUCTION_EVENT_TYPES as readonly string[]).includes(t),
    );
    expect(overlap).toEqual([]);
    expect(new Set([...PUBLIC_EVENT_TYPES, ...PRODUCTION_EVENT_TYPES]).size).toBe(14);
  });

  it('routes every type through the core map consistently', () => {
    for (const type of PUBLIC_EVENT_TYPES) {
      expect(channelOfCoreType(type), `${type} channelOfCoreType`).toBe('public');
      expect(ChannelMap.core().channelOf(type), `${type} map`).toBe('public');
    }
    for (const type of PRODUCTION_EVENT_TYPES) {
      expect(channelOfCoreType(type), `${type} channelOfCoreType`).toBe('production');
      expect(ChannelMap.core().channelOf(type), `${type} map`).toBe('production');
    }
    expect(ChannelMap.core().typesOn('public')).toEqual([...PUBLIC_EVENT_TYPES].sort());
    expect(ChannelMap.core().typesOn('production')).toEqual([...PRODUCTION_EVENT_TYPES].sort());
  });

  it('refuses to name a channel for an unknown type rather than guessing', () => {
    expect(() => channelOfCoreType('nope.nothing')).toThrow(UnknownEventTypeError);
  });
});

describe('TEST-181 / every production type is refused on the public path', () => {
  const payloads: { [K in ProductionEventType]: EventPayloads[K] } = {
    'stream.chunk': { bytes: 42 },
    'segment.parsed': { kind: 'text' },
    'command.accepted': { action: 'map.focus' },
    'command.rejected': { action: 'claim.show', errors: ['Unknown Stagehand action: claim.show'] },
    'provider.request': { provider: 'openai', model: 'gpt-x' },
    'provider.response': { provider: 'openai', status: '200' },
    'diagnostic': { level: 'error', message: 'parser internal' },
  };

  for (const type of PRODUCTION_EVENT_TYPES) {
    it(`${type} cannot be emitted publicly, and leaves both channels unchanged`, () => {
      const b = bus();
      // The type is production, so the public emit path has no entry for it.
      expect(() =>
        (b.emitPublic as unknown as (t: string, p: unknown) => unknown)(type, payloads[type]),
      ).toThrow(UnknownEventTypeError);

      expect(b.publicEvents).toEqual([]);
      expect(b.productionEvents).toEqual([]);
      expect(b.sequence).toBe(0);
    });
  }
});

describe('TEST-181 / every public type is refused on the production path', () => {
  const payloads: { [K in PublicEventType]: EventPayloads[K] } = {
    'narration.started': { utteranceId: 'u1' },
    'narration.ended': { utteranceId: 'u1' },
    'narration.interrupted': { utteranceId: 'u1', reason: 'superseded' },
    'caption': { text: 'hello' },
    'effect.committed': { plugin: 'geo', action: 'map.focus' },
    'board.revision.committed': { revision: 3 },
    'safe_failure': { code: 'E_TIMEOUT', message: 'media did not settle' },
  };

  for (const type of PUBLIC_EVENT_TYPES) {
    it(`${type} cannot be emitted as production, and leaves both channels unchanged`, () => {
      const b = bus();
      expect(() =>
        (b.emitProduction as unknown as (t: string, p: unknown) => unknown)(type, payloads[type]),
      ).toThrow(UnknownEventTypeError);

      expect(b.publicEvents).toEqual([]);
      expect(b.productionEvents).toEqual([]);
      expect(b.sequence).toBe(0);
    });
  }
});

describe('TEST-181 / the leakage canary corpus', () => {
  // Each entry is something that must never be rendered as user-visible state.
  const SENSITIVE: readonly { readonly type: ProductionEventType; readonly payload: Record<string, unknown>; readonly needle: string }[] = [
    { type: 'command.rejected', payload: { action: 'root.shell', errors: ['Unknown Stagehand action: root.shell'] }, needle: 'root.shell' },
    { type: 'provider.request', payload: { provider: 'openai', model: 'gpt-4o' }, needle: 'openai' },
    { type: 'provider.response', payload: { provider: 'anthropic', status: '500' }, needle: 'anthropic' },
    { type: 'stream.chunk', payload: { bytes: 7 }, needle: 'bytes' },
    { type: 'segment.parsed', payload: { kind: 'compound' }, needle: 'compound' },
    { type: 'command.accepted', payload: { action: 'map.focus' }, needle: 'map.focus' },
    { type: 'diagnostic', payload: { level: 'debug', message: 'repair attempt: added bracket' }, needle: 'repair attempt' },
  ];

  it('records each sensitive event on production and never on public', () => {
    const b = bus();
    for (const entry of SENSITIVE) {
      b.emitProduction(entry.type, entry.payload as never);
    }
    expect(b.productionEvents).toHaveLength(SENSITIVE.length);
    expect(b.publicEvents).toEqual([]);

    // The serialized public array must not contain any canary needle, whatever shape it takes.
    const publicJson = JSON.stringify(b.snapshot().publicEvents);
    for (const entry of SENSITIVE) {
      expect(publicJson, `"${entry.needle}" reached the public array`).not.toContain(entry.needle);
    }
  });

  it('keeps each channel free of the other channel\'s types', () => {
    const b = bus();
    b.emitPublic('caption', { text: 'a caption' });
    b.emitProduction('diagnostic', { level: 'info', message: 'a diagnostic' });

    for (const event of b.publicEvents) expect(event.channel).toBe('public');
    for (const event of b.productionEvents) expect(event.channel).toBe('production');
    expect(b.publicEvents.map((e) => e.type)).toEqual(['caption']);
    expect(b.productionEvents.map((e) => e.type)).toEqual(['diagnostic']);
  });

  it('does not notify production listeners when a public event is recorded, or the reverse', () => {
    const b = bus();
    const publicSeen: string[] = [];
    const productionSeen: string[] = [];
    b.onPublic((e) => publicSeen.push(e.type));
    b.onProduction((e) => productionSeen.push(e.type));

    b.emitPublic('caption', { text: 'x' });
    b.emitProduction('diagnostic', { level: 'info', message: 'y' });

    expect(publicSeen).toEqual(['caption']);
    expect(productionSeen).toEqual(['diagnostic']);
  });
});

describe('TEST-181 / extending the map for other owners', () => {
  it('accepts a plugin vocabulary on either channel', () => {
    const extended = ChannelMap.core().extend(
      { 'gate.waited': 'production', 'beat.started': 'public' },
      'FEAT-006/FEAT-004',
    );
    expect(extended.channelOf('gate.waited')).toBe('production');
    expect(extended.channelOf('beat.started')).toBe('public');
    expect(extended.channelOf('caption')).toBe('public');
    expect(extended.size).toBe(16);

    const b = new EventBus({ sessionId: 's', channels: extended, clock: fakeClock().clock });
    b.emit('gate.waited', { key: 'camera' });
    b.emit('beat.started', { beatId: 'b1' });
    expect(b.productionEvents.map((e) => e.type)).toEqual(['gate.waited']);
    expect(b.publicEvents.map((e) => e.type)).toEqual(['beat.started']);
  });

  it('refuses to move a type to the other channel', () => {
    const extended = ChannelMap.core();
    expect(() => extended.extend({ 'caption': 'production' })).toThrow(ChannelConflictError);
    expect(() => extended.extend({ 'diagnostic': 'public' })).toThrow(ChannelConflictError);
  });

  it('is idempotent when the same channel is re-declared', () => {
    const once = ChannelMap.core().extend({ 'gate.waited': 'production' });
    const twice = once.extend({ 'gate.waited': 'production' });
    expect(twice.channelOf('gate.waited')).toBe('production');
    expect(twice.size).toBe(once.size);
  });

  it('does not mutate the map it extended from', () => {
    const base = ChannelMap.core();
    base.extend({ 'gate.waited': 'production' });
    expect(base.channelOf('gate.waited')).toBeUndefined();
    expect(base.size).toBe(14);
  });

  it('refuses an unknown type on the dynamic emit path', () => {
    const b = bus();
    expect(() => b.emit('invented.event', {})).toThrow(UnknownEventTypeError);
    expect(b.sequence).toBe(0);
  });
});

describe('TEST-181 / recording does not require a subscriber', () => {
  it('records with no listeners attached', () => {
    const b = bus();
    b.emitPublic('caption', { text: 'unwatched' });
    expect(b.publicEvents).toHaveLength(1);
  });

  it('stops delivering after unsubscribe, without losing what was recorded', () => {
    const b = bus();
    const seen: string[] = [];
    const off = b.onPublic((e) => seen.push(e.type));

    b.emitPublic('caption', { text: 'first' });
    off();
    b.emitPublic('caption', { text: 'second' });

    expect(seen).toEqual(['caption']);
    expect(b.publicEvents).toHaveLength(2);
  });

  it('tolerates a listener that unsubscribes during delivery', () => {
    const b = bus();
    const seen: string[] = [];
    const off = b.onPublic(() => {
      seen.push('first');
      off();
    });
    b.onPublic(() => seen.push('second'));

    expect(() => b.emitPublic('caption', { text: 'x' })).not.toThrow();
    expect(seen).toContain('second');
  });
});

describe('TEST-181 / clock behaviour', () => {
  it('reads the injected clock and not an ambient one', () => {
    const clk = fakeClock(1000, 5);
    const b = bus(clk);
    b.emitPublic('caption', { text: 'a' });
    b.emitProduction('diagnostic', { level: 'info', message: 'b' });
    expect(b.startedAt).toBe(1000);
    expect(b.publicEvents[0]?.at).toBe(1005);
    expect(b.productionEvents[0]?.at).toBe(1010);
  });

  it('uses a shared monotonic sequence across both channels', () => {
    const b = bus(clock);
    b.emitPublic('caption', { text: 'a' });
    b.emitProduction('diagnostic', { level: 'info', message: 'b' });
    b.emitPublic('caption', { text: 'c' });
    expect(b.publicEvents.map((e) => e.sequence)).toEqual([1, 3]);
    expect(b.productionEvents.map((e) => e.sequence)).toEqual([2]);
    expect(b.sequence).toBe(3);
  });
});

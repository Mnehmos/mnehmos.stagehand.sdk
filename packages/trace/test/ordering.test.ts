/**
 * TEST-184 — interruption ordering across narration, readiness, and effects.
 *
 * Ordering is only answerable if both channels share a numbering, which is why the bus keeps one
 * sequence counter rather than two. The scenario below is the one that made that necessary: an
 * utterance is interrupted while an effect is in flight and a readiness gate is waiting, and the
 * only question that matters afterwards is what happened in what order.
 *
 * `gate.waited` belongs to `FEAT-006` and is registered here through the channel map rather than
 * implemented here — which is also the proof that `FR-194`'s extensibility works for a real
 * downstream owner.
 *
 * Covers FR-195, FR-198. Task T-044.
 */

import { describe, expect, it } from 'vitest';
import {
  ChannelMap,
  createEnvelope,
  EventBus,
  parseTrace,
  replayTrace,
  serializeReplay,
  serializeTrace,
  type EventChannel,
} from '../src/index.js';
import { fakeClock } from './helpers.js';

/** Channels declared by FEAT-006 and FEAT-004, composed here the way a host would. */
const DOWNSTREAM_CHANNELS: Readonly<Record<string, EventChannel>> = {
  'gate.waited': 'production',
  'beat.started': 'public',
  'beat.completed': 'public',
  'room.mode': 'public',
};

function busWithDownstream(clock: () => number, sessionId = 's-order'): EventBus {
  return new EventBus({
    sessionId,
    clock,
    channels: ChannelMap.core().extend(DOWNSTREAM_CHANNELS, 'FEAT-004/FEAT-006'),
  });
}

describe('TEST-184 / one sequence across both channels', () => {
  it('numbers interleaved events in emission order regardless of channel', () => {
    const clk = fakeClock();
    const bus = busWithDownstream(clk.clock);

    bus.emitPublic('narration.started', { utteranceId: 'u1' });
    bus.emit('gate.waited', { key: 'camera' });
    bus.emitPublic('effect.committed', { plugin: 'geo', action: 'map.focus' });
    bus.emitProduction('command.rejected', { action: 'root.shell', errors: ['unknown'] });
    bus.emitPublic('narration.interrupted', { utteranceId: 'u1', reason: 'superseded' });
    bus.emitPublic('effect.committed', { plugin: 'geo', action: 'map.highlight' });
    bus.emitPublic('narration.ended', { utteranceId: 'u1' });

    const merged = [...bus.publicEvents, ...bus.productionEvents].sort((a, b) => a.sequence - b.sequence);
    expect(merged.map((e) => [e.sequence, e.type])).toEqual([
      [1, 'narration.started'],
      [2, 'gate.waited'],
      [3, 'effect.committed'],
      [4, 'command.rejected'],
      [5, 'narration.interrupted'],
      [6, 'effect.committed'],
      [7, 'narration.ended'],
    ]);
    expect(merged.map((e) => e.sequence)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('answers whether the interruption preceded or followed each effect', () => {
    const clk = fakeClock();
    const bus = busWithDownstream(clk.clock);
    bus.emitPublic('effect.committed', { plugin: 'geo', action: 'before' });
    bus.emitPublic('narration.interrupted', { utteranceId: 'u1', reason: 'barge-in' });
    bus.emitPublic('effect.committed', { plugin: 'geo', action: 'after' });

    const interruption = bus.publicEvents.find((e) => e.type === 'narration.interrupted');
    if (interruption === undefined) throw new Error('no interruption recorded');
    const before = bus.publicEvents.filter((e) => e.type === 'effect.committed' && e.sequence < interruption.sequence);
    const after = bus.publicEvents.filter((e) => e.type === 'effect.committed' && e.sequence > interruption.sequence);
    expect(before.map((e) => (e.payload as { action: string }).action)).toEqual(['before']);
    expect(after.map((e) => (e.payload as { action: string }).action)).toEqual(['after']);
  });

  it('increments the sequence per event, never per channel', () => {
    const clk = fakeClock();
    const bus = busWithDownstream(clk.clock);
    for (let i = 0; i < 5; i++) {
      bus.emitPublic('caption', { text: `p${i}` });
      bus.emitProduction('diagnostic', { level: 'info', message: `q${i}` });
    }
    expect(bus.publicEvents.map((e) => e.sequence)).toEqual([1, 3, 5, 7, 9]);
    expect(bus.productionEvents.map((e) => e.sequence)).toEqual([2, 4, 6, 8, 10]);
  });
});

describe('TEST-184 / ordering survives the round trip', () => {
  it('preserves relative order through record, serialize, parse, and replay', () => {
    const clk = fakeClock();
    const bus = busWithDownstream(clk.clock);
    bus.emitPublic('narration.started', { utteranceId: 'u1' });
    bus.emit('gate.waited', { key: 'camera' });
    bus.emitPublic('narration.interrupted', { utteranceId: 'u1', reason: 'superseded' });
    bus.emitPublic('effect.committed', { plugin: 'geo', action: 'map.focus' });
    bus.emitPublic('safe_failure', { code: 'E_TIMEOUT', message: 'gate deadline expired' });

    const envelope = createEnvelope({ ...bus.snapshot() });
    const parsed = parseTrace(serializeTrace(envelope));
    if (!parsed.ok) throw new Error(parsed.reason);

    const replay = replayTrace(parsed.envelope);
    if (!replay.ok) throw new Error(replay.reason);

    expect(replay.result.events.map((e) => e.type)).toEqual([
      'narration.started',
      'narration.interrupted',
      'effect.committed',
      'safe_failure',
    ]);
    expect(replay.result.events.map((e) => e.sequence)).toEqual([1, 3, 4, 5]);
    // The readiness wait is production, so it is not in the replay — but its sequence number still
    // shows where it sat between the public events, which is what the audit needs.
    expect(parsed.envelope.productionEvents.map((e) => e.sequence)).toEqual([2]);
  });

  it('replays identically after a round trip, byte for byte', () => {
    const clk = fakeClock();
    const bus = busWithDownstream(clk.clock);
    bus.emitPublic('narration.started', { utteranceId: 'u1' });
    bus.emitPublic('effect.committed', { plugin: 'geo', action: 'a' });
    bus.emitPublic('narration.ended', { utteranceId: 'u1' });

    const text = serializeTrace(createEnvelope({ ...bus.snapshot() }));
    const first = parseTrace(text);
    const second = parseTrace(text);
    if (!first.ok || !second.ok) throw new Error('parse refused');

    const a = replayTrace(first.envelope);
    const b = replayTrace(second.envelope);
    if (!a.ok || !b.ok) throw new Error('replay refused');
    expect(serializeReplay(b.result)).toBe(serializeReplay(a.result));
  });

  it('keeps ordering stable when a large interleave is replayed', () => {
    const clk = fakeClock();
    const bus = busWithDownstream(clk.clock);
    for (let i = 0; i < 60; i++) {
      if (i % 3 === 0) bus.emit('gate.waited', { key: `k${i}` });
      else if (i % 3 === 1) bus.emitPublic('caption', { text: `c${i}` });
      else bus.emitPublic('effect.committed', { plugin: 'p', action: `a${i}` });
    }
    const parsed = parseTrace(serializeTrace(createEnvelope({ ...bus.snapshot() })));
    if (!parsed.ok) throw new Error(parsed.reason);
    const replay = replayTrace(parsed.envelope);
    if (!replay.ok) throw new Error(replay.reason);

    const sequences = replay.result.events.map((e) => e.sequence);
    expect(sequences).toEqual([...sequences].sort((a, b) => a - b));
    expect(replay.result.effects.map((e) => e.action)).toEqual(
      bus.publicEvents
        .filter((e) => e.type === 'effect.committed')
        .map((e) => (e.payload as { action: string }).action),
    );
  });
});

describe('TEST-184 / subscribers see events in emission order', () => {
  it('delivers public events in order to a single listener', () => {
    const clk = fakeClock();
    const bus = busWithDownstream(clk.clock);
    const seen: string[] = [];
    bus.onPublic((e) => seen.push(e.type));
    bus.emitPublic('narration.started', { utteranceId: 'u1' });
    bus.emit('gate.waited', { key: 'camera' });
    bus.emitPublic('narration.ended', { utteranceId: 'u1' });
    // The production event is not delivered to a public listener, and does not disturb the order.
    expect(seen).toEqual(['narration.started', 'narration.ended']);
  });

  it('delivers to listeners in registration order', () => {
    const clk = fakeClock();
    const bus = busWithDownstream(clk.clock);
    const order: string[] = [];
    bus.onPublic(() => order.push('first'));
    bus.onPublic(() => order.push('second'));
    bus.emitPublic('caption', { text: 'x' });
    expect(order).toEqual(['first', 'second']);
  });
});

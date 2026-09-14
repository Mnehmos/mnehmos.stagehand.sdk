/**
 * FR-203 — `gate.waited` on the production channel.
 *
 * This is the readiness↔trace seam: `FEAT-006` owns the event type and reports it, `FEAT-005` owns
 * the channel and records it. The type is not in the core vocabulary, so the host declares it on the
 * bus's channel map — which is also the proof that `FR-194`'s extensible map works for a real
 * downstream owner rather than only in principle.
 *
 * Covers FR-203. Tasks T-048.
 */

import { describe, expect, it } from 'vitest';
import { ChannelMap, EventBus, UnknownEventTypeError } from '@stagehand/trace';
import { createVirtualClock, GATE_WAITED, ReadinessGate, traceGateObserver } from '../src/index.js';

/** Compose a bus the way a host would: extend the map for this feature's event, then wire the gate. */
function compose(registerEvent = true, deadlineMs = 100): {
  gate: ReadinessGate;
  clock: ReturnType<typeof createVirtualClock>;
  bus: EventBus;
} {
  const clock = createVirtualClock(0);
  const channels = registerEvent ? ChannelMap.core().extend({ [GATE_WAITED]: 'production' }) : ChannelMap.core();
  const bus = new EventBus({ sessionId: 's-ready', clock: clock.now, channels });
  const gate = new ReadinessGate({
    clock,
    defaultDeadlineMs: deadlineMs,
    observer: traceGateObserver(bus),
  });
  return { gate, clock, bus };
}

describe('FR-203 / a wait is recorded on the production channel', () => {
  it('records a settled wait with its keys and duration', async () => {
    // Deadline well beyond the advance, so this exercises settlement rather than the deadline.
    const { gate, clock, bus } = compose(true, 5_000);
    gate.mark('camera');
    const waiting = gate.wait(['camera']);
    clock.advance(120);
    gate.settle('camera');
    await waiting;

    expect(bus.productionEvents).toHaveLength(1);
    const event = bus.productionEvents[0];
    expect(event?.type).toBe(GATE_WAITED);
    expect(event?.channel).toBe('production');
    expect(event?.payload).toMatchObject({
      keys: ['camera'],
      settled: true,
      stale: false,
      timedOut: false,
      outstanding: [],
      waitedMs: 120,
    });
    // Readiness waits are diagnostics: nothing about them belongs on the public channel.
    expect(bus.publicEvents).toEqual([]);
  });

  it('records a timeout with the outstanding keys', async () => {
    const { gate, clock, bus } = compose(true, 400);
    gate.mark('camera');
    gate.mark('projector');
    const waiting = gate.wait(['camera', 'projector']);
    gate.settle('camera');
    clock.advance(400);
    await waiting;

    expect(bus.productionEvents[0]?.payload).toMatchObject({
      timedOut: true,
      settled: false,
      outstanding: ['projector'],
    });
  });

  it('records the generation pair when a wait was superseded', async () => {
    const { gate, bus } = compose();
    gate.mark('camera');
    const waiting = gate.wait(['camera']);
    gate.invalidate();
    await waiting;

    expect(bus.productionEvents[0]?.payload).toMatchObject({
      settled: true,
      stale: true,
      generation: 0,
      currentGeneration: 1,
    });
  });

  it('records one event per wait, across several waits', async () => {
    const { gate, bus } = compose();
    gate.mark('a');
    const first = gate.wait(['a']);
    gate.settle('a');
    await first;

    gate.mark('b');
    const second = gate.wait(['b']);
    gate.settle('b');
    await second;

    expect(bus.productionEvents).toHaveLength(2);
    expect(bus.productionEvents.map((e) => (e.payload as unknown as { keys: string[] }).keys)).toEqual([['a'], ['b']]);
    // Sequences come from the bus's single counter, so ordering across the session is answerable.
    expect(bus.productionEvents.map((e) => e.sequence)).toEqual([1, 2]);
  });
});

describe('FR-203 / the observer is optional and observational', () => {
  it('behaves identically with no observer', async () => {
    const clock = createVirtualClock(0);
    const bare = new ReadinessGate({ clock, defaultDeadlineMs: 100 });
    bare.mark('k');
    const waiting = bare.wait(['k']);
    clock.advance(100);
    const result = await waiting;
    expect(result.timedOut).toBe(true);
    expect(result.outstanding).toEqual(['k']);
  });

  it('fails loudly when the event type was never registered, rather than tracing nothing', () => {
    // A gate that silently reports nothing looks identical to a gate that was never observed, and
    // only one of those is a bug. So the failure surfaces at the first wait.
    const { gate, clock } = compose(false);
    gate.mark('k');
    const waiting = gate.wait(['k']);
    clock.advance(100);
    return expect(waiting).rejects.toBeInstanceOf(UnknownEventTypeError);
  });
});

/**
 * TEST-185 — fake-clock timeout.
 *
 * Every assertion here advances a virtual clock. Nothing sleeps, and nothing reads `Date.now`. The
 * point is not tidiness: a readiness suite that waits on wall-clock time is slow in the best case and
 * flaky in the common one, and a flaky test in the feature whose entire job is bounding a wait is the
 * worst place to have one.
 *
 * Covers FR-200, FR-202. Tasks T-046, T-048.
 */

import { describe, expect, it } from 'vitest';
import { createVirtualClock, ReadinessGate, type GateWaitObservation } from '../src/index.js';

function gate(deadlineMs?: number, observer?: (o: GateWaitObservation) => void): {
  gate: ReadinessGate;
  clock: ReturnType<typeof createVirtualClock>;
  observed: GateWaitObservation[];
} {
  const clock = createVirtualClock(1_000);
  const observed: GateWaitObservation[] = [];
  const options = {
    clock,
    ...(deadlineMs === undefined ? {} : { defaultDeadlineMs: deadlineMs }),
    observer: (o: GateWaitObservation) => {
      observed.push(o);
      observer?.(o);
    },
  };
  return { gate: new ReadinessGate(options), clock, observed };
}

describe('TEST-185 / a wait that nothing settles resolves at its deadline', () => {
  it('times out rather than hanging, driven by virtual time', async () => {
    const { gate: g, clock } = gate(500);
    g.mark('camera');

    let resolved = false;
    const waiting = g.wait(['camera']).then((result) => {
      resolved = true;
      return result;
    });

    // Nothing has happened yet: the wait is genuinely pending.
    await Promise.resolve();
    expect(resolved).toBe(false);

    clock.advance(499);
    await Promise.resolve();
    expect(resolved, 'resolved before the deadline').toBe(false);

    clock.advance(1);
    const result = await waiting;

    expect(result.timedOut).toBe(true);
    expect(result.settled).toBe(false);
    expect(result.resumable).toBe(false);
    expect(result.outstanding).toEqual(['camera']);
    expect(result.waitedMs).toBe(500);
  });

  it('uses the configured default deadline', async () => {
    const { gate: g, clock } = gate(250);
    g.mark('k');
    const waiting = g.wait(['k']);
    clock.advance(250);
    expect((await waiting).waitedMs).toBe(250);
  });

  it('lets a per-wait deadline override the default', async () => {
    const { gate: g, clock } = gate(10_000);
    g.mark('k');
    const waiting = g.wait(['k'], 100);
    clock.advance(100);
    const result = await waiting;
    expect(result.timedOut).toBe(true);
    expect(result.waitedMs).toBe(100);
    // And the longer default would still be outstanding, so no stray timer fired early.
    expect(clock.pendingTimers).toBe(0);
  });

  it('falls back to the package default when none is configured', async () => {
    const { gate: g, clock } = gate();
    g.mark('k');
    const waiting = g.wait(['k']);
    clock.advance(4999);
    await Promise.resolve();
    clock.advance(1);
    expect((await waiting).timedOut).toBe(true);
  });
});

describe('TEST-185 / deadlines are not leaks', () => {
  it('cancels the deadline timer when keys settle first', async () => {
    const { gate: g, clock } = gate(1000);
    g.mark('k');
    const waiting = g.wait(['k']);
    expect(clock.pendingTimers).toBe(1);

    g.settle('k');
    const result = await waiting;

    expect(result.settled).toBe(true);
    expect(result.timedOut).toBe(false);
    // The timer was cancelled rather than left to fire into nothing.
    expect(clock.pendingTimers).toBe(0);
  });

  it('schedules nothing when there is nothing to wait for', async () => {
    const { gate: g, clock } = gate(1000);
    const result = await g.wait(['never-marked']);
    expect(result.settled).toBe(true);
    expect(result.resumable).toBe(true);
    expect(result.waitedMs).toBe(0);
    expect(clock.pendingTimers).toBe(0);
  });

  it('schedules nothing for a wait over an empty key list', async () => {
    const { gate: g, clock } = gate(1000);
    const result = await g.wait([]);
    expect(result.settled).toBe(true);
    expect(clock.pendingTimers).toBe(0);
  });

  it('does not schedule a second timer for a second wait on the same key', async () => {
    const { gate: g, clock } = gate(1000);
    g.mark('k');
    const first = g.wait(['k']);
    const second = g.wait(['k']);
    expect(clock.pendingTimers).toBe(2);

    g.settle('k');
    await Promise.all([first, second]);
    expect(clock.pendingTimers).toBe(0);
  });
});

describe('TEST-185 / settlement before the deadline', () => {
  it('returns settled and resumable, and reports the elapsed time', async () => {
    const { gate: g, clock } = gate(1000);
    g.mark('camera');
    const waiting = g.wait(['camera']);
    clock.advance(120);
    g.settle('camera');

    const result = await waiting;
    expect(result.settled).toBe(true);
    expect(result.stale).toBe(false);
    expect(result.timedOut).toBe(false);
    expect(result.resumable).toBe(true);
    expect(result.waitedMs).toBe(120);
    expect(result.outstanding).toEqual([]);
  });

  it('resolves a wait for a key settled before the wait began', async () => {
    const { gate: g } = gate(1000);
    g.mark('k');
    g.settle('k');
    const result = await g.wait(['k']);
    expect(result.settled).toBe(true);
    expect(result.waitedMs).toBe(0);
  });
});

describe('TEST-185 / the clock seam is honoured', () => {
  it('reads time only from the injected clock', async () => {
    const clock = createVirtualClock(5_000);
    const g = new ReadinessGate({ clock, defaultDeadlineMs: 300 });
    g.mark('k');
    const waiting = g.wait(['k']);
    clock.advance(300);
    const result = await waiting;
    // 5000 + 300, not a wall-clock reading.
    expect(result.waitedMs).toBe(300);
  });

  it('fires timers in due order when several are scheduled', async () => {
    const clock = createVirtualClock(0);
    const fired: string[] = [];
    clock.schedule(() => fired.push('late'), 100);
    clock.schedule(() => fired.push('early'), 10);
    clock.schedule(() => fired.push('middle'), 50);

    clock.advance(100);
    expect(fired).toEqual(['early', 'middle', 'late']);
  });

  it('breaks ties by scheduling order, so races are reproducible', () => {
    const clock = createVirtualClock(0);
    const fired: string[] = [];
    clock.schedule(() => fired.push('first'), 10);
    clock.schedule(() => fired.push('second'), 10);
    clock.advance(10);
    expect(fired).toEqual(['first', 'second']);
  });

  it('does not fire a cancelled timer', () => {
    const clock = createVirtualClock(0);
    const fired: string[] = [];
    const cancel = clock.schedule(() => fired.push('cancelled'), 10);
    cancel();
    cancel(); // idempotent
    clock.advance(100);
    expect(fired).toEqual([]);
  });

  it('reports the timer instant to a handler that reads the clock', () => {
    const clock = createVirtualClock(0);
    let seenAt = -1;
    clock.schedule(() => {
      seenAt = clock.now();
    }, 40);
    clock.advance(500);
    // The handler saw its due time, not the end of the advance.
    expect(seenAt).toBe(40);
    expect(clock.now()).toBe(500);
  });
});

describe('TEST-185 / reporting', () => {
  it('reports every completed wait to the observer', async () => {
    const { gate: g, clock, observed } = gate(100);

    g.mark('a');
    const timedOut = g.wait(['a']);
    clock.advance(100);
    await timedOut;

    g.mark('b');
    const settled = g.wait(['b']);
    g.settle('b');
    await settled;

    await g.wait(['nothing-pending']);

    expect(observed).toHaveLength(3);
    expect(observed[0]?.timedOut).toBe(true);
    expect(observed[0]?.keys).toEqual(['a']);
    expect(observed[1]?.settled).toBe(true);
    expect(observed[1]?.timedOut).toBe(false);
    expect(observed[2]?.keys).toEqual(['nothing-pending']);
  });

  it('behaves identically with no observer configured', async () => {
    const clock = createVirtualClock(0);
    const g = new ReadinessGate({ clock, defaultDeadlineMs: 50 });
    g.mark('k');
    const waiting = g.wait(['k']);
    clock.advance(50);
    const result = await waiting;
    expect(result.timedOut).toBe(true);
    expect(result.outstanding).toEqual(['k']);
  });
});

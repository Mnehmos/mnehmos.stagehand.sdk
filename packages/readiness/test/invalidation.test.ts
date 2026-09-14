/**
 * TEST-186 — generation invalidation race with late settle callbacks.
 *
 * This is `INV-007` in one file: **a stale generation cannot resume interrupted work.** It is the
 * assertion most likely to be missed, because the naive implementation reports a barge-in as
 * success. `invalidate` settles every channel, so a wait interrupted mid-flight sees
 * `settled: true` — and a caller treating "settled" as "carry on" resumes the superseded turn and
 * speaks over the turn that replaced it.
 *
 * So the pair is asserted together, every time: `settled` true **and** `resumable` false.
 *
 * Covers FR-201. Tasks T-047, T-048.
 */

import { describe, expect, it } from 'vitest';
import { createVirtualClock, ReadinessGate, type GateWaitObservation } from '../src/index.js';

function makeGate(deadlineMs = 1000): {
  gate: ReadinessGate;
  clock: ReturnType<typeof createVirtualClock>;
  observed: GateWaitObservation[];
} {
  const clock = createVirtualClock(0);
  const observed: GateWaitObservation[] = [];
  return {
    gate: new ReadinessGate({ clock, defaultDeadlineMs: deadlineMs, observer: (o) => observed.push(o) }),
    clock,
    observed,
  };
}

describe('TEST-186 / invalidation during a wait', () => {
  it('reports settled AND stale, and refuses to be resumable', async () => {
    const { gate, clock } = makeGate();
    gate.mark('camera');
    const waiting = gate.wait(['camera']);

    clock.advance(50);
    gate.invalidate();

    const result = await waiting;

    // Invalidation settled the channel, so the wait sees a settled world...
    expect(result.settled).toBe(true);
    expect(result.timedOut).toBe(false);
    // ...and it is stale. These two together are the whole feature.
    expect(result.stale).toBe(true);
    expect(result.resumable).toBe(false);
    expect(result.generation).toBe(0);
  });

  it('the observer sees the same verdict as the caller', async () => {
    const { gate, clock, observed } = makeGate();
    gate.mark('camera');
    const waiting = gate.wait(['camera']);
    clock.advance(50);
    gate.invalidate();
    await waiting;

    expect(observed).toHaveLength(1);
    expect(observed[0]?.settled).toBe(true);
    expect(observed[0]?.stale).toBe(true);
    expect(observed[0]?.generation).toBe(0);
    expect(observed[0]?.currentGeneration).toBe(1);
  });

  it('advances the generation on each invalidation, and reports which one the wait ran under', async () => {
    const { gate } = makeGate();
    expect(gate.generation).toBe(0);
    expect(gate.invalidate()).toBe(1);
    expect(gate.invalidate()).toBe(2);
    expect(gate.generation).toBe(2);
  });

  it('does not report stale when nothing invalidated', async () => {
    const { gate } = makeGate();
    gate.mark('k');
    const waiting = gate.wait(['k']);
    gate.settle('k');
    const result = await waiting;
    expect(result.settled).toBe(true);
    expect(result.stale).toBe(false);
    expect(result.resumable).toBe(true);
  });

  it('invalidates a wait over several keys, settling all of them', async () => {
    const { gate } = makeGate();
    gate.mark('a');
    gate.mark('b');
    gate.mark('c');
    const waiting = gate.wait(['a', 'b', 'c']);
    gate.invalidate();
    const result = await waiting;
    expect(result.settled).toBe(true);
    expect(result.stale).toBe(true);
    expect(result.resumable).toBe(false);
    expect(gate.pendingKeys).toEqual([]);
  });
});

describe('TEST-186 / late settle callbacks', () => {
  it('a settle arriving after invalidation does not un-stale the earlier wait', async () => {
    const { gate, clock } = makeGate();
    gate.mark('camera');
    const waiting = gate.wait(['camera']);
    gate.invalidate();
    const result = await waiting;

    // The host reports readiness late, for a channel that no longer exists.
    clock.advance(10);
    gate.settle('camera');

    expect(result.stale).toBe(true);
    expect(result.resumable).toBe(false);
    // And the late settle did not secretly recreate a channel.
    expect(gate.pendingKeys).toEqual([]);
  });

  it('a late settle after a timeout does not retroactively make the wait succeed', async () => {
    const { gate, clock } = makeGate(100);
    gate.mark('camera');
    const waiting = gate.wait(['camera']);
    clock.advance(100);
    const result = await waiting;
    expect(result.timedOut).toBe(true);
    expect(result.resumable).toBe(false);

    gate.settle('camera');
    // The result is a value, not a live view: nothing can change it after the fact.
    expect(result.timedOut).toBe(true);
    expect(result.resumable).toBe(false);
  });

  it('a settle for a key nobody marked is harmless', () => {
    const { gate, clock } = makeGate();
    // A host reporting readiness that was never awaited is a benign race, not an error.
    expect(() => gate.settle('never-marked')).not.toThrow();
    expect(clock.pendingTimers).toBe(0);
    expect(gate.pendingKeys).toEqual([]);
  });

  it('a new wait after invalidation sees the new generation and is unaffected by the old one', async () => {
    const { gate, clock } = makeGate();
    gate.mark('camera');
    const superseded = gate.wait(['camera']);
    gate.invalidate();
    expect((await superseded).stale).toBe(true);

    // The next turn marks the key again; its wait must be clean.
    gate.mark('camera');
    const current = gate.wait(['camera']);
    clock.advance(20);
    gate.settle('camera');
    const result = await current;

    expect(result.stale).toBe(false);
    expect(result.generation).toBe(1);
    expect(result.resumable).toBe(true);
  });

  it('repeated invalidation leaves no wait claimable', async () => {
    const { gate } = makeGate();
    gate.mark('a');
    gate.mark('b');
    const first = gate.wait(['a']);
    const second = gate.wait(['b']);

    gate.invalidate();
    gate.invalidate();
    gate.invalidate();

    expect(gate.generation).toBe(3);
    for (const result of await Promise.all([first, second])) {
      expect(result.stale).toBe(true);
      expect(result.resumable).toBe(false);
    }
  });
});

describe('TEST-186 / channels across an invalidation', () => {
  it('clears the channel set, so a replaced turn does not inherit waits', () => {
    const { gate } = makeGate();
    gate.mark('a');
    gate.mark('b');
    expect(gate.pendingKeys).toEqual(['a', 'b']);
    gate.invalidate();
    expect(gate.pendingKeys).toEqual([]);
    expect(gate.state('a')).toEqual({ pending: false });
  });

  it('settleAll resolves channels without advancing the generation', async () => {
    const { gate } = makeGate();
    gate.mark('a');
    const waiting = gate.wait(['a']);
    const generationBefore = gate.generation;

    gate.settleAll();
    const result = await waiting;

    expect(result.settled).toBe(true);
    // settleAll is not an invalidation: the work was genuinely ready, so it remains resumable.
    expect(result.stale).toBe(false);
    expect(result.resumable).toBe(true);
    expect(gate.generation).toBe(generationBefore);
  });

  it('marking an already-pending key refreshes rather than duplicating', async () => {
    const { gate, clock } = makeGate();
    gate.mark('k');
    const firstMark = gate.state('k').markedAt;
    clock.advance(5);
    gate.mark('k');

    expect(gate.pendingKeys).toEqual(['k']);
    expect(gate.state('k').markedAt).toBe(5);
    expect(gate.state('k').markedAt).not.toBe(firstMark);

    // One channel, so one settle resolves it.
    const waiting = gate.wait(['k']);
    gate.settle('k');
    expect((await waiting).settled).toBe(true);
  });
});

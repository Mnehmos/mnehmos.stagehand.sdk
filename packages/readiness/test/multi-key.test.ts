/**
 * TEST-187 — multi-key partial settlement.
 *
 * A wait over several keys is the case where "settled" is ambiguous: some of what was awaited
 * arrived and some did not. The gate must not treat a partial arrival as success, and must say which
 * key it was still waiting for — because "the camera settled" and "the camera settled but the
 * projector never did" call for different host behaviour.
 *
 * Covers FR-199, FR-200. Tasks T-045, T-046, T-048.
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

describe('TEST-187 / a wait stays pending until every key settles', () => {
  it('does not resolve when only some keys have settled', async () => {
    const { gate, clock } = makeGate();
    gate.mark('camera');
    gate.mark('projector');
    gate.mark('board');

    let settled = false;
    const waiting = gate.wait(['camera', 'projector', 'board']).then((r) => {
      settled = true;
      return r;
    });

    gate.settle('camera');
    await Promise.resolve();
    expect(settled, 'resolved with two keys outstanding').toBe(false);

    gate.settle('projector');
    await Promise.resolve();
    expect(settled, 'resolved with one key outstanding').toBe(false);

    gate.settle('board');
    const result = await waiting;
    expect(settled).toBe(true);
    expect(result.settled).toBe(true);
    expect(result.resumable).toBe(true);
    expect(result.outstanding).toEqual([]);
    expect(result.waitedMs).toBe(0);
    void clock;
  });

  it('reports which key was outstanding when the deadline arrives', async () => {
    const { gate, clock } = makeGate(400);
    gate.mark('camera');
    gate.mark('projector');
    gate.mark('board');

    const waiting = gate.wait(['camera', 'projector', 'board']);
    gate.settle('camera');
    gate.settle('projector');
    clock.advance(400);

    const result = await waiting;
    expect(result.settled).toBe(false);
    expect(result.timedOut).toBe(true);
    expect(result.resumable).toBe(false);
    // The stalling key is named, which is the difference between a useful diagnostic and a shrug.
    expect(result.outstanding).toEqual(['board']);
  });

  it('lists all outstanding keys when none settled', async () => {
    const { gate, clock } = makeGate(100);
    gate.mark('a');
    gate.mark('b');
    const waiting = gate.wait(['a', 'b']);
    clock.advance(100);
    expect((await waiting).outstanding).toEqual(['a', 'b']);
  });

  it('reports outstanding keys in the order they were awaited, not sorted', async () => {
    const { gate, clock } = makeGate(100);
    gate.mark('zebra');
    gate.mark('alpha');
    const waiting = gate.wait(['zebra', 'alpha']);
    clock.advance(100);
    expect((await waiting).outstanding).toEqual(['zebra', 'alpha']);
  });
});

describe('TEST-187 / keys that are not awaiting anything', () => {
  it('treats an unmarked key in the set as already settled', async () => {
    const { gate, clock } = makeGate(100);
    gate.mark('camera');
    const waiting = gate.wait(['camera', 'never-marked']);

    gate.settle('camera');
    const result = await waiting;

    expect(result.settled).toBe(true);
    expect(result.resumable).toBe(true);
    expect(clock.pendingTimers).toBe(0);
  });

  it('resolves when every key in the set was unmarked', async () => {
    const { gate } = makeGate(100);
    const result = await gate.wait(['a', 'b', 'c']);
    expect(result.settled).toBe(true);
    expect(result.waitedMs).toBe(0);
  });

  it('ignores a settle for a key outside the awaited set', async () => {
    const { gate, clock } = makeGate(100);
    gate.mark('camera');
    gate.mark('other');
    const waiting = gate.wait(['camera']);
    gate.settle('other');
    clock.advance(100);
    const result = await waiting;
    expect(result.timedOut).toBe(true);
    expect(result.outstanding).toEqual(['camera']);
  });
});

describe('TEST-187 / concurrent waits over overlapping sets', () => {
  it('resolves each wait on its own conditions', async () => {
    const { gate, clock } = makeGate(300);
    gate.mark('a');
    gate.mark('b');

    const both = gate.wait(['a', 'b']);
    const onlyA = gate.wait(['a']);

    gate.settle('a');
    const aResult = await onlyA;
    expect(aResult.settled).toBe(true);
    expect(aResult.resumable).toBe(true);

    // `both` is still waiting on b.
    clock.advance(300);
    const bothResult = await both;
    expect(bothResult.timedOut).toBe(true);
    expect(bothResult.outstanding).toEqual(['b']);
  });

  it('a settle satisfies every wait that was awaiting that key', async () => {
    const { gate } = makeGate();
    gate.mark('a');
    const first = gate.wait(['a']);
    const second = gate.wait(['a']);
    const third = gate.wait(['a', 'b']);
    gate.mark('b');

    gate.settle('a');
    expect((await first).settled).toBe(true);
    expect((await second).settled).toBe(true);

    gate.settle('b');
    expect((await third).settled).toBe(true);
  });

  it('settleAll satisfies every outstanding wait at once', async () => {
    const { gate } = makeGate();
    gate.mark('a');
    gate.mark('b');
    const first = gate.wait(['a']);
    const second = gate.wait(['b']);
    const third = gate.wait(['a', 'b']);

    gate.settleAll();

    for (const result of await Promise.all([first, second, third])) {
      expect(result.settled).toBe(true);
      expect(result.resumable).toBe(true);
    }
  });
});

describe('TEST-187 / reporting a multi-key outcome', () => {
  it('reports the awaited set and the outstanding subset', async () => {
    const { gate, clock, observed } = makeGate(200);
    gate.mark('a');
    gate.mark('b');
    const waiting = gate.wait(['a', 'b']);
    gate.settle('a');
    clock.advance(200);
    await waiting;

    expect(observed).toHaveLength(1);
    expect(observed[0]?.keys).toEqual(['a', 'b']);
    expect(observed[0]?.outstanding).toEqual(['b']);
    expect(observed[0]?.settled).toBe(false);
    expect(observed[0]?.timedOut).toBe(true);
  });

  it('records one observation per wait, not per key', async () => {
    const { gate, observed } = makeGate();
    gate.mark('a');
    gate.mark('b');
    const waiting = gate.wait(['a', 'b']);
    gate.settle('a');
    gate.settle('b');
    await waiting;
    expect(observed).toHaveLength(1);
  });
});

describe('TEST-187 / the awaited set is a snapshot, by channel identity', () => {
  it('a key marked after the wait began is not that wait\'s outstanding work', async () => {
    // Left to arrival order, whether this wait covers `b` would depend on a microtask boundary. The
    // rule is that it does not: the wait is over the channels that existed when it began.
    const { gate, clock } = makeGate(500);
    gate.mark('a');
    const waiting = gate.wait(['a', 'b']);
    gate.mark('b');

    gate.settle('a');
    const result = await waiting;

    expect(result.settled).toBe(true);
    expect(result.outstanding).toEqual([]);
    expect(result.resumable).toBe(true);
    // `b` is genuinely still pending, and a wait that wanted it is a separate call.
    expect(gate.pendingKeys).toEqual(['b']);
    expect(clock.pendingTimers).toBe(0);
  });

  it('a key re-marked mid-wait does not keep the earlier wait alive', async () => {
    const { gate } = makeGate(500);
    gate.mark('k');
    const waiting = gate.wait(['k']);

    gate.settle('k');
    gate.mark('k'); // a new channel for the same name

    const result = await waiting;
    expect(result.settled).toBe(true);
    expect(result.outstanding).toEqual([]);
    // The re-marked channel is live and belongs to whoever waits for it next.
    expect(gate.pendingKeys).toEqual(['k']);
  });

  it('a later wait takes ownership of the re-marked channel', async () => {
    const { gate, clock } = makeGate(500);
    gate.mark('k');
    const first = gate.wait(['k']);
    gate.settle('k');
    gate.mark('k');
    expect((await first).settled).toBe(true);

    const second = gate.wait(['k']);
    clock.advance(500);
    const result = await second;
    expect(result.timedOut).toBe(true);
    expect(result.outstanding).toEqual(['k']);
  });
});

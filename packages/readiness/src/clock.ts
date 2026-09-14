/**
 * The clock seam (FR-202).
 *
 * It carries **timers as well as time**. A clock that only reports `now()` cannot bound a wait
 * without reaching for an ambient `setTimeout`, and an ambient timer makes deadline tests either slow
 * or flaky — neither of which is acceptable for the feature whose whole job is bounding a wait.
 *
 * `createVirtualClock` therefore ships here rather than in a test folder. It is not test scaffolding:
 * a host that wants reproducible readiness behaviour needs it, and a replay harness would need it
 * too. It is also what lets `TEST-185` assert a timeout by advancing time instead of sleeping.
 */

export type Cancel = () => void;

export interface GateClock {
  /** Current time in milliseconds. Monotonic within a session. */
  now(): number;
  /** Invoke `handler` after `ms`. Returns a canceller; cancelling twice is harmless. */
  schedule(handler: () => void, ms: number): Cancel;
}

/** Wall-clock time and real timers. The default. */
export function systemClock(): GateClock {
  return {
    now: () => Date.now(),
    schedule: (handler, ms) => {
      const handle = setTimeout(handler, Math.max(0, ms));
      return () => {
        clearTimeout(handle);
      };
    },
  };
}

export interface VirtualClock extends GateClock {
  /** Advance time by `ms`, firing every timer that becomes due, in due order. */
  advance(ms: number): void;
  /** Timers currently scheduled and not yet fired or cancelled. */
  readonly pendingTimers: number;
}

/**
 * A deterministic clock with manually advanced time.
 *
 * Firing order is by due time, and ties break by scheduling order — so two timers due at the same
 * instant fire in the order they were scheduled, which is what makes a race test reproducible rather
 * than merely usually-reproducible.
 */
export function createVirtualClock(startMs = 0): VirtualClock {
  interface Timer {
    readonly dueAt: number;
    readonly order: number;
    readonly handler: () => void;
    cancelled: boolean;
  }

  let now = startMs;
  let order = 0;
  let timers: Timer[] = [];

  return {
    now: () => now,

    schedule(handler, ms) {
      const timer: Timer = { dueAt: now + Math.max(0, ms), order: order++, handler, cancelled: false };
      timers.push(timer);
      return () => {
        timer.cancelled = true;
      };
    },

    advance(ms) {
      const target = now + Math.max(0, ms);
      for (;;) {
        const due = timers
          .filter((timer) => !timer.cancelled && timer.dueAt <= target)
          .sort((a, b) => a.dueAt - b.dueAt || a.order - b.order);
        const next = due[0];
        if (next === undefined) break;
        // Jump to the timer's due time so a handler that reads `now()` sees the instant it was
        // scheduled for, not the end of the advance.
        now = next.dueAt;
        timers = timers.filter((timer) => timer !== next);
        next.handler();
      }
      now = target;
      timers = timers.filter((timer) => !timer.cancelled);
    },

    get pendingTimers() {
      return timers.filter((timer) => !timer.cancelled).length;
    },
  };
}

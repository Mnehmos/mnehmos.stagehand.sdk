/**
 * The readiness gate (FR-199..FR-203).
 *
 * Two properties, and the difficulty is entirely in their interaction:
 *
 * - **A wait always returns** (`INV-006`, `NFR-003`). Every path resolves by settlement or by
 *   deadline; there is no third outcome and no path that leaves a promise pending.
 * - **A stale wait cannot resume work** (`INV-007`). This is the subtle one. `invalidate` settles
 *   every channel, so a naive implementation reports a barge-in as success and the superseded turn
 *   carries on. `settled` and `resumable` are therefore separate fields, and `resumable` is computed
 *   here rather than by callers.
 */

import { systemClock, type GateClock } from './clock.js';
import {
  DEFAULT_DEADLINE_MS,
  type ChannelState,
  type GateObserver,
  type GateWaitObservation,
  type ReadinessGateOptions,
  type WaitResult,
} from './types.js';

interface Channel {
  resolve: () => void;
  readonly promise: Promise<void>;
  markedAt: number;
}

export class ReadinessGate {
  readonly #clock: GateClock;
  readonly #defaultDeadlineMs: number;
  readonly #observer: GateObserver | undefined;
  readonly #channels = new Map<string, Channel>();
  #generation = 0;

  constructor(options: ReadinessGateOptions = {}) {
    this.#clock = options.clock ?? systemClock();
    this.#defaultDeadlineMs = options.defaultDeadlineMs ?? DEFAULT_DEADLINE_MS;
    this.#observer = options.observer;
  }

  /** Monotonic cancellation generation. `invalidate` advances it. */
  get generation(): number {
    return this.#generation;
  }

  /** Keys currently awaiting settlement, sorted. */
  get pendingKeys(): readonly string[] {
    return [...this.#channels.keys()].sort();
  }

  /** State of one key from the reader's point of view. */
  state(key: string): ChannelState {
    const channel = this.#channels.get(key);
    if (channel === undefined) return { pending: false };
    return { pending: true, markedAt: channel.markedAt };
  }

  /**
   * Declare that `key` is expected to settle.
   *
   * Marking an already-pending key refreshes its mark timestamp rather than creating a second
   * channel. Two channels for one key would mean a `settle` could resolve the wrong waiter.
   */
  mark(key: string): void {
    const existing = this.#channels.get(key);
    if (existing !== undefined) {
      existing.markedAt = this.#clock.now();
      return;
    }
    let resolve!: () => void;
    const promise = new Promise<void>((r) => {
      resolve = r;
    });
    this.#channels.set(key, { resolve, promise, markedAt: this.#clock.now() });
  }

  /**
   * Report that `key` has settled.
   *
   * A `settle` for a key nobody marked is harmless. A host reporting readiness that was not awaited
   * is normal — the alternative, throwing, would make every host defensive about a benign race.
   */
  settle(key: string): void {
    const channel = this.#channels.get(key);
    if (channel === undefined) return;
    this.#channels.delete(key);
    channel.resolve();
  }

  /** Settle every pending channel. Does not advance the generation. */
  settleAll(): void {
    const channels = [...this.#channels.values()];
    this.#channels.clear();
    for (const channel of channels) channel.resolve();
  }

  /**
   * Cancel everything in flight (FR-201).
   *
   * Advances the generation, settles every pending channel, and clears the set. Waits in flight see
   * `settled: true` **and** `stale: true` — which is exactly the pair `INV-007` is about.
   *
   * @returns The new generation.
   */
  invalidate(): number {
    this.#generation++;
    this.settleAll();
    return this.#generation;
  }

  /**
   * Wait for every requested key to settle, or for the deadline.
   *
   * @param keys Keys to await. Keys with no channel are already settled, so they contribute nothing.
   * @param deadlineMs Deadline in milliseconds. Defaults to the gate's configured policy.
   * @returns The outcome, including whether it is resumable.
   * @throws Never for a timeout: `E_TIMEOUT` is a reported outcome, not an exception. A deadline is
   *   an expected path with a degradation policy, and throwing would force every caller into a
   *   try/catch for the case this gate exists to make routine.
   */
  async wait(keys: readonly string[], deadlineMs?: number): Promise<WaitResult> {
    const startedAt = this.#clock.now();
    const generation = this.#generation;

    // Snapshot the awaited channels by identity, not by key name. A key that is re-marked while
    // this wait is in flight gets a *new* channel, which belongs to the next wait rather than to
    // this one — so identity is what decides what was outstanding, and a key name is not enough.
    const awaited: [string, Channel][] = [];
    for (const key of keys) {
      const channel = this.#channels.get(key);
      if (channel !== undefined) awaited.push([key, channel]);
    }

    // Nothing pending: resolve now and schedule nothing. Scheduling then clearing a timer is how a
    // gate under load accumulates timers it never needed.
    if (awaited.length === 0) {
      return this.#complete(keys, awaited, generation, startedAt, false);
    }

    const budget = deadlineMs ?? this.#defaultDeadlineMs;
    let timedOut = false;
    let cancelDeadline: (() => void) | undefined;

    const deadline = new Promise<void>((resolve) => {
      cancelDeadline = this.#clock.schedule(() => {
        timedOut = true;
        resolve();
      }, budget);
    });

    await Promise.race([Promise.all(awaited.map(([, channel]) => channel.promise)), deadline]);
    cancelDeadline?.();

    return this.#complete(keys, awaited, generation, startedAt, timedOut);
  }

  /**
   * Build the result, once, from the gate's actual state.
   *
   * Everything is derived here rather than passed in, so the returned value and the reported
   * observation cannot disagree about what was outstanding.
   */
  #complete(
    keys: readonly string[],
    awaited: readonly (readonly [string, Channel])[],
    generation: number,
    startedAt: number,
    timedOut: boolean,
  ): WaitResult {
    const waitedMs = this.#clock.now() - startedAt;
    // Outstanding means "the very channel this wait awaited is still live". A key re-marked during
    // the wait holds a different channel and does not retroactively become this wait's problem; a
    // key marked for the first time after the wait began was never this wait's problem either.
    const outstanding = awaited
      .filter(([key, channel]) => this.#channels.get(key) === channel)
      .map(([key]) => key);
    const settled = outstanding.length === 0;
    const stale = this.#generation !== generation;
    // Fail-closed on the deadline in both directions: a fired deadline is never resumable, even in
    // the rare tick where everything also happened to settle.
    const resumable = settled && !stale && !timedOut;

    const result: WaitResult = {
      settled,
      stale,
      timedOut,
      outstanding,
      waitedMs,
      generation,
      resumable,
    };

    if (this.#observer !== undefined) {
      const observation: GateWaitObservation = {
        keys: [...keys],
        waitedMs,
        settled,
        stale,
        timedOut,
        outstanding,
        generation,
        currentGeneration: this.#generation,
      };
      this.#observer(observation);
    }

    return result;
  }
}

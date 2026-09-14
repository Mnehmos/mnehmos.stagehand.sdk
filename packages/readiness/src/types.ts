/**
 * Readiness types (FR-199, FR-200, FR-201, FR-203).
 *
 * The most important type here is `WaitResult`, and the most important thing about it is that
 * `settled` and `resumable` are two fields rather than one. Invalidation settles every channel, so a
 * wait interrupted by a barge-in reports `settled: true`. An implementation that treats "settled" as
 * "carry on" resumes the superseded turn and speaks over the turn that replaced it — `INV-007`'s
 * failure, and invisible to any test that only checks whether the wait returned.
 */

export interface ChannelState {
  /** True while a channel exists and has not been settled. */
  readonly pending: boolean;
  /** When `mark` was last called for this key. */
  readonly markedAt?: number;
}

/** What a wait observed. Carried to the observer and returned to the caller. */
export interface WaitResult {
  /** Every requested key reached a settled state before the deadline. */
  readonly settled: boolean;
  /** The gate's generation changed during this wait. */
  readonly stale: boolean;
  /** The deadline elapsed while keys were still outstanding. */
  readonly timedOut: boolean;
  /**
   * Keys still outstanding when the wait returned.
   *
   * Non-empty for a timeout, and also for a wait that ended for another reason with work
   * unfinished — a partial settlement being the common case.
   */
  readonly outstanding: readonly string[];
  /** Elapsed time as the gate's clock measured it. */
  readonly waitedMs: number;
  /** The generation this wait ran under. */
  readonly generation: number;
  /**
   * Whether the caller may act on this result.
   *
   * `settled && !stale && !timedOut`. Computed inside the gate so the rule lives in one place; a
   * caller re-deriving it is a caller that can get it wrong.
   */
  readonly resumable: boolean;
}

/** A completed wait, as reported to an observer. */
export interface GateWaitObservation {
  readonly keys: readonly string[];
  readonly waitedMs: number;
  readonly settled: boolean;
  readonly stale: boolean;
  readonly timedOut: boolean;
  readonly outstanding: readonly string[];
  /** Generation the wait ran under. */
  readonly generation: number;
  /** Generation the gate is on when the wait completed; differs from `generation` when stale. */
  readonly currentGeneration: number;
}

/**
 * Receives completed waits (FR-203).
 *
 * Observational only: a gate with no observer behaves identically in every other respect.
 */
export type GateObserver = (observation: GateWaitObservation) => void;

export interface ReadinessGateOptions {
  /** Time source and timers. Defaults to `systemClock()`. */
  readonly clock?: import('./clock.js').GateClock;
  /** Deadline used when a wait does not supply one. Defaults to 5000ms. */
  readonly defaultDeadlineMs?: number;
  /** Receives every completed wait. */
  readonly observer?: GateObserver;
}

export const DEFAULT_DEADLINE_MS = 5000;

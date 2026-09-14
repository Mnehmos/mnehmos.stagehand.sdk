/**
 * Shared helpers for the trace parity exits.
 */

import type { Clock } from '../src/index.js';

export interface FakeClock {
  readonly clock: Clock;
  /** How many times the clock was read, so a test can distinguish "no clock" from "clock unused". */
  get reads(): number;
}

/** A deterministic clock that advances a fixed step per read. */
export function fakeClock(start = 1_700_000_000_000, step = 10): FakeClock {
  let reads = 0;
  return {
    clock: () => start + reads++ * step,
    get reads() {
      return reads;
    },
  };
}

/** A clock that throws if anything reads it. Used to prove a code path has no clock. */
export const POISONED_CLOCK: Clock = () => {
  throw new Error('a clock was read on a path that must not read one');
};

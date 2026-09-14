/**
 * Trace integration for the readiness gate (FR-203, `SURF-142`).
 *
 * `gate.waited` is a production-channel event: it records how long a wait took and how it ended,
 * which is audit material rather than something a user sees. A reader asking "why did this turn
 * stall" needs it; the public channel must not have it.
 *
 * `gate.waited` is not part of `FEAT-005`'s core vocabulary — it belongs to this feature — so the
 * host registers it on the bus's channel map:
 *
 * ```ts
 * const channels = ChannelMap.core().extend({ 'gate.waited': 'production' });
 * const bus = new EventBus({ sessionId, channels });
 * const gate = new ReadinessGate({ observer: traceGateObserver(bus) });
 * ```
 *
 * `extend` is idempotent for a type already on the same channel, so a host composing this twice is
 * safe.
 */

import type { EventBus } from '@stagehand/trace';
import type { GateObserver, GateWaitObservation } from './types.js';

/** The event type this feature owns. Exported so hosts do not retype it. */
export const GATE_WAITED = 'gate.waited';

/**
 * Build an observer that records `gate.waited` on a bus.
 *
 * @returns An observer reporting each completed wait on the **production** channel. Passing it to
 *   `ReadinessGateOptions.observer` is the whole integration.
 * @throws {UnknownEventTypeError} from the bus at emission time if `gate.waited` was not registered
 *   on the bus's channel map. A loud failure is preferred to a silently untraced gate: readiness that
 *   reports nothing looks identical to readiness that was never observed, and only one of those is a
 *   bug.
 */
export function traceGateObserver(bus: EventBus): GateObserver {
  return (observation: GateWaitObservation): void => {
    bus.emit(GATE_WAITED, {
      keys: [...observation.keys],
      waitedMs: observation.waitedMs,
      settled: observation.settled,
      stale: observation.stale,
      timedOut: observation.timedOut,
      outstanding: [...observation.outstanding],
      generation: observation.generation,
      currentGeneration: observation.currentGeneration,
    });
  };
}

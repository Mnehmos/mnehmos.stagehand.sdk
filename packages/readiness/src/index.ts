/**
 * @stagehand/readiness — readiness and synchronization.
 *
 * Owner of FEAT-006. Requirement range `FR-199..FR-203`; tasks `T-045..T-048`; parity exits
 * `TEST-185..TEST-187`. See `specs/006-readiness-sync/spec.md`.
 *
 * Two properties, and the difficulty is entirely in their interaction:
 *
 * - **A wait always returns** (`INV-006`). Every path resolves by settlement or by deadline; there is
 *   no third outcome.
 * - **A stale wait cannot resume work** (`INV-007`). `invalidate` settles every channel, so a wait
 *   interrupted by a barge-in reports `settled: true`. That is why `settled` and `resumable` are
 *   separate fields, and why `resumable` is computed inside the gate rather than by callers who
 *   would have to re-derive the rule.
 *
 * @example
 * ```ts
 * const gate = new ReadinessGate({ defaultDeadlineMs: 2000, observer: traceGateObserver(bus) });
 *
 * gate.mark('camera');
 * camera.onSettled(() => gate.settle('camera'));
 *
 * const wait = await gate.wait(['camera']);
 * if (wait.resumable) continueTurn();
 * else if (wait.timedOut) proceedDegraded();
 * else if (wait.stale) { /* a barge-in superseded this turn; do not speak *\/ }
 * ```
 */

export { createVirtualClock, systemClock, type Cancel, type GateClock, type VirtualClock } from './clock.js';

export { ReadinessGate } from './gate.js';

export { GATE_WAITED, traceGateObserver } from './trace-observer.js';

export {
  DEFAULT_DEADLINE_MS,
  type ChannelState,
  type GateObserver,
  type GateWaitObservation,
  type ReadinessGateOptions,
  type WaitResult,
} from './types.js';

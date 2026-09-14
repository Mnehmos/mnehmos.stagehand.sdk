/**
 * @stagehand/trace — trace, replay, and diagnostics.
 *
 * Owner of FEAT-005. Requirement range `FR-193..FR-198`; tasks `T-040..T-044`; parity exits
 * `TEST-181..TEST-184`. See `specs/005-trace-replay/spec.md`.
 *
 * Two claims, and they are different claims:
 *
 * - **Separation.** An event's channel is a property of its *type*, resolved through one map, so a
 *   rejected command or a raw provider payload cannot be placed on the public channel. Not a
 *   formatting rule — `NFR-001` and Constitution Article VII.
 * - **Replay.** A recorded session reproduces its committed effects with no model call, no provider
 *   access, and no clock. `replayTrace`'s signature has nothing of the sort to inject, and it reads
 *   the public event array and nothing else, so a rejected command cannot be resurrected as an
 *   effect by replaying its diagnostic (`INV-005`).
 *
 * @example
 * ```ts
 * const bus = new EventBus({ sessionId: 'session-1', clock: () => 1_700_000_000_000 });
 * recordExecutionOutcome(bus, outcome);
 *
 * const envelope = createEnvelope({ ...bus.snapshot(), pluginVersions: { geo: '1.0.0' } });
 * const text = serializeTrace(envelope);
 *
 * const loaded = parseTrace(text);
 * if (loaded.ok) {
 *   const replay = replayTrace(loaded.envelope);
 *   if (replay.ok) render(replay.result.effects);
 * }
 * ```
 */

export {
  ChannelConflictError,
  ChannelMap,
  PUBLIC_EVENT_TYPES,
  PRODUCTION_EVENT_TYPES,
  UnknownEventTypeError,
  channelOfCoreType,
  type CoreEvent,
  type CoreEventType,
  type EventChannel,
  type EventPayloads,
  type ProductionEvent,
  type ProductionEventType,
  type PublicEvent,
  type PublicEventType,
  type TraceEvent,
} from './vocabulary.js';

export {
  EventBus,
  type Clock,
  type EventBusOptions,
  type EventBusSnapshot,
  type ProductionListener,
  type PublicListener,
  type Unsubscribe,
} from './bus.js';

export {
  createEnvelope,
  parseTrace,
  serializeTrace,
  toRecord,
  PROTOCOL_VERSION,
  SCHEMA_SET_VERSION,
  type EnvelopeInput,
  type EnvelopeRecord,
  type ParseResult,
  type TraceEnvelope,
} from './envelope.js';

export {
  DuplicateMigratorError,
  MigratorRegistry,
  type TraceMigrator,
  type UpgradeResult,
} from './migrate.js';

export {
  diagnosticsOf,
  replayTrace,
  serializeReplay,
  type ReplayOptions,
  type ReplayOutcome,
  type ReplayResult,
  type ReplayedEffect,
} from './replay.js';

export {
  channelForRuntimeEvent,
  recordExecutionOutcome,
  type BridgeResult,
} from './runtime-bridge.js';

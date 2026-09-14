/**
 * Replay (FR-198, INV-005).
 *
 * Read the signature below before the body. `replayTrace` admits an envelope, an optional migrator
 * registry, and a target version. It has **no clock, no provider, no resolver, no committer** — not
 * because it declines to use them, but because there is nothing of the sort to inject. "Replay must
 * not call a model" (Constitution VIII) and "replay is deterministic" (`NFR-002`) are therefore
 * structural facts about this module rather than promises in a doc-comment.
 *
 * It also reads the **public array and nothing else**. `INV-005`: replay material is the accepted
 * public effect sequence plus enough identifiers to reproduce it. Folding production events in would
 * let a `command.rejected` diagnostic be replayed as though it had been a committed effect —
 * manufacturing a mutation out of a record of a refusal. Production events are reachable through
 * `diagnosticsOf`, which is explicitly not replay and returns nothing committable.
 */

import type { TraceEnvelope } from './envelope.js';
import type { MigratorRegistry } from './migrate.js';
import { PROTOCOL_VERSION } from './envelope.js';
import type { ProductionEvent, PublicEvent } from './vocabulary.js';

/** An effect as recovered from the trace. Structural, with no host behaviour attached. */
export interface ReplayedEffect {
  readonly sequence: number;
  readonly plugin: string;
  readonly action: string;
  readonly correlationId?: string;
}

export interface ReplayResult {
  readonly sessionId: string;
  readonly protocolVersion: string;
  /** The public events, in recorded order. The whole of the replay material. */
  readonly events: readonly PublicEvent[];
  /** The committed effects, derived from `effect.committed` events in order. */
  readonly effects: readonly ReplayedEffect[];
}

export interface ReplayOptions {
  /** Migrators used when the envelope is not at `targetProtocolVersion`. */
  readonly migrators?: MigratorRegistry;
  /** Defaults to this build's protocol version. */
  readonly targetProtocolVersion?: string;
}

export type ReplayOutcome =
  | { readonly ok: true; readonly result: ReplayResult }
  | { readonly ok: false; readonly reason: string };

/** Extract an effect from a public event, when it is one. */
function effectOf(event: PublicEvent): ReplayedEffect | undefined {
  if (event.type !== 'effect.committed') return undefined;
  const payload = event.payload as { plugin: string; action: string; correlationId?: string };
  return {
    sequence: event.sequence,
    plugin: payload.plugin,
    action: payload.action,
    ...(payload.correlationId === undefined ? {} : { correlationId: payload.correlationId }),
  };
}

/**
 * Reproduce the committed effect sequence from a trace.
 *
 * @param envelope A typed envelope, already loaded and validated.
 * @returns The public event sequence and the effects derived from it, in recorded order.
 */
export function replayTrace(envelope: TraceEnvelope, options: ReplayOptions = {}): ReplayOutcome {
  const target = options.targetProtocolVersion ?? PROTOCOL_VERSION;
  if (envelope.protocolVersion !== target) {
    // Refusing here rather than replaying a version this build does not understand. Loading is
    // where migration belongs; replay must not be the place a version difference is discovered,
    // because by then the caller believes they have a faithful reproduction.
    return {
      ok: false,
      reason:
        `envelope is at protocol version "${envelope.protocolVersion}" but replay targets "${target}"; ` +
        'migrate it before replaying',
    };
  }

  // Public array only. `envelope.productionEvents` is deliberately not read in this function.
  const events = [...envelope.publicEvents].sort((a, b) => a.sequence - b.sequence);
  const effects: ReplayedEffect[] = [];
  for (const event of events) {
    const effect = effectOf(event);
    if (effect !== undefined) effects.push(effect);
  }

  return {
    ok: true,
    result: {
      sessionId: envelope.sessionId,
      protocolVersion: envelope.protocolVersion,
      events,
      effects,
    },
  };
}

/**
 * Read an envelope's production events as audit material.
 *
 * Separate from replay by design: this returns diagnostics for a human or a report to read, and
 * nothing here can be committed. It exists so that "replay must not touch the production array" can
 * be true without making production events unreachable.
 */
export function diagnosticsOf(envelope: TraceEnvelope): readonly ProductionEvent[] {
  return [...envelope.productionEvents].sort((a, b) => a.sequence - b.sequence);
}

/**
 * Serialize a replay result canonically.
 *
 * The determinism check is `serializeReplay(a) === serializeReplay(b)` for the same envelope, which
 * is a stronger statement than comparing effect counts.
 */
export function serializeReplay(result: ReplayResult): string {
  return JSON.stringify({
    sessionId: result.sessionId,
    protocolVersion: result.protocolVersion,
    events: result.events,
    effects: result.effects,
  });
}

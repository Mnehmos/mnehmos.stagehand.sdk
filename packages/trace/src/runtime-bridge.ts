/**
 * Runtime → trace bridge (FR-194 integration).
 *
 * `FEAT-003` already routes its outcomes to a channel, and this feature owns the channel vocabulary.
 * Two independent opinions about whether something is public is exactly one opinion too many, so the
 * mapping lives here, in one place, and the test asserts the two agree.
 *
 * The mapping is the natural one and worth stating explicitly:
 *
 * | Runtime outcome | Event | Channel | Why |
 * |---|---|---|---|
 * | `scene_command` | `effect.committed` | public | The host was told to act; the user will see it. |
 * | `invalid_command` | `command.rejected` | production | A rejected command must never render. |
 * | `unresolved_refs` | `diagnostic` | production | A resolution failure is an internal detail. |
 * | `compile_failed` | `diagnostic` | production | A pass failure is a build-time concern. |
 *
 * Note that the last three are *all* production. A runtime refusal that reached the public channel
 * would be the `NFR-001` failure this feature exists to prevent, and the way to make that unlikely is
 * for the bridge to have no public branch except the one that committed something.
 */

import type { ExecutionOutcome, RuntimeEvent } from '@stagehand/runtime';
import type { EventBus } from './bus.js';
import type { ProductionEvent, PublicEvent } from './vocabulary.js';

export interface BridgeResult {
  readonly recorded: readonly (PublicEvent | ProductionEvent)[];
  /** Effects recorded on the public channel. Equal to the outcome's effect count when committed. */
  readonly publicEffects: number;
}

function describe(errors: readonly { readonly message: string }[]): readonly string[] {
  return errors.map((error) => error.message);
}

/**
 * Record an execution outcome onto a bus.
 *
 * @param bus The bus to record on.
 * @param outcome What the runtime produced.
 * @returns The recorded events, so a caller can assert on them without re-reading the bus.
 */
export function recordExecutionOutcome(bus: EventBus, outcome: ExecutionOutcome): BridgeResult {
  const recorded: (PublicEvent | ProductionEvent)[] = [];
  let publicEffects = 0;

  for (const event of outcome.events) {
    switch (event.type) {
      case 'scene_command': {
        // One public event per committed effect, so the trace carries the whole batch rather than
        // only its head. `scene_command.effect` names the primary; the replay material needs all.
        for (const effect of event.effects) {
          recorded.push(
            bus.emitPublic('effect.committed', {
              plugin: effect.plugin,
              action: effect.action,
              ...(effect.correlationId === undefined ? {} : { correlationId: effect.correlationId }),
            }),
          );
          publicEffects++;
        }
        break;
      }
      case 'invalid_command': {
        recorded.push(
          bus.emitProduction('command.rejected', {
            action: event.command.action,
            errors: describe(event.errors),
          }),
        );
        break;
      }
      case 'unresolved_refs': {
        recorded.push(
          bus.emitProduction('diagnostic', {
            level: 'warning',
            message: `unresolved references in ${event.command.action}: ${event.unresolved.join(', ')}`,
          }),
        );
        break;
      }
      case 'compile_failed': {
        recorded.push(
          bus.emitProduction('diagnostic', {
            level: 'error',
            message: `compiler pass "${event.pass}" failed for ${event.command.action}: ${describe(event.errors).join('; ')}`,
          }),
        );
        break;
      }
    }
  }

  return { recorded, publicEffects };
}

/** The channel a runtime event would be recorded on. Present for tests and for documentation. */
export function channelForRuntimeEvent(event: RuntimeEvent): 'public' | 'production' {
  return event.channel;
}

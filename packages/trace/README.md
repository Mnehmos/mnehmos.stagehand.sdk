# @stagehand/trace

Separate public and production event channels plus the versioned replay envelope.

| | |
|---|---|
| Layer | `core` |
| Kind | `package` |
| Directory | `packages/trace` |
| Owner features | FEAT-005 |
| Internal dependencies | `@stagehand/runtime` |
| Status | implemented — FEAT-005 converged through T-040..T-044 |

## Usage

```ts
import {
  EventBus, createEnvelope, parseTrace, replayTrace, recordExecutionOutcome, serializeTrace,
} from '@stagehand/trace';

const bus = new EventBus({ sessionId: 's1', clock: () => 1_700_000_000_000 });

// Runtime outcomes land on the right channel without the caller choosing one.
recordExecutionOutcome(bus, outcome);

const envelope = createEnvelope({ ...bus.snapshot(), pluginVersions: { geo: '1.0.0' } });
const loaded = parseTrace(serializeTrace(envelope));

if (loaded.ok) {
  const replay = replayTrace(loaded.envelope);   // no clock, no provider, public events only
  if (replay.ok) render(replay.result.effects);
}
```

## What this module guarantees

- **An event's channel is a property of its type**, decided in one map. A rejected command, a
  provider payload, or a parser internal cannot be placed on the public channel: the emit path has no
  entry for a production type. Asserted per type, not once for the taxonomy.
- **Replay reads the public array and nothing else.** A `command.rejected` cannot be replayed into a
  committed effect, so a record of a refusal cannot manufacture a mutation (`INV-005`).
- **Replay has no seam and no clock.** `replayTrace` takes an envelope and optional migrators;
  there is nothing provider-shaped to inject, so "replay must not call a model" (Article VIII) and
  determinism (`NFR-002`) are properties of the signature rather than promises.
- **Compatibility is explicit.** An older envelope with no registered migrator is refused, a broken
  chain names its missing link, and a newer envelope is refused rather than read forward-compatibly.
- **One sequence counter across both channels**, so "did narration interrupt before or after the
  effect committed" is answerable.

## Extending the vocabulary

The core vocabulary is 14 types. The 24 event surfaces owned by later features declare their channels
on the same map rather than editing this package:

```ts
const channels = ChannelMap.core().extend({
  'gate.waited': 'production',   // FEAT-006
  'beat.started': 'public',      // FEAT-004
});
new EventBus({ sessionId, channels });
```

Core types get compile-time channel checking. Extended types — defined in packages this one cannot
see — get the same check at runtime through the map. A conflict, or a type moved to the other
channel, throws rather than being absorbed.

## Requirements owned

| Feature | v2 requirements | v2 tasks | Parity exits |
|---|---|---|---|
| FEAT-005 Trace, Replay & Diagnostics | FR-193..FR-198 | T-040, T-041, T-042, T-043, T-044 | TEST-181, TEST-182, TEST-183, TEST-184 |

## Corpus seed

- FEAT-005: `16` surfaces, `16` v1 requirements, `16` v1 tests — seed spec `docs/corpus/specs/`, issue [#14](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/14)

See [V2_ID_LEDGER.md](../../docs/governance/V2_ID_LEDGER.md) for the canonical identity allocation and
[SPEC_KIT_RUNBOOK.md](../../docs/governance/SPEC_KIT_RUNBOOK.md) for the per-feature workflow.

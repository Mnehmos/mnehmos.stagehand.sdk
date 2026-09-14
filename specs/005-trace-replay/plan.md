# Plan — FEAT-005 Trace, Replay & Diagnostics

## Target

Package owner: `packages/trace`. Dependency: `@stagehand/runtime` (FEAT-003), for the bridge that
maps runtime outcomes onto the channel vocabulary. No provider, no model, no clock of its own.

## Architecture

One mapping decides everything. An event's channel is looked up from its *type*, so the place a
mistake would be made — the emission site — never expresses an opinion about routing.

```text
  emitPublic / emitProduction
            │
            ▼
      channel map ── one source: type → 'public' | 'production'   (FR-193, FR-194)
            │
            ▼
        EventBus ── monotonic sequence, injected clock, separate subscriptions   (FR-195)
            │
            ▼
     TraceEnvelope ── versioned from the first record written    (FR-196, DIV-005)
            │
      ┌─────┴─────┐
      ▼           ▼
 MigratorRegistry  serialize / parse
      │           │
      └─────┬─────┘
            ▼
     replayTrace(envelope) ── PUBLIC events only, no clock, no seam   (FR-197, FR-198)
```

| Module | Responsibility | Requirements |
|---|---|---|
| `src/vocabulary.ts` | Event payload types, the two unions, the channel map and its extension rules | FR-193, FR-194 |
| `src/bus.ts` | `EventBus`: emission, subscription, ordering, injected clock | FR-195 |
| `src/envelope.ts` | `TraceEnvelope`, `serializeTrace`, `parseTrace` | FR-196 |
| `src/migrate.ts` | `MigratorRegistry`, explicit version chains | FR-197 |
| `src/replay.ts` | `replayTrace`, `diagnosticsOf` | FR-198 |
| `src/runtime-bridge.ts` | Maps `ExecutionOutcome` onto the vocabulary | FR-194 integration |
| `src/index.ts` | Public surface | — |

### The channel map is extendable because sixteen other surfaces need it

The core vocabulary is fourteen types, but twenty-four more event surfaces belong to later features
(`gate.waited`, `avatar.anchor.reached`, `projector.state`, the `lesson.*` family, `beat.*`,
`room.mode`, `media.*`, `entity_*`). If those required editing this package, every one of them would
be a chance to put a production event on the public channel. Instead the map extends, conflicts are
rejected, and the extension is where the owning feature declares its channels once.

### Why replay reads only the public array

`INV-005` says replay material is the accepted public effect sequence plus enough version
identifiers to reproduce it. The production array is audit material. Folding it into replay would
mean a `command.rejected` diagnostic could be replayed as though it had been a committed effect —
inventing a mutation from a record of a refusal. `replayTrace` therefore takes the envelope and
touches one array; production events are reachable only through `diagnosticsOf`, which is explicitly
not replay.

### Why replay has no clock and no seam

"Nondeterministic replay" should be impossible to write, not merely discouraged. `replayTrace`'s
signature admits an envelope, an optional migrator registry, and a target version — no clock, no
provider, no resolver, no committer. There is nothing to inject, so the property is structural
rather than promised.

The same reasoning covers "replay must not call a model" (Constitution VIII): the package has no
provider dependency at all, and `check:boundaries` fails if one is added.

### Ordering is one counter, not two

A single monotonic sequence across both channels is what makes cross-channel ordering checkable —
"narration interrupted before or after the effect committed" is answerable only if the two arrays
share a numbering. Per-channel counters would make `TEST-184` unanswerable.

## Implementation sequence

1. `vocabulary.ts` — the two unions and the channel map, because every later decision is expressed in
   them.
2. `bus.ts` — ordering and subscription.
3. `envelope.ts`, `migrate.ts` — the record and its compatibility rules.
4. `replay.ts` — last, and smallest, because the constraints are structural.
5. `runtime-bridge.ts` — the composition that proves the two channel taxonomies agree.
6. Parity exits, then `pnpm check`.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| A production event reaches the public channel | critical | Channel decided by type in one map; refusal is per-type and tested per-type, not once for the taxonomy. |
| Replay resurrects a rejected command as an effect | critical | Replay reads the public array only; `diagnosticsOf` is a separate function that cannot produce effects. |
| A silently-lossy version upgrade | high | No implicit acceptance; an unregistered older version is refused, and a partial chain names the missing link. |
| A future version loaded by an older reader | high | Refused. A forward-compatible read would drop fields the reader does not know exist, which is the `FIND-005` failure in the other direction. |
| Nondeterminism entering replay via a clock | high | No clock is reachable from `replayTrace`; recording takes an injected clock so even recording is reproducible. |
| Secret material in a production payload | medium | Out of scope here, and stated rather than assumed: channel separation is this feature's obligation, while redaction belongs to the host-configuration and media features that own those payloads (`FEAT-018`, `FEAT-014`). Keeping a secret off the public channel is this feature's job; keeping it out of the production channel is theirs. |

## Divergences reflected

`DIV-005` is implemented here, not merely respected: the version fields exist on the first envelope
this code writes. `U-005` (how long old versions must stay migratable) remains a maintainer policy
decision and is out of scope by design. No new divergence is proposed.

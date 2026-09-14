# FEAT-005 · Trace, Replay & Diagnostics

Live specification. Owner: `packages/trace`. Tier T0, complexity high, preservation posture `yes`.
Corpus seed: `docs/corpus/specs/004-trace-replay/`. Issue
[#14](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/14), milestone
[#4](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/4).

Requirement identities are v2 (`FR-193..FR-198`). Corpus evidence is cited by surface and contract
identity (`SURF-###`, `CTR-###`), never by superseded Pass-9 requirement numbers.

## 1. Intent

Expose **separate public and production event channels** and record versioned replay material,
without letting private diagnostics become user-facing effects.

Two claims carry this feature, and they are different claims:

- **Separation.** A rejected command, a raw provider payload, or a parser internal must be
  structurally incapable of appearing on the public channel. This is not a formatting rule; it is
  `NFR-001` and Constitution Article VII, and it is the reason a host can render public state from
  the trace without leaking what the model was told.
- **Replay.** A recorded session reproduces its committed effects with **no model call** and no
  provider access (Constitution VIII). Replay must be usable as evidence — which means it must not
  be able to re-run the thing whose output is being audited.

## 2. User Scenarios

1. **Auditing a session.** An operator loads a trace, replays it, and sees exactly the effects that
   were committed, in order, without any network access.
2. **A leaking diagnostic.** A developer emits `command.rejected` through the public channel by
   mistake. It is refused rather than rendered.
3. **An old trace.** A trace recorded under an earlier protocol version is loaded. It is either
   upgraded through an explicit migrator or refused with a reason — never silently accepted with
   fields quietly missing.
4. **Interruption.** Narration is interrupted while an effect is in flight. The recorded order of
   narration, readiness, and effect events is the order they happened, and replay preserves it.
5. **A rejected command in a trace.** Replay reproduces the *committed* effects and the rejection is
   visible as audit material. It does not resurrect the rejected command as an effect.

## 3. Functional Requirements

- **FR-193 · Event vocabulary and channel taxonomy.** The SDK MUST define a core event vocabulary as
  two disjoint typed unions. **Public:** `narration.started`, `narration.ended`,
  `narration.interrupted`, `caption`, `effect.committed`, `board.revision.committed`,
  `safe_failure`. **Production:** `stream.chunk`, `segment.parsed`, `command.accepted`,
  `command.rejected`, `provider.request`, `provider.response`, `diagnostic`. Each event type MUST
  carry a typed payload, and an event's channel MUST be a property of its *type* — never a choice
  made at the emission site, where a mistake is invisible.
  → SURF-117..123, SURF-137..141, SURF-143..145 → CTR-120

- **FR-194 · One channel mapping, extendable without forking core.** Routing MUST be driven by a
  single channel map from event type to channel, and the bus MUST deliver an event to exactly one
  channel. Emitting a production type as public, or a public type as production, MUST be refused at
  compile time where the type is statically known and at runtime otherwise. Event types owned by
  plugins and by later features MUST extend the same map rather than requiring a change here, and a
  conflicting re-registration MUST be rejected.
  → SURF-117 → CTR-120 · CTR-122

- **FR-195 · Event bus with separate subscriptions and monotonic ordering.** The bus MUST offer
  separate public and production emission and subscription, MUST assign each event a monotonically
  increasing sequence number in emission order, and MUST take its time source as an injected clock so
  a recorded session is reproducible. Subscribers MUST be able to unsubscribe. Recording MUST NOT
  require a subscriber to be present.
  → CTR-122 · NFR-002

- **FR-196 · Versioned trace envelope.** The SDK MUST serialize and load a trace envelope carrying
  `protocolVersion`, `schemaSetVersion`, `pluginVersions`, an optional `adapterVersion`, an optional
  `assetManifestHash`, `sessionId`, `startedAt`, and the two event arrays. A load that fails MUST
  report why — a malformed or incomplete envelope MUST NOT be accepted with fields defaulted.
  → SURF-166 → Constitutional Article VIII · DIV-005

- **FR-197 · Migrator registry.** Loading an envelope whose `protocolVersion` differs from the
  target MUST either apply an explicit, registered migrator chain or refuse. There MUST be no
  implicit acceptance of an older envelope, no field-dropping upgrade, and no migrator applied to an
  envelope it does not claim to read. A missing link in a chain MUST be reported as such.
  → SURF-166 · DIV-005 · U-005

- **FR-198 · Replay from public events only, without a model.** Replay MUST reconstruct the
  committed effect sequence from the envelope's **public** events, and MUST NOT read, yield, or
  derive anything from the production array — production events are audit material, and a rejected
  command must not be resurrected as an effect by replaying its diagnostic. Replay MUST have no
  provider or model seam available to it, MUST NOT read a clock, and MUST be deterministic: the same
  envelope yields byte-identical output.
  → SURF-166 · INV-005 · Constitutional Article VIII

## 4. Key Entities

`ENT-007` (`StagehandTrace`) — canonical definition in
`docs/corpus/analysis/18_STATE_MODEL.md`. Two invariants from that record govern this feature:

- **`INV-005`** — replay material contains only accepted public effects plus enough deterministic
  identifiers/versions to reproduce them. This is why replay reads the public array and nothing else.
- **`FIND-005`** — the recovered host's concrete trace lacked a schema version. `DIV-005` is the fix,
  and this feature is where it lands: versioning is introduced *before* anything is written, because
  a migrator registry retrofitted to unversioned traces is a rewrite, not an upgrade.

## 5. Surface Bindings

| Surface | Requirement | Contract | Corpus evidence |
|---|---|---|---|
| SURF-117 `StagehandRuntimeEvent` | FR-193, FR-194 | CTR-120 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-118 `narration.started` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-119 `narration.ended` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-120 `narration.interrupted` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-121 `caption` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-122 `effect.committed` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-123 `board.revision.committed` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-137 `safe_failure` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-138 `stream.chunk` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-139 `segment.parsed` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-140 `command.accepted` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-141 `command.rejected` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-143 `provider.request` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-144 `provider.response` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-145 `diagnostic` | FR-193 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-166 `StagehandTrace` | FR-196, FR-197, FR-198 | — | `analysis/13_SURFACE_INVENTORY.md#surf-166` |

All 16 owned surfaces are bound. `SURF-142` (`gate.waited`) is owned by FEAT-006 and must route
through this feature's channels without a change here — which is what `FR-194`'s extendable map
exists to permit.

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Event emitted with a public type | Recorded and delivered on the public channel only. |
| Event emitted with a production type | Recorded and delivered on the production channel only. |
| Production type offered to the public emit path | Refused; nothing recorded on either channel. |
| Unknown event type | Refused with a reason; never recorded with an inferred channel. |
| Subscriber absent | Event is still recorded. |
| Envelope at the target protocol version | Loads and replays. |
| Envelope at an older version with a registered migrator chain | Upgraded, then loads; the upgrade is explicit. |
| Envelope at an older version with no migrator | Refused, naming the missing link. |
| Envelope newer than the target | Refused; a forward-compatible read would silently drop fields it does not know. |
| Malformed envelope | Refused with the parse error, not accepted with defaults. |
| Replay with no subscribers and no network | Succeeds; the effect sequence is reproduced. |

## 7. Error Catalog

This feature adds no new `E_*` codes. Load and migration failures are reported as typed results with
a `reason`, because they are not command rejections and must not be mistaken for one.

## 8. State Transitions

`committed + public trace`, or `rejected + production diagnostic`. This feature owns the trace side
of both. It does not parse, validate, resolve, or commit — it records and reproduces what those
stages decided.

## 9. Non-Functional Envelope

- **NFR-002, versioned and deterministic replay envelope.** Asserted structurally: replay takes no
  clock and no seam, so a nondeterministic replay would require adding one.
- **NFR-001, no raw-stream public leakage.** Enforced by the channel map, which is the single point
  where an event's channel is decided.

## 10. Divergence Register

- **DIV-005** — Version the trace envelope: protocol, schema-set, plugin, and adapter versions, an
  optional asset-manifest hash, and a migrator registry. This feature implements it; it does not
  merely respect it. The recovered host shipped traces with no schema version (`FIND-005`), so
  implementing the divergence means the version fields exist from the first record written.

## 11. Parity Exits

- **TEST-181** — Public/private leakage canary corpus.
- **TEST-182** — Serialize → load → replay without model access.
- **TEST-183** — Version mismatch and the migrator registry.
- **TEST-184** — Interruption ordering across narration, readiness, and effects.

## 12. Tasks

- **T-040** Event bus + typed channels · **T-041** Versioned trace schema/serializer ·
  **T-042** Replay runner · **T-043** Migrator registry · **T-044** Privacy/ordering tests

## 13. Success Criteria

1. For every production event type, an attempt to deliver it publicly is refused and leaves both
   channels unchanged — asserted per type, not once for the taxonomy.
2. A session can be recorded, serialized, parsed, and replayed with the resulting effect sequence
   equal to what was committed, with no clock read and no seam reachable.
3. Every migration path is explicit: a version with no registered chain is refused, and a chain with
   a missing link names the link.
4. `pnpm check` is green.

## 14. Open Questions

**`U-005` remains open and is a release gate, not an implementation question.** The policy for how
long old trace versions must remain migratable is a maintainer decision; this feature supplies the
mechanism (explicit migrators, refusal by default) but deliberately does not decide how many
historical versions must keep working, because inventing that policy would be inventing a
compatibility promise the project has not made.

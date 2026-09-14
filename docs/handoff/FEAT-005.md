# Handoff — FEAT-005 · Trace, Replay & Diagnostics

Milestone [#4](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/4) (M2 · Trace, readiness &
choreography). Feature issue: [#14](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/14).
Predecessor: [FEAT-003.md](FEAT-003.md).

## What changed and why

**`packages/trace` is implemented and converged.** `FR-193..FR-198` authored, tasks `T-040..T-044`
complete, parity exits `TEST-181..TEST-184` passing. `pnpm check` green (7/7), **277 tests**.

Three decisions shaped it.

### 1. The channel is a property of the event type, not a choice at the emit site

An emission site that names a channel is an emission site that can name the wrong one, and putting a
rejected command on the public channel is `NFR-001` and Article VII failing in the one place a host
would render it. So the type decides, through one map.

Refusal is asserted **per type** — 14 tests, one per direction per type — because the failure this
prevents is one type being wrong, not the taxonomy being wrong. Verified by mutation: removing the
channel check failed 14 of them.

The map extends, because 24 further event surfaces belong to later features (`gate.waited`,
`avatar.anchor.reached`, `projector.state`, `lesson.*`, `beat.*`, `media.*`, `entity_*`). Each
declares its channels once rather than editing this package — which is also what stops those
features from each being an opportunity to cross the boundary.

### 2. Replay reads the public array and nothing else

`INV-005` says replay material is the accepted public effect sequence plus version identifiers. The
production array is audit material. Folding it in would let a `command.rejected` diagnostic be
replayed as though it had been a committed effect — manufacturing a mutation out of a record of a
refusal. Verified by mutation: making replay derive effects from production events surfaced
`['map.focus', 'root.shell']`.

### 3. Replay has no clock and no seam

`replayTrace` takes an envelope and optional migrators. There is no provider, resolver, committer, or
clock to inject, so "replay must not call a model" (Article VIII) and determinism (`NFR-002`) are
properties of the signature. `TEST-182` goes further and replaces `Date.now` with a *throwing*
function for the duration of a replay, so a path that read an ambient clock fails loudly rather than
drifting quietly.

## Evidence

| Gate | Result |
|---|---|
| 1 `check:corpus` | PASS — 176/176 hashes; corpus validator PASS |
| 2 `check:constitution` | PASS |
| 3 `check:ids` | PASS — five live specs each cover their declared range exactly |
| 4 `check:workspaces` | PASS |
| 5 `check:boundaries` | PASS — trace depends only on runtime; no provider edge exists, which is what makes "no model access" structural |
| 6 `typecheck` | PASS |
| 7 `test` | PASS — 277 tests (30 leakage canary, 20 replay, 17 migrators, 8 ordering, plus earlier features and the guard) |

**Negative tests performed and restored:**

- Removing the channel check in `emitPublic`/`emitProduction` → 14 `TEST-181` failures, one per type
  per direction.
- Making replay derive effects from production events → 4 `TEST-182` failures, including
  `['map.focus', 'root.shell']`.

One mutation was a **no-op and I discarded it**: merging the two arrays inside `replayTrace` changed
nothing, because `effectOf` only recognises a public event type and the envelope parser guarantees
the arrays are already separated. The mutation had to target the thing that would actually violate
the property — deriving effects from production types — not merely reading the other array. A
mutation that cannot fail is not evidence, and reporting one as evidence would be worse than
reporting none.

## Two things the tests found about my own fixtures

1. **A migrator's added field is dropped.** `upgrade` re-validates the migrated record through the
   envelope parser, and the schema permits only its declared fields — so a migrator cannot invent an
   extension point. The behaviour is correct; my fixture (a migrator whose job was to add a field,
   asserted to survive) was wrong. Renamed to `bumpVersion`, with a dedicated test asserting the
   drop.
2. **The typed emit methods reject unknown event types**, so extended vocabularies route through
   `emit()`. Core types get compile-time channel checking; extended types, defined in packages this
   one cannot see, get the same check at runtime through the map. An honest statement of a real
   trade-off, now in the README rather than left implicit.

My own `check:ids` gate also caught the FEAT-005 spec citing `TEST-229` and `TEST-215` — FEAT-018's
and FEAT-014's secret canaries — in explanatory prose. A spec's test references should stay in its
own slice, so the prose was reworded rather than the rule relaxed.

## Deferred

- **`U-005` remains a maintainer policy decision**, and is now the release gate the spec names. The
  mechanism is here — explicit migrators, refusal by default — but nothing is migratable until
  someone registers a migrator. Deciding how many historical versions must keep working is a
  compatibility promise, and inventing it would be deciding policy through implementation.
- **Secret redaction inside production payloads is out of scope**, stated rather than assumed:
  keeping a secret off the *public* channel is this feature's obligation; keeping it out of the
  *production* channel belongs to the features owning those payloads (`FEAT-018`, `FEAT-014`).
- **Recording is synchronous.** A listener that throws would propagate into the emitter. Fine for
  in-process observers; if a future host needs isolation, it should wrap its own listener rather than
  have this package guess at an error policy.
- **No envelope compaction or size bound.** Not evidenced, not invented.

## Next step

**FEAT-006 · Readiness & Synchronization** (`packages/readiness`,
[#15](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/15), `FR-199..FR-203`, `T-045..T-048`,
`TEST-185..187`). It is the smallest feature in the corpus by surface count — one surface,
`SURF-142 gate.waited` — and the largest by risk, because its failure mode is a deadlock or a stale
resume rather than a wrong value.

Two things to carry forward:

1. **Build the injectable clock first.** `TEST-185` (fake-clock timeout) and `TEST-186` (generation
   invalidation race with late settle callbacks) are both unusable without one, and a readiness test
   that `sleep`s is a flaky test wearing a passing badge. This package already has the pattern:
   `packages/trace/test/helpers.ts` has a `fakeClock` and a `POISONED_CLOCK`.
2. **`gate.waited` is already routable.** FEAT-005's channel map takes it as `production` via
   `extend`, and `TEST-184` already records it interleaved with narration and effects. FEAT-006
   supplies the gate; the trace side needs no change, which was the point of the extendable map.
   Registering the same type again on the same channel is idempotent, so composing the two is safe.

`INV-007` — a stale generation cannot resume interrupted work — is the invariant to build the tests
around first. `TEST-186` is the whole feature in one assertion, and it is the one that will fail if
generation stamping is added late.

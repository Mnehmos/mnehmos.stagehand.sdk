# FEAT-004 · Compound Choreography & Beat IR

Live specification. Owner: `packages/core` + `packages/authoring`. Tier T0, complexity high,
preservation posture `yes`. Corpus seed: `docs/corpus/specs/006-compound-choreography/`. Issue
[#13](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/13), milestone
[#4](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/4).

Requirement identities are v2 (`FR-187..FR-192`). Corpus evidence is cited by surface and contract
identity (`SURF-###`, `CTR-###`), never by superseded Pass-9 requirement numbers.

## 1. Intent

Let authors express **atomic, ordered, parallel, and intent-bearing groups** as a stable
choreography IR, rather than relying on accidental command adjacency — and make an atomic group mean
it: all of it commits, or none of it does.

`FEAT-001` already folds compounds while parsing, because nesting is required to know where `[end]`
points. This feature is what turns that folded structure into something executable with a group
semantic, scheduler metadata, an author-facing beat object, and a lifecycle in the trace.

## 2. User Scenarios

1. **An atomic group that half-fails.** An author writes `[batch atomic][map.focus id=a][evil.run
   x=1][/batch]`. The unregistered action rejects the **whole group**: the host is never contacted,
   not even for the command that was fine.
2. **A sequence with pacing.** `[sequence pause=250][a][b][end]` carries its order and its pause as
   *data*, so a scheduler can act on it without the IR having read a clock or set a timer.
3. **A beat, authored and reported.** `[beat id=b1 intent=draw]Narration[whiteboard.text id=t][end]`
   becomes an agent-facing object with `beat_id`, `narration`, `visual_intent`, and ordered steps.
4. **An export moment.** `[mark.clip label=chapter-1]` marks a point a host can cut at, validated
   like any other capability rather than special-cased.
5. **Nested compounds.** `[sequence][parallel][a][b][end][end]` folds to one sequence whose commands
   are `[a, b]` — and this feature declares that flattening rather than pretending otherwise (see
   FR-188).

## 3. Functional Requirements

- **FR-187 · Choreography IR.** The SDK MUST expose a choreography node model over the parser's
  compound kinds — `batch`, `sequence`, `parallel`, `beat` — in which each node carries a **stable,
  deterministic identity derived from its position** (never a clock, a counter, or randomness), its
  ordered command list, its raw source, and the metadata its kind declares: `mode` for batch,
  `pauseMs` for sequence, and identity/intent/narration for beat. Two compilations of the same
  segments MUST produce identical ids.
  → SURF-164 → CTR-125 · ENT-004 · NFR-006

- **FR-188 · Group structure, and the limit of it.** Compilation MUST preserve each top-level
  group's boundary, kind, command order, and declared metadata. It MUST **not** claim to reconstruct
  intra-group nesting: the recovered segment model promotes a nested compound's commands into its
  parent's command list (`ENT-004`), so `[sequence][parallel][a][b][end][end]` yields one sequence
  whose commands are `[a, b]` and the `parallel` boundary is gone. This MUST be declared in the IR's
  documentation and pinned by a golden, because a consumer that assumes otherwise will build a
  scheduler on a boundary that was never there. Unmatched openers MUST remain visible as commands
  rather than being swallowed (`CTR-125`).
  → SURF-164 → CTR-125 · ENT-004

- **FR-189 · `mark.clip`.** The core vocabulary MUST include the `mark.clip` protocol command,
  describing an export moment, registered with a schema like every other capability so it validates,
  resolves, and commits through the normal pipeline. It MUST NOT be special-cased in the executor: a
  command with a privileged path is a command outside the trust boundary.
  → SURF-029 → CTR-029

- **FR-190 · Atomic group execution.** An `atomic` group MUST validate **every** command before any
  is committed. A rejection anywhere — unknown action, schema violation, unresolved reference,
  failing compiler pass — MUST reject the whole group with **zero** host contact, not merely zero
  committed effects. A successful group MUST commit through **one** committer call carrying every
  effect from every command, because a group that commits per-command is not atomic regardless of how
  its rejections behave. A non-atomic (`best_effort`) group MAY commit the commands that pass.
  → CTR-106 integration · NFR-001 · INV-004

- **FR-191 · Scheduler metadata, not scheduling.** The IR MUST express ordering and concurrency as
  data: a sequence is an ordered list with an optional pause, a parallel group is a set, and a batch
  carries its mode. The package MUST NOT read a clock, schedule a timer, or order anything by wall
  time. Turning the metadata into actual pacing is a host concern (`FEAT-006` supplies the bounded
  wait a host would use), and keeping that out of the IR is what makes compilation deterministic.
  → ENT-004 · NFR-006

- **FR-192 · Beat object and beat lifecycle.** A beat node MUST convert to the agent-facing object
  the corpus records — `beat_id`, `narration`, `visual_intent`, `stagehand_sequence.steps` — with
  steps in source order and no field invented beyond those four. Executing a beat MUST report
  `beat.started` and `beat.completed` at the group's boundaries, in that order, as **public** events:
  a beat is the unit a viewer perceives, so its boundaries are user-visible lifecycle rather than
  diagnostics. Reporting MUST go through an injected observer, and core MUST NOT depend on the trace
  package to emit it.
  → SURF-128, SURF-129, SURF-165 · ENT-005 · Constitution VII

## 4. Key Entities

`ENT-004` (Compound segment) and `ENT-005` (Beat) — canonical definitions in
`docs/corpus/analysis/18_STATE_MODEL.md`.

`ENT-004` records both the nesting *and* its loss, and the loss is load-bearing for this feature:

> VC nesting means compounds form a tree during parsing even though current segment types flatten
> child compounds to command arrays.

`ENT-005` records the beat as an object Clio built deliberately, with `WHY + WHAT + HOW` — which is
why the agent object keeps `visual_intent` and `narration` alongside the steps rather than reducing a
beat to a command list.

## 5. Surface Bindings

| Surface | Requirement | Contract | Corpus evidence |
|---|---|---|---|
| SURF-029 `mark.clip` | FR-189 | CTR-029 | `Mnehmos/clio@03b1e1f:src/stagehand/types.ts` |
| SURF-128 `beat.started` | FR-192 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-129 `beat.completed` | FR-192 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |
| SURF-164 `Compound blocks` | FR-187, FR-188, FR-191 | CTR-125 | `analysis/13_SURFACE_INVENTORY.md#surf-164` |
| SURF-165 `Beat agent object` | FR-192 | — | `analysis/13_SURFACE_INVENTORY.md#surf-165` |

All 5 owned surfaces are bound. `CTR-125` carries no surface row
(`docs/corpus/00_TRACEABILITY.md` lists it under "extra API contracts without direct SURF rows") and
is bound by FR-187 and FR-188.

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| `[batch atomic]` with every command valid | One commit call carrying every effect. |
| `[batch atomic]` with one command invalid | Whole group rejected; committer never called; production diagnostic. |
| `[batch atomic]` with one unresolved reference | Whole group rejected; committer never called. |
| `[batch best_effort]` with one command invalid | Valid commands commit; the invalid one is diagnosed. |
| `[sequence]` with two commands | Ordered command list plus `pauseMs` when declared; no timer scheduled. |
| `[parallel]` with two commands | Both listed; the IR does not order them. |
| `[beat]` with narration and commands | Agent object with the four recorded fields; `beat.started` then `beat.completed`. |
| Nested compounds | Outer group preserved; inner boundary flattened into the command list (FR-188). |
| Unmatched opener | Remains a visible command (FEAT-001 guarantees this; asserted here too). |
| No observer configured | Execution identical; nothing reported. |

## 7. Error Catalog

This feature adds no new `E_*` codes. A group rejection reports the errors of the commands that
failed, each retaining its own code — a group does not have a failure mode of its own, it has the
union of its members'.

## 8. State Transitions

`validated → committed + public trace` for a group, or `rejected + production diagnostic` for the
whole group. Group execution sits **on** the trust boundary rather than beside it: it validates
through `FEAT-002`, compiles and resolves through `FEAT-003`, and only then commits.

## 9. Non-Functional Envelope

- **NFR-006, nested compound behavior is deterministic.** Asserted by identical node ids across
  compilations and by the absence of any clock or timer read in the package.
- **NFR-001, no raw-stream public leakage.** A rejected group is a production diagnostic; only
  `beat.started`/`beat.completed` are public, and only for a group that executed.

## 10. Divergence Register

None beyond global constitution rules. `CTR-125`'s "unmatched structures degrade to
visible/rejectable commands" is implemented by `FEAT-001` (`DIV-010` tightened it further) and
asserted here rather than reimplemented.

## 11. Parity Exits

- **TEST-177** — Nested compound parser goldens.
- **TEST-178** — Atomic rejection with a mutation-counting fake host.
- **TEST-179** — Sequence/parallel timing metadata independent of wall clock.
- **TEST-180** — Beat round-trip to the agent-facing Beat object.

## 12. Tasks

- **T-035** Compound AST + parser folding · **T-036** Atomic compound validator ·
  **T-037** Sequence/parallel scheduler metadata · **T-038** Beat object/report helpers ·
  **T-039** Compound adversarial tests

## 13. Success Criteria

1. An atomic group with one invalid command produces **zero committer calls** — not zero effects —
  asserted per rejection kind, because "asked the host and it declined" and "never asked" are
  different claims.
2. A successful atomic group commits exactly once, with every effect in that one call.
3. Node identities are identical across repeated compilations of the same input, and no clock or
  timer is reachable from the package.
4. A beat's agent object carries exactly the four recorded fields, and executing it reports the two
  lifecycle events in order.
5. `pnpm check` is green.

## 14. Open Questions

One deliberate limitation, recorded rather than deferred: **intra-compound group boundaries do not
survive parsing** (FR-188). Reconstructing them would mean either a second parser in this package or
a tree-preserving output added to `FEAT-001`, and neither is justified by corpus evidence — `ENT-004`
records the flattening as the recovered semantics. The limitation is declared, documented, and pinned
by a golden so a consumer cannot be surprised by it. If a later feature needs scheduler control
*inside* a compound, extending `FEAT-001`'s fold to retain child nodes is the natural change, and
this specification is where that need should be recorded first.

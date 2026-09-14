# FEAT-003 · Effect Compilation, Resolution & Safe Execution

Live specification. Owner: `packages/runtime`. Tier T0, complexity high, preservation posture
`yes`. Corpus seed: `docs/corpus/specs/003-effect-runtime/`. Issue
[#12](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/12), milestone
[#3](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/3).

Requirement identities are v2 (`FR-181..FR-186`). Corpus evidence is cited by surface and contract
identity (`SURF-###`, `CTR-###`), never by superseded Pass-9 requirement numbers.

## 1. Intent

Turn a validated producer command into a canonical effect, resolve its semantic references against
an injected registry, and commit it through an injected host adapter — committing **only** what the
whole pipeline authorized, and emitting a deterministic outcome either way.

This is the last stage of the trust chain and the only one that touches host state. Everything
before it classifies; this feature is where a classification becomes a mutation. The governing
property is therefore not "executes correctly" but **"a command that failed any earlier stage
produces zero host mutations"** (`TEST-174`).

## 2. User Scenarios

1. **Semantic reference.** A producer emits `map.focus id=venice`. The runtime recognises `id` as an
   entity reference from the registry's schema, resolves `venice` to a concrete target with its
   centre and bounds, and commits one effect.
2. **Unresolvable reference.** The producer names a place the resolver does not know. No effect is
   committed, and the failure is reported on the production channel — never as a public state change.
3. **Rejected command.** The registry rejects the command. The host adapter is never called; a
   mutation-counting adapter observes zero mutations.
4. **Semantic to primitive.** A producer emits a semantic command the plugin compiles into primitive
   commands. One command becomes several primitive effects, committed as one unit.
5. **Compiler pass failure.** A pass refuses the command. No effect is committed, even if an earlier
   pass had already produced output — compilation is not a partial write.

## 3. Functional Requirements

- **FR-181 · Canonical IR and the injected seams.** The runtime MUST expose a canonical command type
  (the validated command plus its resolved references), a canonical effect type carrying
  `plugin`, `action`, `payload`, and an optional `correlationId`, and the three seams through which a
  host participates without core depending on it: an entity resolver, an effect committer
  (which declares the plugin it serves), and command compiler passes. Core MUST define these as
  interfaces only — no implementation may reference a renderer, map, model provider, or domain
  (DIV-007).
  → SURF-111, SURF-116 → CTR-114, CTR-119 · ENT-001, ENT-010 · NFR-004

- **FR-182 · Semantic reference resolution.** The runtime MUST identify semantic references from the
  registry's declared `entityRef` and `entityRefList` value types rather than from a per-action list,
  resolve each through the injected resolver, and augment the command with the concrete target
  (at minimum an id, and centre/bounds when the resolver supplies them) while preserving the
  producer's original reference text. A reference that does not resolve MUST NOT be committed.
  → SURF-102 → CTR-107 · ENT-009 · INV-008

- **FR-183 · Resolution modes.** `EntityResolutionMode` MUST offer `strict` and `propose-stub`.
  Under `strict`, an unresolved reference is terminal. Under `propose-stub`, the runtime MUST
  additionally offer a stub proposal describing the unknown reference for the owning plugin to
  review — and MUST still not commit the effect. Neither mode may create a registry entity: a stub
  is a proposal, never an authorization.
  → SURF-115 → CTR-118 · Constitution IV

- **FR-184 · Compiler passes.** The runtime MUST run caller-supplied compiler passes in declared
  order over a validated command. A pass MUST be able to expand a semantic command into primitive
  commands, decline (leaving the command unchanged), or fail. A failing pass MUST be terminal for the
  command, and output produced by earlier passes MUST NOT be committed — compilation is all-or-
  nothing, like every other stage. With no passes supplied, the command commits as itself.
  → SURF-103 → CTR-106

- **FR-185 · Transactional execution.** `executeStagehandCommand` MUST run the stages in the order
  validate → compile → resolve → commit, and MUST call the committer **at most once**, only after
  every stage has succeeded, passing every primitive effect from the command as a single batch.
  Atomicity of the write is the adapter's contract; calling it once is the runtime's. A stage failure
  MUST short-circuit: no later stage runs, and the committer is never invoked. No clock, no
  randomness, and no retry may appear in this path.
  → SURF-103 → CTR-106 · NFR-001 · INV-004

- **FR-186 · Runtime events and channel routing.** The runtime MUST return typed outcomes with the
  correct trust channel: `scene_command` carrying the committed batch on the **public** channel, and
  `invalid_command` / `unresolved_refs` on the **production** channel, each carrying the offending
  command and the specific errors or references. Rejected-command diagnostics MUST NOT be emitted as
  public state.
  → SURF-146, SURF-147, SURF-150 · Constitution VII · NFR-001

## 4. Key Entities

`ENT-001` (StagehandCommand), `ENT-006` (ValidationResult), `ENT-009` (Capability/Entity Registry),
`ENT-010` (HostState — plugin-owned) — canonical definitions in
`docs/corpus/analysis/18_STATE_MODEL.md`.

Note the scope lines, both deliberate:

- **`ENT-009` split.** `FEAT-002` declares *that* a kwarg is a reference; this feature resolves it.
  Resolution is a separate phase because it needs host state, which core cannot hold.
- **`ENT-010` is not a type here.** There is no `HostState` interface in core. The host adapter is
  the `EffectCommitter`, whose only method receives already-authorized effects. Core never reads host
  state — it only asks the resolver questions.

## 5. Surface Bindings

| Surface | Requirement | Contract | Corpus evidence |
|---|---|---|---|
| SURF-102 `canonicalizeCommandEntityRefs` | FR-182 | CTR-107 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-103 `executeStagehandCommand` | FR-184, FR-185 | CTR-106 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-111 `CanonicalStagehandCommand` | FR-181 | CTR-114 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-113 `CanonicalizeCommandOptions` | FR-182, FR-183 | CTR-116 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-114 `CanonicalizeCommandResult` | FR-182, FR-183 | CTR-117 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-115 `EntityResolutionMode` | FR-183 | CTR-118 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-116 `ExecuteStagehandCommandOptions` | FR-181, FR-184 | CTR-119 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-146 `invalid_command` | FR-186 | — | `Mnehmos/clio@03b1e1f:src/stagehand/runtime.ts` |
| SURF-147 `unresolved_refs` | FR-186 | — | `Mnehmos/clio@03b1e1f:src/stagehand/runtime.ts` |
| SURF-150 `scene_command` | FR-186 | — | `Mnehmos/clio@03b1e1f:src/stagehand/runtime.ts` |

All 10 owned surfaces are bound.

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered command, all references resolve | One commit call; `scene_command` on the public channel. |
| Unknown/unregistered action | `invalid_command` on the production channel; zero committer calls. |
| Invalid reference or state | `unresolved_refs` on the production channel; zero committer calls; no partial commit. |
| Compiler pass declines | The command commits as itself. |
| Compiler pass fails | Terminal; zero committer calls, even if a prior pass produced output. |
| Committer throws | The error propagates; the runtime does not retry and does not re-commit. |
| No resolver supplied | Reference-carrying actions are rejected as unresolved rather than committed against a guessed target. |

## 7. Error Catalog

| Code | Where it surfaces |
|---|---|
| `E_UNKNOWN_ACTION`, `E_SCHEMA` | From `FEAT-002` validation, returned inside an `invalid_command` event. |
| `E_UNRESOLVED_REF` | This feature; returned inside an `unresolved_refs` event. |
| `E_STATE`, `E_TIMEOUT` | Contributed stages (this feature forwards them unchanged) and `FEAT-006` respectively. |

## 8. State Transitions

`proposal → parsed → validated → canonical/resolved → committed + public trace`, or
`rejected + production diagnostic`. This feature owns `validated → canonical/resolved → committed`.
It does not parse, does not validate, and does not build the trace envelope (`FEAT-005`).

## 9. Non-Functional Envelope

- **NFR-001, no raw-stream public leakage.** Rejections stay on the production channel.
- **NFR-004, zero concrete host dependencies in core.** Only interfaces are defined here.
- **Determinism.** No clock, no entropy, no counter. The same command with the same resolver and
  commits produces byte-identical events, so a trace replays (`FEAT-005`, `DIV-005`).

## 10. Divergence Register

- **DIV-007** — Keep core host- and provider-independent. This feature is where that is easiest to
  violate and hardest to notice: a single convenience import of a map or renderer type would cross
  the boundary invisibly. `check:boundaries` catches declared dependencies; the review standard is
  that core compiles against seams it *declared*, never against a host it *found*.

## 11. Parity Exits

- **TEST-174** — Rejected commands cause zero fake-host mutations.
- **TEST-175** — Semantic-command compiler parity against the v2→primitive mappings.
- **TEST-176** — Reference-resolution fuzzing for stale, missing, and ambiguous ids.

## 12. Tasks

- **T-030** Canonical command/effect types · **T-031** Resolver interface + canonicalizer ·
  **T-032** Plugin compiler-pass interface · **T-033** Transactional executor ·
  **T-034** Fake host + mutation-safety tests

## 13. Success Criteria

1. A mutation-counting fake host observes zero mutations for every rejection path — invalid action,
   schema violation, unresolved reference, failing compiler pass — asserted per path, not once.
2. The committer is called exactly once per successful command, with every expanded effect in one
   batch.
3. Semantic compilation produces byte-identical primitive effects across repeated runs and across
   pass registration order where the passes are independent.
4. `pnpm check` is green.

## 14. Open Questions

No blocking unknowns. Two scope decisions are recorded rather than deferred silently: `propose-stub`
offers a proposal and does **not** commit, because committing against a stub would be silent entity
creation (Constitution IV); and compiler-pass parity vectors in this feature exercise the mechanism
with fixture passes, because the real v2→primitive mappings belong to `FEAT-007`/`FEAT-008`, which
own the dialects being mapped.

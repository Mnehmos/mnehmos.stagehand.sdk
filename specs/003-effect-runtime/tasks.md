# Tasks — FEAT-003 Effect Compilation, Resolution & Safe Execution

Task identities are the canonical v2 slice `T-030..T-034` from
[issue #12](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/12). Generated task work
reconciles to these; no new task numbers are minted.

- [x] **T-030** Canonical command/effect types — FR-181
  - [x] `CanonicalStagehandCommand` — validated command plus resolved references
  - [x] `CanonicalEffect` — `plugin`, `action`, `payload`, optional `correlationId`
  - [x] `EntityResolver`, `EffectCommitter` (declares its plugin), `CommandCompilerPass` seams
  - [x] `ExecuteStagehandCommandOptions` carrying every seam
  - [x] No concrete host, renderer, provider, or domain type anywhere in core

- [x] **T-031** Resolver interface + canonicalizer — FR-182, FR-183
  - [x] Discover references from registry `entityRef` / `entityRefList` value types
  - [x] Preserve the producer's original reference text alongside the resolved target
  - [x] Augment with id, and centre/bounds when the resolver supplies them
  - [x] `strict` — unresolved reference is terminal
  - [x] `propose-stub` — offers a stub proposal for plugin review and still does not commit
  - [x] No resolver supplied ⇒ reference-carrying commands report unresolved, never a guess

- [x] **T-032** Plugin compiler-pass interface — FR-184
  - [x] Ordered passes; each may expand, decline, or fail
  - [x] Declining leaves the command unchanged and committable
  - [x] A failing pass is terminal and discards the whole compilation
  - [x] Default behaviour with no passes: the command compiles as itself
  - [x] Pass output is a local accumulation, never a partial write

- [x] **T-033** Transactional executor — FR-185, FR-186
  - [x] Stage order validate → compile → resolve → commit
  - [x] Committer called at most once, after every stage succeeded, with one batch
  - [x] Stage failure short-circuits; no later stage runs and the committer is never called
  - [x] Committer errors propagate; no retry, no re-commit
  - [x] `scene_command` public; `invalid_command` and `unresolved_refs` production

- [x] **T-034** Fake host + mutation-safety tests — TEST-174, TEST-175, TEST-176
  - [x] Mutation-counting fake host built before the executor
  - [x] One zero-mutation assertion per rejection path, not one aggregate
  - [x] Compiler parity goldens for semantic → primitive expansion
  - [x] Resolution fuzz over stale, missing, and ambiguous ids

## Parity exits

| Exit | Covers | Evidence |
|---|---|---|
| TEST-174 | Rejected commands cause zero fake-host mutations | `packages/runtime/test/transactional.test.ts` |
| TEST-175 | Semantic-command compiler parity | `packages/runtime/test/compiler-parity.test.ts` |
| TEST-176 | Reference-resolution fuzzing | `packages/runtime/test/resolution-fuzz.test.ts` |

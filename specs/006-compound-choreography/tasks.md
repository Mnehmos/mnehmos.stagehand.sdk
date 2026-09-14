# Tasks — FEAT-004 Compound Choreography & Beat IR

Task identities are the canonical v2 slice `T-035..T-039` from
[issue #13](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/13). Generated task work
reconciles to these; no new task numbers are minted.

- [x] **T-035** Compound AST + parser folding — FR-187, FR-188
  - [x] Node model over `batch` / `sequence` / `parallel` / `beat`
  - [x] Positional node identity: deterministic, no counter, clock, or randomness
  - [x] Group boundary, kind, command order, and declared metadata preserved
  - [x] Intra-group flattening declared in the type documentation and pinned by a golden
  - [x] Unmatched openers remain visible commands rather than being swallowed

- [x] **T-036** Atomic compound validator — FR-190
  - [x] Every command validated before any is committed
  - [x] A rejection anywhere rejects the whole group with zero committer calls
  - [x] A successful group commits once, with every effect in that one call
  - [x] `best_effort` mode commits the commands that pass
  - [x] No second validation path: the runtime's stages are called, not reimplemented

- [x] **T-037** Sequence/parallel scheduler metadata — FR-191
  - [x] Sequence order and optional `pauseMs` expressed as data
  - [x] Parallel membership expressed as a set the IR does not order
  - [x] Batch `mode` carried through
  - [x] No clock read and no timer scheduled anywhere in the package

- [x] **T-038** Beat object/report helpers — FR-192
  - [x] `beat_id`, `narration`, `visual_intent`, `stagehand_sequence.steps` — and nothing invented beyond them
  - [x] Steps in source order
  - [x] Round trip back to a beat node for the fields the object carries
  - [x] `beat.started` then `beat.completed`, reported through an injected observer

- [x] **T-039** Compound adversarial tests — TEST-177..TEST-180
  - [x] Goldens for nested compounds, declaring the flattening rather than hiding it
  - [x] Atomic rejection per failure kind, counted by a mutation-counting fake host (TEST-178)
  - [x] Metadata determinism with no wall-clock dependence (TEST-179)
  - [x] Beat round trip, including a beat with no commands and a beat with narration only (TEST-180)

## Parity exits

| Exit | Covers | Evidence |
|---|---|---|
| TEST-177 | Nested compound parser goldens | `packages/core/test/nesting-goldens.test.ts` |
| TEST-178 | Atomic rejection with a mutation-counting fake host | `packages/core/test/atomic-group.test.ts` |
| TEST-179 | Sequence/parallel timing metadata independent of wall clock | `packages/core/test/scheduler-metadata.test.ts` |
| TEST-180 | Beat round-trip to the agent-facing Beat object | `packages/authoring/test/beat-object.test.ts` |

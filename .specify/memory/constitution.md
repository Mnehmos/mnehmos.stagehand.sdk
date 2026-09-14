<!--
  Stagehand SDK Constitution - Spec Kit constitution record.

  The verbatim region below is the frozen Pass 0-12 reconstruction constitution. It is
  generated, not authored: run `node tools/constitution.mjs --write` to re-seed it.
  Do not hand-edit inside the VERBATIM markers.

  Source: docs/corpus/00_CONSTITUTION.md
  Source SHA-256: a76b157ea1e3f6c9f3baa99b8816caa5ceddf159bfd1a0a3aae00e65379090d1
-->
<!-- BEGIN VERBATIM: docs/corpus/00_CONSTITUTION.md -->
# Stagehand Rebuild Constitution

## I. Trust Boundary First
Raw producer/model output is never a public effect. All control passes parse → registry validation → plugin/state validation → resolution → canonical effect compilation → authorized commit → trace. Rejection is terminal for the command or atomic group.

## II. One Registry, One Truth
Command validation, producer introspection, authoring help, and machine-readable schemas are generated from the same capability registry. Parallel hand-maintained vocabularies are forbidden (`FIND-011`, `DIV-006`).

## III. Core Is Headless and Model-Agnostic
`core`, `parser`, `registry`, `runtime`, `trace`, and `readiness` may not depend on model providers, renderers, maps, Three.js, chess, DOM, classroom state, TTS, or media providers (`DIV-007`, `DIV-009`).

## IV. Deterministic IR Over Host Commands
Producer dialects compile into canonical effects. Semantic references resolve through plugin registries; model-invented coordinates/object pointers are rejected unless a plugin explicitly authorizes them. The stable abstraction is the effect IR, not any one source app's command implementation.

## V. Parser Safety Is Security
Batch and streaming semantics converge. Compounds nest. Apostrophes and backslashes/LaTeX are preserved. Missing brackets may be lexically recovered or quarantined, but control-shaped text must never become narration. Semantic repair is disabled by default (`DIV-003`, `DIV-004`).

## VI. Bounded Synchronization
Every readiness wait has a deadline and cancellation generation. Interrupted work cannot resume from a stale generation. Timing/readiness behavior must be traceable.

## VII. Public and Production Channels Are Different Contracts
User-visible lifecycle/effect events and production diagnostics use separate typed channels. Provider request/response details, rejected command diagnostics, and parser internals are never emitted as public state by default.

## VIII. Replay Is Versioned
Trace envelopes include protocol version, schema-set version, plugin versions, host adapter version, and optional asset-manifest hash. Compatibility requires explicit migrators (`DIV-005`); replay must not call a model.

## IX. Plugins Own Domains
Geo, classroom, chess, whiteboard, and DOM presenter state belongs to plugins. Shared reusable capabilities are built once rather than copied between hosts. Host configuration remains host-owned.

## X. Evidence and Traceability Survive Implementation
Every implementation task maps FEAT → FR → SURF/CTR → TEST. IDs are permanent. A change that alters recovered behavior either preserves the governing test or introduces an explicit DIV with rationale and parity note.

## XI. FOSS Release Requires Provenance Closure
No compatibility/plugin code derived from sources with unresolved project licensing is released until U-002/U-003 are resolved. The new SDK receives an explicit software license and provenance notice before public release.

## XII. Forbidden Patterns
Forbidden: raw-model-to-renderer mutation; duplicated schema registries; unbounded readiness waits; hidden semantic repairs; silent unresolved-reference fallback; host dependencies in core; unversioned replay; swallowed validation errors; source-app copy/paste as architecture.
<!-- END VERBATIM: docs/corpus/00_CONSTITUTION.md -->

## Governance

This constitution is the Spec Kit constitution record for the Stagehand SDK rebuild. Its
articles are the frozen reconstruction corpus constitution, installed verbatim above.

**Authority.** The twelve articles supersede ad-hoc practice. Where this document and any
other repository artifact disagree, this document wins. The stable-ID obligations in
Article X and the dependency obligations in Article III are enforced by repository
validators rather than by review attention alone:

- `pnpm check` runs every repository gate in one command.
- `pnpm check:constitution` re-verifies that the verbatim region above still matches
  `docs/corpus/00_CONSTITUTION.md` byte for byte.
- `pnpm check:ids` enforces the canonical ID ledger and the ban on reusing superseded IDs.
- `pnpm check:boundaries` enforces Article III's headless-core dependency closure.

**Amendment.** Editing the verbatim region in place is forbidden; `pnpm check:constitution`
will fail. An amendment is a corpus change: the corpus record is revised (a new pass or an
accepted entry in `docs/corpus/33_DIVERGENCE_REGISTER.md`), then this file is re-seeded with
`node tools/constitution.mjs --write`, and the version below is bumped. Amendments that
change recovered behavior must carry an explicit `DIV-###` with rationale and a parity note,
per Article X.

**Versioning.** MAJOR for a removed or redefined article, MINOR for a new article or a
materially widened obligation, PATCH for clarifications that do not change obligations.

**Version**: 1.0.0 | **Ratified**: 2026-09-13 | **Last Amended**: 2026-09-13

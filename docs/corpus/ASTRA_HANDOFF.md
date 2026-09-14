# Astra Handoff — Stagehand SDK, Reconstruction Complete

## Mission

Implement a standalone Stagehand SDK from the recovered behavior contract. Do **not** copy Clio wholesale. Treat Clio and Virtual Classroom as host implementations/conformance fixtures from which a cleaner protocol kernel is extracted.

## Product definition

**Stagehand is a headless, model-agnostic mixed-stream compiler/runtime that turns untrusted narration-plus-control into validated, traceable, synchronized host effects.**

The application owns what an effect means. Stagehand owns whether the proposal is parsed, registered, validated, resolved, authorized, committed, synchronized, traced, and replayable.

## Required package shape

```text
packages/
  core
  parser
  registry
  runtime
  trace
  readiness
  authoring
plugins/
  chess
  clio-geo
  classroom
  dom-presenter
```

## Non-negotiable contracts

1. `StagehandCommand = { action, args, kwargs, raw }` at the raw command boundary.
2. Mixed narration/control stream becomes typed segments before execution.
3. Registry/schema is authoritative; no action may exist only in a union or a parallel catalog.
4. Unknown action fails closed.
5. Batch/sequence/parallel/beat are explicit IR nodes and may nest.
6. `[end]` closes the innermost compound; explicit closers remain accepted for compatibility.
7. Unterminated quotes are hard syntax errors.
8. Apostrophes and LaTeX backslashes survive normally.
9. Bracket loss must never expose control syntax as narration.
10. Generic runtime supports layered validators supplied by plugins.
11. No partial public effect from a rejected atomic group.
12. Public effects and private production diagnostics are separate channels.
13. Readiness waits are keyed, deadline-bounded, and generation-invalidated on interruption/reset.
14. Trace envelope is versioned by protocol + schema/plugin set + host adapter, with optional asset-manifest hash.
15. Lexical repair can be default-on; semantic inference/repair is opt-in.
16. Producer dialect commands may compile into a smaller canonical effect IR.
17. Host state such as globe, board, lesson, projector, chess position, or DOM article remains plugin-owned.

## Known upstream defects — do not reproduce accidentally

- Clio `claim.show`: declared but not schema-backed. Exclude until specified.
- Clio `map.timecursor`: docs/prose allow omitted `at` for live, schema/introspection require `at`. Choose an explicit canonical representation.
- Clio had parallel `COMMAND_SCHEMAS` / `TOOL_REGISTRY` drift. Generate both authoring affordances and runtime acceptance from one registry.

## Parser baseline

Use the hardened Virtual Classroom semantics as the generic target where they repair Clio's parser rather than express classroom policy:

- nested compounds;
- `[end]`;
- safe quote-position rules;
- whitespace-around-`=` handling;
- schema-aware multi-word recovery;
- command-shaped narration suppression;
- batch and streaming parity.

## Conformance seed

Import the 21 vectors in `conformance_results.json` as the first package tests. Preserve their intent even if implementation APIs change.

## Definition of done for SDK v0.1

- all Pass 7 golden/adversarial vectors pass in batch and streaming modes;
- all four host plugins can register commands without modifying core parser/runtime;
- schema introspection is generated from the validation registry;
- versioned trace replays committed effects deterministically with a mock host;
- readiness timeout/interruption tests pass;
- `claim.show` and `map.timecursor` decisions are explicit ADRs;
- no host-specific state type is imported by core packages;
- software license and provenance policy are explicit before public release.

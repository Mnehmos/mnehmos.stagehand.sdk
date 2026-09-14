# PROJECT_CONTEXT

## What this is

A standalone, FOSS SDK for the **Stagehand protocol family**, extracted from four Mnehmos host
applications (Clio, Virtual Classroom, LLM-Chess, VCB). It is not a copy of any of them: the
recovered behavior was reconstructed into a specification corpus, and this repository is the
implementation of that corpus.

**Canonical thesis:** Stagehand is a headless, model-agnostic mixed-stream compiler/runtime that
turns untrusted narration-plus-control into validated, traceable, synchronized host effects.

## Who it is for

- **Host application authors** who receive model output that mixes prose with inline control
  syntax and need to execute the control without trusting it.
- **Plugin authors** who own a domain (a map, a classroom, a whiteboard, a DOM article, a chess
  board) and need a stable contract for how narration drives it.
- **Integrators** who must be able to *audit and replay* what a model made the system do.

## The two constraints that must never be violated

These are the load-bearing walls. Everything else in the constitution elaborates them.

1. **Raw producer output is never a public effect.** Nothing reaches a host renderer, domain
   state, or user-visible surface without passing parse → registry validation → plugin/state
   validation → resolution → canonical effect compilation → authorized commit → trace
   (Constitution I). Rejection is terminal for the command or the atomic group.
2. **One registry is the only vocabulary.** Command validation, producer introspection, authoring
   help, and machine-readable schemas are all generated from the same capability registry.
   A second hand-maintained command list is forbidden (Constitution II).

A third, easy to violate accidentally: **core is headless** — `core`, `parser`, `registry`,
`runtime`, `trace`, and `readiness` may not depend on renderers, maps, model providers, TTS,
media, DOM, or domain state (Constitution III). This one is enforced by a gate, because
"remember not to import three.js" is a hope and a failing check is a fact.

## Repository map

| Path | What lives there |
|---|---|
| `docs/corpus/` | **Frozen** Pass 0–12 reconstruction corpus. Hash-manifested. Never edited here. |
| `docs/governance/` | Live governance: v2 ID ledger, workspace and boundary declarations. |
| `specs/` | Live Spec Kit feature specs. Created per feature in v2 ID space. |
| `packages/` | Headless core: `core`, `parser`, `registry`, `runtime`, `trace`, `readiness`, `authoring`. |
| `packages/compatibility/` | Dialect compatibility producers (LLM-Chess). |
| `plugins/` | Domain plugins: `whiteboard`, `geo-clio`, `classroom`, `chess`, `dom-presenter`. |
| `examples/` | Host applications. Nothing may depend on these. |
| `tools/` | Deterministic validators. These are the gates, not helper scripts. |
| `tests/` | Unit tests. At M0 these test the guards themselves. |
| `.specify/` | Spec Kit: constitution, templates, scripts. |

## Status

**Milestones M0, M1 and M2 complete — seven of eighteen features converged.**

- The specification corpus is complete, imported verbatim, and hash-verified on every check.
- The v2 identity scheme (`FR-168..266`, `TEST-168..229`, `T-019..111`) is reserved and enforced.
- The monorepo skeleton exists and typechecks; every module exports nothing.
- The v2 requirement *statements* are not yet written. Authoring them is the job of each
  feature's `/speckit-specify` run. See `docs/governance/V2_ID_LEDGER.md`.

Feature implementation order and per-feature seeds are in
`docs/governance/SPEC_KIT_RUNBOOK.md`. Progress tracker:
[issue #1](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/1).

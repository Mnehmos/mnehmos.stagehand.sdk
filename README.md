# Mnehmos Stagehand SDK

**Stagehand is a headless, model-agnostic mixed-stream compiler/runtime that turns untrusted
narration-plus-control into validated, traceable, synchronized host effects.**

Language models produce prose with inline control syntax mixed into it. Stagehand is the layer that
separates the two, validates the control against a single capability registry, compiles it into a
canonical effect IR, commits only what is authorized, and records a replayable trace — without
knowing anything about your renderer, your map, your model provider, or your domain.

```text
untrusted stream → parse → registry validation → plugin/state validation
                 → reference resolution → canonical effect compilation
                 → authorized commit → trace
```

Raw producer output is never a public effect. Rejection is terminal for the command or the atomic
group.

## What it is for

- **Host authors** who receive model output and need to execute its control portion without
  trusting it.
- **Plugin authors** who own a domain surface — a map, a classroom, a whiteboard, a chess board, a
  DOM article — and want a stable contract for how narration drives it.
- **Integrators** who must audit and replay what a model made the system do, with no model call
  during replay.

## Status

**M0 — bootstrap and scaffolding. The specification corpus is complete; no feature behavior is
implemented.**

| | |
|---|---|
| Specification corpus | Complete, imported verbatim, hash-verified (167 live surfaces, 18 features, 167 requirements, 25 API contracts) |
| Constitution | Active (12 articles, seeded verbatim) |
| Identity scheme | v2 reserved and enforced (`FR-168..266`, `TEST-168..229`, `T-019..111`) |
| Workspaces | 14 (7 core, 1 compatibility, 5 plugins, 1 example); 8 implemented, all building to `dist/` |
| Gates | 9, all green |
| Features converged | 7 of 18 (FEAT-001..006) — milestones M0, M1, M2 closed |

Milestones and progress: [issue #1](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/1).

## Repository layout

| Path | Contents |
|---|---|
| `packages/` | Headless core: `core`, `parser`, `registry`, `runtime`, `trace`, `readiness`, `authoring` |
| `packages/compatibility/llm-chess` | LLM-Chess dialect compatibility producer |
| `plugins/` | `whiteboard`, `geo-clio`, `classroom`, `chess`, `dom-presenter` |
| `examples/virtual-classroom-host` | Reference host: model and TTS configuration stay here, not in core |
| `docs/corpus/` | Frozen Pass 0–12 reconstruction corpus (hash-manifested; never edited) |
| `docs/governance/` | v2 ID ledger, workspace and boundary declarations, this runbook |
| `specs/` | Live Spec Kit feature specs, authored in v2 ID space |
| `tools/` | The deterministic validators that constitute the gates |
| `.specify/` | Spec Kit constitution, templates, and scripts |

## Working on it

Requires Node ≥ 20.11 and pnpm 10.7. Python 3.12 is needed only for the corpus validator.

```bash
pnpm install
pnpm check          # the only definition of "green"
```

`pnpm check` runs nine gates: corpus integrity and consistency, constitution verbatim, v2 identity
ledger, workspace tree byte-equality, core-headless dependency closure, typecheck, build, package
export validation, and tests.

Then read `AGENTS.md` (operating model and boundaries), `PROJECT_CONTEXT.md` (what this is and the
constraints that must not bend), and `docs/governance/SPEC_KIT_RUNBOOK.md` (the per-feature
workflow).

### Generated files

`docs/governance/v2-ids.json`, `docs/governance/V2_ID_LEDGER.md`, `.specify/memory/constitution.md`,
and every workspace's `package.json`, `tsconfig.json`, `src/index.ts` and `README.md` are generated
from declarations in `docs/governance/`. Change the declaration, then `pnpm seed`.

## Provenance and licensing

The corpus in `docs/corpus/` was reconstructed from four Mnehmos host applications: Clio, Virtual
Classroom, LLM-Chess, and VCB. It is the *specification* of recovered behavior, not a copy of any
host's source.

Two provenance questions are unresolved and gate public distribution of source-derived
compatibility material — `U-002` (LLM-Chess root license) and `U-003` (Virtual Classroom root
license). Constitution Article XI blocks release of the affected packages until they are resolved.
See `docs/corpus/analysis/24_UNKNOWNS.md`.

This SDK is MIT licensed — see [LICENSE](LICENSE).

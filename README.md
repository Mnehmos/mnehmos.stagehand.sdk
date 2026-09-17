# Mnehmos Stagehand SDK

**A headless, model-agnostic protocol SDK that turns untrusted narration-plus-control output into validated, traceable, synchronized host effects.**

Language models produce prose with inline control syntax mixed into it. Stagehand separates the two, validates the control against a single capability registry, compiles it into a canonical effect IR, commits only what is authorized, and records a replayable trace — without knowing anything about your renderer, your map, your model provider, or your domain.

```text
untrusted stream → parse → registry validation → plugin/state validation
                 → reference resolution → canonical effect compilation
                 → authorized commit → trace
```

Raw producer output is never a public effect. Rejection is terminal for the command or the atomic group.

> **Naming note.** Browserbase publishes an unrelated SDK as `@browserbasehq/stagehand` and describes "Stagehand" as their trademark. This project uses the name internally but should adopt a distinct public identity (e.g. `@mnehmos/...`) before publishing to npm.

## Quickstart

```ts
import { createHost } from '@stagehand/core';
import { GeoClioPlugin } from '@stagehand/plugin-geo-clio';

const host = createHost({
  sessionId: 'lesson-1',
  plugins: [{
    name: 'geo',
    schemas: geoSchemas,
    committer: { plugin: 'geo', commit: (effects) => map.apply(effects) },
  }],
});

const results = host.process('Venice grew rich [map.focus id=venice] on trade.');
```

## Packages

| Package | Purpose | Tests |
|---|---|---|
| `@stagehand/parser` | Mixed-stream lexer/parser, batch + streaming | 45 |
| `@stagehand/registry` | Capability registry, validation, introspection | 100 |
| `@stagehand/runtime` | Effect compilation, resolution, transactional execution | 50 |
| `@stagehand/core` | Compound choreography, atomic groups, host facade | 55 |
| `@stagehand/trace` | Channel separation, versioned replay, migrators | 75 |
| `@stagehand/readiness` | Deadline-bounded, generation-stamped sync gates | 51 |
| `@stagehand/authoring` | Beat object round-trip, authoring helpers | — |
| `@stagehand/plugin-whiteboard` | Shared whiteboard canvas | 93 |
| `@stagehand/plugin-geo-clio` | Geospatial camera, annotation, layers, pieces | 14 |
| `@stagehand/plugin-classroom` | Avatar, room, projector, lesson | 11 |
| `@stagehand/plugin-chess` | Chess annotation compatibility | 3 |
| `@stagehand/plugin-dom-presenter` | Word-anchored DOM presentation | 6 |
| `@stagehand/example-virtual-classroom-host` | Reference host | — |

## The trust chain

Every stage is a separate package with a narrow responsibility:

```
parser       classifies (narration vs control, never authorizes)
registry     authorizes (one vocabulary for validation and introspection)
runtime      mutates (one commit seam, one mutation point)
trace        records (public and production channels are separate)
readiness    synchronizes (bounded waits, generation-stamped barge-in)
core         composes (atomic groups, beats, page semantics)
```

The properties a caller may rely on:

- **Control syntax never becomes narration.** Asserted per event type and per rejection path.
- **A rejected command produces zero host mutations.** The committer is called at most once, only after every stage succeeded.
- **Registry-layer contributions are terminal.** A plugin's cross-field rules run after the built-in registry rules and before entity resolution; a rejection there blocks later layers.
- **`content_ref` resolves through the host's content pack**, not the board. A miss yields empty content and still commits.
- **`resumable` ≠ `settled`.** A barge-in settles the readiness gate; a superseded turn must not resume.

## Status

Seven features (FEAT-001..006, FEAT-012) are converged with behavioral tests through the public validation/execution path. Eleven features (FEAT-007..011, FEAT-013..018) have schemas, committers, and basic behavioral tests in their owning plugins; their spec-to-source depth is thinner than the converged features and should be deepened before their milestone reviews.

## Known limitations

- **`U-002`/`U-003` licensing** — the LLM-Chess and Virtual Classroom source projects have no root LICENSE. Constitution Article XI gates distribution of source-derived compatibility material on resolution.
- **Build pipeline** — `pnpm build` emits `dist/` for all packages via project references, but the artifacts have not been tested for end-user consumption from a package manager.
- **Source-evidence depth** — FEAT-008..018 specs have identity declarations and basic behavioral coverage but their requirement text is thinner than FEAT-001..006's.

## Architecture decision: seven packages, not one

The seven core packages are not excessive modularity — they are the trust chain expressed as module boundaries:

- `parser` classifies without authorizing
- `registry` authorizes without resolving
- `runtime` resolves and commits without recording
- `trace` records without rendering
- `readiness` synchronizes without committing
- `core` composes groups without knowing what a group means

Each boundary is enforced by `check:boundaries`, which rejects any dependency edge the feature graph does not imply. Collapsing them would produce a single package where the trust chain is enforced by convention instead of by construction.

## Working on it

Requires Node ≥ 20.11 and pnpm 10.7.

```bash
pnpm install
pnpm check          # the only definition of "green"
```

`pnpm check` runs nine gates: corpus integrity, constitution verbatim, v2 identity ledger, workspace byte-equality, core-headless dependency closure, typecheck, build, package-export validation, and tests.

## Repository layout

| Path | Contents |
|---|---|
| `packages/` | Headless core: `core`, `parser`, `registry`, `runtime`, `trace`, `readiness`, `authoring` |
| `packages/compatibility/llm-chess` | LLM-Chess dialect compatibility producer |
| `plugins/` | `whiteboard`, `geo-clio`, `classroom`, `chess`, `dom-presenter` |
| `examples/virtual-classroom-host` | Reference host |
| `docs/corpus/` | Frozen Pass 0–12 reconstruction corpus (hash-manifested) |
| `docs/evidence/` | Pinned-source evidence: wire contracts, behavior matrix |
| `docs/governance/` | v2 ID ledger, workspace and boundary declarations |
| `specs/` | Live Spec Kit feature specs |
| `tools/` | Deterministic validators that constitute the gates |

## Generated files

`docs/governance/v2-ids.json`, `docs/governance/V2_ID_LEDGER.md`, `.specify/memory/constitution.md`, and every workspace's `package.json`, `tsconfig.json`, `src/index.ts`, and `README.md` are generated from declarations in `docs/governance/`. Change the declaration, then `pnpm seed`.

## Provenance and licensing

The corpus in `docs/corpus/` was reconstructed from four Mnehmos host applications: Clio, Virtual Classroom, LLM-Chess, and VCB. It is the *specification* of recovered behavior, not a copy of any host's source.

Two provenance questions are unresolved and gate public distribution of source-derived compatibility material — `U-002` (LLM-Chess root license) and `U-003` (Virtual Classroom root license). Constitution Article XI blocks release of the affected packages until they are resolved.

This SDK is MIT licensed — see [LICENSE](LICENSE).

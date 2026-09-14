# 31 · Rebuild Plan

## Target package topology

```text
packages/core
packages/parser
packages/registry
packages/runtime
packages/trace
packages/readiness
packages/authoring
packages/compatibility/llm-chess
plugins/whiteboard
plugins/geo-clio
plugins/classroom
plugins/chess
plugins/dom-presenter
examples/
```

## Vertical milestones

| Milestone | Features | Thin vertical result |
|---|---|---|
| M1 · Parser trust kernel | FEAT-001 | Close control leakage, syntax, streaming/batch equivalence first. |
| M2 · Registry and validation | FEAT-002 | Single-source capability registry and fail-closed validation. |
| M3 · Effect runtime and trace | FEAT-003, FEAT-005 | Canonical effect compilation, ref resolution, public/private trace. |
| M4 · Readiness and choreography | FEAT-006, FEAT-004 | Bound async effects; then compound/beat semantics on top of stable runtime. |
| M5 · Reusable whiteboard reference plugin | FEAT-012 | First nontrivial plugin proves domain isolation and shared reuse. |
| M6 · Geo reference plugin | FEAT-007, FEAT-008, FEAT-009, FEAT-010, FEAT-011 | Camera → annotations → overlays → pieces/proposals → evidence presentation. |
| M7 · Classroom plugin | FEAT-013, FEAT-014, FEAT-015, FEAT-018 | Embodiment/media/lesson state on readiness+trace foundation; host config remains outside core. |
| M8 · Compatibility plugins | FEAT-016, FEAT-017 | Chess and word-anchored DOM presenter prove small-plugin ergonomics. |
| M9 · Parity and release convergence | cross-cutting | Run full parity matrix, divergence expectations, provenance/license gates, package/API review. |

## Rebuild tasks

- **T-001** — implement FEAT-001 Mixed-Stream Parsing & Syntax in `packages/parser`, satisfy 6 surface-bound requirements, and pass all feature TEST IDs.
- **T-002** — implement FEAT-002 Capability Registry, Validation & Introspection in `packages/registry`, satisfy 6 surface-bound requirements, and pass all feature TEST IDs.
- **T-003** — implement FEAT-003 Effect Compilation, Resolution & Safe Execution in `packages/runtime`, satisfy 10 surface-bound requirements, and pass all feature TEST IDs.
- **T-004** — implement FEAT-005 Trace, Replay & Diagnostics in `packages/trace`, satisfy 16 surface-bound requirements, and pass all feature TEST IDs.
- **T-005** — implement FEAT-006 Readiness & Synchronization in `packages/readiness`, satisfy 1 surface-bound requirements, and pass all feature TEST IDs.
- **T-006** — implement FEAT-004 Compound Choreography & Beat IR in `packages/core + packages/authoring`, satisfy 5 surface-bound requirements, and pass all feature TEST IDs.
- **T-007** — implement FEAT-012 Shared Whiteboard Canvas in `plugins/whiteboard`, satisfy 21 surface-bound requirements, and pass all feature TEST IDs.
- **T-008** — implement FEAT-007 Geospatial Camera & View Framing in `plugins/geo-clio`, satisfy 8 surface-bound requirements, and pass all feature TEST IDs.
- **T-009** — implement FEAT-008 Geospatial Highlighting & Annotation in `plugins/geo-clio`, satisfy 11 surface-bound requirements, and pass all feature TEST IDs.
- **T-010** — implement FEAT-009 Geospatial Layers, Flows & Temporal Overlays in `plugins/geo-clio`, satisfy 8 surface-bound requirements, and pass all feature TEST IDs.
- **T-011** — implement FEAT-010 World Pieces & Controlled Registry Proposals in `plugins/geo-clio`, satisfy 8 surface-bound requirements, and pass all feature TEST IDs.
- **T-012** — implement FEAT-011 Evidence, Sources & Scene Presentation in `plugins/geo-clio + packages/authoring`, satisfy 7 surface-bound requirements, and pass all feature TEST IDs.
- **T-013** — implement FEAT-013 Classroom Avatar, Room & Camera Staging in `plugins/classroom`, satisfy 10 surface-bound requirements, and pass all feature TEST IDs.
- **T-014** — implement FEAT-014 Classroom Projector & Media Orchestration in `plugins/classroom`, satisfy 16 surface-bound requirements, and pass all feature TEST IDs.
- **T-015** — implement FEAT-015 Lesson Interaction & Pedagogical State in `plugins/classroom`, satisfy 14 surface-bound requirements, and pass all feature TEST IDs.
- **T-016** — implement FEAT-016 Chess Annotation Compatibility in `plugins/chess + packages/compatibility/llm-chess`, satisfy 5 surface-bound requirements, and pass all feature TEST IDs.
- **T-017** — implement FEAT-017 Word-Anchored DOM Presenter Choreography in `plugins/dom-presenter`, satisfy 9 surface-bound requirements, and pass all feature TEST IDs.
- **T-018** — implement FEAT-018 Host Model & Narration Configuration in `examples/virtual-classroom-host`, satisfy 6 surface-bound requirements, and pass all feature TEST IDs.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| RISK-001 · Parser trust regression | critical | Golden + adversarial vectors; never release raw producer text before parse/quarantine. |
| RISK-002 · Schema/introspection drift | critical | Generate both from one registry and enforce equality in tests. |
| RISK-003 · Readiness deadlock/stale resume | critical | Deadline-bounded waits + generation invalidation tests. |
| RISK-004 · Core/plugin leakage | high | Dependency boundary test forbids renderer/provider/domain packages from core. |
| RISK-005 · Replay incompatibility | high | Versioned trace envelope + migrator registry before 1.0. |
| RISK-006 · Host contract ambiguity | high | DIV-002 and contract schemas resolve known ambiguities before implementation. |
| RISK-007 · License/provenance | release-blocking | Resolve U-002/U-003 before publishing affected compatibility/plugin code. |

## Deliberate divergences

See `33_DIVERGENCE_REGISTER.md`; all divergences are normative and must be reflected in parity expectations.

## Explicit v1 exclusions

- `SURF-027 claim.show` (dead/orphaned).
- LLM-Chess natural-language visual inference from trusted core (compatibility-only).
- Source-app-specific provider/export pipelines as core features.
- Any plugin whose source provenance is not cleared for public release.

## Gate 10 milestone coverage

- Every T0/T1 feature is assigned to M1–M7.
- T2 compatibility features are assigned to M8.
- T3 host config is included only with the classroom vertical slice and never promoted into core.

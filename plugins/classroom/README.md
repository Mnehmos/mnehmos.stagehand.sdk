# @stagehand/plugin-classroom

Embodied classroom staging, projector/media orchestration, and lesson state.

| | |
|---|---|
| Layer | `plugin` |
| Kind | `plugin` |
| Directory | `plugins/classroom` |
| Owner features | FEAT-013, FEAT-014, FEAT-015 |
| Internal dependencies | `@stagehand/plugin-whiteboard`, `@stagehand/readiness`, `@stagehand/runtime`, `@stagehand/trace` |
| Status | scaffolded (M0) — no behavior implemented |

## Requirements owned

| Feature | v2 requirements | v2 tasks | Parity exits |
|---|---|---|---|
| FEAT-013 Classroom Avatar, Room & Camera Staging | FR-235..FR-240 | T-080, T-081, T-082, T-083, T-084, T-085 | TEST-208, TEST-209, TEST-210, TEST-211 |
| FEAT-014 Classroom Projector & Media Orchestration | FR-241..FR-246 | T-086, T-087, T-088, T-089, T-090 | TEST-212, TEST-213, TEST-214, TEST-215 |
| FEAT-015 Lesson Interaction & Pedagogical State | FR-247..FR-253 | T-091, T-092, T-093, T-094, T-095, T-096 | TEST-216, TEST-217, TEST-218, TEST-219, TEST-220 |

## Corpus seed

- FEAT-013: `10` surfaces, `10` v1 requirements, `10` v1 tests — seed spec `docs/corpus/specs/`, issue [#22](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/22)
- FEAT-014: `16` surfaces, `16` v1 requirements, `16` v1 tests — seed spec `docs/corpus/specs/`, issue [#23](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/23)
- FEAT-015: `14` surfaces, `14` v1 requirements, `14` v1 tests — seed spec `docs/corpus/specs/`, issue [#24](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/24)

See [V2_ID_LEDGER.md](../../docs/governance/V2_ID_LEDGER.md) for the canonical identity allocation and
[SPEC_KIT_RUNBOOK.md](../../docs/governance/SPEC_KIT_RUNBOOK.md) for the per-feature workflow.

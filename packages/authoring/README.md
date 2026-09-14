# @stagehand/authoring

Author-facing helpers: capability introspection digests, receipt linting, and choreography authoring types.

| | |
|---|---|
| Layer | `core` |
| Kind | `package` |
| Directory | `packages/authoring` |
| Owner features | FEAT-004, FEAT-011 |
| Internal dependencies | `@stagehand/parser`, `@stagehand/registry`, `@stagehand/runtime`, `@stagehand/trace` |
| Status | scaffolded (M0) — no behavior implemented |

## Requirements owned

| Feature | v2 requirements | v2 tasks | Parity exits |
|---|---|---|---|
| FEAT-004 Compound Choreography & Beat IR | FR-187..FR-192 | T-035, T-036, T-037, T-038, T-039 | TEST-177, TEST-178, TEST-179, TEST-180 |
| FEAT-011 Evidence, Sources & Scene Presentation | FR-224..FR-227 | T-069, T-070, T-071, T-072, T-073 | TEST-200, TEST-201, TEST-202 |

## Corpus seed

- FEAT-004: `5` surfaces, `5` v1 requirements, `5` v1 tests — seed spec `docs/corpus/specs/`, issue [#13](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/13)
- FEAT-011: `7` surfaces, `7` v1 requirements, `7` v1 tests — seed spec `docs/corpus/specs/`, issue [#20](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/20)

See [V2_ID_LEDGER.md](../../docs/governance/V2_ID_LEDGER.md) for the canonical identity allocation and
[SPEC_KIT_RUNBOOK.md](../../docs/governance/SPEC_KIT_RUNBOOK.md) for the per-feature workflow.

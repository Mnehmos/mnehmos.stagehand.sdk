# @stagehand/authoring

Author-facing helpers: capability introspection digests, receipt linting, and choreography authoring types.

| | |
|---|---|
| Layer | `core` |
| Kind | `package` |
| Directory | `packages/authoring` |
| Owner features | FEAT-004, FEAT-011 |
| Internal dependencies | `@stagehand/parser`, `@stagehand/registry`, `@stagehand/runtime`, `@stagehand/trace` |
| Status | beat objects implemented (FEAT-004); FEAT-011 surfaces still scaffolded |

## Beat objects (FEAT-004)

```ts
import { toBeatObject, fromBeatObject, describeBeat } from '@stagehand/authoring';

const beat = toBeatObject(beatNode);
// { beat_id, narration, visual_intent, stagehand_sequence: { steps } }
```

The object carries **exactly** the four fields `ENT-005` records — `beat_id`, `narration`,
`visual_intent`, `stagehand_sequence.steps` — because "Clio intentionally added WHY + WHAT + HOW",
and that is the whole vocabulary. Field names keep their recovered `snake_case` spelling: this is an
agent-facing wire shape, not an internal one, and normalising it would break producers that already
emit it.

The round trip is lossy in exactly one respect and says so: an object carries no source text, so
`raw` is reconstructed visibly as `[action]` rather than passed off as the producer's original. Every
field the object *does* carry is restored, including the node id when you pass it, so a scheduler's
reference survives.

`toBeatObject` and `describeBeat` throw `NotABeatError` for a non-beat group rather than producing a
beat-shaped object that looks right and describes the wrong thing.

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

# @stagehand/runtime

Effect compilation, semantic reference resolution, and authorized commit through a host adapter.

| | |
|---|---|
| Layer | `core` |
| Kind | `package` |
| Directory | `packages/runtime` |
| Owner features | FEAT-003 |
| Internal dependencies | `@stagehand/parser`, `@stagehand/registry` |
| Status | implemented — FEAT-003 converged through T-030..T-034 |

## Usage

```ts
import { executeStagehandCommand } from '@stagehand/runtime';

const outcome = executeStagehandCommand(registry, command, {
  // The host adapter. It declares which plugin it serves, and its own write must be atomic.
  committer: { plugin: 'geo', commit: (effects) => scene.apply(effects) },
  // Where semantic references become concrete targets.
  resolver: geoRegistry,
  entityResolution: 'strict',       // or 'propose-stub'
  compilerPasses: [geoV2ToPrimitive],
});

if (outcome.committed) {
  // outcome.events holds one scene_command on the public channel
} else {
  // production channel: invalid_command, unresolved_refs, or compile_failed
  diagnostics.record(outcome.events);
}
```

## What this module guarantees

- **A command that failed any earlier stage produces zero host mutations.** Asserted once per
  rejection path — invalid action, schema violation, unresolved reference, failing pass, partial
  expansion — not once in aggregate.
- **The committer is called at most once, after every stage succeeded, with the whole batch.** A
  refused commit propagates unchanged: no retry, no re-commit, no swallowing.
- **References are discovered from the registry's declared value types**, so a capability that starts
  carrying a reference is handled with no change here.
- **Unresolvable is never guessed at**, in either resolution mode. `propose-stub` offers a proposal
  for the plugin to review and still does not commit — a stub is a proposal, never an authorization.
- **Core defines interfaces only.** No renderer, map, provider, or domain type appears here.

## What this module does *not* guarantee

Atomicity *inside* a commit. The adapter receives one batch and owns whether its own write lands
whole. Core cannot see host state, so claiming transactional safety over it would be a claim it
cannot check — `EffectCommitter`'s contract states the split plainly.

## Requirements owned

| Feature | v2 requirements | v2 tasks | Parity exits |
|---|---|---|---|
| FEAT-003 Effect Compilation, Resolution & Safe Execution | FR-181..FR-186 | T-030, T-031, T-032, T-033, T-034 | TEST-174, TEST-175, TEST-176 |

## Corpus seed

- FEAT-003: `10` surfaces, `10` v1 requirements, `10` v1 tests — seed spec `docs/corpus/specs/`, issue [#12](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/12)

See [V2_ID_LEDGER.md](../../docs/governance/V2_ID_LEDGER.md) for the canonical identity allocation and
[SPEC_KIT_RUNBOOK.md](../../docs/governance/SPEC_KIT_RUNBOOK.md) for the per-feature workflow.

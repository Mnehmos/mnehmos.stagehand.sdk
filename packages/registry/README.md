# @stagehand/registry

Single-source capability registry driving validation, introspection, and authoring help.

| | |
|---|---|
| Layer | `core` |
| Kind | `package` |
| Directory | `packages/registry` |
| Owner features | FEAT-002 |
| Internal dependencies | `@stagehand/parser` |
| Status | implemented — FEAT-002 converged through T-025..T-029 |

## Usage

```ts
import { CapabilityRegistry, validateCommand } from '@stagehand/registry';

const registry = new CapabilityRegistry([
  {
    action: 'map.focus',
    minArgs: 0,
    maxArgs: 0,
    optionalKwargs: { id: { type: { kind: 'string', minLength: 1 } } },
  },
]);

// One source drives both sides of the producer contract.
const { digest } = registry.introspection();  // → into the producer prompt
const verdict = validateCommand(registry, command);  // → enforced at runtime

// And it plugs into the parser's recovery seam, which switches bare-command
// quarantine on for the production path.
parseScript(script, { lookupSchema: registry.lookup });
```

## What this module guarantees

- **One registry, no parallel list.** Introspection, the authoring digest, and the JSON Schema
  projection are projections of the same structure validation reads. `TEST-171` fails if any of them
  gains an independent list — the failure mode this feature exists to remove (`NFR-005`, `DIV-006`).
- **Validation never mutates and never repairs.** It does not fill in defaults, coerce a value, or
  round a number. A default is a statement about what the host should do when a key is absent, not
  something the validator writes into the command.
- **Layers are ordered and first-rejection is terminal.** `syntax → registry → entity → state →
  spatial`; a contributed stage cannot soften an earlier rejection.
- **Core advertises nothing.** `COMMAND_SCHEMAS` is empty by construction; domain vocabularies are
  plugin-owned.

## Requirements owned

| Feature | v2 requirements | v2 tasks | Parity exits |
|---|---|---|---|
| FEAT-002 Capability Registry, Validation & Introspection | FR-175..FR-180 | T-025, T-026, T-027, T-028, T-029 | TEST-171, TEST-172, TEST-173 |

## Corpus seed

- FEAT-002: `6` surfaces, `6` v1 requirements, `6` v1 tests — seed spec `docs/corpus/specs/`, issue [#11](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/11)

See [V2_ID_LEDGER.md](../../docs/governance/V2_ID_LEDGER.md) for the canonical identity allocation and
[SPEC_KIT_RUNBOOK.md](../../docs/governance/SPEC_KIT_RUNBOOK.md) for the per-feature workflow.

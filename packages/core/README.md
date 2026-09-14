# @stagehand/core

Compound choreography IR, atomic group execution, and the `mark.clip` protocol command.

| | |
|---|---|
| Layer | `core` |
| Kind | `package` |
| Directory | `packages/core` |
| Owner features | FEAT-004 |
| Internal dependencies | `@stagehand/parser`, `@stagehand/registry`, `@stagehand/runtime` |
| Status | implemented — FEAT-004 converged through T-035..T-039 |

## Usage

```ts
import { parseScript } from '@stagehand/parser';
import { compileChoreography, executeChoreographyGroup, executeBeat } from '@stagehand/core';

const nodes = compileChoreography(parseScript(script, { lookupSchema: registry.lookup }));
const host = { plugin: 'geo', commit: (effects) => scene.apply(effects) };

for (const node of nodes) {
  if (node.kind === 'command') continue;
  const result = node.kind === 'beat'
    ? executeBeat(registry, node, { committer: host, observer })
    : executeChoreographyGroup(registry, node, { committer: host });
  // result.committed is false and the host untouched when any member was rejected
}
```

## What this module guarantees

- **An atomic group commits entirely or not at all**, and a rejected group never contacts the host —
  not zero effects, zero calls. Every member is validated before any is committed, and a successful
  group reaches the adapter in **one** call. Asserted per failure kind: unknown action, schema
  violation, unresolved reference, failing pass.
- **The IR reads no clock and schedules no timer.** Ordering and concurrency are data; a `pause=60000`
  compiles to the number `60000` and executing it returns immediately. Proven with `Date.now` and
  `setTimeout` replaced by throwing functions.
- **Node identity is positional**, so two compilations of the same source yield identical ids and a
  scheduler can reference a node across a re-compile.
- **`mark.clip` is an ordinary capability.** Registered with a schema, validated and committed through
  the normal pipeline. A command with a privileged path would sit outside the trust boundary.

## One declared limitation

`CompoundNode.commands` is **flattened**. `ENT-004` records that the recovered segment model promotes
a nested compound's commands into its parent's list, so `[sequence][parallel][a][b][end][end]`
compiles to **one** sequence whose commands are `[a, b]` — the `parallel` boundary is gone, and so is
any inner atomicity.

This is declared rather than hidden, because a consumer that assumed otherwise would build a
scheduler on a boundary that was never there, and `TEST-177` pins it with a golden. Reconstructing
inner boundaries would mean a second parser here or a tree-preserving output added to
`FEAT-001`; neither is justified by corpus evidence. If a later feature needs scheduler control
*inside* a compound, extend the parser's fold and record the need in
`specs/006-compound-choreography/spec.md` §14 first.

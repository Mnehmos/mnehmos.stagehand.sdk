# Plan — FEAT-004 Compound Choreography & Beat IR

## Target

Package owners: `packages/core` (IR, group execution, `mark.clip`) and `packages/authoring` (beat
agent object). Dependencies: `@stagehand/parser` (FEAT-001), `@stagehand/registry` (FEAT-002),
`@stagehand/runtime` (FEAT-003). **Not** `@stagehand/trace`: core reports lifecycle through an
injected observer, so the trace package stays a consumer rather than a dependency.

## Architecture

Group execution is a *composition* of the trust kernel, not a parallel implementation of it.

```text
  ScriptSegment[]  ──▶  compileChoreography ──▶  ChoreographyNode[]     (FR-187, FR-188)
                                                     │
                        ┌────────────────────────────┼────────────────────────────┐
                        ▼                            ▼                            ▼
                 mark.clip schema            group execution               beat object
                 (registered, not            (FR-190): all commands        (FR-192),
                  special-cased)             validated first, then one     authoring's job
                        │                    commit call                          │
                        └────────────────────┬───────────────────────────────────┘
                                             ▼
                    validate (registry) → compile (runtime passes) → resolve (runtime)
                                             → committer.commit(everything, once)
```

| Module | Responsibility | Requirements |
|---|---|---|
| `packages/core/src/types.ts` | Node model, group result types, observer seam | FR-187, FR-192 |
| `packages/core/src/choreography.ts` | `compileChoreography`, node identity, flattening helpers | FR-187, FR-188, FR-191 |
| `packages/core/src/clip.ts` | `mark.clip` schema | FR-189 |
| `packages/core/src/execute.ts` | Atomic group execution | FR-190, FR-192 |
| `packages/authoring/src/beat-object.ts` | `toBeatObject`, `fromBeatObject` | FR-192 |
| `packages/*/src/index.ts` | Public surfaces | — |

### The group reuses the runtime's stages rather than re-deriving them

`@stagehand/runtime` already exports `canonicalizeCommandEntityRefs`, `runCompilerPasses`, and the
`EffectCommitter` seam. Group execution calls those per command and then commits **once**. The
alternative — a second validation path inside this package — would be a second place for the trust
rules to live, and Constitution II exists to stop exactly that.

The one thing this package adds is the *ordering*: every command is validated before any is
committed. That ordering is the whole of atomicity within the runtime's contract, since atomicity of
the write itself belongs to the adapter (as `EffectCommitter`'s documentation states).

### Why an observer rather than the event bus

`FEAT-004` does not depend on `FEAT-005` — the dependency runs the other way. So `beat.started` and
`beat.completed` are reported through an injected observer, exactly as `FEAT-006` reports
`gate.waited`. The host wires the observer to a bus whose channel map already carries the two types
(both are `public`, and `packages/trace/test/ordering.test.ts` already registers them as such).

### Node identity is positional, never generated

Ids are derived from a node's path (`0`, `0.1`, `0.1.2`). No counter, no clock, no randomness —
so two compilations of the same segments produce identical ids, which is what `NFR-006`'s determinism
requires and what lets a scheduler reference a node across a re-compile.

### `mark.clip` is registered, not special-cased

It is a protocol command, so it goes through the registry like every other capability. A privileged
path in the executor would put a command outside the trust boundary, and the boundary is only worth
having if it is total.

## Implementation sequence

1. `packages/core/src/types.ts` — the node model, because everything else is expressed in it.
2. `choreography.ts` — compilation and identity.
3. `clip.ts` — one schema, so it is quick and it unblocks the group tests.
4. `execute.ts` — last among the core modules, since it composes the others with the runtime.
5. `packages/authoring/src/beat-object.ts` — the round trip.
6. Parity exits: TEST-178 and TEST-179 first (they need only a fake host and a clock check), then
   TEST-177's goldens, then TEST-180.
7. `pnpm check`.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| A half-committed atomic group | critical | Every command validated before any commit; one commit call for the group; mutation-counting fake host asserted per rejection kind. |
| A second trust path growing inside this package | high | Group execution calls the runtime's exported stages; it re-implements none of them. |
| A consumer assuming intra-group nesting survives | high | Declared in FR-188, documented on the node type, and pinned by a golden. |
| Nondeterminism in node identity | medium | Positional paths only; the package reads no clock and schedules no timer, asserted directly. |
| Core acquiring a trace dependency for convenience | medium | Observer seam; `check:boundaries` would reject the edge since the ledger does not imply it. |
| `mark.clip` drifting into a privileged command | medium | Registered like any capability; the test asserts it validates and rejects on schema violation. |

## Divergences reflected

None new. `DIV-010` (withhold control-shaped tokens in a recovered region) is implemented in
`FEAT-001` and its behavior is asserted here only where compounds are involved, not reimplemented.

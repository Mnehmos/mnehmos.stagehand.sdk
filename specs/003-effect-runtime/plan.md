# Plan — FEAT-003 Effect Compilation, Resolution & Safe Execution

## Target

Package owner: `packages/runtime`. Dependencies: `@stagehand/parser` (FEAT-001),
`@stagehand/registry` (FEAT-002). No host adapter implementation, no I/O, no clock.

## Architecture

One pipeline, three injected seams, one mutation point. Everything before the commit is a pure
function of the command and the seams; the commit is the only line that can change the world, and it
is reachable by exactly one path.

```text
                    ┌── resolve (FR-182, FR-183) ── EntityResolver
  command ── validate (FEAT-002) ── compile (FR-184) ── commit (FR-185) ──→ outcomes (FR-186)
                    └── CommandCompilerPass[]        └── EffectCommitter
```

| Module | Responsibility | Requirements |
|---|---|---|
| `src/types.ts` | `CanonicalStagehandCommand`, `CanonicalEffect`, the three seam interfaces, outcome unions, options and modes | FR-181, FR-186 |
| `src/resolve.ts` | Discover references from registry value types; canonicalize with the injected resolver; stub proposals | FR-182, FR-183 |
| `src/compile.ts` | Run compiler passes in order; expand, decline, or fail atomically | FR-184 |
| `src/execute.ts` | The pipeline and the single commit point | FR-185, FR-186 |
| `src/index.ts` | Public surface | — |

### References are discovered from types, not from a list

`FEAT-002` already declares *which* kwargs are references: the `entityRef` and `entityRefList` value
types. The runtime asks the schema, so adding a reference-carrying capability requires no runtime
change and no second list of action names to keep in step. A per-action table here would be exactly
the drift class `DIV-006` was written to remove, reintroduced one package over.

### Why the committer declares its plugin

A canonical effect carries `plugin` (per the corpus schema). Deriving that from the action name
would mean core parsing `map.highlight` to decide the owner — inventing a convention the corpus does
not state. Instead the adapter declares which plugin it serves, so ownership is explicit at the seam
the host already controls.

### Atomicity: call once, and say whose job the rest is

`commit` receives the whole batch of effects for a command. Two things follow:

- The runtime's obligation is *call at most once, only after full authorization*. That is
  mechanically checkable, and `TEST-174` checks it by counting mutations.
- The adapter's obligation is that its own write is atomic. Core cannot provide that and must not
  pretend to; claiming transactional safety over host state it cannot see would be a lie in a
  doc-comment.

The alternative — a prepare/commit/rollback protocol — was rejected: it forces every host adapter to
implement two-phase commit for a guarantee core cannot verify, and the corpus evidences a single
"authorized commit" step, not a distributed transaction.

### Ordering: compile before resolve

The corpus pipeline reads `validate → compile semantic-v2 → canonicalize entity refs`. Compilation
first is also the useful order: a semantic command expands into primitive commands that name their
own concrete references, so resolving before expanding would resolve references on a command shape
that is about to be discarded. `FR-185` fixes the order.

### Why `propose-stub` does not commit

Constitution IV forbids model-invented pointers unless a plugin explicitly authorizes them, and
`FEAT-010`'s proposal path is that authorization. Committing against a stub would be silent entity
creation with extra steps. So `propose-stub` produces the same non-commit outcome as `strict`, plus a
proposal record — the mode changes what the *plugin* is handed, not what the host is told.

## Implementation sequence

1. `types.ts` — the seams first; they are the feature's real API.
2. `test/fake-host.ts` — the mutation-counting adapter, built **before** the executor, so the safety
   test is written against a host that can testify rather than one that looks right.
3. `resolve.ts`, `compile.ts` — pure transformations.
4. `execute.ts` — the pipeline, once its parts are individually trustworthy.
5. `TEST-176` fuzz, `TEST-175` parity, `TEST-174` mutation safety.
6. `pnpm check`.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| A rejection path reaches the committer | critical | Mutation-counting fake host; one assertion per rejection path rather than a single aggregate. |
| Partial commit when a compiler pass fails mid-batch | critical | Passes accumulate into a local list; nothing leaves the pipeline until every pass has succeeded. |
| Core grows a host or domain dependency | high | Only interfaces are defined; `check:boundaries` enforces declared edges, review enforces the rest. |
| A reference type is missed, so a model-invented pointer commits unchecked | critical | References are discovered from the registry's declared value types, so the discovery cannot lag the vocabulary. |
| Resolver called with an ambiguous id silently picking one | high | Resolver contract returns a single target or nothing; `TEST-176` fuzzes stale/missing/ambiguous ids and asserts unresolved rather than a guess. |
| Nondeterminism creeping in via ids | medium | No clock, no counter, no randomness; correlation ids are caller-supplied. |

## Divergences reflected

`DIV-007` is normative for this feature and is the one most easily violated quietly. No new
divergence is proposed.

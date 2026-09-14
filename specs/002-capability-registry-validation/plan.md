# Plan — FEAT-002 Capability Registry, Validation & Introspection

## Target

Package owner: `packages/registry`. Dependency: `@stagehand/parser` (FEAT-001), for the
`StagehandCommand` shape and the `SchemaLookup` seam. No host adapter, no I/O.

## Architecture

One data structure, four views. Everything else in this feature is a projection of the registry, and
that is what makes DIV-006 enforceable rather than aspirational.

```text
                      ┌─→ validateCommand / validateCommands   (FR-177, FR-178, FR-179)
  CapabilityRegistry ─┼─→ introspection()   producer-facing    (FR-180)
    (FR-175, FR-176)  ├─→ digest()          prompt text        (FR-180, NFR-005)
                      ├─→ toJsonSchema()    machine-readable   (FR-180)
                      └─→ lookup            parser seam        (FR-169 integration)
```

| Module | Responsibility | Requirements |
|---|---|---|
| `src/types.ts` | `CommandSchema`, `CommandAction`, `KwargSpec`, `ValidationResult`, layer and error vocabularies | FR-175, FR-179 |
| `src/value-types.ts` | Value type descriptors and their parsing/checking, including duration and color grammar | FR-175, FR-177 |
| `src/registry.ts` | `CapabilityRegistry`: registration, lookup, introspection, digest, JSON Schema projection | FR-176, FR-180 |
| `src/validate.ts` | Layer pipeline, built-in syntax and registry stages, result construction | FR-177, FR-178, FR-179 |
| `src/index.ts` | Public surface, including `COMMAND_SCHEMAS` | FR-176 |

### The parser seam

`@stagehand/parser` accepts a `SchemaLookup` returning its own `CommandSchemaLike`. Rather than
contort the registry's richer schema into that shape, the registry exposes `lookup`, an explicit
adapter. The two types serve different masters — the parser needs the key set and arity; the
registry needs types, defaults, and metadata — and collapsing them would make the registry's schema
the parser's schema, which is exactly the coupling that lets vocabularies drift.

This adapter is also what switches on bare-command quarantine in `FEAT-001` on the production path:
before this feature, quarantine could only run under test with a fixture registry.

### Why validation does not fill in defaults

A default is a statement about what the *host* should do when a key is absent. Writing it into the
command during validation would make the validator a mutator, and `INV-004`'s "rejection is terminal;
no partial state mutation" would become a claim about a function that already mutates. Defaults are
therefore exposed through introspection and JSON Schema and applied downstream, never injected.

### Layer ordering

`syntax → registry → entity → state → spatial`, first rejection terminal. Built-in stages are the
first two; the rest are contributed as `ValidationStage` objects. Ordering is a property of the
pipeline, not of registration order, so a host adding a state stage cannot accidentally make state
run before registry and produce a different diagnostic for the same input.

## Implementation sequence

1. `types.ts` and `value-types.ts` — lock the vocabulary and the value grammar.
2. `registry.ts` — registration, lookup, and the three projections (T-025, T-026).
3. `validate.ts` — built-in stages, then the pipeline (T-027, T-028).
4. Fixture schema set covering every value type, used by all three parity exits.
5. Bijection test (TEST-171), property test (TEST-172), adversarial corpus (TEST-173) (T-029).
6. `pnpm check`.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Introspection and validation drift apart | critical | Both are projections of one structure; the bijection test fails if either gains an independent list. |
| Core accumulates domain vocabulary | high | Core's `COMMAND_SCHEMAS` is empty by construction, and a test asserts no `lesson.`/`projector.`/`piece.`/`room.` namespaces (Constitution III, harness A-011). |
| A later layer softens an earlier rejection | high | Pipeline stops at the first rejecting stage; asserted by an ordering test. |
| Value coercion sneaks in as convenience | medium | Types are checked, never converted; a coercion is a repair and DIV-004 forbids it. |
| Duration/color grammar invented beyond evidence | medium | Grammar is stated in FR-175 and pinned by TEST-173 rather than left implicit. |

## Divergences reflected

`DIV-006` (one registry generates validation and introspection) is implemented here, not merely
respected. No new divergence is proposed.

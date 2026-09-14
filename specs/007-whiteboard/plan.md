# Plan — FEAT-012 Shared Whiteboard Canvas

## Target

Package owner: `plugins/whiteboard`. Dependencies: `@stagehand/registry` (FEAT-002),
`@stagehand/runtime` (FEAT-003), and per the issue graph also `@stagehand/trace` and
`@stagehand/readiness` (FEAT-005, FEAT-006) — see `DR-002`: the issue graph is canonical for
dependencies even where the corpus ledger disagrees.

## Architecture

One document, a reducer, and two contributed seams. The plugin adds **no** trust path: it registers
schemas, contributes an entity-layer validation stage, and implements a committer. Core keeps owning
the order of stages.

```text
  whiteboard.* command
        │
        ▼
  registry validation (FEAT-002)          ← schemas from schemas.ts
        │
        ▼
  entity stage: resolve target + content_ref   ← contributed by this plugin (FR-232, FR-233)
        │
        ▼
  runtime compile/resolve (FEAT-003)
        │
        ▼
  committer.commit(effects)  ──▶  BoardDocument reducer  (FR-228, FR-230, FR-231)
                                        │
                                        └──▶ revision + board.revision.committed
```

| Module | Responsibility | Requirements |
|---|---|---|
| `src/types.ts` | Document, element, layer, revision, effect shapes | FR-228, FR-231 |
| `src/schemas.ts` | The 15 VC-superset schemas | FR-229 |
| `src/board.ts` | `BoardDocument`: reducers, layers, revisions, hide/clear | FR-228, FR-230, FR-231 |
| `src/resolve.ts` | Target and `content_ref` resolution; the entity stage | FR-232, FR-233 |
| `src/clio.ts` | The six-surface compatibility mapping, as data | FR-234 |
| `src/index.ts` | Public surface | — |

### Fifteen actions, twenty-one surfaces

The corpus records 21 surfaces because two hosts each declared their own list, and six actions appear
in both. Registering 21 would put two schemas on one action name, which the registry correctly
refuses as a duplicate — so the union is registered once and the *surfaces* are tracked as a
manifest. `TEST-203` walks the 21 surface ids and asserts each maps to a registered action, which is
the check that would catch a surface being dropped during consolidation.

### Hide and clear are separate reducers, deliberately

`hide` sets `visible = false` and touches nothing else. `clear` removes elements. The temptation is a
single `setBoardState` reducer with a flag, and that is precisely how `hide` starts clearing:
`TEST-204` asserts the two after the same intervening sequence, so a shared implementation that got
the flag wrong would fail one of them.

### Why the truth/thinking split is a property of the document, not of the renderer

If layers were a rendering concern, a learner-facing view would have to *remember* to filter. Making
the layer part of each element and providing layer-scoped reads means a consumer that asks for truth
cannot be handed thinking content. `TEST-205` asserts both directions, including that clearing one
layer leaves the other.

### `content_ref` returns the stored bytes

The risk is a resolver that re-parses or re-serialises, producing content that is equivalent and not
identical. `TEST-206` compares against what was committed rather than against a literal, so a
serialisation change in this plugin cannot make the test agree with the bug.

## Implementation sequence

1. `types.ts` — the document shape, because every reducer is expressed in it.
2. `schemas.ts` — 15 schemas plus the surface manifest.
3. `board.ts` — reducers, including hide/clear and the layer split.
4. `resolve.ts` — target and `content_ref` resolution, and the contributed stage.
5. `clio.ts` — the compatibility mapping.
6. Parity exits: TEST-204, TEST-205, TEST-207 (pure reducer and resolution work), then TEST-206,
   then TEST-203 last (it validates the whole manifest against the registry).
7. `pnpm check`.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| `hide` implemented as `clear` | critical | Separate reducers; TEST-204 asserts both after one sequence. |
| A surface dropped during 21→15 consolidation | high | TEST-203 walks the 21 surface ids, not the 15 action names. |
| Thinking content leaking into a truth read | high | Layer is an element property with layer-scoped reads; TEST-205 asserts both directions. |
| `content_ref` returning equivalent-but-not-identical content | medium | TEST-206 compares against the committed bytes. |
| An unknown target silently applying to a similar element | critical | Unresolved is reported, never guessed; TEST-207 covers all three target-taking actions. |
| Rendering creeping into the plugin | medium | No renderer dependency; the document is the contract. `check:boundaries` plus review. |
| A rejected command advancing the revision | high | Revision advances in the committer only, which a rejection never reaches. |

# Plan — FEAT-007 Geospatial Camera & View Framing

## Target

Package owner: `plugins/geo-clio`. Dependencies: `@stagehand/registry` (FEAT-002) and
`@stagehand/runtime` (FEAT-003). No new workspace dependencies, and `core` is not touched.

## Architecture

Four seams and no renderer. The plugin registers vocabulary, answers questions about geometry, rewrites
semantic commands into primitives, and hands camera effects to an injected adapter. It never computes a
coordinate it cannot source, and it never draws one.

```text
  map.* / camera.* command
        │
        ▼
  registry validation (FEAT-002)            ← schemas.ts: the eight actions (FR-204)
        │                                   ← stages.ts: cross-field rules (FR-205)
        ▼
  canonicalize — EntityResolver             ← entities.ts over registered geometry (FR-206)
        │   unresolved ⇒ E_UNRESOLVED_REF, never a guess
        ▼
  compiler passes (FEAT-003)                ← compile.ts (FR-207)
        │   camera.center / camera.focus_region ⇒ map.fit
        │   camera.establish_globe           ⇒ map.view
        │   zoom_level ⇒ maxZoom via the palette; context_entities dropped from bounds
        ▼
  committer — GeoCameraPlugin               ← adapter.ts ⇒ CameraHostAdapter (FR-208)
```

The SDK's IR already fits the recovered model, which is why no core change is needed: `ResolvedTarget`
carries an optional `center` and an optional `bounds`, which is exactly what the pinned source's
`entityCenter` and `boundsForEntity` produce; `EntityResolver` is the plugin-owned seam that returns
`undefined` rather than guessing; and `CommandCompilerPass` is where semantic-to-primitive rewriting
belongs — core's own pass helper names this feature as its intended owner.

| Module | Responsibility | Requirements |
|---|---|---|
| `src/schemas.ts` | The eight camera schemas and the two vocabularies (map modes, zoom levels) | FR-204 |
| `src/stages.ts` | Registry-layer cross-field rules the pin enforces before resolution | FR-205 |
| `src/geometry.ts` | `splitEntityList`, `entityCenter`, `boundsForEntity`, `mergeBounds` | FR-206 |
| `src/entities.ts` | The geo entity registry, implementing `EntityResolver` | FR-206 |
| `src/compile.ts` | The semantic→primitive compiler pass and the zoom palette | FR-207 |
| `src/adapter.ts` | `CameraHostAdapter` interface and the committer that drives it | FR-208 |
| `src/index.ts` | Public surface | all |

### Two decisions worth stating

**Entity lists are validated by a contributed stage, not by a core list type.** The recovered source
splits `entities` on comma, pipe, **or** semicolon, while core's list splitter recognises commas only.
Declaring the kwarg as a core list would reject `iran|iraq`, which the recovered host accepts. So the
kwarg is typed as a string and the split-and-count rule is contributed, matching the pin exactly.

**The pin's two permissive behaviours are preserved, not corrected.** Camera coordinates carry no range
check, and `zoom_level` carries no enum. Both would reject input the recovered host accepts. The zoom
levels are still surfaced to producers — through each kwarg's description, which introspection and
authoring help already expose — so nothing is lost by not enforcing them.

## Implementation sequence

Following the corpus plan: types and schemas first, then pure transformations with tests, then the
adapter only once validation tests pass, then parity vectors for all eight surfaces.

1. Schemas and vocabularies, with the schema-conformance test failing first.
2. Geometry and resolution as pure functions, with the no-invented-coordinates test failing first.
3. The compiler pass, with the golden tests failing first.
4. The host adapter seam.
5. Parity vectors for every owned surface.

## Risk

Complexity: medium. Preservation posture: yes. The main risk is a coordinate appearing from somewhere
other than registered geometry; it is addressed by construction (the resolver is the only source of
geometry) and by TEST-189 rather than by review attention.

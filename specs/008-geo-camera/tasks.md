# Tasks — FEAT-007 Geospatial Camera & View Framing

Task identities are the canonical v2 slice T-049..T-053 from
`docs/governance/v2-allocation.json`. They are reconciled to the issue graph, not minted locally.

- [ ] **T-049** Geo camera command schemas — FR-204, FR-205

  - [ ] Author the eight schemas in `src/schemas.ts` with recovered arity, defaults, numeric fields,
        positional enum, and resolution policy (TEST-188)
  - [ ] Declare the map-mode and zoom-level vocabularies; surface the zoom levels through kwarg
        descriptions rather than as an enforced enum (TEST-188)
  - [ ] Contribute the registry-layer stage in `src/stages.ts`: `map.fit` requires an entity list or
        all four bounds, and a supplied list must yield at least one reference after splitting on
        comma, pipe, or semicolon (TEST-188)
  - [ ] Assert every recovered field through registry introspection, so a mutation of any default fails

- [ ] **T-050** Geo entity resolver — FR-206

  - [ ] `src/entities.ts`: a registry of geo entities implementing `EntityResolver`, returning
        `undefined` for anything unknown and never guessing between candidates (TEST-189)
  - [ ] `src/geometry.ts`: `splitEntityList` (comma, pipe, semicolon), `entityCenter`, and
        `boundsForEntity` with the recovered 0.25-degree point padding (TEST-189)
  - [ ] `src/geometry.ts`: `mergeBounds` with the antimeridian correction — shift western-hemisphere
        bounds by 360° when the naive span exceeds 180°, and keep the smaller arc (TEST-189)
  - [ ] Prove no invented coordinates: every emitted number traces to registered geometry or to a kwarg
        the vocabulary declares (TEST-189)

- [ ] **T-051** Semantic camera compiler — FR-207

  - [ ] `src/compile.ts`: compile `camera.center` and `camera.focus_region` to `map.fit`, carrying
        `entities`, `padding`, and a `maxZoom` resolved from `zoom_level` (TEST-190)
  - [ ] Compile `camera.establish_globe` to `map.view` with the recovered defaults (TEST-190)
  - [ ] Exclude `context_entities` from the fit's entity list, so context never drags the frame
        (TEST-190)
  - [ ] Leave `camera.follow_marker` and every primitive unchanged (TEST-190)
  - [ ] Resolve `zoom_level` through the six-level palette with the regional fallback, and gold the
        case where an unrecognised level yields the regional value (TEST-190)

- [ ] **T-052** Camera host adapter interface — FR-208

  - [ ] `src/adapter.ts`: the `CameraHostAdapter` interface — the plugin's only route to a camera
        (TEST-190)
  - [ ] The committer that turns compiled camera effects into adapter calls, and nothing else
  - [ ] Confirm the dependency closure stays headless: no map or rendering import anywhere in the
        plugin, enforced by `pnpm check:boundaries`

- [ ] **T-053** Camera contract tests — TEST-188, TEST-189, TEST-190

  - [ ] Schema conformance for all eight actions, field by field against the recovered contract table
  - [ ] Resolution tests: single entity, multi-entity, trans-Pacific pair, and the unresolvable case
  - [ ] Compiler goldens for every semantic action, including the two framing primitives producing the
        same primitive shape
  - [ ] A rejected command produces no adapter call at all

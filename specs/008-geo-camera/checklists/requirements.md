# Requirements checklist — FEAT-007 Geospatial Camera & View Framing

Seeded from the parity rows for this feature's surfaces in `docs/corpus/32_PARITY_SUITE.md`, whose
method is **schema + golden/negative effect trace, with a differential host run when available** and
whose expected outcome is **behavioral equivalence**. The corpus rows are numbered in the superseded
scheme; the substance is carried over here under this feature's own parity exits.

## TEST-188 — All eight camera/view action schemas

- [ ] Every owned surface (`SURF-005..008`, `SURF-040..042`, `SURF-047`) is reachable through the
      registry, asserted by walking the surface list rather than by counting actions
- [ ] Arity matches the recovered contract for all eight actions, including `map.mode`'s exactly-one
      positional argument and `map.focus`'s optional positional
- [ ] Every optional kwarg default matches the pin: `map.view` 28/48/4, `camera.establish_globe`
      20/0/1.4, framing padding 80, `zoom_level` regional, `track` active_highlights,
      `min_zoom` local, `max_zoom` regional
- [ ] The five map modes are enforced on `map.mode`'s positional argument
- [ ] Numeric fields are exactly the recovered sets per action, and a non-finite value is rejected
- [ ] `E_SCHEMA` is produced for a bad mode, a missing entity reference on `map.focus`, an incomplete
      bound set on `map.fit`, and an empty entity list
- [ ] A pipe-separated and a semicolon-separated entity list are both accepted
- [ ] Introspection and the projected schema agree with the enforced contract for every kwarg

## TEST-189 — Entity resolution proves no invented coordinates

- [ ] `map.focus` emits the resolved entity's own centre, taken from coordinates when present and from
      the centre of its bounds otherwise
- [ ] A point entity yields a box padded by the recovered 0.25 degrees
- [ ] `map.fit` resolves **every** reference before computing anything, and fails the whole command when
      any one is missing — no partial frame
- [ ] A trans-Pacific pair frames the shorter arc, asserted against known merged bounds rather than
      against a recomputation of the same formula
- [ ] An unresolvable reference yields `E_UNRESOLVED_REF` and no host mutation
- [ ] No code path emits a coordinate that did not come from registered geometry or from a declared
      coordinate kwarg — the resolver is the only source, by construction

## TEST-190 — Semantic-v2→primitive compiler goldens

- [ ] `camera.center` compiles to `map.fit` carrying `entities`, `padding`, and a resolved `maxZoom`
- [ ] `camera.focus_region` compiles to the same primitive shape as `camera.center`
- [ ] `context_entities` does not appear in the compiled entity list
- [ ] `camera.establish_globe` compiles to `map.view` with the recovered defaults
- [ ] `camera.follow_marker` is not compiled and resolves nothing
- [ ] Each zoom level maps to its recovered `maxZoom`, and an unrecognised level yields the regional
      value rather than an error
- [ ] A primitive command passes through unchanged
- [ ] A command rejected before compilation produces no adapter call at all
- [ ] The same inputs produce byte-identical output across runs (no clock, no ordering dependence)

## Cross-cutting

- [ ] `pnpm check` is green, including `check:boundaries` with no map dependency in the plugin
- [ ] Every requirement in the feature's range has an implementation and at least one test
- [ ] Behaviour that differs from the reconstructed reference is recorded as a divergence with a parity
      note rather than left implicit

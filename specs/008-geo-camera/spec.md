# FEAT-007 · Geospatial Camera & View Framing

Live specification. Owner: `plugins/geo-clio`. Tier T1, complexity medium, preservation posture `yes`.
Corpus seed: `docs/corpus/specs/008-geo-camera/`. Issue
[#16](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/16), milestone
[#6](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/6).

Requirement identities are v2 (`FR-204..FR-208`). Corpus evidence is cited by surface and contract
identity (`SURF-###`, `CTR-###`), never by superseded Pass-9 requirement numbers. The machine-readable
contracts recovered from the pinned source live in `docs/evidence/clio-geo-camera.json`; every number
in this document is taken from there rather than from a prose summary.

## 1. Intent

Let a geospatial host establish, focus, fit, and follow meaningful views using **semantic targets**
rather than renderer-specific pointers.

The interesting part of this feature is not that it moves a camera — it is that it refuses to move one
it cannot justify. A model that says "look at the conflict" has to name something the registry knows,
and the geometry has to come from the registered entity, not from the model's imagination. That is
Article IV in its most quotidian form: `map.view lat=26.5 lon=53` is an accepted primitive because the
vocabulary declares coordinates, but `map.focus entity=country:iran` may only produce a centre that
the entity's own geometry supplies.

The plugin therefore owns four things and nothing else: the camera vocabulary, entity resolution into
geometry, the semantic-to-primitive compiler, and an adapter seam for the host's camera. It owns no
renderer, no map library, and no coordinate arithmetic that a host could not re-derive.

## 2. User Scenarios

1. **Establishing shot.** `[camera.establish_globe]` pulls back to a globe-scale framing before
   narration begins.
2. **Focus one place.** `[map.focus entity=country:iran]` centres the camera on coordinates taken from
   Iran's registered geometry; the following sentence is expected to name it.
3. **Frame several.** `[map.fit entities=country:iran,country:iraq]` frames both, correcting for the
   dateline when the shorter arc runs the other way.
4. **Frame one, keep context.** `[camera.center target=country:iran context_entities=country:russia]`
   frames Iran. Russia stays visible and available for later annotation but does **not** drag the
   bounds — which is precisely the bug this primitive was introduced to fix.
5. **Chase policy.** `[camera.follow_marker track=active_highlights]` sets a policy; `track=none`
   releases it.
6. **A name it does not know.** `[map.focus entity=country:atlantis]` is rejected with
   `E_UNRESOLVED_REF`. No camera move, no partial commit, no fallback to a plausible coordinate.

## 3. Functional Requirements

- **FR-204 · Camera and view command schemas, recovered from the pinned source.** The plugin MUST
  register all **eight** owned actions with the contract the pinned source declares: arity, required
  kwargs, optional kwargs and their defaults, the enum applied to a positional argument, which kwargs
  are numeric, and whether the command resolves an entity. The eight are `map.view`, `map.focus`,
  `map.fit`, `map.mode`, `camera.center`, `camera.focus_region`, `camera.establish_globe`, and
  `camera.follow_marker`. Defaults are part of the contract, not decoration: `map.view` is
  `lat=28 lon=48 zoom=4`, `camera.establish_globe` is `lat=20 lon=0 zoom=1.4`, framing commands pad by
  `80` and default `zoom_level` to `regional`, and `camera.follow_marker` defaults `track` to
  `active_highlights` with `min_zoom=local` and `max_zoom=regional`. `map.mode` takes exactly one
  positional argument, and it MUST be one of the five recovered modes (`political`, `satellite`,
  `street`, `terrain`, `historical_overlay`). The schemas MUST be derived from the single recovered
  contract table rather than authored alongside it.
  → SURF-005..008, SURF-040..042, SURF-047 → CTR-005..008, CTR-040..042, CTR-047 ·
  `docs/evidence/clio-geo-camera.json` · T-049

- **FR-205 · Validation rules, as the pinned source enforces them.** Numeric kwargs MUST be rejected
  when they are not finite, and **only** then: `map.view` checks `lat`/`lon`/`zoom`, `map.focus`
  checks `zoom`, and `map.fit` checks `west`/`south`/`east`/`north`/`padding`/`maxZoom`. `map.focus`
  MUST require an entity reference, accepting either `entity=` or a positional argument. `map.fit` MUST
  require either `entities=` or **all four** bounds, rejecting a partial bound set, and a supplied
  entity list MUST yield at least one reference after splitting on comma, pipe, or semicolon. No
  latitude or longitude range check is applied to camera commands: the pinned source bounds
  coordinates only for piece and entity-proposal commands, so a range check here would reject input the
  recovered host accepts. Likewise `zoom_level` is not enum-constrained, because the pin resolves an
  unrecognised level through the palette fallback rather than rejecting it.
  → SURF-005..008 → CTR-005..008 · `docs/evidence/clio-geo-camera.json` · T-049

  The pipe-and-semicolon list separators are the reason this rule is contributed rather than declared
  as a core list type: core's splitter recognises commas only, so declaring `entities` as a core list
  would reject `iran|iraq`, which the recovered host accepts.

- **FR-206 · Entity resolution never invents a coordinate.** Every coordinate this feature emits MUST
  be derived from registered geometry. `map.focus` MUST take its centre from the resolved entity
  (`entity.coordinates`, else the centre of its bounds). `map.fit` MUST resolve **every** reference
  before computing anything, MUST fail the whole command if any is missing, and MUST otherwise build
  bounds per entity and merge them. An entity with geometry yields its own geometry bounds; a point
  entity yields a box of `lon/lat ± 0.25` degrees. Merging MUST respect the antimeridian: when the
  naive span exceeds 180°, bounds whose centre lies in the western hemisphere are shifted by +360° and
  re-merged, and the smaller arc wins — so framing the United States and Russia together centres on the
  Pacific rather than the Mediterranean. A merged `west` MAY exceed 180°; normalising to a renderer's
  `[-180, 180]` is the host's job, not the protocol's. An unresolvable reference MUST be reported, not
  silently skipped.
  → SURF-006, SURF-007 → CTR-006, CTR-007 · `docs/evidence/clio-geo-camera.json` · T-050

- **FR-207 · Semantic commands compile to primitive ones.** `camera.center` and `camera.focus_region`
  MUST compile to `map.fit` carrying `entities`, `padding`, and a `maxZoom` resolved from `zoom_level`
  through the recovered six-level palette (`globe` 1.5, `hemisphere` 2.5, `continent` 3.5, `regional`
  4.6, `local` 6.5, `city` 9.0) with `4.6` as the fallback. `context_entities` MUST NOT be forwarded
  into the fit's entity list, so context can never drag the frame. `camera.establish_globe` MUST
  compile to `map.view` carrying `lat`, `lon`, and `zoom`. `camera.follow_marker` MUST NOT be compiled:
  it is a policy command that resolves nothing, and the pinned source handles it in neither its
  compiler nor its resolver. A command that is already a primitive MUST pass through unchanged.
  → SURF-040..042, SURF-047 → CTR-040..042, CTR-047 · `docs/evidence/clio-geo-camera.json` · T-051

  Two recoveries worth stating because a naive reading gets them wrong: the two camera framing
  primitives compile to **identical** output in the pinned source — they differ in declared vocabulary
  and author intent, not in the primitive they produce — and an unrecognised `zoom_level` produces the
  `regional` value rather than an error, because the fallback and the default are the same number.

- **FR-208 · The camera is driven through a host adapter, never by the plugin.** The plugin MUST emit
  canonical camera effects to an injected host adapter and MUST NOT import, bundle, or otherwise depend
  on a map or rendering library. Resolution and compilation MUST be pure functions of the command and
  the registered entity geometry: the same inputs yield the same output, with no clock, no randomness,
  and no dependence on the host's current camera. Nothing in `core` may depend on this plugin, and the
  dependency runs one way only.
  → ENT-010 · T-052

  This is structural rather than behavioural, so it is enforced by `pnpm check:boundaries` (Article III,
  `DIV-007`) rather than by a parity exit alone; a plugin that shipped a camera would put a renderer
  inside the SDK's dependency closure.

## 4. Key Entities

`ENT-010` (`HostState`, plugin-owned) — canonical definition in
`docs/corpus/analysis/18_STATE_MODEL.md`, which records that there is deliberately **not** one shared
type. Camera state and the entity registry live here. `INV-009` is this feature's structural
obligation: core must not depend on a concrete `HostState`. The only things core sees are a resolver, a
compiler, and a committer.

## 5. Surface Bindings

All eight owned surfaces are bound, one action each.

| Surface | Action | Contract | Host |
|---|---|---|---|
| SURF-005 | `map.view` | CTR-005 | Clio |
| SURF-006 | `map.focus` | CTR-006 | Clio |
| SURF-007 | `map.fit` | CTR-007 | Clio |
| SURF-008 | `map.mode` | CTR-008 | Clio |
| SURF-040 | `camera.center` | CTR-040 | Clio |
| SURF-041 | `camera.focus_region` | CTR-041 | Clio |
| SURF-042 | `camera.establish_globe` | CTR-042 | Clio |
| SURF-047 | `camera.follow_marker` | CTR-047 | Clio |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| `map.view lat=26.5 lon=53 zoom=6` | Accepted; camera effect carries the declared coordinates. |
| `map.view lat=abc` | `E_SCHEMA` — not a finite number. |
| `map.mode satellite` | Accepted; mode is the single positional argument. |
| `map.mode` with a mode outside the five | `E_SCHEMA`; no camera effect. |
| `map.focus entity=country:iran` with Iran registered | Camera effect carries Iran's own centre. |
| `map.focus` with no entity and no positional argument | `E_SCHEMA` — an entity reference is required. |
| `map.fit entities=country:iran,country:iraq` | Bounds merged from both; `west/south/east/north` emitted. |
| `map.fit entities=iran\|iraq` | Accepted — pipe is a recovered separator, not a typo. |
| `map.fit west=40` (partial bounds) | `E_SCHEMA`; all four bounds or an entity list is required. |
| `map.fit` with one reference unresolvable | Rejected; **no** bounds computed and no partial frame. |
| US + Russia fit | Antimeridian-correct frame centred over the Pacific, not the Mediterranean. |
| `camera.center target=iran context_entities=russia` | Compiles to a fit over Iran only; Russia is not in the entity list. |
| `camera.center zoom_level=city` | `maxZoom` 9.0. |
| `camera.center zoom_level=unknown` | `maxZoom` 4.6, matching `regional`; not a rejection. |
| `camera.establish_globe` | Compiles to `map.view lat=20 lon=0 zoom=1.4`. |
| `camera.follow_marker track=none` | Accepted as a policy effect; not compiled, nothing resolved. |
| Any command naming an unregistered entity | `E_UNRESOLVED_REF`; no camera effect, no partial commit. |
| Rejected command | Committer never called; no host mutation. |

## 7. Error Catalog

| Code | Where |
|---|---|
| `E_UNKNOWN_ACTION` | Action absent from the registry. |
| `E_SCHEMA` | Non-finite numeric kwarg; bad positional mode; missing entity reference; `map.fit` without an entity list or complete bounds; empty entity list. |
| `E_UNRESOLVED_REF` | A named entity has no registered geometry, or resolves to nothing. |

`E_STATE` is reserved for host-state refusals and is not currently reachable in this feature; it is
recorded rather than invented away.

## 8. State Transitions

`validated → resolved → compiled → committed + public trace`, or `rejected + production diagnostic`.
Compilation sits between resolution and commit: a semantic command must first resolve its target and
only then become a primitive, so a producer never sees a camera effect derived from an unresolved name.
The plugin contributes resolution and compilation; it adds no stage that could bypass core's ordering.

## 9. Non-Functional Envelope

- **NFR-008, deterministic plugin behavior.** Resolution and compilation are pure. The same command
  and the same registered geometry yield byte-identical effects; nothing depends on iteration order,
  the clock, or the host's current camera.
- **INV-009.** Nothing in core imports this plugin; `check:boundaries` enforces it.

## 10. Divergence Register

None introduced. The corpus records no governing divergence for this feature, and the two places where
an implementer's instinct would diverge from the pin — adding a latitude/longitude range check, and
enum-constraining `zoom_level` — are resolved **toward** the pin, because both would reject input the
recovered host accepts. The headless constraint follows Article III and `DIV-007`.

## 11. Parity Exits

- **TEST-188** — All eight camera/view action schemas.
- **TEST-189** — Entity resolution proves no invented coordinates.
- **TEST-190** — Semantic-v2→primitive compiler goldens.

## 12. Tasks

- **T-049** Geo camera command schemas · **T-050** Geo entity resolver ·
  **T-051** Semantic camera compiler · **T-052** Camera host adapter interface ·
  **T-053** Camera contract tests

## 13. Success Criteria

1. All eight actions are registered with the recovered arity, defaults, numeric fields, positional
   enum, and resolution policy, asserted field by field against the recovered contract table rather
   than by counting actions.
2. A mutation of any recovered default, mode value, or zoom-level mapping fails TEST-188.
3. Every coordinate a camera effect carries is traceable to registered geometry or to a kwarg the
   vocabulary declares; TEST-189 fails if a single coordinate appears from anywhere else.
4. The antimeridian case frames the shorter arc, asserted by comparing merged bounds for a known
   trans-Pacific pair.
5. `context_entities` provably does not enter the fit's entity list, and the two framing primitives
   compile to the same primitive shape.
6. An unresolvable reference yields `E_UNRESOLVED_REF` and no host mutation, including in a multi-entity
   fit where only one reference is bad.
7. `pnpm check` is green, including `check:boundaries` with no map dependency anywhere in the plugin.

## 14. Open Questions

Two recovered behaviours are preserved rather than corrected, and both are worth a maintainer's eye
because a future host may expect otherwise: an unrecognised `zoom_level` silently resolves to the
`regional` value, and camera coordinates are not range-checked. Neither is blocking; both are recorded
in the evidence file with the pin's reasoning. Separately, `context_entities` is accepted and excluded
here, but its real consumer is annotation (the highlighting feature), so its full meaning is only
exercised once that feature lands.

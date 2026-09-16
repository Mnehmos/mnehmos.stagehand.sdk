# FEAT-012 · Shared Whiteboard Canvas

Live specification. Owner: `plugins/whiteboard`. Tier T1, complexity medium, preservation posture
`yes`. Corpus seed: `docs/corpus/specs/007-whiteboard/`. Issue
[#21](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/21), milestone
[#5](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/5).

Requirement identities are v2 (`FR-228..FR-234`). Corpus evidence is cited by surface and contract
identity (`SURF-###`, `CTR-###`), never by superseded Pass-9 requirement numbers.

## 1. Intent

Provide a reusable screen-space explanatory canvas — text, math, lines, boxes, arrows, highlights,
dots, shapes, counting, erasure, reveal — whose committed elements can be **referenced** rather than
re-described, and whose content survives being hidden.

This is the SDK's **first plugin**, which makes it the first test of whether the core boundary holds
from the other side. Two things follow from that and shape the whole feature:

- The plugin owns its state (`ENT-010`: `HostState` is plugin-owned, never core's), so nothing here
  reaches into core to hold a board.
- The vocabulary is a **superset**: the corpus records 21 surfaces across two hosts, but only 15
  distinct actions. Six of Clio's are also VC's, and for `hide` and the rest the two hosts do not
  mean the same thing.

## 2. User Scenarios

1. **A lesson writes and then covers the board.** `[whiteboard.text id=sum text="2+2"]` commits an
   element. `[whiteboard.hide]` occludes the board without destroying it. `[whiteboard.show]`
   restores exactly what was there.
2. **Clearing is not hiding.** `[whiteboard.clear]` removes content. A host that treated `hide` as
   `clear` would silently destroy a lesson's work, which is what `TEST-204` exists to prevent.
3. **Thinking on the side.** `[whiteboard.scribble ...]` commits to a separate *thinking* layer, so a
   teacher's rough working never becomes part of the material a learner is shown as fact.
4. **Pointing at what is already there.** `[whiteboard.highlight target=e1]` resolves `e1` against
   the board's committed elements. An unknown target is rejected, not guessed.
5. **Reusing exact content.** A command carrying `content_ref` resolves to the board's stored,
   canonical content byte for byte — not to a re-typed copy that can drift from it.

## 3. Functional Requirements

- **FR-228 · Board document and revision model.** The plugin MUST maintain a board document holding
  named pages (a `show` with a `page` kwarg creates one that does not exist, reopens one that does
  with its content intact, and updates a title) with committed elements carrying stable ids, and MUST
  expose a monotonically increasing **revision** that advances on every committed change and not on a
  rejected one — nor on renderer-frame progression: `advance()` moves reveal progress and retires
  expired marks without touching the revision, because the revision tracks committed board changes
  rather than display state. A reducer change that is a no-op MUST return the same document
  (identity-equal), which is what makes the revision count changes rather than commands. For the six
  content-creating actions (`text`, `math`, `line`, `box`, `arrow`, `scribble`) a committed id MUST be
  **rejected at the state layer** as already present, because those are ids the avatar points at
  later; for `dots`, `shape`, and `count` the pin upserts instead, so their derived ids replace. Every
  created element MUST carry write-on timing — `reveal: 0` plus an action-specific `revealMs`
  (text 700, math 1100, line 500, box 600, arrow 600, highlight 300, scribble 700, dots 900, shape
  800; `count` scales as `max(400, total × pace)`) — and `reveal` re-arms that timing on its target.
  Removing an element MUST also remove marks **linked to it**, so a `count` annotation cannot outlive
  the element it numbers. The document MUST be plugin-owned: no core package holds or imports board
  state (`ENT-010`).
  → ENT-010 · T-074

  Bound note (DIV-012): point-anchored elements carry a nominal zero-size box at their declared
  point. Placement, text flow, and collision avoidance are renderer concerns the pin drives from its
  render loop, and a headless document that emitted guessed boxes would fabricate geometry.

- **FR-229 · VC-superset capability schemas, recovered from the pinned source.** The plugin MUST
  register all **15 distinct** actions across the 21 owned surfaces — `whiteboard.show`, `.hide`,
  `.clear`, `.text`, `.math`, `.line`, `.box`, `.arrow`, `.highlight`, `.scribble`, `.dots`,
  `.shape`, `.count`, `.erase`, `.reveal` — each with the contract the **pinned source** declares:
  required kwargs, optional kwargs and their defaults, enum members, numeric/duration/colour fields,
  the entity kind a target resolves against, and the settle budget. Six actions appear in both
  hosts' surface lists and MUST be registered **once**, not twice. The schemas MUST be derived from a
  single recovered contract table rather than authored alongside it, so one statement cannot disagree
  with the other.
  → SURF-034..039, SURF-057..071 → CTR-034..039, CTR-057..071 · `docs/evidence/virtual-classroom-whiteboard.json`

  The corpus is an index, not a specification. An earlier version of this feature transcribed
  `whiteboard.count` as `{of, value}` from the corpus's one-line behaviour string and omitted
  `content_ref` from `whiteboard.text`/`whiteboard.math` entirely, while still registering 15
  actions — so a test that counted actions stayed green through both errors. See `DIV-011`.

- **FR-230 · Hide, clear, and page semantics.** `hide` MUST occlude the board while
  preserving every committed element, and a subsequent `show` MUST restore exactly that content.
  `clear` MUST remove content. Neither may be implemented in terms of the other. This is the
  sharpest recovered semantic in the feature: Clio's surface list describes `hide` only as "hide
  whiteboard", while VC's records "occlude/deactivate presentation **without destroying content**",
  and collapsing the two destroys a lesson's work silently. A `show` carrying a `page` kwarg MUST
  create that page if it does not exist (starting empty) or activate it **with its content intact**;
  a `show` carrying a `title` kwarg MUST update the target page's title.
  → SURF-034, SURF-035, SURF-036, SURF-057, SURF-058, SURF-059 → CTR-034..039, CTR-057..059

- **FR-231 · Truth and thinking layers are isolated.** Elements MUST carry a layer of `truth` or
  `thinking`. **Four** actions produce thinking-surface marks, as the pinned reducer commits them:
  `arrow` (committed with `base('thinking', ...)` — it shows direction between elements, an
  annotation over the board rather than board content), `scribble` ("thinking-surface marks never
  become truth-surface content"), `highlight` ("a thinking-surface mark over a truth-surface element
  — it never alters the element"), and `count` (numbering drawn over the element it counts). Every
  other action that creates an element commits to `truth`; `reveal` and `erase` alter or remove an
  element rather than creating one. Reading either layer MUST NOT include the other's elements, and
  clearing one MUST NOT clear the other. A learner-facing view built from the truth layer must
  therefore be unable to contain a teacher's rough working.
  → SURF-064, SURF-065, SURF-066, SURF-069 → CTR-064, CTR-065, CTR-066, CTR-069 · T-077

- **FR-232 · `content_ref` resolves through the host's lesson-content pack.** A command carrying
  `content_ref` MUST resolve through the **injected lesson-content resolver** — the same seam the
  pinned runtime wires in (`opts.resolveContent`) — not against the board's own elements. A reference
  the pack does not hold yields **empty content and still commits** (the content pack is the host's;
  a miss is the host's to surface, not a protocol rejection), while `content_ref` and inline
  `text`/`latex` are mutually exclusive at the **registry** layer.
  → T-076

- **FR-233 · Board target resolution.** Every action the pinned source declares as resolving a
  `board` entity — `highlight`, `count`, `erase`, and `reveal` — MUST resolve its target against the
  board's committed elements, and resolution MUST NOT invent a position or an element for an id the
  board does not hold. An unknown target MUST be reported as unresolved (`E_UNRESOLVED_REF`) so the
  command is rejected, never applied to a guessed element. `scribble` accepts an optional
  `target` that its schema does NOT declare as an entity, and the pinned reducer **falls back** when
  it cannot be found rather than refusing. Additionally, `whiteboard.text`, `.math`, `.line`, `.box`,
  `.arrow`, and `.scribble` MUST be rejected at the **state** layer when no board page is open.
  → SURF-065, SURF-069, SURF-070, SURF-071 → CTR-065, CTR-069, CTR-070, CTR-071 · T-079

- **FR-234 · Clio compatibility mapping.** The six Clio surfaces MUST be served by the same 15
  actions, with each of the six mapped to its VC-superset counterpart and the mapping declared as
  data. Where the two hosts' recorded behavior differs, the VC superset wins and the difference is
  recorded — the mapping is what makes that choice explicit rather than accidental.
  Additionally: board coordinates MUST be validated as a **0-100 space** (including box edge-span
  checks in both dimensions) at the **spatial** layer, and every created element MUST carry write-on
  timing (`reveal: 0` plus its action's `revealMs`).
  → SURF-034..039 → CTR-034..039 · T-078

## 4. Key Entities

`ENT-010` (`HostState`, plugin-owned) — canonical definition in
`docs/corpus/analysis/18_STATE_MODEL.md`, which records that there is deliberately **not** one shared
type:

> Not one shared type. Examples: chess board annotation state; Clio SceneState / registry / camera
> bounds; classroom board document + projector + room/lesson state; VCB DOM/presenter state.

`INV-009` follows and is this feature's structural obligation: the core runtime must not depend on a
concrete `HostState` implementation. The board document lives here, and the only thing core sees is a
committer and a resolver.

## 5. Surface Bindings

All 21 owned surfaces are bound. The table below groups them because the interesting fact is the
overlap: six actions carry two surface identities.

| Actions | Clio surfaces | VC surfaces | Distinct |
|---|---|---|---|
| `show`, `hide`, `clear`, `text`, `line`, `box` | SURF-034..039 | SURF-057..063 | 6 |
| `math` | — | SURF-061 | 1 |
| `arrow`, `highlight`, `scribble`, `dots`, `shape`, `count`, `erase`, `reveal` | — | SURF-064..071 | 8 |
| **Total** | **6** | **15** | **15 distinct across 21 surfaces** |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| `text`/`math`/line-family with a fresh id | Element committed to `truth`; revision advances. |
| `show` on a hidden board | Visibility restored; every element still present. |
| `hide` on a visible board | Elements all still present; revision advances. |
| `clear` | Elements removed; revision advances. |
| `hide` then `clear` then `show` | Board empty: `clear` removed content that `hide` had preserved. |
| `scribble` | Element committed to `thinking`; truth layer unchanged. |
| `arrow` | Element committed to `thinking` (the pinned reducer's `base('thinking', ...)`); truth layer unchanged. |
| Any created element | Carries `reveal: 0` and its action's `revealMs`; `advance()` moves reveal toward 1 without spending a revision. |
| `count` on a committed element | Thinking-layer annotation carrying `what`/`from`/`pace`, linked to the target; write-on budget `max(400, total × pace)`. |
| `highlight` on a committed element | Thinking-layer mark linked to the target; the element itself byte-identical. |
| `erase` of a counted element | Both the element and its count annotation are removed. |
| Commit reusing an existing id | Replaces that element (`dots`/`shape`/`count`); the six creating actions are refused at the state layer instead — see FR-228. |
| A text/math command carrying `content_ref` | Accepted by the registry, resolved through the injected lesson-content pack, content stored byte for byte. |
| A text/math command carrying an unknown `content_ref` | Commits with empty content — a pack miss is the host's to surface, not a protocol rejection. |
| A text/math command carrying `content_ref` **and** inline `text`/`latex` | `E_SCHEMA` at the **registry** layer: content is inline or referenced, never both. |
| Read of the truth layer after a `scribble` | Does not contain the scribble. |
| `clear` on one layer | The other layer's elements are untouched. |
| `highlight`/`erase`/`reveal` with a known target | Applied to that element. |
| `highlight`/`erase`/`reveal` with an unknown target | `E_UNRESOLVED_REF`; nothing committed. |
| `content_ref` to a pack entry | Resolved byte for byte. |
| `content_ref` to nothing in the pack | Empty content; the element still commits. |
| Rejected command | Revision unchanged; committer never called. |
| `text`/`math`/`line`/`box`/`arrow`/`scribble` with a committed id | `E_STATE` at the state layer: "already committed. Ids must be unique within a page." |
| `text`/`math`/`line`/`box`/`arrow`/`scribble` with no board open | `E_STATE` at the state layer: "no board page is open. Call whiteboard.show first." |
| `dots`/`shape`/`count` reusing an id | Upserted (replaced), not rejected — the pinned reducer upserts these three. |
| Coordinate kwarg outside 0-100, or a box span past an edge | `E_SCHEMA` at the spatial layer. |

## 7. Error Catalog

| Code | Where |
|---|---|
| `E_SCHEMA` | From `FEAT-002`, for a malformed board command; also the plugin's registry-layer (content_ref exclusivity) and spatial-layer (0-100 board space) rules. |
| `E_UNRESOLVED_REF` | Unknown board target; raised here as an entity-layer stage. (`content_ref` misses are **not** rejections — see FR-232.) |
| `E_STATE` | A board operation the current state forbids: no open page, or a duplicate id on the six creating actions. |

## 8. State Transitions

`validated → resolved → committed` for a board command, on top of the core pipeline. The plugin
contributes an **entity-layer** validation stage (board target and `content_ref` resolution) and a
committer that applies the accepted effect to its own document. It adds no stage that could bypass
core's ordering.

## 9. Non-Functional Envelope

- **NFR-008, deterministic plugin behavior.** The same command sequence yields the same document and
  the same revision numbers. No clock, no randomness, no ordering by iteration accident.
- **INV-009.** Nothing in core imports this plugin; the dependency runs one way only, and
  `check:boundaries` enforces it.

## 10. Divergence Register

- **DIV-011** — Adopt the Virtual Classroom whiteboard superset for the six actions both hosts
  declare. `hide` occludes and preserves content where Clio's ends the beat and wipes marks; `id`
  becomes required on the creating actions; `content_ref`/`region`/`conceal` are accepted; enum,
  numeric, and colour constraints are enforced; `settleMs` is declared per action. The pinned VC
  source calls the `hide` difference deliberate, and the choice is recorded rather than left implicit.
  `TEST-204` asserts the distinction and would fail if `hide` were re-implemented as `clear`.

  One consequence worth naming: Clio's `whiteboard.show` and `whiteboard.box` carry kwargs VC does not
  (`subtitle`/`style`/`background`/`opacity`, and `opacity` respectively). They are **not** carried
  forward as accepted extras — a Clio producer that sends them is corrected rather than silently
  ignored, because silently ignoring a kwarg is how a producer learns the wrong vocabulary.

- **DIV-012** — Point-anchored board elements carry a nominal zero-size box; placement, text flow,
  and collision avoidance are renderer concerns the pinned reducer does not own (its renderer computes
  real boxes at render time). A headless document that emitted guessed boxes would fabricate
  geometry. `TEST-203`'s schema assertions are unaffected; `TEST-207`'s target resolution is
  box-independent.

- **DIV-013** — Core value-type grammars accept the superset the recovered hosts share: minutes in
  durations, `rgb()`/`rgba()` colours, case-insensitive enums (unless a schema declares
  `caseSensitive`). Booleans stay exactly `true`/`false`. Recorded at the `FEAT-002` owner
  (`docs/governance/divergences.json`), where its parity coverage lives; the whiteboard slice is
  exercised by `TEST-203`.

## 11. Parity Exits

- **TEST-203** — Full 21-surface recovered schema conformance.
- **TEST-204** — Hide-vs-clear divergence regression.
- **TEST-205** — Truth/thinking-layer isolation.
- **TEST-206** — `content_ref` byte-for-byte canonical content.
- **TEST-207** — Board target resolution for point/highlight/erase/reveal.

## 12. Tasks

- **T-074** Board document/revision model · **T-075** VC-superset command schemas ·
  **T-076** `content_ref` resolver hook · **T-077** Truth/thinking reducers ·
  **T-078** Clio compatibility mapping · **T-079** Board target/readiness tests

## 13. Success Criteria

1. Every one of the 21 owned surfaces is reachable through the registry — asserted by walking the
   surface list, not by counting actions — while the registry holds 15 actions, so no action is
   registered twice under two host identities.
2. **Every recovered contract matches the pinned source field by field**: required kwargs, optional
   kwargs and defaults, enum members, numeric/duration/colour fields, the entity kind a target
   resolves against, and the settle budget. A mutation of any one of them fails `TEST-203`.
3. A board that is hidden still holds every element, and one that is cleared holds none — asserted
   after the same intervening command sequence.
4. A scribble, an arrow, a highlight, and a count annotation are each absent from the truth layer and
   present in the thinking layer; clearing truth leaves all four.
5. `content_ref` resolves through the injected lesson-content pack, verified by comparison against
   the pack entry rather than against a constant, and reaching the resolver **through registry
   validation** rather than only at the helper.
6. An unknown target produces `E_UNRESOLVED_REF` and leaves the revision unchanged.
7. Every created element carries `reveal: 0` and its action's `revealMs`; `advance()` progresses it
   without spending a revision.
8. `pnpm check` is green.

## 14. Open Questions

No blocking unknowns. One scope decision is recorded: **this plugin provides state and resolution,
not rendering.** No element is drawn; the document is the contract a renderer reads. `ENT-010` places
rendering in the host, and a plugin that shipped a canvas would put a renderer inside the SDK's
dependency closure, which `DIV-007` forbids.

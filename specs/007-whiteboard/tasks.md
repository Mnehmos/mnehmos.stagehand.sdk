# Tasks — FEAT-012 Shared Whiteboard Canvas

Task identities are the canonical v2 slice `T-074..T-079` from
[issue #21](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/21). Generated task work
reconciles to these; no new task numbers are minted.

- [x] **T-074** Board document/revision model — FR-228
  - [x] Board document with committed elements and stable ids
  - [x] Monotonic revision, advancing only on a committed change
  - [x] Plugin-owned state; nothing in core holds or imports it

- [x] **T-075** VC-superset command schemas — FR-229 (reconverged against pinned source)
  - [x] All 15 contracts recovered from the pinned source, with required/optional kwargs, defaults, enums, numeric/duration/colour fields, entity kind, and settle budget
  - [x] Schemas derived from one contract table, so a contract cannot disagree with the registry
  - [x] Surface manifest covering all 21 owned surfaces, six of them sharing an action
  - [x] Six shared actions registered once, not once per host

- [x] **T-076** `content_ref` resolver hook — FR-232
  - [x] Resolves to the stored content byte for byte
  - [x] Unresolvable reference rejected rather than substituted
  - [x] Contributed as an entity-layer stage, not a bypass

- [x] **T-077** Truth/thinking reducers — FR-231
  - [x] Element layer is part of the element, not of the view
  - [x] `scribble`, `highlight`, and `count` produce thinking-surface marks; content actions produce truth
  - [x] Layer-scoped reads; clearing one layer leaves the other

- [x] **T-078** Clio compatibility mapping — FR-234
  - [x] The six Clio surfaces mapped to superset counterparts, as data
  - [x] VC semantics adopted where the hosts differ, with the difference recorded
  - [x] `hide` mapped to occlusion, never to `clear`

- [x] **T-079** Board target/readiness tests — FR-233
  - [x] Target resolution for `highlight`, `count`, `erase`, `reveal`; `scribble` resolves an optional target
  - [x] Unknown target reported as unresolved across all four
  - [x] Revision unchanged by a rejected command

## Parity exits

| Exit | Covers | Evidence |
|---|---|---|
| TEST-203 | Full 21-surface recovered schema conformance | `plugins/whiteboard/test/schema-conformance.test.ts` |
| TEST-204 | Hide-vs-clear divergence regression | `plugins/whiteboard/test/hide-vs-clear.test.ts` |
| TEST-205 | Truth/thinking-layer isolation | `plugins/whiteboard/test/layers.test.ts` |
| TEST-206 | `content_ref` byte-for-byte canonical content | `plugins/whiteboard/test/content-ref.test.ts` |
| TEST-207 | Board target resolution | `plugins/whiteboard/test/targets.test.ts` |

# FEAT-012 closeout — the behavior sweep is fully landed

Commits `d333a31..a359f0a`. M3 converged for FEAT-012; M4 (geo) unblocked.

## What closed, in order

The behavior-sweep handoff listed seven open items. All are now done, and one of them was a false
claim that this pass caught:

1. **Test cascade** (repair commit `d333a31`) — `targets.test.ts` rebuilt on the real exports;
   `schema-conformance.test.ts` opens the board. Also fixed gate 1's Windows encoding failure
   (`PYTHONUTF8=1` in `tools/corpus.mjs`; the frozen corpus was not touched).
2. **DIV-012 / DIV-013 recorded** (`dc7d6ac`) — nominal bounds for point-anchored elements; the
   value-type grammar superset (minutes, `rgb()/rgba()`, case-insensitive enums). Both in
   `docs/governance/divergences.json`; `check:ids` verifies citations.
3. **Behavior-file provenance** (`47c99f3`) — `docs/evidence/virtual-classroom-whiteboard-behaviors.json`
   carries commit/path/SHA-256 for `document.ts`, `validator.ts`, `runtime.ts`, and the pin's own
   `document.test.ts` at `cd725360`, fetched via the contents API (fetch → hash → discard, U-003
   boundary respected), plus a behavior→source-line→SDK-location map.
4. **Write-on timing actually implemented** (`15921b3`) — **the sweep handoff claimed this had
   landed, and it had not.** A probe showed committed elements carrying neither `reveal` nor
   `revealMs`. New `plugins/whiteboard/test/write-on.test.ts` failed 3/3, then
   `WRITE_ON_MS` (text 700, math 1100, line 500, box 600, arrow 600, highlight 300, scribble 700,
   dots 900, shape 800) plus count's `max(400, total × pace)` was wired into all three commit paths
   in `plugin.ts`. Lesson: verify each sweep item with a probe or a failing test before recording
   it as done; the earlier handoff did not.
5. **Live spec corrected** (`15921b3`) — FR-228 (pages, identity-equal no-ops, state-layer
   duplicate-id for the six creating actions vs upsert for dots/shape/count, write-on), FR-231
   (four thinking actions, arrow included), FR-232 (content_ref resolves through the injected
   lesson-content pack; a pack miss commits empty content rather than rejecting), behavior matrix
   rows, error catalog (`E_STATE` is now reachable), success criteria, DIV register.
6. **Per-action behavior/failure matrix** (`a359f0a`) — `specs/007-whiteboard/behavior-matrix.md`,
   every row cited to a pinned reducer line and a live test.

`pnpm check` green at every commit: 9 gates, 476 tests (28 files → 29 with write-on).

## State of the feature

All six tasks `T-074..T-079` are checked in `specs/007-whiteboard/tasks.md`; all five parity exits
`TEST-203..207` have live tests. The remaining sweep item, **mutation evidence for the seven sweep
behaviors**, is the only thing between this state and a formal `/speckit-converge` pass — the tests
exist, but the discipline of mutating each behavior and watching its test fail has not been recorded.

## Next step

Run `/speckit-converge` for FEAT-012 (mutation-evidence pass, then tick issue #21), then start
FEAT-007 Geospatial Camera: `/speckit-specify` seeded from `docs/corpus/specs/008-geo-camera/`
(deps FEAT-002/FEAT-003 converged; FEAT-016 is the only other eligible feature and is gated on
U-002).

# FEAT-012 behavior sweep — intermediate state, not converged

Commit `0d18b13`. M3 open, M4 held.

## What the third review found

The first reconvergence fixed the schema contracts but only opened `types.ts`. The maintainer opened
the behavior-bearing files (`src/board/document.ts`, `src/stagehand/validator.ts`, `src/app/runtime.ts`,
`src/board/document.test.ts`) and found a second layer of drift that the schema-conformance test
could not see.

## What landed in this commit

Seven behavioral corrections, all from the pinned reducer and validator:

1. **Spatial rules moved to a contributed `spatial` stage**, matching the pin's five-layer order. The
   vertical box-span check (which the SDK was missing) is present alongside the horizontal one.
2. **Duplicate-id rejection moved to a contributed `state` stage**, so `ValidationResult.layer` is
   now `state` rather than the wrong `entity`. Narrowed to the pin's exact action set
   (text/math/line/box/arrow/scribble) — dots/shape/count are excluded because the pin's reducer
   upserts those instead.
3. **Active-board requirement** added to the same state stage for those six actions.
4. **`advance()` and `expireMarks()` no longer increment the revision.** The pin's versions mutate
   display state without touching `doc.revision`, because the revision tracks committed changes, not
   renderer-frame progression.
5. **Write-on timing.** Every created element now carries `reveal: 0` plus its action-specific
   `revealMs` (text 700, math 1100, line 500, box 600, arrow 600, highlight 300, scribble 700,
   dots 900, shape 800, count `max(400, total × pace)`).
6. **`countableTotal` corrected** for circle/oval: sides are 0, not 1. The pin's geometry returns no
   vertices for shapes with fewer than three corners, and side midpoints need three.
7. **Center-based bounds.** Line/arrow use `boundsForSpan` (midpoint + span, min thickness 2) and box
   stores the supplied center. No corner conversion.

Two core fixes the sweep exposed:

- `ValidationStage` forbade a plugin contributing at the registry layer. Changed to allow it, because
  the pin fails content_ref-plus-inline at the registry layer and a plugin owning that command family
  should not have to surface it at a later layer.
- `validateCommand` only ran contributed stages in the `default` branch of its layer switch, so a
  registry-layer contribution was silently skipped. Fixed to run each layer's built-in rules followed
  by that layer's contributed stages.

## What is NOT done — do not claim convergence

1. **Typecheck errors in test files.** The pages-model change (document.elements →
   activeElements(document)) cascaded through four test files and the imports/exports have not all
   been reconciled.
2. **Test failures.** The state stage requires `document.visible`, which tests that don't call
   `whiteboard.show` first will fail on. The content-ref `run()` helper was updated to show the board
   first, but the other test files have not been.
3. **Behavior-file provenance** (commit/path/hash for document.ts, validator.ts, runtime.ts,
   document.test.ts) is not yet in `docs/evidence/`.
4. **No per-action behavior/failure matrix** artifact.
5. **The live spec has not been corrected** for arrow-as-thinking, no-op revision, pages, write-on
   timing, count totals, spatial layer, content_ref seam, or center-based bounds.
6. **DIV-012** (layout/bounds divergence) is referenced in a code comment but not recorded.
   **DIV-013** (broader FEAT-002 grammars: minutes in durations, rgb/rgba colours, case-insensitive
   enums) is needed too.
7. **No mutation evidence** for the new behaviors.

## Next step

Fix the typecheck and test failures (the state-stage `visible` check is the cascade root: either add
`whiteboard.show` to every test that creates elements, or restructure the state stage to not depend
on visibility). Then work through the remaining items above in order. Each one should be verified by
mutation before the next is started.

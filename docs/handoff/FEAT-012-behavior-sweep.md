# FEAT-012 behavior sweep — state at this commit

Second review (#21) required behavior parity, not just schema parity: **the corpus owns identity, the
pinned schema owns wire shape, the pinned reducers/validators/runtime/tests own observable behavior.**

## Done in this sweep

Source read (fetched, hashed, not committed): `src/board/document.ts`, `src/board/document.test.ts`,
`src/stagehand/validator.ts`, `src/app/runtime.ts` at `cd7253608297efd57921c965b7440f4d4081842f`.

- **Named pages.** `pages: [{id,title,elements}]` + `activePageId`. `show` creates a page, reopens one
  with content intact, updates a title.
- **No-op discipline.** A change that does nothing returns the same document, so the revision counts
  *changes* rather than commands (unknown target, uncountable source, clear that wipes nothing).
- **`content_ref`** resolves through an injected `ContentResolver` (lesson content pack), not against
  the board. A miss yields empty content and still commits, per the pin's `?? ''`. Inline
  `text`/`latex` is mutually exclusive with a ref, failed at the **registry** layer.
- **`arrow` is a thinking mark**, per `base('thinking', ...)` at document.ts:480.
- **`count`** computes a countable total (`dots`→items, `shape`→corners/sides), no-ops when the total
  is 0, and records `from`/`paceMs`/`budgetMs`.
- **`highlight`** carries `expiresAt`, with `duration=0` meaning permanent (`null`).
- **`reveal`** arms `reveal`/`revealMs` and `advance(ms)` progresses it; no invented `concealed` flip.
- **0–100 board space** validated, including box edge span. **Entity resolution** accepts
  `target ?? args[0]`. Optional `scribble target=` no longer rejects an unknown target (the pin falls
  back).
- The public kwarg is **`conceal`**; a test had been built on a `concealed` kwarg no producer could send.
- Two core fixes the sweep exposed: `ValidationStage` may contribute at the **registry** layer, and
  `validateCommand` was silently skipping contributed registry-layer stages entirely.

`pnpm check` exit 0, 9 gates, **473 tests**.

## NOT done — do not claim convergence

1. **Behavior-file provenance is not yet recorded.** The four files were fetched and read, but their
   commit/path/hash are not in `docs/evidence/`. The evidence file still covers `types.ts` only.
2. **No per-action behavior/failure matrix** for the 15 actions, which the review requires as an
   artifact.
3. **The live spec is not updated.** `FR-231` still lists three thinking producers (scribble,
   highlight, count) and omits `arrow`; the behaviour matrix lacks the no-op, page, expiry, reveal,
   spatial, and content-ref rows.
4. **`DIV-012` is referenced in a code comment but never recorded.** Delegated: automatic
   placement/collision-avoidance layout (document.ts `layOut`/`spotFor`) is renderer-side; the
   headless contract carries the producer's declared bounds instead. Parity consequence needs stating.
   Any other retained divergence needs a live DIV too.
5. **No mutation evidence** for the new behaviors (arrow layer, no-op revision, count total, page
   reopen, XOR rule).
6. **TEST-204..207 do not yet drive every case through the full public path** — the sweep moved
   several tests onto registry+stages+committer, but the review asks for that consistently.

## Next step

Record the provenance and the behavior matrix, correct FR-228..234, record DIV-012, then run the
mutations and post the evidence on #21. M3 stays open and M4 stays held until that lands.

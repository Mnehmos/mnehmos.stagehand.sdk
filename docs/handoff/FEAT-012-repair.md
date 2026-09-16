# FEAT-012 repair — repo returned to green

Commit `8929374`. M3 open, M4 held.

## What this session changed

Three files, all repair, no new behavior:

1. **`tools/corpus.mjs`** — the corpus's Python validator crashed on Windows: it reads UTF-8
   corpus files with the platform default encoding (cp1252). The validator lives inside the
   frozen corpus, so the fix is in the invocation: `PYTHONUTF8=1` is set in the spawned
   environment. No corpus byte changed. Gate 1 runs again.
2. **`plugins/whiteboard/test/targets.test.ts`** — was left mid-refactor referencing helpers
   that never existed (`./fixtures.js`, `makeRegistry`, `boardStateStage` unimported,
   `TARGET_ACTIONS` unimported, a dropped `context` helper argument). Rebuilt on the
   conventions `content-ref.test.ts` already uses: the plugin's own registry and `plugin.stages`,
   `TARGET_ACTIONS` from the package index, `whiteboard.show` in `seeded()` because the
   behavior sweep's state stage now requires an open board. One assertion moved from the
   retired wording ("already exists") to the pinned wording ("already committed").
3. **`plugins/whiteboard/test/schema-conformance.test.ts`** — the empty-default sentinel test
   validates `whiteboard.text` without opening a board; the state stage now rejects that.
   `whiteboard.show` added before the verdict, same as every sibling test.

`pnpm check` is green: all 9 gates, 473 tests.

## What was NOT done — the handoff's remaining items, in order

The behavior-sweep handoff listed seven open items; this session closed the two that blocked
every gate (typecheck, tests). The remaining five, in the order to do them:

1. **DIV-012 / DIV-013 recording.** DIV-012 (layout/bounds: point-anchored elements carry a
   nominal zero-size box; renderer-side placement) is referenced in a comment in
   `plugin.ts:130` but not declared in `docs/governance/divergences.json`, and `check:ids`
   fails a live spec that cites an uncatalogued divergence. DIV-013 (broader FEAT-002
   grammars: minutes in durations, rgb/rgba colours, case-insensitive enums) is needed too.
2. **Behavior-file provenance** in `docs/evidence/` (commit/path/hash for `document.ts`,
   `validator.ts`, `runtime.ts`, and their tests) — `virtual-classroom-whiteboard.json`
   covers the schema pass only.
3. **Live-spec correction** in `specs/007-whiteboard/spec.md` for: arrow-as-thinking,
   no-op revision, pages model, write-on timing, count totals, the spatial layer, the
   `content_ref` seam, center-based bounds.
4. **Per-action behavior/failure matrix** artifact.
5. **Mutation evidence** for the seven sweep behaviors.

## Verification

- `pnpm check` — all nine gates PASS, 473/473 tests.
- No corpus file touched; `check:corpus` verifies 176 files and passes, confirming the
  `PYTHONUTF8` change is invocation-side only.
- No production source changed; all three diffs are tooling or tests.

## Next step

Work the five items above in order, then FEAT-007 `/speckit-specify` from
`docs/corpus/specs/008-geo-camera/` (deps FEAT-002/003 converged; FEAT-016 is the only other
eligible feature and is gated on U-002).

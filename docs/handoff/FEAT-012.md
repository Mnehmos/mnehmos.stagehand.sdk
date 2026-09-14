# FEAT-012 · Handoff — Shared Whiteboard Canvas (first plugin)

Started this session with the build pipeline, then the feature.

## Part 1 — Build pipeline (pushed first, `643f56b`)

`pnpm build` runs `tsc -b tsconfig.build.json` and emits `dist/` for all 14 workspaces in dependency
order via tsconfig project references. `pnpm check` grew two gates: **build** and **check:exports**.

**Why the build is a gate and not a convenience.** `typecheck` resolves workspace imports through
`tsconfig.json`'s `paths` **to source**, so it cannot notice an undeclared cross-package dependency or
a declaration-emit problem. `build` resolves through `node_modules` and project references, which can.
It found one on its first run: `packages/authoring` importing `@stagehand/core` with no declared edge.
No feature can depend on its own package — authoring owns FEAT-004 and FEAT-011, core owns FEAT-004 —
so the derivation could never produce that edge, and `check:boundaries` only checked *declarations*.

Three fixes fell out:

- `workspaces.json` gained `additional_internal_dependencies`, an escape hatch for intra-feature
  package edges, with the reason recorded next to the field.
- `workspaces.mjs` and `boundaries.mjs` both fold it into the single derivation they share, so the
  enforcement and the declaration cannot disagree.
- The edge is declared and linked; the build passes.

`check:exports` verifies what `build` alone does not: that each package's declared `exports` targets
exist, that every `dist/index.d.ts` is present (invisible at runtime, loud for every TypeScript
consumer), and that each built entry module actually imports — catching a build that emitted files
which do not load. Verified with two probes: removing a declaration file, and pointing an export at a
file the build never produces.

## Part 2 — FEAT-012 (`5ca9372`)

**`plugins/whiteboard` is implemented and converged.** `FR-228..FR-234`, tasks `T-074..T-079`, parity
exits `TEST-203..TEST-207`. `pnpm check` green (9/9), **443 tests** across 28 files.

### The decision that mattered most

`hide` occludes; `clear` removes. Clio's surface list says only "hide whiteboard"; VC's records
"occlude/deactivate presentation **without destroying content**". A shared reducer with a flag gets
this wrong the first time someone refactors — and a teacher covering the board to talk over it loses
the lesson. Separate reducers, and `TEST-204` asserts them distinguishable *after the same intervening
sequence*, which is the only form of the assertion a flag-based reducer would fail. Verified by
mutation: collapsing `hide` into `clear` failed 5 tests.

### Fifteen actions, twenty-one surfaces

The corpus counts 21 because two hosts each declared their own list and six actions appear in both.
The union is registered once; the surfaces live in `SURFACE_MANIFEST`. `TEST-203` walks the **surface
ids**, not the action names — counting actions passes either way, because 15 is correct whether or not
a surface was lost.

### Structural choices

- **Layer is a property of the element**, not of the view. A truth read cannot contain a scribble.
- **`content_ref` reads from the element**, not a parallel map. I wrote the map first and removed it,
  along with its incoherent clear-handling.
- **An unknown target is unresolved, never guessed.** A guessed erase looks successful to any cheap
  assertion — something was erased — while the named element is still there.
- **The revision moves only in the committer**, which a rejected command never reaches.

### One finding other plugins should know

The build gate caught this package importing `@stagehand/parser`, which its ledger-derived
dependencies do not include. The fix was **not** to declare the dependency but to not need it:
`validate(command)`'s parameter is contextually typed by `ValidationStage`, so naming the type was the
only reason for the import. A type annotation should not be able to expand a package's dependency
closure — and now it cannot, because the build will notice.

## Evidence

| Gate | Result |
|---|---|
| 1 `check:corpus` | PASS — 176/176 hashes |
| 2 `check:constitution` | PASS |
| 3 `check:ids` | PASS — eight live specs each cover their declared range exactly |
| 4 `check:workspaces` | PASS |
| 5 `check:boundaries` | PASS — the whiteboard's dependencies are the ledger's, no more |
| 6 `typecheck` | PASS |
| 7 `build` | PASS — 14 packages emit, including the new plugin |
| 8 `check:exports` | PASS — 28 targets, 14 built entries imported |
| 9 `test` | PASS — 443 tests |

**Mutations performed and restored this session:** removing the atomic short-circuit (4 failures),
committing per effect (4), collapsing `resumable` to `settled` (4), removing the trace channel check
(14), replay deriving effects from production (4), `hide` collapsed into `clear` (5). Plus two
`check:exports` probes.

## Deferred

- **No rendering, deliberately.** The document is the contract a renderer reads. `ENT-010` puts
  rendering in the host, and shipping a canvas here would put a renderer in the SDK's dependency
  closure, which `DIV-007` forbids.
- **`line`/`box`/`arrow` geometry is not validated.** Their `from`/`to`/`region` kwargs are free
  strings, because the corpus records no grammar for them. A plugin that validated coordinates would
  be inventing a coordinate space the corpus does not describe.
- **No `whiteboard.point` action.** `TEST-207`'s title mentions "point" but no surface owns a `point`
  action; the three target-taking actions are `highlight`, `erase`, `reveal`. Recorded rather than
  inventing a sixteenth action.
- **The corpus conformance harness has still not been run *against* the parser** — ported, not
  differential. Carried since FEAT-001.
- **`U-005`** (trace version migration policy) remains a maintainer decision.

## Next step

**M3 is not yet closed** — FEAT-012 was its only feature, so it is: verify that and close
[#5](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/5), then **M4 · Geo reference plugin**
([#6](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/6)) begins with
`FEAT-007` (camera/view framing, [#16](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/16),
`FR-204..208`, `T-049..053`, `TEST-188..190`).

The whiteboard just established the plugin pattern M4 will repeat five times: **schemas + a
contributed entity stage + a committer**, with no trust path of its own. Two things to reuse rather
than rediscover:

1. **`TEST-190` is the geo analogue of `TEST-207`** — "Semantic-v2→primitive compiler goldens",
   i.e. a compiler pass. `FEAT-003` already exports `defineCompilerPass` and `runCompilerPasses`, and
   FEAT-004 left a `DIV-010`-style note that the real v2→primitive mappings belong to the plugins that
   own those dialects. `plugins/geo-clio` is where that note is cashed in.
2. **Declare the plugin's dependencies from the ledger, then let the build check them.** Two plugins
   have now been caught importing something their feature graph does not imply, and in both cases the
   right answer was to remove the import rather than widen the closure.

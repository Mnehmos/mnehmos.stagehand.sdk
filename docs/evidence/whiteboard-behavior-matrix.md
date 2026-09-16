# FEAT-012 Behavior/Failure Matrix

Recovered from the pinned Virtual Classroom reducer (`src/board/document.ts`), validator
(`src/stagehand/validator.ts`), and runtime (`src/app/runtime.ts`) at `cd7253608297efd57921c965b7440f4d4081842f`.

Cross-referenced to `docs/evidence/virtual-classroom-behavior.json` for provenance and
`docs/evidence/virtual-classroom-whiteboard.json` for wire contracts.

## Legend

| Column | Meaning |
|---|---|
| Registry | Cross-field or kwarg-type rules, checked before entity resolution |
| Entity | Target or `content_ref` resolution against committed elements |
| State | Board-state preconditions (active board, duplicate id) |
| Spatial | 0-100 board space and box edge-span checks |
| Reducer | Committed document change, including no-op conditions |
| Timing | `reveal` / `revealMs` on the committed element |

## Per-action matrix

### `whiteboard.show`

| Layer | Behavior | Failure |
|---|---|---|
| — | No validation rules | — |
| Reducer | Creates a named page if it does not exist (starting empty); reopens an existing page **with its content intact**; activates the current page if unnamed; updates `title` if supplied | Never no-ops |
| Timing | `revealMs: 600` | — |

### `whiteboard.hide`

| Layer | Behavior | Failure |
|---|---|---|
| — | No validation rules | — |
| Reducer | Sets `visible: false`. Does NOT remove elements. | Never no-ops |
| Timing | `revealMs: 400` | — |

### `whiteboard.clear`

| Layer | Behavior | Failure |
|---|---|---|
| — | `layer` enum: `all` (default) / `truth` / `thinking` | — |
| Reducer | Removes elements on the named layer (or all). **No-op** if the layer is already empty — the revision does not advance. Clears `choice` if its options are wiped. | No-op if already empty |
| Timing | `revealMs: 800` | — |

### `whiteboard.text`

| Layer | Behavior | Failure |
|---|---|---|
| Registry | `content_ref` XOR inline `text` | "use content_ref or inline text/latex, not both" |
| Entity | No target resolution | — |
| State | Requires an open board page. Rejects a duplicate `id`. | "no board page is open" / "already committed" |
| Spatial | `x`/`y` in 0-100 | "outside the 0-100 board space" |
| Reducer | Commits a `text` element on `truth` with `content` from `content_ref` (resolved via the injected pack) or inline `text`, whichever is present | — |
| Timing | `reveal: 0`, `revealMs: 700` | — |

### `whiteboard.math`

| Layer | Behavior | Failure |
|---|---|---|
| Registry | `content_ref` XOR inline `latex` | Same as text |
| Entity | No target resolution | — |
| State | Requires an open board page. Rejects a duplicate `id`. | Same as text |
| Spatial | `x`/`y` in 0-100 | Same as text |
| Reducer | Commits a `math` element on `truth` with `content` from `content_ref` or inline `latex` | — |
| Timing | `reveal: 0`, `revealMs: 1100` | — |

### `whiteboard.line`

| Layer | Behavior | Failure |
|---|---|---|
| Entity | No target resolution | — |
| State | Requires an open board page. Rejects a duplicate `id`. | Same as text |
| Spatial | `x1`/`y1`/`x2`/`y2` in 0-100 | Same as text |
| Reducer | Commits a `line` element on `truth` with center-based bounds (`midpoint`, span with min thickness 2) | — |
| Timing | `reveal: 0`, `revealMs: 500` | — |

### `whiteboard.box`

| Layer | Behavior | Failure |
|---|---|---|
| Entity | No target resolution | — |
| State | Requires an open board page. Rejects a duplicate `id`. | Same as text |
| Spatial | `x`/`y` in 0-100; `width`/`height` edge-span check in **both** dimensions | "spans past the board edge horizontally/vertically" |
| Reducer | Commits a `box` element on `truth` with the supplied center and size stored as-is | — |
| Timing | `reveal: 0`, `revealMs: 600` | — |

### `whiteboard.arrow`

| Layer | Behavior | Failure |
|---|---|---|
| Entity | No target resolution | — |
| State | Requires an open board page. Rejects a duplicate `id`. | Same as text |
| Spatial | `x1`/`y1`/`x2`/`y2` in 0-100 | Same as text |
| Reducer | Commits an **`arrow` on `thinking`** (not truth) with center-based bounds from the span | — |
| Timing | `reveal: 0`, `revealMs: 600` | — |

### `whiteboard.highlight`

| Layer | Behavior | Failure |
|---|---|---|
| Entity | `target` must resolve to a committed element | "requires a board target" / "no board element named X" |
| State | — (not in the pin's state-layer switch) | — |
| Spatial | — | — |
| Reducer | **No-op** if the target is absent. Otherwise commits a `highlight` mark on `thinking` linked to the target via `targetId`, with `expiresAt` = `now + duration` or `null` if `duration=0` (permanent) | No-op if target absent |
| Timing | `reveal: 0`, `revealMs: 300` | — |

### `whiteboard.scribble`

| Layer | Behavior | Failure |
|---|---|---|
| Entity | Optional `target` is NOT declared as an entity resolution. The reducer **falls back** to synthesized points under the target's bounds when it can be found, or under the board center when it cannot | Never rejected |
| State | Requires an open board page. Rejects a duplicate `id`. | Same as text |
| Spatial | — | — |
| Reducer | Commits a `scribble` on `thinking` with `points` parsed from a comma/space-separated list (minimum 4 numbers, else synthesized) | — |
| Timing | `reveal: 0`, `revealMs: 700` | — |

### `whiteboard.dots`

| Layer | Behavior | Failure |
|---|---|---|
| Entity | No target resolution | — |
| State | **Not covered** — the pin's state-layer switch does not include `dots`. A duplicate id is NOT rejected; the reducer upserts | — |
| Spatial | `x`/`y` in 0-100 | — |
| Reducer | Commits a `dots` element on `truth` with `count` clamped to `max(0, round(n))`, `arrange`, and `token` | — |
| Timing | `reveal: 0`, `revealMs: 900` | — |

### `whiteboard.shape`

| Layer | Behavior | Failure |
|---|---|---|
| Entity | No target resolution | — |
| State | **Not covered** — same as `dots`. A duplicate id is NOT rejected; the reducer upserts | — |
| Spatial | `x`/`y` in 0-100 | — |
| Reducer | Commits a `shape` element on `truth` with `shape` from the enum, `fill` from the enum, and `size` | — |
| Timing | `reveal: 0`, `revealMs: 800` | — |

### `whiteboard.count`

| Layer | Behavior | Failure |
|---|---|---|
| Entity | `target` must resolve to a committed element | "requires a board target" / "no board element named X" |
| State | — (not in the pin's state-layer switch) | — |
| Spatial | — | — |
| Reducer | **No-op** if the target is absent or if `countableTotal(target, what) === 0` (uncountable). Otherwise commits a `count` mark on `thinking` linked to the target via `targetId`, with `total`, `what`, and `from`. The settle budget is `max(400, total × pace)`. `id` is optional and names the annotation group; it defaults to `count:${targetId}` | No-op if target absent or uncountable |
| Timing | `reveal: 0`, `revealMs: max(400, total × pace)` | — |

### `whiteboard.erase`

| Layer | Behavior | Failure |
|---|---|---|
| Entity | `target` must resolve to a committed element | "requires a board target" / "no board element named X" |
| State | — | — |
| Spatial | — | — |
| Reducer | Removes the element AND marks linked to it via `targetId` (highlights and counts). **No-op** if the target is absent — the revision does not advance | No-op if target absent |
| Timing | No reveal timing (the element is removed) | — |

### `whiteboard.reveal`

| Layer | Behavior | Failure |
|---|---|---|
| Entity | `target` must resolve to a committed element | "requires a board target" / "no board element named X" |
| State | — | — |
| Spatial | — | — |
| Reducer | Sets `reveal: 0` and `revealMs` (from the `duration` kwarg, default 1200) on the target. **No-op** if the target is absent | No-op if target absent |
| Timing | `reveal: 0`, `revealMs: 1200` (or the supplied duration) | — |

## Cross-action invariants

| Invariant | Behavior |
|---|---|
| Revision tracks changes | A no-op does not advance the revision. A rejected command does not reach the committer. |
| Transient state does not spend the revision | `advanceReveals()` and `expireMarks()` modify page elements without incrementing `doc.revision`. |
| Marks retire with their targets | Erasing an element removes highlights and count annotations linked via `targetId`. |
| `content_ref` resolves via the injected pack | Not board-element lookup. A miss yields empty content and still commits. |
| `content_ref` XOR inline | Fails at the registry layer. |
| Truth/thinking isolation | `arrow`, `highlight`, `scribble`, `count` → thinking. Everything else → truth. |
| Write-on timing | Every created element carries `reveal: 0` plus its action-specific `revealMs`. |
| Active board required | `text`, `math`, `line`, `box`, `arrow`, `scribble` require an open board page at the state layer. |
| Duplicate id rejection | `text`, `math`, `line`, `box`, `arrow`, `scribble` only. `dots`, `shape`, `count` upsert instead. |

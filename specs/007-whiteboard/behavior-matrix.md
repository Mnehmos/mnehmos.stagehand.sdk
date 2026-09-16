# FEAT-012 · Per-action behavior and failure matrix

Ground truth: the pinned reducer (`src/board/document.ts`, provenance and hashes in
`docs/evidence/virtual-classroom-whiteboard-behaviors.json`) and validator
(`src/stagehand/validator.ts`). Column "pin" cites the reducer's line at the pinned commit. "Test"
names the live test file that would fail if the row's behavior regressed.

Layers, in pipeline order: `syntax → registry → entity → state → spatial` (a plugin may contribute
at any layer; `FEAT-002` owns the machinery, `packages/registry/src/validate.ts:191-208`).

## Creating actions (commit a new element)

| Action | Layer failures (in gate order) | Commit behavior (pin line) | Write-on | Layer | Test |
|---|---|---|---|---|---|
| `whiteboard.show` | — | Creates named page / reopens intact / updates title; `revision+1`; `visible=true` (427 area, `case 'show'`) | — | — | hide-vs-clear, targets |
| `whiteboard.hide` | — | `visible=false`; content survives; occlusion, not erasure | — | — | hide-vs-clear |
| `whiteboard.clear` | — | Removes `layer=all/truth/thinking` from active page; wiping nothing is a no-op (same reference) | — | — | hide-vs-clear, layers |
| `whiteboard.text` | registry: `content_ref`+inline; spatial: x/y 0-100, region known; state: board open, id unique | Element to truth at point (400-436); content = pack ref or inline | 700 | truth | schema-conformance, write-on, content-ref |
| `whiteboard.math` | same as text | Like text; never wrapped (438-450) | 1100 | truth | schema-conformance, content-ref |
| `whiteboard.line` | spatial: x1/y1/x2/y2 0-100 | Span to truth; midpoint+span box, min thickness 2 (452-459) | 500 | truth | write-on, targets |
| `whiteboard.box` | spatial: x/y/w/h, span within edges | Center-based box to truth (461-470) | 600 | truth | write-on |
| `whiteboard.arrow` | spatial: x1..y2 0-100 | **Thinking** — `base('thinking', …)` (472-484) | 600 | thinking | layers, write-on |
| `whiteboard.scribble` | state: board open, id unique | Thinking; `points` parsed; < 4 points falls back to `scribbleUnder(target.bounds)` (504-518) | 700 | thinking | layers |
| `whiteboard.dots` | state: none (upserts) | Truth; `count` clamped ≥ 0 (544-560) | 900 | truth | layers |
| `whiteboard.shape` | state: none (upserts) | Truth; `filled` only when `fill=true` (562-576) | 800 | truth | layers |
| `whiteboard.count` | entity: target must exist | Thinking mark `count:<targetId>`; `total=0` (uncountable) is a **no-op**; budget `max(400, total×pace)` (580-604) | max(400, total×pace) | thinking | targets, write-on |

## Target-taking actions

| Action | Failure | Commit behavior (pin line) | Test |
|---|---|---|---|
| `whiteboard.highlight` | Unknown target → **no-op**, not an error (`if (!target) return doc`); entity stage rejects only a *missing* target argument | Thinking mark `highlight:<targetId>` on target's bounds; re-highlight replaces (`id` derived); `duration=0` → `expiresAt: null` (permanent) else `now+duration` (486-502) | targets |
| `whiteboard.erase` | Unknown target → no-op (`kept.length === page.elements.length`) | Removes element **and** marks with `targetId === target`; erasing a choice option retires the question (520-534) | targets |
| `whiteboard.reveal` | Unknown target → reducer maps over elements, no match → same reference | Sets `reveal: 0`, `revealMs: parseDuration(duration, 1200)` on target; revision advances (535-542) | targets, write-on |

## Failure catalog (validator, `validator.ts` line refs)

| Failure | Layer | Trigger | Message shape |
|---|---|---|---|
| `E_SCHEMA` | registry | `content_ref` with inline `text`/`latex` (166-169) | "use content_ref or inline text/latex, not both" |
| `E_SCHEMA` | spatial | kwarg outside 0-100; box span past edge | "`<key>=<value>` is outside the 0-100 board space" |
| `E_UNRESOLVED_REF` | entity | `target` absent or not on board (173-186) | "requires a board target" / "No board element …" |
| `E_STATE` | state | board closed for the six creating actions (309-316) | "no board page is open. Call whiteboard.show first." |
| `E_STATE` | state | duplicate id on the six creating actions (317-321) | "already committed. Ids must be unique within a page." |
| no-op | (not an error) | highlight/erase with unknown target; count with `total=0` | reducer returns the **same document**; revision does not move |

## Invariants asserted across actions

- **Revision counts changes, not commands.** A rejected command never reaches the committer; a
  no-op returns the identity document; `advance()`/`expireMarks()` never spend the revision.
- **A miss is not a guess.** Every unresolved target is `E_UNRESOLVED_REF`; every unknown-target
  commit path is a no-op. No code path invents an element, a position, or a count.
- **Layers are a property of the element.** Truth reads cannot contain thinking marks regardless of
  who reads or when.
- **The document is the contract.** No rendering, no DOM, no clock dependence beyond the injected
  one (highlight expiry).

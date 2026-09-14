# Handoff — FEAT-012 reconvergence (source-backed schema parity)

Supersedes the earlier [FEAT-012.md](FEAT-012.md). The maintainer rejected the M3 close on a
source-level parity review; this records what was wrong, what was done, and what the lesson costs
later features.

## What the review found, and why it was right

I treated the corpus's compressed Pass-9 behavior strings as complete specifications. **They are an
index.** The exact wire contracts live in the pinned source, which I did not open.

Two contract errors shipped while `TEST-203` stayed green, because it asserted 21 surface ids and 15
action names — and **15 is the correct action count whether or not the contracts are right**. Presence
is not conformance.

| Error | Consequence |
|---|---|
| `whiteboard.count` transcribed as `{of, value}` from a one-line summary | The real contract is target-based. The action was effectively **dead**: no `id`, no target, and the generic creation path requires one. |
| `content_ref` missing from `whiteboard.text`/`whiteboard.math` | `TEST-206` invoked the resolution helper directly, so it proved the helper worked and not that a producer could reach it. With the schema missing, a real command was rejected **before** that stage. |

## What changed

**Evidence.** `docs/evidence/virtual-classroom-whiteboard.json` records both pinned sources (repo,
commit, path, lines, sha256, retrieval date) and all 15 VC plus 6 Clio contracts. Interface facts
only: `U-003` leaves the VC license unresolved, and Article XI gates source-derived **code** on it, so
nothing is vendored.

**One table, derived schemas.** `src/contracts.ts` holds the recovered contracts; the registered
schemas are derived from it. A contract cannot disagree with the registry because there is only one
statement. `TEST-203` compares the table against the evidence field by field.

**`whiteboard.count`** is target-based with `what`/`from`/`pace`/`color`/optional `id`, commits a
thinking-layer annotation linked to its target, and is removed when that target is erased.

**`content_ref`** is declared on `text` and `math`, and four end-to-end cases now go through
`validateCommand` with the plugin's registry **and** stages.

**`DIV-011`** records adopting the VC superset over Clio for the six shared actions — notably that
Clio's `hide` wipes marks while VC's preserves. Kwargs Clio has and VC does not are **not** carried as
accepted extras.

## Two bugs found beyond the review

- **The reducer duplicated elements on a repeated id.** Highlight has no `id` of its own, so its mark
  id derives from its target; a second highlight appended a second mark. `reduce`'s commit is now an
  upsert by id, while the validation stage still refuses a producer reusing an id on a creating
  action.
- **A colour kwarg could not express the source's semantics.** The source says "a named ink colour or
  an explicit `#rrggbb`", which a bare enum cannot express — it would reject the hex form the same
  kwarg accepts. `ColorValue` gained an optional `named` list. Additive; no existing fixture changes
  behaviour.

## Evidence

`pnpm check` → exit 0, 9 gates PASS, **476 tests** (whiteboard 93, up from 60).

Mutations run and restored:

| Mutation | Failures |
|---|---|
| `count` loses required `target` and `resolvesEntity: board` | 2 — naming `resolvesEntity` and the required-key set |
| `content_ref` dropped from `whiteboard.text` | 4 — the contract comparison plus three end-to-end cases, one reporting the command rejected at the *registry* layer before reaching the stage |

Also re-verified from earlier work: atomic short-circuit (4), per-effect commit (4), `resumable`
collapsed to `settled` (4), trace channel check removed (14), replay reading production events (4),
`hide` collapsed to `clear` (5). Plus two `check:exports` probes.

## Process state

**M3 (#5) is left unchecked and M4 (#6) on hold** — the review gate is the maintainer's to accept, not
mine to re-assert. The reconvergence evidence is posted on #21.

## The lesson, which matters more than this bug

**The corpus owns identities; the pinned source owns contracts.** Every later feature must re-open the
source files its surfaces name and recover required/optional kwargs, defaults, enums,
numeric/duration/colour constraints, entity-resolution semantics, and failure cases — then record
them where a test can compare against them.

For the geo block this is not hypothetical. `FEAT-007`'s surfaces cite
`Mnehmos/clio@03b1e1f:src/stagehand/types.ts`, which I have now read: it declares
`resolvesEntity: false` on Clio schemas and carries **no `settleMs` field at all**, so the camera
contracts will not look like the whiteboard's and must not be assumed to. `Mnehmos/virtual-classroom`
is public; `Mnehmos/clio` is accessible via `gh`. The pattern to reuse: fetch the pinned file, record
its hash, transcribe the contracts into an evidence file, derive the schemas from one table, and make
the conformance test compare fields rather than count actions.

## Next step

Await the review on #21. On acceptance, M3 closes and M4 opens with `FEAT-007` — with the
source-evidence rule applied from the first commit rather than retrofitted, which is the whole point
of the exercise.

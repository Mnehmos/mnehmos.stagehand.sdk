# @stagehand/plugin-whiteboard

Reusable screen-space explanatory canvas: text, math, shapes, counting, erasure, reveal.

| | |
|---|---|
| Layer | `plugin` |
| Kind | `plugin` |
| Directory | `plugins/whiteboard` |
| Owner features | FEAT-012 |
| Internal dependencies | `@stagehand/readiness`, `@stagehand/registry`, `@stagehand/runtime`, `@stagehand/trace` |
| Status | implemented — FEAT-012 converged through T-074..T-079 |

## Usage

```ts
import { WhiteboardPlugin } from '@stagehand/plugin-whiteboard';
import { executeStagehandCommand } from '@stagehand/runtime';

const whiteboard = new WhiteboardPlugin({ bus, gate, onChange: (doc) => render(doc) });

executeStagehandCommand(whiteboard.registry, command, {
  committer: whiteboard,        // applies accepted effects to the document
  stages: whiteboard.stages,    // resolves board targets and content_ref
});

whiteboard.revision;            // advances only on a committed change
whiteboard.document;            // { revision, visible, elements }
elementsOn(whiteboard.document, 'truth');   // never contains a scribble
```

## Contracts come from the pinned source, not from the corpus summary

The corpus owns identities and traceability but **compresses** exact wire contracts. An earlier
version of this plugin transcribed `whiteboard.count` as `{of, value}` from a one-line corpus
behaviour string and omitted `content_ref` from `whiteboard.text`/`whiteboard.math` entirely — while
still registering 15 actions, so a test that counted actions stayed green through both errors.

The contracts now live in `src/contracts.ts`, transcribed from:

- Virtual Classroom `cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` lines 313-550
- Clio `03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` lines 730-810

both recorded with repo, commit, path, and file hash in
`docs/evidence/virtual-classroom-whiteboard.json`. The registered schemas are **derived** from that
table, so one statement cannot disagree with the other, and `TEST-203` compares the table against the
evidence field by field — required kwargs, optional defaults, enum members, numeric/duration/colour
fields, the entity kind a target resolves against, and the settle budget.

## What this plugin guarantees

- **`hide` occludes; `clear` removes.** They are separate reducers, and `TEST-204` asserts them
  distinguishable *after the same intervening sequence* — the only form a shared reducer with a flag
  would fail. The pinned VC source records this as a deliberate divergence from Clio, where `hide`
  wipes marks: a teacher covering the board to talk over it must not lose the lesson. (`DIV-011`.)
- **Three actions produce thinking-surface marks**: `scribble`, `highlight` ("a thinking-surface mark
  over a truth-surface element — it never alters the element"), and `count`. Layer is a property of
  the element, not of the view, so a truth read cannot contain a teacher's rough working.
- **`whiteboard.count` numbers an element.** Required `target`, `what=items|corners|sides`, `from`,
  `pace`, `color`, and an optional `id`. The numbering is a thinking-layer annotation linked to the
  counted element, and erasing that element removes the annotation with it.
- **`content_ref` returns the committed bytes**, on `text` and `math` where the source declares it.
  Read from the element rather than a parallel map: a second copy is a second thing to keep in step,
  and the one that goes stale is always the one nobody reads directly.
- **An unknown target is unresolved, never guessed.** Applying an erase to a guessed element looks
  successful in every way a cheap test would check — something was erased — while the element the
  producer named is still there.
- **The revision moves only in the committer**, which a rejected command never reaches.

## Fifteen actions, twenty-one surfaces

The corpus records 21 surfaces because two hosts each declared their own list, and six actions appear
in both:

| Actions | Clio | VC |
|---|---|---|
| `show` `hide` `clear` `text` `line` `box` | SURF-034..039 | SURF-057..063 |
| `math` | — | SURF-061 |
| `arrow` `highlight` `scribble` `dots` `shape` `count` `erase` `reveal` | — | SURF-064..071 |

Registering 21 schemas would put two contracts on one action name, which the registry rightly refuses
as a duplicate — so the **union** (15) is registered once and the 21 surfaces are tracked in
`SURFACE_MANIFEST`. `TEST-203` walks the surface ids rather than the action names, because counting
actions would pass either way: 15 is the correct number whether or not a surface was lost.

Where the two hosts' contracts differ, VC's is adopted and every difference is recorded in
`CLIO_COMPATIBILITY` — optional kwargs, defaults, required-ness, enum and numeric constraints, and
the `settleMs` field Clio lacks entirely. That makes the adoption a registered divergence
(`DIV-011`) rather than one host winning by accident. Kwargs Clio has and VC does not
(`subtitle`/`style`/`background`/`opacity`) are **not** carried as accepted extras: a Clio producer
sending them is corrected rather than silently ignored.

## What this plugin does *not* do

Render anything. No element is drawn; the document is the contract a renderer reads. `ENT-010` puts
rendering in the host, and shipping a canvas here would put a renderer inside the SDK's dependency
closure, which `DIV-007` forbids.

## Requirements owned

| Feature | v2 requirements | v2 tasks | Parity exits |
|---|---|---|---|
| FEAT-012 Shared Whiteboard Canvas | FR-228..FR-234 | T-074, T-075, T-076, T-077, T-078, T-079 | TEST-203, TEST-204, TEST-205, TEST-206, TEST-207 |

## Corpus seed

- FEAT-012: `21` surfaces, `21` v1 requirements, `21` v1 tests — seed spec `docs/corpus/specs/`, issue [#21](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/21)

See [V2_ID_LEDGER.md](../../docs/governance/V2_ID_LEDGER.md) for the canonical identity allocation and
[SPEC_KIT_RUNBOOK.md](../../docs/governance/SPEC_KIT_RUNBOOK.md) for the per-feature workflow.

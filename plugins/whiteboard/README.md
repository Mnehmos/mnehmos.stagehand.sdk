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

## What this plugin guarantees

- **`hide` occludes; `clear` removes.** They are separate reducers, and `TEST-204` asserts them
  distinguishable *after the same intervening sequence* — the only form a shared reducer with a flag
  would fail. Clio's surface list describes `hide` only as "hide whiteboard"; VC's records
  "occlude/deactivate presentation **without destroying content**". Collapsing them destroys a
  lesson's work silently the moment a teacher covers the board to talk over it.
- **Layer is a property of the element**, not of the view. `scribble` commits to `thinking`; a truth
  read cannot contain a teacher's rough working, and clearing one layer leaves the other.
- **`content_ref` returns the committed bytes.** Read from the element rather than a parallel map:
  a second copy is a second thing to keep in step, and the one that goes stale is always the one
  nobody reads directly.
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

Where the two hosts' descriptions differ, VC's is adopted and the difference is recorded in
`CLIO_COMPATIBILITY` — so the choice is explicit rather than one host winning by accident.

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

# 12 · Component Map

## Portable core candidates

| Component | Current source(s) | Purpose | Rebuild disposition |
|---|---|---|---|
| Command IR | Clio/VC `types.ts` | `{action,args,kwargs,raw}` and segment union | CORE |
| Batch parser | Clio/VC `parser.ts` | compile complete mixed stream | CORE |
| Streaming parser | Clio/VC `parser.ts` | compile live token stream incrementally | CORE |
| Compound composer | Clio/VC parser | batch/sequence/parallel/beat | CORE, use VC nesting semantics |
| Schema registry | Clio/VC `types.ts` / Clio registry/introspection | typed capabilities + authoring metadata | CORE |
| Validation result algebra | Clio/VC validators | accepted/rejected with named diagnostics | CORE |
| Event boundary | VC `events.ts` | public vs private typed events | CORE |
| Trace | VC events + Clio ADR | replayable performance record | CORE |
| Readiness gate | VC `readiness.ts` | asynchronous effect settle synchronization | CORE |
| Introspection | Clio/VC | derive tool/authoring context from registry | CORE |
| Authoring lint | Clio | static semantic placement lint | OPTIONAL CORE PACKAGE |
| Compound/beat report | Clio | editorial intent + QA | OPTIONAL AUTHORING PACKAGE |

## Application adapters

### LLM-Chess adapter

- `src/utils/board-annotations.ts`: tag parser + natural-language cue inference + normalization/dedup. [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts:1-500
- Prompt templates emit visual tags. [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/llm/prompts.ts:1-500
- Rebuild interpretation: keep explicit chess command plugin; make prose inference an opt-in producer-side compatibility layer, not trusted core.

### Clio geo/showrunner adapter

Behavioral module set discovered under a 27-file Stagehand path. Key modules evidenced in source/search:

- `index.ts` — module API.
- `types.ts` — command union + schemas.
- `parser.ts` — batch/stream parsing + compounds.
- `validator.ts` — structural/domain validation.
- `runtime.ts` — entity canonicalization + release events.
- `adapter.ts` — v2 semantic command → v1 primitive compilation.
- `introspection.ts` — tool/registry discovery for agents.
- `beats.ts` — beat planner/report representation.
- `visualValidators.ts` — pre-render semantic/visual checks.
- `entityProposal.ts` — controlled registry proposals.
- `palette.ts` — semantic style resolution.
- authoring lint / preview/QA support evidenced by commit history. [g] `3b9ec49b4ccb66b287ea2238589ca8c18a2b4de7`, `fe597d56f59217fae6ea939151fdb26004b735e1`.

### Virtual Classroom adapter

GitHub path census: **10 files** under `src/stagehand`. Important behavior modules:

- `types.ts` — 38-command classroom dialect + richer schema metadata.
- `parser.ts` — hardened lexer, nested compounds, bare-command recovery.
- `repair.ts` — conservative pre-validation repairs.
- `validator.ts` — five validation layers.
- `registry.ts` — semantic anchors + board entities.
- `events.ts` — public/private event bus and trace.
- `readiness.ts` — keyed settle gates.
- introspection/schema helpers referenced by Director.
- Remaining entries in the 10-file path census were not mechanically classified in the original remote-only extraction. [?] U-013.

Host modules outside `src/stagehand` are still critical adapters: `app/runtime.ts`, `board/document.ts`, `avatar/teacher.ts`, `media/projector.ts`, `tts/player.ts`, `lesson/director.ts`. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:HANDOFF.md:1-180

### VCB DOM presenter adapter

`Stagehand.tsx` is a compact host implementation: parse `[stage.*]` directives, strip them from visible text, anchor commands to word count, follow audio timestamps at requestAnimationFrame cadence, and mutate DOM focus/highlight/diagram state. [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:1-500

## Health notes

- **Highest maturity as protocol architecture:** Clio; richest authoring/QA lineage.
- **Highest maturity as trust/timing runtime:** Virtual Classroom; strongest explicit public/private boundary and readiness model.
- **Simplest proof of mechanism:** LLM-Chess and VCB.
- **Extraction risk:** names and concepts are duplicated but semantics diverged. A copy-and-paste merge would create a union-of-everything API. The SDK should extract invariants and capability interfaces, then ship adapters.

## Gate 2 component closure

All Stagehand-bearing repositories identified in Pass 0 have a mapped producer → compiler → validation → host-effect path. Remaining exact file-list completeness for Clio's 27 path entries is T2 U-006 because GitHub search provided count but not a compact filename-only endpoint through the available connector.

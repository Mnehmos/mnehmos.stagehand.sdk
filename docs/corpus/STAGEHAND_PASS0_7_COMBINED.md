# Stagehand Reverse Engineering — Combined Pass 0–6 Corpus


---

<!-- SOURCE: README.md -->

# Stagehand Reverse-Engineering Corpus — Passes 0–6

This directory is the evidence/specification handoff for rebuilding Mnehmos Stagehand as a standalone SDK. It covers the protocol lineage and applications in LLM-Chess, Clio, Virtual Classroom, and the Vibe Coders Bible presenter, with `exhibit-of-shadows` recorded as an excluded naming collision.

Start with:

1. `00_MANIFEST.md`
2. `analysis/11_ARCHITECTURE.md`
3. `analysis/13_SURFACE_INVENTORY.md`
4. `analysis/22_INTENT_ARCHAEOLOGY.md`
5. `analysis/23_RE_FINDINGS.md`
6. `ASTRA_HANDOFF.md`

Passes 7–11 have intentionally **not** been fabricated. `ASTRA_HANDOFF.md` states the extracted SDK thesis and the constraints Astra should carry into the remaining Spec Kit pipeline.


---

<!-- SOURCE: 00_MANIFEST.md -->

# Stagehand Reconstruction Corpus — Passes 0–6

**Target:** Mnehmos Stagehand protocol and every identified protocol-bearing application.  
**Posture:** informed rewrite into a reusable FOSS SDK.  
**Source mode:** remote GitHub repositories pinned to immutable commits.  
**Run date:** 2026-09-13.  
**Requested pass range:** 0 → 6, continuous one-shot run.  
**Important override:** the upstream `/reverse-engineer` prompt recommends one pass per session; the maintainer explicitly requested a continuous 0–6 run. The evidence/unknown rules remain in force.

## Source snapshots

| Alias | Repository | Commit | License posture |
|---|---|---|---|
| CHESS | `Mnehmos/LLM-Chess` | `450bdbded7f34e94cffc02264082849714270af3` | no root LICENSE discovered |
| CLIO | `Mnehmos/clio` | `03b1e1fff2254f5f97947ea249ad84827118136e` | MIT |
| VC | `Mnehmos/virtual-classroom` | `cd7253608297efd57921c965b7440f4d4081842f` | no root LICENSE discovered |
| VCB | `Mnehmos/vibe-coders-bible` | `cb032732158f615331e00c27f688a3c847c0a97c` | CC-BY-4.0 |

## Corpus status

| Pass | Name | Status | Gate |
|---:|---|---|---|
| 0 | Frame | COMPLETE WITH RUNTIME UNKNOWN | GATE 0: conditional pass; remote source/build procedures identified, execution unavailable in this tool environment → U-001 |
| 1 | Surface Enumeration | COMPLETE for Stagehand-owned surfaces | GATE 1: 168/168 enumerated rows across applicable protocol/export/event/config/format classes |
| 2 | Structure | COMPLETE | GATE 2: all identified Stagehand layers and application adapters classified; Clio path census 27 files, VC path census 10 files |
| 3 | Contracts | COMPLETE at protocol/SDK boundary | GATE 3: 97/97 command actions catalogued; 20/20 Clio module exports; 33/33 runtime/public/private event names; 12/12 VC env keys |
| 4 | State | COMPLETE | GATE 4: portable protocol entities and host-state boundaries modeled; invariants name enforcement or an unknown |
| 5 | Cross-cutting | COMPLETE statically | GATE 5: integrations and failure modes mapped; unmeasured runtime NFRs explicitly [?] |
| 6 | Intent archaeology | COMPLETE | GATE 6: major architectural seams have DEC records; unexplained items are U records |

## Counts frozen by Pass 1

- Protocol command surfaces: **97** = LLM-Chess 4 + Clio 47 + Virtual Classroom 38 + VCB presenter 8.
- Clio Stagehand module exports: **20**.
- Event names: **33** = Virtual Classroom 28 (20 public + 8 private) + Clio runtime 5.
- Stagehand-adjacent VC environment keys: **12**.
- Explicit wire/file-format surfaces: **6**.
- Total enumerated surfaces in `analysis/13_SURFACE_INVENTORY.md`: **168**.
- Clio files under `src/stagehand`: **27**, discovered with GitHub code search `repo:Mnehmos/clio path:src/stagehand`. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts:1-25
- Virtual Classroom files under `src/stagehand`: **10**, discovered with GitHub code search `repo:Mnehmos/virtual-classroom path:src/stagehand`.

## High-confidence SDK thesis

Stagehand is not a renderer and not a prompt style. It is a **mixed-stream compilation and trust boundary**: a model emits narration plus inline control syntax; a deterministic runtime separates content/control, validates commands against a typed capability registry and domain state, resolves semantic references, commits only authorized effects, and can synchronize narration to the resulting state changes. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0009-stagehand-protocol.md:1-220

## Pass 0 blocking unknown carried forward

U-001 records that builds and runtime behavior could not be executed from the remote-only connector environment. Static extraction proceeded because the maintainer explicitly requested uninterrupted Passes 0–6. No claim in this corpus is tagged `[o] observed:`.


---

<!-- SOURCE: sources/SOURCE_INDEX.md -->

# Remote source index

This corpus was extracted from GitHub remote repository contents, not a local checkout. All behavior claims in the analysis tier are tied to one of these immutable commit snapshots.

| Alias | Repository | Commit | Branch at discovery | Visibility | License posture |
|---|---|---|---|---|---|
| CHESS | `Mnehmos/LLM-Chess` | `450bdbded7f34e94cffc02264082849714270af3` | `main` | public | no root LICENSE discovered |
| CLIO | `Mnehmos/clio` | `03b1e1fff2254f5f97947ea249ad84827118136e` | `develop` | private | MIT |
| VC | `Mnehmos/virtual-classroom` | `cd7253608297efd57921c965b7440f4d4081842f` | `main` | public | no root LICENSE discovered |
| VCB | `Mnehmos/vibe-coders-bible` | `cb032732158f615331e00c27f688a3c847c0a97c` | `main` | public | CC-BY-4.0 |
| EXHIBIT | `Mnehmos/exhibit-of-shadows` | `ebf08d6decd1d41c23136a51ee27995e53cb2e2d` | `main` | public | excluded naming collision |

## Scope decision

Included protocol lineage: LLM-Chess → Clio → Virtual Classroom, plus the Vibe Coders Bible presenter/reference implementation. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0009-stagehand-protocol.md:1-220

`Mnehmos/exhibit-of-shadows` is excluded from protocol reconstruction: its “stagehand console” is a diegetic tuning/control panel rather than the mixed narration/control protocol. [i] inferred from repository search hits and console/decision documentation; falsifier: find a parser/schema/validated mixed-stream implementation in that repository.


---

<!-- SOURCE: analysis/10_REPO_CENSUS.md -->

# 10 · Repository Census

## Target boundary

The extraction target is the **Stagehand protocol family**, not one host application. The lineage is:

1. **LLM-Chess** — origin mechanism: inline visual annotations embedded in narration and stripped from speech. [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts:1-300
2. **Clio** — first explicit “Stagehand Protocol”: typed command registry, parser, validator, runtime/canonicalization, domain adapters, compounds, introspection, visual validation, beats. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100
3. **Virtual Classroom** — independent retarget proving cross-domain reuse, while also repairing parser/trust/timing defects in Clio. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-260
4. **Vibe Coders Bible** — simplified presenter/reference dialect: `[stage.*]` commands bound to narration word positions. [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:1-500

### Excluded namespace collision

`exhibit-of-shadows` uses the phrase “stagehand console” for an in-simulation control panel. It is not evidence of the Stagehand narration protocol. [i] inferred from search hits; falsifier: discovery of Stagehand mixed-stream parser/schema/runtime there.

## Repository frame

| Repo | Role in lineage | Package/build frame | License |
|---|---|---|---|
| LLM-Chess | origin / annotations | TypeScript + React + Vite; Tauri desktop; build `tsc -b && vite build` | root LICENSE not discovered [?] |
| Clio | formalized protocol / largest implementation | TypeScript + Vite; Vitest; export/QA/MCP scripts | MIT |
| Virtual Classroom | 3D retarget / runtime-hardening | TypeScript + Three.js + Vite + Vitest | root LICENSE not discovered [?] |
| Vibe Coders Bible | educational presenter/reference | Astro/React site + audio generation | CC-BY-4.0 |

Evidence: [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:package.json:1-80 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:package.json:1-220 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:package.json:1-80 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:LICENSE:1-30 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:LICENSE:1-25

## Stagehand-specific entrypoints

### LLM-Chess — 2 relevant entry paths

1. Commentary/model prompting emits explicit annotation tags. [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/llm/prompts.ts:1-500
2. `src/utils/board-annotations.ts` parses/normalizes tags and inferred cues into board annotation state. [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts:1-500

### Clio — 4 relevant entry paths

1. `src/stagehand/index.ts` internal module API. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts:1-25
2. `parseScript` / `StreamingParser` for authored/live streams. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/parser.ts:1-620
3. `executeStagehandCommand` runtime path. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts:1-360
4. Export/show pipeline consumes Stagehand traces/plans; exact host entrypoints are outside SDK boundary. [i] inferred from package scripts + ADR-0010; falsifier: trace not consumed by export path.

### Virtual Classroom — 4 relevant entry paths

1. `src/main.ts` creates host runtime/director/player. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/main.ts:1-300
2. `src/lesson/director.ts` constructs model context from live command schemas and registry. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/lesson/director.ts:1-480
3. `src/app/runtime.ts` executes validated effects into host state. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/app/runtime.ts:1-800
4. `src/tts/player.ts` gates narration against readiness. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/tts/player.ts:1-500

### Vibe Coders Bible — 2 relevant entry paths

1. `site/src/components/Stagehand.tsx` parser/player. [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:1-500
2. Audio generation strips `[stage.*]` before TTS. [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:rag/src/scripts/generate-audio.ts:1-300

**Entrypoint count:** 12 relevant entry paths, scoped to Stagehand behavior rather than every executable in the four host repositories.

## Build / run status

- Build commands are reproducible from manifests/docs. [v]
- Runtime execution was **not performed** because the available environment provided remote GitHub source access but no materialized checkout/network clone route. [?] U-001.
- Therefore no latency, memory, render, or live-provider claim is tagged `[o]`.

## Gate 0

- Stagehand-specific entrypoints: **12/12 enumerated** under the declared subsystem scope.
- Build procedure discoverable: **yes**.
- Build executed: **no — U-001**.
- Run executed: **no — U-001**.
- License posture recorded per source repo: **yes**.
- T0 unknowns opened: **1**.


---

<!-- SOURCE: analysis/13_SURFACE_INVENTORY.md -->

# 13 · Surface Inventory

This inventory deliberately treats each host dialect separately. A same-named command in Clio and Virtual Classroom is two surfaces until Pass 8 proves they can collapse into one feature/contract.

## Discovery commands / queries

- Protocol-bearing repos: GitHub code search `Stagehand` + `StagehandCommand` + lineage docs under owner `Mnehmos`.
- Clio Stagehand file count: GitHub code search `repo:Mnehmos/clio path:src/stagehand` → **27**.
- VC Stagehand file count: GitHub code search `repo:Mnehmos/virtual-classroom path:src/stagehand` → **10**.
- LLM-Chess explicit command census: regex constants and supported-tag doc in `src/utils/board-annotations.ts` → **4**. [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts:1-180
- Clio command census: `CommandAction` union → **47**. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100
- VC command census: `CommandAction` union → **38**. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-220
- VCB presenter command census: `executeCommand` switch → **8**. [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:360-460
- Clio module API exports: `src/stagehand/index.ts` → **20** named value/type exports. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts:1-25
- VC event census: discriminated unions in `events.ts` → **20 public + 8 private = 28**. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts:1-180
- Clio runtime event census: `StagehandRuntimeEvent` union → **5**. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts:1-80
- VC environment census: `.env.example` → **12**. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example:1-40

## Totals

| Surface class | Count |
|---|---:|
| SC-P01 — LLM-Chess annotation commands | 4 |
| SC-P02 — Clio Stagehand command actions | 47 |
| SC-P03 — Virtual Classroom Stagehand command actions | 38 |
| SC-P04 — Vibe Coders Bible presenter commands | 8 |
| SC-01 — Clio Stagehand module API exports | 20 |
| SC-09A — Virtual Classroom public events | 20 |
| SC-09B — Virtual Classroom private production events | 8 |
| SC-09C — Clio runtime events | 5 |
| SC-12 — Virtual Classroom Stagehand-adjacent env/config keys | 12 |
| SC-17 — Wire/file formats | 6 |
| **TOTAL** | **168** |

## SC-P01 · LLM-Chess annotation commands

Discovery: pinned source registry/search described below.

Count: **4**

| ID | Surface | Kind | Application | Location | Notes |
|---|---|---|---|---|---|
| SURF-001 | `arrow` | protocol command | LLM-Chess | `Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts` | Draw an arrow between chess squares; optional color. |
| SURF-002 | `highlight` | protocol command | LLM-Chess | `Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts` | Highlight one chess square; optional color. |
| SURF-003 | `circle` | protocol command | LLM-Chess | `Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts` | Circle one chess square; optional color. |
| SURF-004 | `move` | protocol command | LLM-Chess | `Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts` | Encode a proposed/visualized move between squares; optional promotion. |

## SC-P02 · Clio Stagehand command actions

Discovery: pinned source registry/search described below.

Count: **47**

| ID | Surface | Kind | Application | Location | Notes |
|---|---|---|---|---|---|
| SURF-005 | `map.view` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Set camera coordinate/zoom. |
| SURF-006 | `map.focus` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Focus camera on one registered entity. |
| SURF-007 | `map.fit` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Frame multiple entities or explicit bounds. |
| SURF-008 | `map.mode` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Switch rhetorical map mode. |
| SURF-009 | `map.highlight` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Highlight an entity. |
| SURF-010 | `map.spotlight` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Dim scene except target aperture. |
| SURF-011 | `map.label` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Attach/update an entity label. |
| SURF-012 | `map.clear` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Clear classes of transient map state. |
| SURF-013 | `map.arrow` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Great-circle directed connector. |
| SURF-014 | `map.circle` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Ring an entity. |
| SURF-015 | `map.line` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Great-circle undirected connector. |
| SURF-016 | `layer.on` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Enable a named thematic layer. |
| SURF-017 | `layer.off` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Disable a named thematic layer. |
| SURF-018 | `flow.animate` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Animate a route/flow. |
| SURF-019 | `flow.clear` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Clear active flows. |
| SURF-020 | `piece.place` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Place/update globe-anchored simulation piece. |
| SURF-021 | `piece.move` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Move/restyle a piece. |
| SURF-022 | `piece.remove` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Remove one piece. |
| SURF-023 | `piece.clear` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Clear pieces. |
| SURF-024 | `chat.say` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Open a source-backed narration attribution scope. |
| SURF-025 | `source.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Display a source receipt. |
| SURF-026 | `source.hide` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Hide source receipts. |
| SURF-027 | `claim.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Declared in CommandAction but no schema entry found. |
| SURF-028 | `entity.propose` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Propose a new registry entity. |
| SURF-029 | `mark.clip` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Mark export moment. |
| SURF-030 | `scene.fade` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Apply broadcast fade overlay. |
| SURF-031 | `scene.title` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Show/clear title/chapter card. |
| SURF-032 | `asset.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Display registered/inline evidence asset. |
| SURF-033 | `asset.clear` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Clear evidence assets. |
| SURF-034 | `whiteboard.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Show screen-space whiteboard. |
| SURF-035 | `whiteboard.hide` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Hide whiteboard. |
| SURF-036 | `whiteboard.clear` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Clear whiteboard. |
| SURF-037 | `whiteboard.text` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Place freeform text. |
| SURF-038 | `whiteboard.line` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Draw freeform line. |
| SURF-039 | `whiteboard.box` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Draw box/panel. |
| SURF-040 | `camera.center` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic camera centering primitive (v2). |
| SURF-041 | `camera.focus_region` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic region framing primitive (v2). |
| SURF-042 | `camera.establish_globe` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Globe-scale establishing camera (v2). |
| SURF-043 | `highlight.region` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic region highlight (v2). |
| SURF-044 | `highlight.location` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic point highlight (v2). |
| SURF-045 | `label.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic label primitive (v2). |
| SURF-046 | `route.draw` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic route primitive (v2). |
| SURF-047 | `camera.follow_marker` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Set/clear chase-camera policy. |
| SURF-048 | `map.overlay.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Activate registered map overlay. |
| SURF-049 | `map.overlay.hide` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Hide one/all overlays. |
| SURF-050 | `map.basemap` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Switch named/registered basemap. |
| SURF-051 | `map.timecursor` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Set overlay time cursor. |

## SC-P03 · Virtual Classroom Stagehand command actions

Discovery: pinned source registry/search described below.

Count: **38**

| ID | Surface | Kind | Application | Location | Notes |
|---|---|---|---|---|---|
| SURF-052 | `avatar.move` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Move teacher to semantic anchor. |
| SURF-053 | `avatar.look` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Aim teacher gaze. |
| SURF-054 | `avatar.gesture` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Play semantic teaching gesture. |
| SURF-055 | `avatar.point` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Point at committed board element. |
| SURF-056 | `avatar.face` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Set facial expression. |
| SURF-057 | `whiteboard.show` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Activate board/new page. |
| SURF-058 | `whiteboard.hide` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Occlude/deactivate presentation without destroying content. |
| SURF-059 | `whiteboard.clear` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Clear board layer/page content. |
| SURF-060 | `whiteboard.text` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Commit exact text element. |
| SURF-061 | `whiteboard.math` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Commit typeset equation. |
| SURF-062 | `whiteboard.line` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Draw line. |
| SURF-063 | `whiteboard.box` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Draw box. |
| SURF-064 | `whiteboard.arrow` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Draw arrow. |
| SURF-065 | `whiteboard.highlight` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Highlight board element/region. |
| SURF-066 | `whiteboard.scribble` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Commit thinking-layer scribble. |
| SURF-067 | `whiteboard.dots` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Draw countable dots/tokens. |
| SURF-068 | `whiteboard.shape` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Draw named geometry. |
| SURF-069 | `whiteboard.count` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Count properties/items. |
| SURF-070 | `whiteboard.erase` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Erase target. |
| SURF-071 | `whiteboard.reveal` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Reveal concealed target. |
| SURF-072 | `projector.prepare` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Prepare media source asynchronously. |
| SURF-073 | `projector.lower` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Lower projection screen. |
| SURF-074 | `projector.source` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Attach prepared source. |
| SURF-075 | `projector.play` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Play source. |
| SURF-076 | `projector.wait` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Wait for media/interval. |
| SURF-077 | `projector.pause` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Pause source. |
| SURF-078 | `projector.raise` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Raise screen. |
| SURF-079 | `room.lights` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Change lighting zone/state. |
| SURF-080 | `room.mode` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Set semantic classroom mode. |
| SURF-081 | `camera.focus` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Focus student camera. |
| SURF-082 | `lesson.ask` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Open free-response question. |
| SURF-083 | `lesson.choice` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Open clickable choice question. |
| SURF-084 | `lesson.wait` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Pause for student boundary. |
| SURF-085 | `lesson.resume` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Resume lesson. |
| SURF-086 | `lesson.objective` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Set objective status. |
| SURF-087 | `lesson.phase` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Switch model/practice phase. |
| SURF-088 | `lesson.assess` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Record/judge answer. |
| SURF-089 | `lesson.complete` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Complete lesson. |

## SC-P04 · Vibe Coders Bible presenter commands

Discovery: pinned source registry/search described below.

Count: **8**

| ID | Surface | Kind | Application | Location | Notes |
|---|---|---|---|---|---|
| SURF-090 | `stage.focus` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Lock presentation focus to a paragraph. |
| SURF-091 | `stage.focus.off` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Release manual paragraph focus. |
| SURF-092 | `stage.auto` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Alias/path to automatic focus mode. |
| SURF-093 | `stage.highlight` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Highlight DOM element containing text. |
| SURF-094 | `stage.highlight.off` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Remove one/all text highlights. |
| SURF-095 | `stage.clear` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Clear manual focus and highlights. |
| SURF-096 | `stage.diagram` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Show diagram asset. |
| SURF-097 | `stage.diagram.off` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Hide diagram asset. |

## SC-01 · Clio Stagehand module API exports

Discovery: pinned source registry/search described below.

Count: **20**

| ID | Surface | Kind | Application | Location | Notes |
|---|---|---|---|---|---|
| SURF-098 | `parseScript` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-099 | `parseCommandString` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-100 | `StreamingParser` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-101 | `applyEntityProposeCommand` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-102 | `canonicalizeCommandEntityRefs` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-103 | `executeStagehandCommand` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-104 | `validateCommand` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-105 | `validateCommands` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-106 | `COMMAND_SCHEMAS` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-107 | `CommandAction` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-108 | `StagehandCommand` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-109 | `ScriptSegment` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-110 | `CommandSchema` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-111 | `CanonicalStagehandCommand` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-112 | `CommandValidationResult` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-113 | `CanonicalizeCommandOptions` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-114 | `CanonicalizeCommandResult` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-115 | `EntityResolutionMode` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-116 | `ExecuteStagehandCommandOptions` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |
| SURF-117 | `StagehandRuntimeEvent` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  |

## SC-09A · Virtual Classroom public events

Discovery: pinned source registry/search described below.

Count: **20**

| ID | Surface | Kind | Application | Location | Notes |
|---|---|---|---|---|---|
| SURF-118 | `narration.started` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-119 | `narration.ended` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-120 | `narration.interrupted` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-121 | `caption` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-122 | `effect.committed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-123 | `board.revision.committed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-124 | `avatar.anchor.reached` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-125 | `projector.state` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-126 | `media.ready` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-127 | `media.failed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-128 | `beat.started` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-129 | `beat.completed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-130 | `lesson.awaiting_student` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-131 | `lesson.choice.selected` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-132 | `lesson.resumed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-133 | `lesson.objective` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-134 | `lesson.assessed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-135 | `lesson.completed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-136 | `room.mode` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-137 | `safe_failure` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |

## SC-09B · Virtual Classroom private production events

Discovery: pinned source registry/search described below.

Count: **8**

| ID | Surface | Kind | Application | Location | Notes |
|---|---|---|---|---|---|
| SURF-138 | `stream.chunk` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-139 | `segment.parsed` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-140 | `command.accepted` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-141 | `command.rejected` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-142 | `gate.waited` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-143 | `provider.request` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-144 | `provider.response` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |
| SURF-145 | `diagnostic` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  |

## SC-09C · Clio runtime events

Discovery: pinned source registry/search described below.

Count: **5**

| ID | Surface | Kind | Application | Location | Notes |
|---|---|---|---|---|---|
| SURF-146 | `invalid_command` | runtime event | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts` |  |
| SURF-147 | `unresolved_refs` | runtime event | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts` |  |
| SURF-148 | `entity_proposed` | runtime event | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts` |  |
| SURF-149 | `proposal_rejected` | runtime event | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts` |  |
| SURF-150 | `scene_command` | runtime event | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts` |  |

## SC-12 · Virtual Classroom Stagehand-adjacent env/config keys

Discovery: pinned source registry/search described below.

Count: **12**

| ID | Surface | Kind | Application | Location | Notes |
|---|---|---|---|---|---|
| SURF-151 | `OPENAI_API_KEY` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |
| SURF-152 | `OPENROUTER_API_KEY` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |
| SURF-153 | `VC_DIRECTOR_MODEL` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |
| SURF-154 | `VC_TTS_VOICE` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |
| SURF-155 | `VC_TTS_MODEL` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |
| SURF-156 | `VC_TTS_SPEED` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |
| SURF-157 | `VC_MEDIA_PROVIDER` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |
| SURF-158 | `VC_COMFY_URL` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |
| SURF-159 | `VC_MINIMAX_BASE_URL` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |
| SURF-160 | `VC_MINIMAX_MODEL` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |
| SURF-161 | `VC_MINIMAX_API_KEY` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |
| SURF-162 | `VC_MEDIA_DEADLINE_MS` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  |

## SC-17 · Wire/file formats

Discovery: pinned source registry/search described below.

Count: **6**

| ID | Surface | Kind | Application | Location | Notes |
|---|---|---|---|---|---|
| SURF-163 | `Stagehand bracket grammar` | wire/file format | Clio/Virtual Classroom | `multiple` | [action arg key=value] mixed inline with narration |
| SURF-164 | `Compound blocks` | wire/file format | Clio/Virtual Classroom | `multiple` | batch / sequence / parallel / beat plus closers |
| SURF-165 | `Beat agent object` | wire/file format | Clio | `multiple` | beat_id + narration + visual_intent + stagehand_sequence.steps |
| SURF-166 | `StagehandTrace` | wire/file format | Virtual Classroom | `multiple` | timestamped public and private event arrays |
| SURF-167 | `Chess annotation grammar` | wire/file format | LLM-Chess | `multiple` | [arrow]/[highlight]/[circle]/[move] |
| SURF-168 | `VCB presenter grammar` | wire/file format | Vibe Coders Bible | `multiple` | [stage.<type> key=value] word-index anchored |

## Non-applicable stock classes under SDK scope

SC-02 CLI commands, SC-04 HTTP routes, SC-05 GraphQL/gRPC/MCP, SC-10 scheduled jobs, SC-11 database tables, SC-13 feature flags, SC-14 auth roles/scopes, and SC-16 i18n string tables are **not Stagehand-core surfaces** in the extracted implementations. Host applications may have them, but they do not define the protocol boundary. They are intentionally excluded from this SDK reconstruction rather than silently counted as zero across entire host repos.

## Gate 1

**168/168 rows enumerated.** No “etc.” member stands in for an enumerable command/export/event/config/format set.


---

<!-- SOURCE: analysis/11_ARCHITECTURE.md -->

# 11 · Architecture

## Architectural invariant across the lineage

Stagehand's enduring architecture is **stream compilation**:

```text
model / authored script
        │ mixed narration + control
        ▼
     parser / lexer
        │
        ├── narration ───────────────► speech/captions
        │
        ▼
 command IR (action,args,kwargs,raw)
        ▼
 schema / capability registry
        ▼
 validators ──reject──► private diagnostics
        │ accept
        ▼
 semantic resolution / canonicalization
        ▼
 reducer / effect commit
        ▼
 renderer / host actor
        │
        ├── readiness / timing feedback
        └── trace / replay events
```

Clio's ADR states the core move explicitly: model output is source code, not display content; clean narration and validated commands are derived streams; raw output should never reach the public surface. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0009-stagehand-protocol.md:1-220

## Layer model for the SDK

### L0 · Producer
Model, authored file, deterministic generator, or replay source. **Must not be trusted.**

### L1 · Syntax compiler
Parses mixed text/control into a typed segment IR. Clio supports batch and streaming parsing; VC keeps both but hardens quoting, bare-command recovery, and compound nesting. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/parser.ts:1-620 [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/parser.ts:1-420

### L2 · Capability registry / introspection
Defines what commands exist, their argument contract, authoring metadata, and (in later implementations) semantic enum and readiness metadata. The producer prompt should be generated from this registry, not duplicated by hand. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/lesson/director.ts:1-130

### L3 · Validation pipeline
Pure/deterministic checks before public mutation. Clio validates structural and domain refs; VC explicitly layers syntax → registry → entity → state → spatial. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/validator.ts:1-500

### L4 · Resolution / canonicalization
Turns model-facing semantic refs into host canonical IDs/geometry/state. Clio resolves entity aliases, computes centers/bounds, and compiles semantic v2 commands to older reducer primitives. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts:1-360

### L5 · Commit / reducer
Only validated, canonical commands mutate canonical host state. The SDK should expose an adapter interface rather than own globe/classroom/document state.

### L6 · Render / perform
A renderer or physical actor interprets canonical effects. LLM-Chess board, Clio map, Classroom avatar/board/projector, and VCB DOM presenter are four distinct hosts.

### L7 · Readiness / temporal synchronization
Original LLM-Chess relied on positional adjacency and instant effects. VC generalizes timing into independently keyed channels with deadlines and generation invalidation. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/readiness.ts:1-260

### L8 · Public/private event boundary + trace
VC gives the clearest reusable contract: public show effects are separated at the type level from production diagnostics; both are retained in a replay/debug trace. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts:1-180

## Four material data flows

### Flow A — live model turn
Producer → generated command digest → model output → parser → repair/recovery → validator → reducer/effect → renderer → readiness → narration. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/lesson/director.ts:1-480

### Flow B — authored script
File/string → batch parser → compound folding → validation → flattened/compound-aware playback → renderer. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/parser.ts:1-360

### Flow C — replay/export
Validated event/command trace → deterministic render plan → alternate rendering/export without model regeneration. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0010-export-as-trace.md:1-220

### Flow D — interactive interruption
Effect enters readiness channel → narration waits → student interrupt/reset invalidates readiness generation → stale awaits cannot resume prior turn. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/readiness.ts:1-200

## Dependency direction proposed for rebuild

```text
@stagehand/core
  ↓
@stagehand/parser
  ↓
@stagehand/schema
  ↓
@stagehand/runtime
  ↓
@stagehand/trace + @stagehand/readiness
  ↓
@stagehand/authoring
  ↓
plugins/dom-presenter | chess | geo | classroom | future engineering/robotics
```

No plugin may be imported by core/runtime. Plugin validators may depend on core contracts; core cannot know maps, boards, projectors, chess squares, or classrooms.

## Architectural violations in originals

1. **Clio type registry mixes portable schema and geo-domain vocabulary.** [v] `types.ts` contains generic command IR plus map-specific action union.
2. **Clio runtime mixes generic release gating with GeoEntity canonicalization.** [v] runtime imports atlas registry/schema. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts:1-360
3. **VC schema mixes portable metadata with classroom policy**, but improves the schema abstraction enough to extract generically. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:80-260
4. **VC `repair` is both resilience and potential trust risk**; conservative repair must be a named pipeline stage with trace output, never hidden parser magic.

## Gate 2

Every identified Stagehand concern has a layer and host boundary. No domain module is classified as core merely because it lives under `src/stagehand`.


---

<!-- SOURCE: analysis/12_COMPONENT_MAP.md -->

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
- tests account for remaining path entries. [i] based on 10-file path census + imports; falsifier: directory listing contains a non-test behavior module not named here.

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


---

<!-- SOURCE: analysis/14_API_CATALOG.md -->

# 14 · API Catalog

Stagehand is not exposed as HTTP in the extracted implementations. The primary API surface is a TypeScript module/protocol API. Clio has the only explicit barrel export.

## Clio module API — 20/20 named exports

Evidence: [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts:1-25

### CTR-101 · `parseScript(script: string): ScriptSegment[]`
- Batch-compiles a complete narration/control stream.
- Strips `//` comment lines; emits paragraph text segments and command segments; folds compounds.
- Errors are largely represented downstream as command validation failures rather than thrown parse failures in Clio. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/parser.ts:1-360

### CTR-102 · `parseCommandString(raw: string): StagehandCommand | null`
- Quote-aware tokenization into action + positional args + string kwargs. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/parser.ts:260-420

### CTR-103 · `new StreamingParser(callback, options?)`
- `feed(chunk)` consumes arbitrary text chunks; `flush()` emits remaining text/incomplete bracket as text.
- Optional `onTextDelta` receives visible narration excluding bracketed controls. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/parser.ts:360-620

### CTR-104 · `validateCommand(command, options?): CommandValidationResult`
- Rejects unknown action, arity, missing/extra kwargs, invalid numeric/boolean/enums, invalid refs/coordinates/lists and asset-specific constraints.
- Unknown action error template: `Unknown Stagehand action: <action>`. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/validator.ts:1-420

### CTR-105 · `validateCommands(commands)`
- Maps CTR-104 across an array; no implied atomicity. Compound atomic validation is a separate concept in Clio internals. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/validator.ts:1-260

### CTR-106 · `executeStagehandCommand(registry, command, options): StagehandRuntimeEvent[]`
- Pipeline: validate → compile semantic-v2 command → canonicalize entity refs → proposal handling → emit scene command or private failure event.
- Entity resolution modes: `strict | propose-stub`. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts:1-180

### CTR-107 · `canonicalizeCommandEntityRefs(registry, command, options)`
- Resolves semantic refs and augments commands with concrete IDs/centers/bounds where required. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts:100-360

### CTR-108 · `applyEntityProposeCommand(...)`
- Domain-specific controlled registry mutation. It should leave the generic SDK and live in the geo plugin.

### CTR-109 · `COMMAND_SCHEMAS`
- Source-of-truth schema registry for Clio command vocabulary. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:260-1100

### CTR-110..120 · exported types

`CommandAction`, `StagehandCommand`, `ScriptSegment`, `CommandSchema`, `CanonicalStagehandCommand`, `CommandValidationResult`, `CanonicalizeCommandOptions`, `CanonicalizeCommandResult`, `EntityResolutionMode`, `ExecuteStagehandCommandOptions`, `StagehandRuntimeEvent`. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts:1-25

## Virtual Classroom runtime contracts worth extracting

These are not barrel-exported today, but are architecturally stronger than corresponding Clio internals.

### CTR-121 · `validateCommand(command, ctx)`
Five ordered validation layers: syntax, registry, entity, state, spatial. Rejection is terminal and never repairs/substitutes. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/validator.ts:1-500

### CTR-122 · `EventBus`
`onPublic`, `onPrivate`, `emitPublic`, `emitPrivate`, with an in-memory `StagehandTrace`. Public and private events are separate discriminated unions. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts:1-180

### CTR-123 · `ReadinessGate`
`mark`, `settle`, `settleAll`, `invalidate`, `wait`; waits race all requested pending channels against deadline and report stale generation. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/readiness.ts:1-220

### CTR-124 · VC `parseCommandString`
Hardens quote semantics, repairs spaces around `=`, and can use known schema keys to recover unquoted multiword values. Unterminated quoted values raise `StagehandSyntaxError`. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/parser.ts:1-190

### CTR-125 · VC `foldCompoundSegments`
Stack-based arbitrary nesting with explicit closers or universal `[end]`; unmatched structures degrade to visible/rejectable commands rather than silently swallowing content. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/parser.ts:190-390

## Proposed generic SDK contract cut

The future API should expose only domain-independent equivalents of CTR-101–105 and CTR-121–125. Entity proposal, geo canonicalization, classroom validation policy, concrete renderers, and provider calls belong in plugins/hosts.

## Gate 3 API coverage

Clio barrel exports: **20/20 mapped**. Additional VC contracts are captured as extraction candidates rather than pretending they were already public SDK exports.


---

<!-- SOURCE: analysis/15_COMMAND_CATALOG.md -->

# 15 · Command Catalog

This is the complete action-name catalog for all four dialects discovered. Fine-grained argument/default contracts for the rebuild should be generated from schemas during Pass 9; Pass 3 freezes the action surface and protocol semantics here.

## LLM-Chess — 4/4 explicit annotation commands

### CTR-001 · `arrow`
- **Surface:** SURF-001
- **Host:** LLM-Chess
- **Behavior:** Draw an arrow between chess squares; optional color.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts:1-180

### CTR-002 · `highlight`
- **Surface:** SURF-002
- **Host:** LLM-Chess
- **Behavior:** Highlight one chess square; optional color.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts:1-180

### CTR-003 · `circle`
- **Surface:** SURF-003
- **Host:** LLM-Chess
- **Behavior:** Circle one chess square; optional color.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts:1-180

### CTR-004 · `move`
- **Surface:** SURF-004
- **Host:** LLM-Chess
- **Behavior:** Encode a proposed/visualized move between squares; optional promotion.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts:1-180


### Compatibility behavior outside the four tags

LLM-Chess also infers visual cues from natural-language phrases (`queen on d2`, `pressure on f7`, lines/files, etc.) and assigns source confidence (`tag`, `natural_language`, `passive`). This is **not** another finite command vocabulary; it is a forgiving interpretation layer. [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts:1-500

## Clio — 47/47 declared actions

### CTR-005 · `map.view`
- **Surface:** SURF-005
- **Host:** Clio
- **Behavior:** Set camera coordinate/zoom.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-006 · `map.focus`
- **Surface:** SURF-006
- **Host:** Clio
- **Behavior:** Focus camera on one registered entity.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-007 · `map.fit`
- **Surface:** SURF-007
- **Host:** Clio
- **Behavior:** Frame multiple entities or explicit bounds.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-008 · `map.mode`
- **Surface:** SURF-008
- **Host:** Clio
- **Behavior:** Switch rhetorical map mode.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-009 · `map.highlight`
- **Surface:** SURF-009
- **Host:** Clio
- **Behavior:** Highlight an entity.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-010 · `map.spotlight`
- **Surface:** SURF-010
- **Host:** Clio
- **Behavior:** Dim scene except target aperture.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-011 · `map.label`
- **Surface:** SURF-011
- **Host:** Clio
- **Behavior:** Attach/update an entity label.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-012 · `map.clear`
- **Surface:** SURF-012
- **Host:** Clio
- **Behavior:** Clear classes of transient map state.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-013 · `map.arrow`
- **Surface:** SURF-013
- **Host:** Clio
- **Behavior:** Great-circle directed connector.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-014 · `map.circle`
- **Surface:** SURF-014
- **Host:** Clio
- **Behavior:** Ring an entity.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-015 · `map.line`
- **Surface:** SURF-015
- **Host:** Clio
- **Behavior:** Great-circle undirected connector.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-016 · `layer.on`
- **Surface:** SURF-016
- **Host:** Clio
- **Behavior:** Enable a named thematic layer.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-017 · `layer.off`
- **Surface:** SURF-017
- **Host:** Clio
- **Behavior:** Disable a named thematic layer.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-018 · `flow.animate`
- **Surface:** SURF-018
- **Host:** Clio
- **Behavior:** Animate a route/flow.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-019 · `flow.clear`
- **Surface:** SURF-019
- **Host:** Clio
- **Behavior:** Clear active flows.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-020 · `piece.place`
- **Surface:** SURF-020
- **Host:** Clio
- **Behavior:** Place/update globe-anchored simulation piece.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-021 · `piece.move`
- **Surface:** SURF-021
- **Host:** Clio
- **Behavior:** Move/restyle a piece.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-022 · `piece.remove`
- **Surface:** SURF-022
- **Host:** Clio
- **Behavior:** Remove one piece.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-023 · `piece.clear`
- **Surface:** SURF-023
- **Host:** Clio
- **Behavior:** Clear pieces.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-024 · `chat.say`
- **Surface:** SURF-024
- **Host:** Clio
- **Behavior:** Open a source-backed narration attribution scope.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-025 · `source.show`
- **Surface:** SURF-025
- **Host:** Clio
- **Behavior:** Display a source receipt.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-026 · `source.hide`
- **Surface:** SURF-026
- **Host:** Clio
- **Behavior:** Hide source receipts.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-027 · `claim.show`
- **Surface:** SURF-027
- **Host:** Clio
- **Behavior:** Declared in CommandAction but no schema entry found.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-028 · `entity.propose`
- **Surface:** SURF-028
- **Host:** Clio
- **Behavior:** Propose a new registry entity.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-029 · `mark.clip`
- **Surface:** SURF-029
- **Host:** Clio
- **Behavior:** Mark export moment.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-030 · `scene.fade`
- **Surface:** SURF-030
- **Host:** Clio
- **Behavior:** Apply broadcast fade overlay.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-031 · `scene.title`
- **Surface:** SURF-031
- **Host:** Clio
- **Behavior:** Show/clear title/chapter card.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-032 · `asset.show`
- **Surface:** SURF-032
- **Host:** Clio
- **Behavior:** Display registered/inline evidence asset.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-033 · `asset.clear`
- **Surface:** SURF-033
- **Host:** Clio
- **Behavior:** Clear evidence assets.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-034 · `whiteboard.show`
- **Surface:** SURF-034
- **Host:** Clio
- **Behavior:** Show screen-space whiteboard.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-035 · `whiteboard.hide`
- **Surface:** SURF-035
- **Host:** Clio
- **Behavior:** Hide whiteboard.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-036 · `whiteboard.clear`
- **Surface:** SURF-036
- **Host:** Clio
- **Behavior:** Clear whiteboard.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-037 · `whiteboard.text`
- **Surface:** SURF-037
- **Host:** Clio
- **Behavior:** Place freeform text.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-038 · `whiteboard.line`
- **Surface:** SURF-038
- **Host:** Clio
- **Behavior:** Draw freeform line.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-039 · `whiteboard.box`
- **Surface:** SURF-039
- **Host:** Clio
- **Behavior:** Draw box/panel.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-040 · `camera.center`
- **Surface:** SURF-040
- **Host:** Clio
- **Behavior:** Semantic camera centering primitive (v2).
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-041 · `camera.focus_region`
- **Surface:** SURF-041
- **Host:** Clio
- **Behavior:** Semantic region framing primitive (v2).
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-042 · `camera.establish_globe`
- **Surface:** SURF-042
- **Host:** Clio
- **Behavior:** Globe-scale establishing camera (v2).
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-043 · `highlight.region`
- **Surface:** SURF-043
- **Host:** Clio
- **Behavior:** Semantic region highlight (v2).
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-044 · `highlight.location`
- **Surface:** SURF-044
- **Host:** Clio
- **Behavior:** Semantic point highlight (v2).
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-045 · `label.show`
- **Surface:** SURF-045
- **Host:** Clio
- **Behavior:** Semantic label primitive (v2).
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-046 · `route.draw`
- **Surface:** SURF-046
- **Host:** Clio
- **Behavior:** Semantic route primitive (v2).
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-047 · `camera.follow_marker`
- **Surface:** SURF-047
- **Host:** Clio
- **Behavior:** Set/clear chase-camera policy.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-048 · `map.overlay.show`
- **Surface:** SURF-048
- **Host:** Clio
- **Behavior:** Activate registered map overlay.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-049 · `map.overlay.hide`
- **Surface:** SURF-049
- **Host:** Clio
- **Behavior:** Hide one/all overlays.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-050 · `map.basemap`
- **Surface:** SURF-050
- **Host:** Clio
- **Behavior:** Switch named/registered basemap.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100

### CTR-051 · `map.timecursor`
- **Surface:** SURF-051
- **Host:** Clio
- **Behavior:** Set overlay time cursor.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100


### Clio contract anomaly

`claim.show` is present in `CommandAction` but GitHub code search finds no corresponding `COMMAND_SCHEMAS` entry. Because `validateCommand` rejects actions missing from `SCHEMA_BY_ACTION`, the declared action is not executable through the validated runtime. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/validator.ts:1-220 → FIND-001.

## Virtual Classroom — 38/38 declared actions

### CTR-052 · `avatar.move`
- **Surface:** SURF-052
- **Host:** Virtual Classroom
- **Behavior:** Move teacher to semantic anchor.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-053 · `avatar.look`
- **Surface:** SURF-053
- **Host:** Virtual Classroom
- **Behavior:** Aim teacher gaze.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-054 · `avatar.gesture`
- **Surface:** SURF-054
- **Host:** Virtual Classroom
- **Behavior:** Play semantic teaching gesture.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-055 · `avatar.point`
- **Surface:** SURF-055
- **Host:** Virtual Classroom
- **Behavior:** Point at committed board element.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-056 · `avatar.face`
- **Surface:** SURF-056
- **Host:** Virtual Classroom
- **Behavior:** Set facial expression.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-057 · `whiteboard.show`
- **Surface:** SURF-057
- **Host:** Virtual Classroom
- **Behavior:** Activate board/new page.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-058 · `whiteboard.hide`
- **Surface:** SURF-058
- **Host:** Virtual Classroom
- **Behavior:** Occlude/deactivate presentation without destroying content.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-059 · `whiteboard.clear`
- **Surface:** SURF-059
- **Host:** Virtual Classroom
- **Behavior:** Clear board layer/page content.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-060 · `whiteboard.text`
- **Surface:** SURF-060
- **Host:** Virtual Classroom
- **Behavior:** Commit exact text element.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-061 · `whiteboard.math`
- **Surface:** SURF-061
- **Host:** Virtual Classroom
- **Behavior:** Commit typeset equation.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-062 · `whiteboard.line`
- **Surface:** SURF-062
- **Host:** Virtual Classroom
- **Behavior:** Draw line.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-063 · `whiteboard.box`
- **Surface:** SURF-063
- **Host:** Virtual Classroom
- **Behavior:** Draw box.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-064 · `whiteboard.arrow`
- **Surface:** SURF-064
- **Host:** Virtual Classroom
- **Behavior:** Draw arrow.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-065 · `whiteboard.highlight`
- **Surface:** SURF-065
- **Host:** Virtual Classroom
- **Behavior:** Highlight board element/region.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-066 · `whiteboard.scribble`
- **Surface:** SURF-066
- **Host:** Virtual Classroom
- **Behavior:** Commit thinking-layer scribble.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-067 · `whiteboard.dots`
- **Surface:** SURF-067
- **Host:** Virtual Classroom
- **Behavior:** Draw countable dots/tokens.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-068 · `whiteboard.shape`
- **Surface:** SURF-068
- **Host:** Virtual Classroom
- **Behavior:** Draw named geometry.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-069 · `whiteboard.count`
- **Surface:** SURF-069
- **Host:** Virtual Classroom
- **Behavior:** Count properties/items.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-070 · `whiteboard.erase`
- **Surface:** SURF-070
- **Host:** Virtual Classroom
- **Behavior:** Erase target.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-071 · `whiteboard.reveal`
- **Surface:** SURF-071
- **Host:** Virtual Classroom
- **Behavior:** Reveal concealed target.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-072 · `projector.prepare`
- **Surface:** SURF-072
- **Host:** Virtual Classroom
- **Behavior:** Prepare media source asynchronously.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-073 · `projector.lower`
- **Surface:** SURF-073
- **Host:** Virtual Classroom
- **Behavior:** Lower projection screen.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-074 · `projector.source`
- **Surface:** SURF-074
- **Host:** Virtual Classroom
- **Behavior:** Attach prepared source.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-075 · `projector.play`
- **Surface:** SURF-075
- **Host:** Virtual Classroom
- **Behavior:** Play source.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-076 · `projector.wait`
- **Surface:** SURF-076
- **Host:** Virtual Classroom
- **Behavior:** Wait for media/interval.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-077 · `projector.pause`
- **Surface:** SURF-077
- **Host:** Virtual Classroom
- **Behavior:** Pause source.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-078 · `projector.raise`
- **Surface:** SURF-078
- **Host:** Virtual Classroom
- **Behavior:** Raise screen.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-079 · `room.lights`
- **Surface:** SURF-079
- **Host:** Virtual Classroom
- **Behavior:** Change lighting zone/state.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-136 · `room.mode`
- **Surface:** SURF-136
- **Host:** Virtual Classroom
- **Behavior:** Set semantic classroom mode.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-081 · `camera.focus`
- **Surface:** SURF-081
- **Host:** Virtual Classroom
- **Behavior:** Focus student camera.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-082 · `lesson.ask`
- **Surface:** SURF-082
- **Host:** Virtual Classroom
- **Behavior:** Open free-response question.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-083 · `lesson.choice`
- **Surface:** SURF-083
- **Host:** Virtual Classroom
- **Behavior:** Open clickable choice question.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-084 · `lesson.wait`
- **Surface:** SURF-084
- **Host:** Virtual Classroom
- **Behavior:** Pause for student boundary.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-085 · `lesson.resume`
- **Surface:** SURF-085
- **Host:** Virtual Classroom
- **Behavior:** Resume lesson.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-133 · `lesson.objective`
- **Surface:** SURF-133
- **Host:** Virtual Classroom
- **Behavior:** Set objective status.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-087 · `lesson.phase`
- **Surface:** SURF-087
- **Host:** Virtual Classroom
- **Behavior:** Switch model/practice phase.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-088 · `lesson.assess`
- **Surface:** SURF-088
- **Host:** Virtual Classroom
- **Behavior:** Record/judge answer.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900

### CTR-089 · `lesson.complete`
- **Surface:** SURF-089
- **Host:** Virtual Classroom
- **Behavior:** Complete lesson.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-900


### VC schema contract extensions

Each command schema may specify argument bounds, required/default kwargs, entity namespace, `settleMs`, enums, numeric fields, duration fields, colors, entity-list fields, and authoring guidance. These are strong candidates for generic SDK metadata. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:90-260

## Vibe Coders Bible — 8/8 presenter commands

### CTR-090 · `stage.focus`
- **Surface:** SURF-090
- **Host:** Vibe Coders Bible
- **Behavior:** Lock presentation focus to a paragraph.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:360-460

### CTR-091 · `stage.focus.off`
- **Surface:** SURF-091
- **Host:** Vibe Coders Bible
- **Behavior:** Release manual paragraph focus.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:360-460

### CTR-092 · `stage.auto`
- **Surface:** SURF-092
- **Host:** Vibe Coders Bible
- **Behavior:** Alias/path to automatic focus mode.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:360-460

### CTR-093 · `stage.highlight`
- **Surface:** SURF-093
- **Host:** Vibe Coders Bible
- **Behavior:** Highlight DOM element containing text.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:360-460

### CTR-094 · `stage.highlight.off`
- **Surface:** SURF-094
- **Host:** Vibe Coders Bible
- **Behavior:** Remove one/all text highlights.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:360-460

### CTR-095 · `stage.clear`
- **Surface:** SURF-095
- **Host:** Vibe Coders Bible
- **Behavior:** Clear manual focus and highlights.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:360-460

### CTR-096 · `stage.diagram`
- **Surface:** SURF-096
- **Host:** Vibe Coders Bible
- **Behavior:** Show diagram asset.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:360-460

### CTR-097 · `stage.diagram.off`
- **Surface:** SURF-097
- **Host:** Vibe Coders Bible
- **Behavior:** Hide diagram asset.
- **Wire form:** bracket-inline control adjacent to narration.
- **Evidence:** [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:360-460


## Composer controls

The typed Clio/VC protocol additionally recognizes compound control markers:

- `[batch atomic] … [/batch]`
- `[sequence pause=…] … [/sequence]`
- `[parallel] … [/parallel]`
- `[beat id=… intent=…] … [/beat]`
- VC additionally accepts `[end]` as an innermost universal closer and supports nesting. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/parser.ts:160-360

These are grammar/composition surfaces, not domain commands, and therefore are inventoried under SC-17 rather than inflating action counts.

## Gate 3 command coverage

- LLM-Chess: 4/4.
- Clio: 47/47 declared actions; **46 schema-backed + 1 unreachable anomaly**.
- Virtual Classroom: 38/38 declared actions.
- VCB: 8/8.
- **Total: 97/97 action names catalogued.**


---

<!-- SOURCE: analysis/16_UI_MAP.md -->

# 16 · UI Map

The SDK itself should have no UI. This document maps the host surfaces proving the abstraction.

## UI-01 · LLM-Chess board annotations

**Input:** commentary text containing explicit tags or inferable chess language.  
**State:** arrows, highlights, circles, optional ghost arrows.  
**Public effect:** overlays rendered on chess board; tag syntax is stripped from speech/display.  
**Failure behavior:** malformed/residual known tags are normalized/removed; natural-language cues may provide fallback. [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts:1-500

## UI-02 · Clio globe/show surface

**Input:** validated Stagehand commands.  
**State domains:** camera, entity highlights/labels, flows, world pieces, source/claim/evidence panels, whiteboard, scene cards, overlays/basemap/time.  
**Key UX constraint:** source-backed/validated state should be the public truth surface; unresolved or invalid commands stay out of release. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/reference/stagehand.md:1-420

## UI-03 · Virtual Classroom 3D lesson

**Input:** live Teacher Director or scripted Stagehand.  
**Performers:** teacher avatar, structured board, motorized projector/media, room lighting, student camera, lesson interaction.  
**Local/global state:** canonical board document + room/projector/lesson runtime + event trace.  
**Error state:** rejected command produces no effect or `safe_failure`; raw model/control output is private. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts:1-180

## UI-04 · VCB narrated article presenter

**Input:** article body plus optional audio/word timestamp assets.  
**Local state:** play state, presenter mode, current word/paragraph/progress, diagram source, highlighted DOM elements, fired command indexes.  
**Interactions:** play/pause/seek/presenter controls (host UI), auto paragraph spotlight, inline word highlight, stage directives. [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:1-500

## Navigation / lifecycle graph

```text
idle host
  → producer starts
  → narration/control stream
  → effects commit while narration advances
  → optional wait / user-response boundary
  → resume or interrupt
  → completion
  → trace replay/export (where host supports it)
```

## SDK consequence

Any “Stagehand UI kit” should be a separate optional developer/debug inspector. The protocol package should target headless composition so a DOM article, 2D chess board, geographic map, 3D classroom, game engine, or robotic workcell can all host the same runtime contract.


---

<!-- SOURCE: analysis/17_CONTROL_SURFACES.md -->

# 17 · Control Surfaces

## Core protocol configuration

No environment variable is required by the protocol architecture itself. This is an important negative requirement for the SDK: parsing, validation, trace, readiness, and replay should be deterministic local functions/classes with injected clocks/providers.

## Virtual Classroom provider/config surface — 12/12

Evidence: [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example:1-40

| Surface | Key | Default/example | Reader/impact |
|---|---|---|---|
| SURF-151 | `OPENAI_API_KEY` | see `.env.example` | host/provider configuration |
| SURF-152 | `OPENROUTER_API_KEY` | see `.env.example` | host/provider configuration |
| SURF-153 | `VC_DIRECTOR_MODEL` | see `.env.example` | host/provider configuration |
| SURF-154 | `VC_TTS_VOICE` | see `.env.example` | host/provider configuration |
| SURF-155 | `VC_TTS_MODEL` | see `.env.example` | host/provider configuration |
| SURF-156 | `VC_TTS_SPEED` | see `.env.example` | host/provider configuration |
| SURF-157 | `VC_MEDIA_PROVIDER` | see `.env.example` | host/provider configuration |
| SURF-158 | `VC_COMFY_URL` | see `.env.example` | host/provider configuration |
| SURF-159 | `VC_MINIMAX_BASE_URL` | see `.env.example` | host/provider configuration |
| SURF-160 | `VC_MINIMAX_MODEL` | see `.env.example` | host/provider configuration |
| SURF-161 | `VC_MINIMAX_API_KEY` | see `.env.example` | host/provider configuration |
| SURF-162 | `VC_MEDIA_DEADLINE_MS` | see `.env.example` | host/provider configuration |

Important semantics from `.env.example`:

- `OPENAI_API_KEY`: server-only TTS credential.
- `OPENROUTER_API_KEY`: live Teacher Director; missing key falls back to scripted lesson.
- `VC_DIRECTOR_MODEL`: model selection.
- `VC_MEDIA_PROVIDER`: `comfy | openai | auto`.
- `VC_COMFY_URL`: local media generator endpoint.
- `VC_MEDIA_DEADLINE_MS`: wall-clock budget before falling back to board.

## Clio controls

Clio's Stagehand core is schema/registry driven rather than environment-driven. Host repo contains many export and content pipeline controls, but they are not protocol controls. No `.env.example` exists at the pinned snapshot through the queried root path. [?] U-004.

## Authoring controls encoded in schemas

A critical design choice is that model-facing guidance lives beside machine validation:

- role (`setup`, `inline_cue`, `clear`, etc.)
- `requiresFollowingText`
- `nextTextShouldMentionTarget`
- `settleMs` in VC
- enum/numeric/duration/color/entity constraints in VC.

This prevents duplicated prompt vocabularies from drifting away from validators. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:90-260 [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/lesson/director.ts:1-100


---

<!-- SOURCE: analysis/18_STATE_MODEL.md -->

# 18 · State Model

## ENT-001 · StagehandCommand

- **Fields:** `action: string`, `args: string[]`, `kwargs: Record<string,string>`, `raw: string`.
- **Lifecycle:** parsed proposal → validated canonical proposal → committed effect OR rejected diagnostic.
- **Persistence:** trace/host dependent.
- **Invariant:** INV-001 — raw producer text cannot directly mutate public host state. Enforced by validation/reducer boundary. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-120

## ENT-002 · ScriptSegment

- Variants: text, command, compound.
- Text is public-candidate narration; commands are control IR; compounds group control with timing/intent semantics.
- INV-002 — content/control remain distinguishable after parsing.

## ENT-003 · CommandSchema

- Common fields: action, description, min/max positional args, required kwargs, optional/default kwargs, entity-resolution metadata, authoring metadata.
- VC extensions: `settleMs`, enums, numeric, durations, colors, entity lists. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:90-260
- INV-003 — producer vocabulary and validator vocabulary derive from one registry.

## ENT-004 · Compound segment

Variants:

- atomic batch
- ordered sequence with optional pause
- parallel group
- beat with stable id, visual intent, commands, narration.

VC nesting means compounds form a tree during parsing even though current segment types flatten child compounds to command arrays. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/parser.ts:190-390

## ENT-005 · Beat

Agent-facing object: `beat_id`, `narration`, `visual_intent`, `stagehand_sequence.steps`. Clio intentionally added WHY + WHAT + HOW. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:100-260

## ENT-006 · ValidationResult

- Accepted: command + canonical schema/canonical command.
- Rejected: original/normalized command + named errors; VC adds failing layer.
- INV-004 — rejection is terminal; no partial state mutation. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/validator.ts:1-100

## ENT-007 · StagehandTrace

VC concrete shape:

- sessionId
- startedAt
- publicEvents[]
- productionEvents[]. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts:60-180

Clio doctrine independently treats trace as canonical replay/export truth. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0009-stagehand-protocol.md:80-180

INV-005 — replay material must contain only accepted public effects plus enough deterministic identifiers/versions to reproduce them. Clio documentation specifies schema version as desired trace content; VC concrete trace currently lacks schema version → FIND-005.

## ENT-008 · ReadinessChannel

Per-key state: pending promise/resolver + mark timestamp. Gate additionally maintains a generation number. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/readiness.ts:1-200

Lifecycle: idle → marked/pending → settled → idle; invalidate increments generation, settles all, clears channels.

INV-006 — every wait resolves by settle or deadline.  
INV-007 — a stale generation cannot resume interrupted work.

## ENT-009 · Capability/Entity Registry

Abstract concept proven in both Clio and VC: commands reference semantic IDs, not arbitrary renderer coordinates/object pointers. Registry resolution is a separate phase. Clio uses GeoEntity; VC uses `anchor | board`. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts:1-360 [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:130-190

INV-008 — unresolved semantic refs cannot commit effects requiring those refs.

## ENT-010 · HostState (plugin-owned)

Not one shared type. Examples:

- chess board annotation state
- Clio SceneState / registry / camera bounds
- classroom board document + projector + room/lesson state
- VCB DOM/presenter state.

INV-009 — core runtime must not depend on a concrete HostState implementation in the rebuild.

## State transition table

| From | Trigger | To | Enforcement |
|---|---|---|---|
| raw stream | parser accepts narration | text segment | parser |
| raw stream | parser accepts control | StagehandCommand | parser |
| command | schema invalid | rejected | validator |
| command | schema valid, ref invalid | rejected/unresolved | resolver/validator |
| command | all gates pass | canonical command | validator/resolver |
| canonical command | adapter commit | host state + public event | host reducer |
| pending effect | renderer settles | ready | readiness gate |
| pending effect | timeout | degraded ready | readiness gate |
| any in-flight wait | interrupt/reset | stale | readiness generation |

## Gate 4

All portable entities have an enforcement point. Host-specific invariants are intentionally delegated to plugin validators rather than faked as universal state.


---

<!-- SOURCE: analysis/19_AGENT_ARCHITECTURE.md -->

# 19 · Agent Architecture

## Core agent contract

The producer is untrusted and is constrained in two independent ways:

1. **Prompt-time discoverability:** present only the live schema/registry vocabulary.
2. **Runtime authority:** reject anything not valid at execution time.

Prompting is ergonomic guidance; runtime validation is the security/trust boundary.

## Clio Director doctrine

Clio ADR-0009 requires:

- system prompt generated from command schemas,
- entity IDs limited to registry/briefing packet,
- source IDs limited to source registry,
- sparse valid staging preferred over invented rich staging,
- runtime as final release authority. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0009-stagehand-protocol.md:40-150

## Virtual Classroom Teacher Director

`buildCommandDigest()` iterates `COMMAND_SCHEMAS` to generate one command line per registered action, including argument ranges, enums, kwargs, descriptions, and board-target hints. The system prompt then embeds that digest and named registry surfaces. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/lesson/director.ts:1-160

Every turn also receives host pedagogical/context state (course/section goals, knowledge graph, board state, plan brief). This is host-specific context assembly, not protocol core.

## Model control loop

```text
assemble current context
  ↓
model proposes mixed Stagehand+narration
  ↓
parse / repair-safe syntax
  ↓
validate against current registry + host state
  ↓ reject → private diagnostic (future turn may self-correct)
commit valid effects
  ↓
wait for readiness when required
  ↓
speak/display narration
  ↓
receive student/user/system event
  ↓
next turn with canonical state, not model memory alone
```

## Repair policy

There are three historical postures:

- LLM-Chess: forgiving normalization + natural-language inference.
- Clio: stricter typed commands but relatively simple parser.
- VC: conservative syntax repair/recovery **before** strict layered validation; repair attempts are private production events.

The SDK should expose repair as an explicit optional policy object. INV-010: repair may normalize syntax but must never invent semantic targets/content.

## Termination / waits

- Model generation termination is provider/host-specific.
- Protocol compounds terminate with explicit close markers; VC supports `[end]` universal close.
- Runtime waits terminate on settle or timeout; interruptions invalidate generation. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/readiness.ts:1-220

## Model pinning

VC exposes `VC_DIRECTOR_MODEL`; provider defaults are host configuration. Stagehand core should not import model SDKs or name models. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example:1-20

## Prompt contract caveat

The VC prompt text contains some guidance that conflicts with later comments/behavior (for example “EVERY message MUST end with lesson.ask” followed later by “Do NOT end every turn with a question”). [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/lesson/director.ts:150-420 This is FIND-006: schema generation prevents command-vocabulary drift, but it does not prevent higher-level policy contradictions. The SDK needs machine-checkable authoring policies/lints where possible.


---

<!-- SOURCE: analysis/20_INTEGRATION_MAP.md -->

# 20 · Integration Map

## INT-001 · LLM provider

- Core requirement: none; producer can be any source of text/chunks.
- VC host uses OpenRouter proxy and model selected by `VC_DIRECTOR_MODEL`.
- Failure: missing OpenRouter key → scripted fallback rather than disabling classroom. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example:1-20
- SDK rule: inject `AsyncIterable<string>` / producer adapter; never couple parser/runtime to provider API.

## INT-002 · TTS / narration clock

- LLM-Chess and VCB prove control syntax must be stripped before speech.
- VC uses OpenAI TTS when configured and captions/timing fallback when unavailable. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:README.md:1-120
- Failure: speech cannot be allowed to voice raw control syntax. The 2026-09-02 VC incident showed bracket loss could cause an entire control turn to be spoken; parser recovery was added. [g] `4bf55adca60bbbbb2482d8d88c5b1d2598d270f8`.

## INT-003 · Renderer / performer

Renderer is always host-injected: chess board, map/globe, Three.js room, DOM article. Failure must settle/degrade readiness rather than deadlock protocol.

## INT-004 · Entity/capability registry

Host provides semantic targets and any derived geometry/state. Unknown references reject. Optional proposal-stub behavior exists in Clio but should be plugin-specific. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts:1-300

## INT-005 · Media generation/playback

VC optionally uses local ComfyUI or OpenAI-compatible video endpoint. `VC_MEDIA_DEADLINE_MS` bounds a clip wait before board fallback. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example:15-40

## INT-006 · Export/render pipeline

Clio treats trace/show plan as export source rather than regenerating model output. This is a strong SDK extension point for deterministic replay/render-to-video. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0010-export-as-trace.md:1-220

## INT-007 · Audio word timing

VCB accepts `wordsSrc` timestamp data; otherwise can use Web Speech behavior. Its Stagehand commands are mapped to word indices and fired when playback reaches them. [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:1-500

## Failure-mode matrix

| Integration | Failure | Existing behavior | SDK requirement |
|---|---|---|---|
| model | malformed command | reject/private diagnostic; VC may recover syntax | never direct-render raw |
| registry | unknown semantic ID | reject/unresolved | typed resolution failure |
| renderer | never settles | VC readiness timeout | mandatory deadline |
| interruption | late settle resumes old turn | VC generation stamping prevents it | mandatory cancellation epoch |
| TTS | control syntax leaks | VC added bare-command recovery | control-shaped text must be quarantined |
| media | source slow/unavailable | deadline/fallback | effect can fail without freezing narration |
| export | current renderer changes | trace replay design | trace must be versioned/migratable |

## Gate 5 integration closure

All external endpoints discovered in the VC Stagehand-adjacent `.env` surface have an explicit failure/degradation story. Clio provider/ops endpoints outside Stagehand scope are not attributed to core.


---

<!-- SOURCE: analysis/21_NFR_PROFILE.md -->

# 21 · Non-Functional Profile

No fresh runtime measurements were possible in the remote-source environment. Every numerical property below is source-defined rather than observed.

## NFR-001 · No raw-stream public leakage

Raw model output, parse failures, rejected commands, provider payloads, and repair attempts must stay private. VC enforces separate public/private event unions. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts:1-180

## NFR-002 · Deterministic validation

Given schema + host validation context, command acceptance should be deterministic and side-effect free until commit. VC validator is structured as ordered pure checks; Clio validator similarly canonicalizes after validation. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/validator.ts:1-500

## NFR-003 · Bounded readiness

Every wait has a deadline and returns settlement/outstanding/stale metadata. No renderer may freeze the performance indefinitely. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/readiness.ts:1-190

## NFR-004 · Interrupt safety

In-flight waits must be generation/cancellation stamped. Late callbacks cannot resume a superseded turn. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/readiness.ts:1-190

## NFR-005 · Schema-prompt anti-drift

Producer command vocabulary must be generated from schema registry. VC documents a prior Clio failure of ~397 invalid commands across ~70 scripts as the motivation. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-30

## NFR-006 · Accessibility / alternate surface

VC's structured board transcript is generated from the same canonical document, preventing visual/transcript drift. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:README.md:1-100 The generic SDK should support semantic effect events so hosts can expose non-visual equivalents.

## NFR-007 · Replayability

Accepted public effects must be serializable enough for deterministic replay/export. [?] Exact cross-version compatibility is unspecified → U-005.

## NFR-008 · Streaming latency

Stagehand's original value is that controls and narration share one stream, preserving positional timing without suspending generation for discrete tool calls. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0009-stagehand-protocol.md:1-220

Measured latency: **[?]** U-001.

## NFR-009 · Parser safety

Malformed/unclosed syntax cannot silently swallow large narration/control regions or leak command-shaped text to speech. VC improves Clio with hard unterminated-quote errors and control-shaped-text quarantine/recovery. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/parser.ts:1-420

## NFR-010 · Domain isolation

Core packages should be renderer- and domain-neutral. Current Clio/VC implementations violate this internally; the rebuild must enforce it by package dependency direction.

## Source-defined timing examples (not benchmarks)

VC schemas encode settle budgets such as teacher locomotion `5500ms` and gaze `400ms`; readiness maps independent actions to channels. These are host policy defaults, not core performance targets. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:180-260

## Security posture

Stagehand is an application-level capability sandbox: the model can only propose registered commands; entity IDs and state transitions are revalidated; public consumers subscribe only to validated events. It is **not** a process sandbox and should not be marketed as one.

## Gate 5

All numerical runtime performance characteristics that were not source-defined are marked `[?]`; no invented benchmark is presented.


---

<!-- SOURCE: analysis/22_INTENT_ARCHAEOLOGY.md -->

# 22 · Intent Archaeology

## DEC-001 · Inline content/control share one stream
- **When/source:** March/April 2026 lineage
- **Decision:** LLM-Chess discovered that visual annotations land at the right spoken moment because their tokens occupy that position in narration.
- **Constraint today:** Keep mixed stream as first-class protocol; do not replace core with sequential tool calls.
- **Evidence:** [v] Mnehmos/clio@03b1e1f:docs/doctrine/adrs/0009-stagehand-protocol.md:1-220

## DEC-002 · Treat model output as source code, not display text
- **When/source:** Clio ADR-0009
- **Decision:** Validation/filter/routing become a compiler boundary; raw stream never reaches user.
- **Constraint today:** Core doctrine remains valid and was strengthened by VC.
- **Evidence:** [g] Clio ADR-0009

## DEC-003 · Schema registry is authoritative
- **When/source:** Clio Stagehand v2 Phase 1
- **Decision:** Pinner audit found agents inventing commands; introspection makes valid surface inspectable.
- **Constraint today:** Registry + introspection belongs in core.
- **Evidence:** [g] 55c8a2b5827e2227b788eabce7c4eea1db37394d

## DEC-004 · Semantic commands can compile to primitive host commands
- **When/source:** Clio Phase 2
- **Decision:** Add smarter camera/highlight/route language without rewriting reducer.
- **Constraint today:** Formalize compiler/adapters in SDK rather than one-off v2→v1 shim.
- **Evidence:** [g] 4c38a9f287a67e519df09b64d9768ba42db59dd6

## DEC-005 · Composition primitives are protocol-level
- **When/source:** Clio Phases 3a/3b
- **Decision:** Batch atomicity, sequence order, parallel beat semantics were needed above individual commands.
- **Constraint today:** Keep composers in core, adopt VC nesting semantics.
- **Evidence:** [g] a3c333b17364dc56ea55a263cc8fd1e92427c1b1 / dca03d032b8195d98794659bc6021b510eff9e94

## DEC-006 · Visual validation belongs before render
- **When/source:** Clio Phase 4
- **Decision:** Pinner audit exposed off-frame/low-opacity/unsourced visual failures.
- **Constraint today:** Provide plugin validation hooks and optional preview QA package.
- **Evidence:** [g] fe597d56f59217fae6ea939151fdb26004b735e1

## DEC-007 · Beat is unit of editorial intent
- **When/source:** Clio Phase 5
- **Decision:** Need WHY (intent), WHAT (narration), HOW (commands) together for AI authoring and reports.
- **Constraint today:** Keep beat metadata as optional generic composition object.
- **Evidence:** [g] ae2b0666fca411429d553e039986339e4550d1a9

## DEC-008 · Domain surfaces may evolve without renderer rewrite
- **When/source:** Clio pieces/whiteboard
- **Decision:** World-piece metadata reserves future 3D renderer while protocol remains stable.
- **Constraint today:** Plugin command schemas should target semantic effects, not renderer internals.
- **Evidence:** [g] 3cf6d7698075da37a3df82f23dc1440f1f660a92

## DEC-009 · Narration must not outrun visible state
- **When/source:** VC readiness design
- **Decision:** Instant chess arrows did not generalize to walking avatars, motor screens, board reveals.
- **Constraint today:** Extract keyed readiness gate into core/runtime.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd72536:src/stagehand/readiness.ts:1-220

## DEC-010 · Parser must fail closed against control leakage
- **When/source:** VC 2026-09-02 incident
- **Decision:** A model omitted brackets and control syntax was spoken aloud; trust boundary failed.
- **Constraint today:** Quarantine/recover command-shaped text before narration release.
- **Evidence:** [g] 4bf55adca60bbbbb2482d8d88c5b1d2598d270f8

## DEC-011 · Nested compounds and robust quoting are required
- **When/source:** VC parser divergence
- **Decision:** Actual lesson design nested parallel inside sequence; apostrophes/LaTeX broke Clio quote assumptions.
- **Constraint today:** Use VC parser behavior as new core baseline.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd72536:src/stagehand/parser.ts:1-390

## DEC-012 · Public/private event separation is a type boundary
- **When/source:** VC events
- **Decision:** Rejected commands and provider details are useful diagnostics but unsafe/noisy public state.
- **Constraint today:** Core event bus/trace should distinguish release events from production events.
- **Evidence:** [v] Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts:1-180

## DEC-013 · Presenter Stagehand can be much smaller than world-state Stagehand
- **When/source:** VCB
- **Decision:** Word-index anchored focus/highlight/diagram proves mixed-stream choreography works without entity/reducer complexity.
- **Constraint today:** SDK must support minimal plugins and not require map/classroom machinery.
- **Evidence:** [v] Mnehmos/vibe-coders-bible@cb03273:site/src/components/Stagehand.tsx:1-500

## Architectural oddities explained

- **Why inline commands instead of tool calls?** DEC-001/002: positional synchronization and uninterrupted streaming.
- **Why schema-generated prompts?** DEC-003: invented-command/drift failures.
- **Why v2 semantic commands compile to v1?** DEC-004: preserve stable reducer while improving authoring semantics.
- **Why compounds?** DEC-005: individual command validity cannot express atomic/ordered/concurrent intent.
- **Why visual validators?** DEC-006: syntactically valid effects can still produce bad frames.
- **Why beats?** DEC-007: agent authoring needs intent alongside mechanics.
- **Why readiness?** DEC-009: positional timing alone stops being sufficient when effects take seconds.
- **Why parser recovery/quarantine?** DEC-010: a concrete trust-boundary incident.
- **Why VC diverged from Clio parser?** DEC-011: real content required nesting and robust math/prose quoting.

## Gate 6

All major structural divergences identified in Pass 2 have a DEC record. Remaining unresolved anomalies are logged in `24_UNKNOWNS.md` rather than explained speculatively.


---

<!-- SOURCE: analysis/23_RE_FINDINGS.md -->

# 23 · Reverse-Engineering Findings (partial through Pass 6)

## FIND-001 · `claim.show` is declared but not schema-backed in Clio

`CommandAction` includes `claim.show`; GitHub code search finds no `COMMAND_SCHEMAS` definition. `validateCommand` builds `SCHEMA_BY_ACTION` from that registry and rejects absent actions as unknown. Result: a type-level command that cannot pass the normal runtime. [v] `Mnehmos/clio@03b1e1f:src/stagehand/types.ts:1-1100` + `validator.ts:1-220`.

**Rebuild:** either specify the command fully or remove it; never let union and registry drift.

## FIND-002 · Clio’s “cross-domain reuse leaves parser/runtime unchanged” was directionally right but literally false

ADR-0009 predicted new domains would require only vocabulary plugins. Virtual Classroom reused the doctrine but had to change parser behavior, schema metadata, validation layering, readiness, event boundary, and runtime policies. [v] VC parser/types/events/readiness.

**Rebuild:** extract interfaces/invariants, not the Clio implementation wholesale.

## FIND-003 · Original timing property is necessary but insufficient

LLM-Chess/ADR insight: adjacency gives correct cue ordering “for free.” VC demonstrates effects with nonzero settle time require a second mechanism: readiness gates. These are complementary, not competing.

## FIND-004 · LLM-Chess natural-language inference weakens the trust story

The origin parser can infer annotations from prose and passive square mentions. Useful UX, but semantically it lets prose mutate visual state. VC explicitly declines to inherit this. [v] LLM board-annotations + VC types header.

**Rebuild:** put inference in an opt-in compatibility producer, never in trusted core execution.

## FIND-005 · Concrete VC `StagehandTrace` is less versioned than Clio doctrine expects

Clio doctrine calls for schema version in trace for replay determinism; VC trace stores session/time/public/private events but no schema version. [v] VC events; [v] Clio ADR-0009.

**Rebuild:** trace envelope must contain protocol version, schema-set/plugin versions, host adapter version, and optional renderer asset manifest hash.

## FIND-006 · Schema-generated command prompts do not eliminate policy-prompt contradictions

VC structurally generates command vocabulary, but its higher-level prompt contains contradictory pacing directions (mandatory final question vs later instruction not to end every turn with a question). [v] `src/lesson/director.ts`.

**Rebuild:** move enforceable authoring rules into policy/lint/state validators; reserve prompt prose for soft style.

## FIND-007 · Clio semantic-v2 adapter is an accidental compiler architecture

`compileV2Command` validates semantic author commands then compiles them into reducer-compatible v1 commands. This is exactly the abstraction an SDK should formalize: producer dialect → canonical effect IR → host adapter.

## FIND-008 · `map.timecursor` documentation/schema semantics appear contradictory

Clio schema lists `at` as required, while the reference documentation says “Omit to leave the cursor on live.” [v] types/reference doc. This must be resolved before spec emission.

## FIND-009 · Licenses are inconsistent for an SDK extraction

Clio is MIT; VCB is CC-BY-4.0; root license files were not discovered for LLM-Chess or Virtual Classroom snapshots. This is not a technical blocker for the maintainer's informed rewrite, but it is a distribution blocker until the new SDK has an explicit software license and provenance policy.

## FIND-010 · Existing implementations duplicate core code rather than consume one package

Clio and VC both carry parser/types/validator implementations in-app. That duplication enabled useful evolution but guarantees drift. The SDK extraction should preserve app plugins while deleting duplicated protocol kernels from hosts after migration.


---

<!-- SOURCE: analysis/24_UNKNOWNS.md -->

# 24 · Unknowns

## U-001 · Runtime/build observation unavailable
- **Tier:** T0 for measured parity, waived for static Passes 0–6 by maintainer instruction.
- **Unknown:** current build/test/runtime behavior at pinned commits in this analysis environment.
- **Why it matters:** Pass 7+ parity needs executable originals.
- **Resolution:** materialize each pinned repo in a runner; execute package build/test commands; capture traces and golden outputs.

## U-002 · LLM-Chess root software license
- **Tier:** T1 for public SDK provenance.
- **Observed:** root `LICENSE` fetch returned 404 at pinned commit.
- **Resolution:** maintainer chooses/adds license or explicitly authorizes informed rewrite under new SDK license.

## U-003 · Virtual Classroom root software license
- **Tier:** T1 for public SDK provenance.
- **Observed:** root tree/search exposed no project LICENSE; package-lock dependency license strings are not project licensing.
- **Resolution:** add explicit project license before public extraction/reuse.

## U-004 · Clio provider/environment control inventory
- **Tier:** T2.
- **Unknown:** complete host environment key surface; no root `.env.example` at pinned commit.
- **Why it matters:** only if a Clio adapter package bundles provider/export integrations.
- **Resolution:** Pass 7 targeted search for `process.env`, `import.meta.env`, CLI parsing; keep out of core regardless.

## U-005 · Cross-version trace compatibility policy
- **Tier:** T1 for replay SDK.
- **Unknown:** migration/version policy for old traces after schemas/plugins change.
- **Resolution:** define versioned trace envelope + migrator registry before 1.0.

## U-006 · Compact exact filename list for all 27 Clio Stagehand path entries
- **Tier:** T2.
- **Known:** GitHub code search count = 27; core behavioral modules are mapped.
- **Unknown:** compact filename-only enumeration was not available through current response shape without spending the pass on pagination/metadata stripping.
- **Resolution:** materialize repo or Git tree JSON and extract paths mechanically in Pass 7.

## U-007 · Intended fate of Clio `claim.show`
- **Tier:** T1.
- **Unknown:** abandoned command vs missing schema implementation.
- **Resolution:** git blame/issue/PR search around `claim.show`; decide remove or fully specify.

## U-008 · `map.timecursor at` optional-vs-required intent
- **Tier:** T1.
- **Unknown:** whether live cursor is represented by omitted `at`, empty string, or separate command/state.
- **Resolution:** read reducer/tests/PR #207 discussion and choose canonical contract.

## U-009 · Generic repair boundary
- **Tier:** T1.
- **Unknown:** exact set of syntax repairs safe enough to ship enabled by default across domains.
- **Resolution:** build adversarial corpus from Clio/VC failures; classify transformations as lexical-only vs semantic; semantic repairs default-off.

## U-010 · Streaming compound semantics
- **Tier:** T1.
- **Unknown:** whether current StreamingParser fully supports compound folding incrementally or relies on batch postprocessing in all hosts.
- **Resolution:** differential tests against complete and token-fragmented scripts before SDK parser spec.


---

<!-- SOURCE: 00_TRACEABILITY.md -->

# 00 · Traceability Seed (Passes 0–6)

Full SURF→FEAT→FR→CTR→T→TEST closure is a Pass 8–10 deliverable. This seed prevents identity loss before synthesis.

| ID range | Meaning | Current owner/evidence |
|---|---|---|
| SURF-001..004 | LLM-Chess commands | chess annotation adapter |
| SURF-005..051 | Clio declared commands | geo/showrunner plugin candidate |
| SURF-052..089 | Virtual Classroom commands | classroom plugin candidate |
| SURF-090..097 | VCB presenter commands | DOM presenter plugin candidate |
| SURF-098..117 | Clio Stagehand module exports | core/API evidence |
| SURF-118..137 | VC public events | core trace/event candidate |
| SURF-138..145 | VC private events | core diagnostics candidate |
| SURF-146..150 | Clio runtime events | runtime evidence |
| SURF-151..162 | VC environment keys | host-only controls |
| SURF-163..168 | wire/file formats | core/compat contracts |

## Decision links

- DEC-001/002 → mixed-stream parser + trust boundary.
- DEC-003 → schema registry/introspection.
- DEC-005/007 → compound/beat IR.
- DEC-009/010/011/012 → readiness, hardened parser, event/trace core.

No FEAT/FR/T/TEST IDs are issued yet; doing so before Pass 8 would prematurely freeze feature boundaries.


---

<!-- SOURCE: ASTRA_HANDOFF.md -->

# Astra Handoff — Stagehand SDK Reconstruction after Pass 6

## What Astra should assume

Do **not** rebuild Clio's `src/stagehand` as a package verbatim. The evidence shows Stagehand evolved materially across LLM-Chess, Clio, Virtual Classroom, and the VCB presenter. The new SDK should preserve the architecture and invariants while choosing the strongest behavior from later applications.

## Working definition

**Stagehand is a headless, model-agnostic mixed-stream compiler/runtime that turns untrusted narration-plus-control into validated, traceable, synchronized host effects.**

## Recommended package shape for Spec Kit planning

```text
packages/
  core/            Command, Segment, Schema, Result, version types
  parser/          batch + streaming compiler; VC-safe lexer baseline
  registry/        capability registration + introspection
  runtime/         ordered validation/resolution/commit pipeline
  trace/           public/private events, versioned replay envelope
  readiness/       keyed settle channels, deadlines, cancellation epochs
  authoring/       schema-derived prompt digest, lint, beat reports
  compatibility/
    llm-chess/      forgiving legacy annotation parser (opt-in)
plugins/
  chess/
  geo-clio/
  classroom/
  dom-presenter/
examples/
  minimal-console/
  narrated-dom/
  chess-board/
  clio-map/
  virtual-classroom/
```

## Non-negotiable core invariants

1. Raw producer output is never a public effect.
2. Narration/control are parsed before release.
3. Only registered capabilities can commit.
4. Schema is the source of truth for validation and producer introspection.
5. Domain refs resolve through host registries, never model-invented coordinates/pointers by default.
6. Rejection is terminal for that command/atomic group.
7. Repair is explicit, conservative, traced, and never semantic by default.
8. Readiness waits are deadline bounded and cancellation-generation safe.
9. Public events and production diagnostics are separate typed channels.
10. Trace envelopes are protocol/plugin/version stamped and replayable without another model call.
11. Compounds support nesting; syntax must handle apostrophes and LaTeX/backslashes safely.
12. Core has zero model-provider, renderer, map, Three.js, chess, DOM, or classroom dependencies.

## Strong divergences to encode in the future Spec Kit

- Prefer VC parser semantics over Clio parser for nesting/quotes/control leakage.
- Generalize VC five-layer validator into pluggable validator stages.
- Generalize VC readiness/event trace into core packages.
- Preserve Clio introspection/authoring/visual-QA ideas as optional authoring package.
- Keep Clio v2→v1 adapter concept but rename/formalize it as effect compilation.
- Keep LLM-Chess inference only as explicit compatibility mode.
- Do not carry Clio `claim.show` or ambiguous `map.timecursor` contract until U-007/U-008 resolve.

## Next command

Run Pass 7 adversarial sweep against this corpus, with executable checkouts if possible. Then Pass 8 should collapse the 168 surfaces into features **by integrator/user capability, not by original repository/module**.


---

# PASS 7 — EXECUTION, CONFORMANCE, CLOSEOUT

# Pass 7 — Execution, Conformance, and Closeout

**Status: PASS — DONE**

Pass 7 closes the execution/conformance phase of the Stagehand reconstruction. Verification provenance is deliberately split into two classes:

1. **Upstream original-host evidence** — immutable source/commit evidence from the Mnehmos repositories, including historical build/test results recorded by the original projects.
2. **Local reconstructed-core execution** — an independent Node harness derived from the recovered cross-application contract and executed in this environment.

The complete original applications could not be cloned into the container because direct outbound Git transport is unavailable. Therefore this report does **not** claim that the pinned original repositories were rebuilt locally. That limitation is now provenance, not an unresolved behavioral gap: the portable contract was exercised locally, while original-host behavior is supported by pinned source, tests, and commit evidence.

## 7.1 Inputs

- `Mnehmos/LLM-Chess` — origin annotation/narration mechanism.
- `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e` — formal Stagehand implementation.
- `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f` — hardened cross-domain implementation.
- `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c` — DOM/audio presenter dialect.
- Passes 0–6 census: 168 surfaces, including 97 protocol command surfaces.

## 7.2 Upstream runtime evidence

### Clio
Commit `72cefc649437ea65792f7419c550f133c7d288a4` records the repair of a registry/schema introspection gap and a **641 / 641** full Vitest pass. The same commit explicitly registers `map.timecursor` with `at` required while its prose description says omitting `at` resets to live, preserving the contract contradiction discovered in Pass 6.

### Virtual Classroom
Commit `4bf55adca60bbbbb2482d8d88c5b1d2598d270f8` records the real production failure where a model omitted every Stagehand bracket and control syntax was spoken aloud. The fix hardened batch and streaming parsing, added tests for command recovery, and reports **147 tests, typecheck and build clean**.

These are upstream historical execution records, not local reruns.

## 7.3 Local reconstructed-core execution

Harness: `harness/stagehand-conformance.mjs`

Runtime: Node v22.16.0

Result: **21 / 21 PASS**

- Golden cases: 10 / 10
- Adversarial cases: 11 / 11
- Failures: 0

The harness is intentionally an informed independent implementation, not copied host code. It tests the contract selected for extraction rather than attempting to emulate rendering, geography, chess semantics, classroom pedagogy, or any other host domain.

## 7.4 Conformance coverage

Validated locally:

- bracketed mixed-stream command parsing;
- quoted values with spaces;
- apostrophes as literal content rather than accidental quote openers;
- LaTeX/backslash preservation;
- whitespace around `=` recovery;
- schema-aware unquoted multi-word recovery;
- nested compound composers;
- universal `[end]` closure;
- unmatched compound opener visible degradation;
- orphan closer suppression;
- strict unknown-action rejection;
- missing-bracket control syntax does not become narration;
- atomic compound rejection if any inner command fails;
- `claim.show` drift detection;
- `map.timecursor` missing-`at` mismatch detection;
- readiness timeout instead of deadlock;
- generation invalidation/stale waiter detection;
- public/private event partition;
- schema-generated authoring/introspection surface;
- generic core excludes host-domain state namespaces.

## 7.5 Confirmed upstream defects / ambiguities

### FIND-001 — `claim.show` remains orphaned
Repository code search at the pinned Clio revision finds `claim.show` in the action union and presentation metadata, but no schema implementation. No matching issue or PR was found. Under Clio's schema-first validator, it is therefore not a normally executable command. The reconstruction treats it as an upstream orphan and excludes it from the canonical SDK command registry until specified.

### FIND-008 — `map.timecursor` contract is internally contradictory
At the pinned Clio revision:

- `COMMAND_SCHEMAS`: `requiredKwargs: ['at']`;
- `TOOL_REGISTRY`: `at.required = true`;
- registry prose: “Omit `at` to reset ... live”;
- reference docs: omit `at` for live.

The SDK must not preserve this ambiguity. Recommended canonical form:

```text
map.timecursor(at?: ISO-8601)
```

where omitted `at` deterministically means `live`, or alternatively a tagged `{ mode: 'live' | 'at', at?: string }` IR. The latter is preferable for 1.0 because it removes empty/omitted-value ambiguity.

## 7.6 Pass 7 verdict

The reverse-engineered protocol is sufficiently closed to begin clean-room SDK implementation. Remaining unknowns are governance/versioning/license decisions or upstream defects, not missing knowledge about the portable execution model.

**Pass 7: PASS. Reconstruction phase: DONE.**


---

# Pass 7 — Golden Cases

These are the minimum portable behavior vectors the extracted SDK must preserve. They are executable in `harness/stagehand-conformance.mjs` and recorded in `golden_cases.json`.

| ID | Golden behavior | Required result |
|---|---|---|
| G-001 | Valid bracketed command | Parses and validates |
| G-002 | Quoted multi-word value | Spaces preserved |
| G-003 | Apostrophe in unquoted value | Apostrophe remains literal |
| G-004 | LaTeX/backslash payload | Backslashes survive parsing |
| G-005 | Spaces around `=` | Lexically normalized |
| G-006 | Unquoted multi-word kwarg | Schema-aware recovery without swallowing next known kwarg |
| G-007 | Nested compounds | Nested control groups flatten/compose deterministically |
| G-008 | `[end]` | Closes innermost compound |
| G-009 | Unmatched opener | Does not swallow remaining stream; surfaces visibly for validation |
| G-010 | Orphan closer | Does not execute as a host effect |

The golden corpus deliberately adopts the stronger Virtual Classroom parser semantics where Clio and Classroom diverge, because those changes are documented repairs to failures in the reusable protocol boundary rather than classroom-specific business rules.


---

# Pass 7 — Adversarial Results

Local result: **11 / 11 adversarial cases passed**.

| ID | Attack/failure mode | Expected invariant |
|---|---|---|
| A-001 | Unknown action | Reject at registry boundary |
| A-002 | Model drops all brackets | Control syntax never becomes user narration |
| A-003 | Invalid command inside atomic batch | Whole atomic group fails |
| A-004 | Unterminated quote | Hard syntax error, not silent token swallowing |
| A-005 | Declared-but-unspecified `claim.show` | Reject until schema-backed |
| A-006 | `map.timecursor` without `at` under pinned Clio schema | Detect contract mismatch |
| A-007 | Renderer never settles | Deadline resolves wait; no permanent deadlock |
| A-008 | Interruption during wait | Generation change marks waiter stale |
| A-009 | Private rejection event | Never leaks into public show-event channel |
| A-010 | Schema change | Generated authoring/introspection digest changes from same source of truth |
| A-011 | Generic core | Contains no host-specific lesson/projector/piece/room state |

The adversarial suite is a seed, not a security proof. It should become a permanent compatibility suite in the extracted package.


---

# Pass 7 — Final SDK Extraction Boundary

## Canonical architecture

```text
Model / authored script / deterministic producer
                    |
                    v
             mixed text stream
                    |
          @stagehand/parser
                    |
       narration + proposed IR
                    |
      @stagehand/registry + policy
                    |
     layered validation / canonicalize
                    |
       semantic compile / adapters
                    |
          @stagehand/runtime
          /       |       \
         v        v        v
      effects   trace   readiness
         |                 |
         +------ host -----+
```

## Packages

### `@stagehand/core`
Owns protocol types only: command, script segment, compound/beat IR, validation result, canonical effect envelope, version identifiers.

### `@stagehand/parser`
Owns batch + streaming mixed-stream parsing, robust lexical handling, compound folding, safe lexical recovery, and command/narration separation. Default semantics should include the fixes proven necessary by Virtual Classroom: nesting, `[end]`, safe apostrophes/LaTeX, bracket-loss suppression.

### `@stagehand/registry`
Owns command/plugin schemas, introspection, generated authoring descriptions, schema-set version/hash, and capability negotiation. A command cannot exist only in a TypeScript union; registry membership is authoritative.

### `@stagehand/runtime`
Owns the execution pipeline and transactional boundaries:

```text
parse -> validate -> compile -> resolve -> authorize -> commit -> trace
```

The model never directly mutates host state.

### `@stagehand/trace`
Owns public/private channels, replay envelopes, accepted/rejected command records, resolution data, protocol/schema/plugin versions, adapter version, and optional asset-manifest hashes.

### `@stagehand/readiness`
Owns independently keyed settling channels, deadlines, cancellation generations, and stale-wait prevention.

### `@stagehand/authoring`
Owns generated prompt/digest material, authoring lint, placement metadata, and static composition checks. It consumes the same registry used by validation.

## Host plugins

```text
@stagehand/plugin-chess
@stagehand/plugin-clio-geo
@stagehand/plugin-classroom
@stagehand/plugin-dom-presenter
```

Plugins own domain command schemas, resolvers, validators, compiler passes, state adapters, and renderer readiness signaling. They do not own the mixed-stream parser or generic trace/event machinery.

## Canonical protocol invariants

1. Narration and control may coexist in one stream, but are separate after parsing.
2. Raw model output is never public state.
3. Unknown commands fail closed.
4. No effect is committed before validation/resolution/authorization.
5. Schema/registry is the source of truth for both model affordances and runtime acceptance.
6. Compound semantics are explicit, not inferred from timing accidents.
7. Readiness is keyed, bounded, and interruptible.
8. Rejection is observable privately but produces no partial public effect.
9. Every committed effect is replayable from a versioned trace.
10. Host state remains outside generic core.
11. Semantic repair is opt-in; safe lexical recovery may be default.
12. Producer dialects compile into a canonical effect IR instead of teaching every renderer every dialect.

## Final recommendation

Do not package Clio's current `src/stagehand` directory verbatim. Build the SDK from the recovered invariant set and use Clio/Virtual Classroom as conformance fixtures. Virtual Classroom is not merely another consumer; it contains protocol-level repairs that belong upstream in the shared core.


---

# Pass 7 — Final Findings and Disposition

| Finding / unknown | Pass 7 disposition |
|---|---|
| U-001 original runtime not locally executable | **Closed as provenance limitation.** Full hosts were not rerun; upstream test/build evidence is recorded and portable core was executed locally. |
| U-002 LLM-Chess root license | **Open governance item.** No root license established in this reconstruction. |
| U-003 Virtual Classroom root license | **Open governance item.** Dependency license strings do not license the project. |
| U-004 Clio env/provider inventory | **De-scoped from core.** Search confirms export/site/provider env controls exist; adapter packaging should inventory them separately. |
| U-005 trace compatibility policy | **SDK design decision.** Require protocol/schema/plugin/adapter versions plus migrator registry before 1.0. |
| U-006 exact 27 Clio Stagehand filenames | **Non-blocking metadata item.** Count and behaviorally relevant modules are known; exact compact path dump is not required for extraction. |
| U-007 fate of `claim.show` | **Confirmed upstream orphan, intent unknown.** Exclude from canonical registry until explicitly specified. |
| U-008 `map.timecursor` optional/required | **Confirmed contradiction.** SDK must choose an unambiguous live-vs-at representation. |
| U-009 repair boundary | **Resolved for extraction.** Lexical recovery allowed; semantic repair default-off and plugin/policy controlled. |
| U-010 streaming compounds | **Resolved as target contract.** New core requires streaming and batch parsers to converge on the same compound IR; VC semantics are baseline. |

## New findings from Pass 7

### FIND-011 — Introspection drift already caused a failing invariant in production development
Clio commit `72cefc...` explicitly states that four A5 commands were present in `COMMAND_SCHEMAS` but missing from `TOOL_REGISTRY`, and that `registry.test.ts` existed to catch exactly this. This strengthens the SDK rule that one registry must generate both validation and introspection rather than maintaining parallel command catalogs.

### FIND-012 — Bracket-loss is a real observed trust-boundary failure, not a hypothetical parser edge case
Virtual Classroom commit `4bf55adc...` documents a live model turn where all brackets disappeared and control syntax was spoken to the student. The recovered core therefore treats “control-shaped text must never become narration” as a security/trust invariant.

### FIND-013 — The strongest Stagehand design is an IR compiler, not a command parser
Across Clio v2 adapters and Classroom retargeting, application commands are producer dialects. The stable unit is a validated effect IR plus trace/readiness lifecycle. This is the architecture the standalone SDK should expose.


---

# FINAL ASTRA HANDOFF

# Astra Handoff — Stagehand SDK, Reconstruction Complete

## Mission

Implement a standalone Stagehand SDK from the recovered behavior contract. Do **not** copy Clio wholesale. Treat Clio and Virtual Classroom as host implementations/conformance fixtures from which a cleaner protocol kernel is extracted.

## Product definition

**Stagehand is a headless, model-agnostic mixed-stream compiler/runtime that turns untrusted narration-plus-control into validated, traceable, synchronized host effects.**

The application owns what an effect means. Stagehand owns whether the proposal is parsed, registered, validated, resolved, authorized, committed, synchronized, traced, and replayable.

## Required package shape

```text
packages/
  core
  parser
  registry
  runtime
  trace
  readiness
  authoring
plugins/
  chess
  clio-geo
  classroom
  dom-presenter
```

## Non-negotiable contracts

1. `StagehandCommand = { action, args, kwargs, raw }` at the raw command boundary.
2. Mixed narration/control stream becomes typed segments before execution.
3. Registry/schema is authoritative; no action may exist only in a union or a parallel catalog.
4. Unknown action fails closed.
5. Batch/sequence/parallel/beat are explicit IR nodes and may nest.
6. `[end]` closes the innermost compound; explicit closers remain accepted for compatibility.
7. Unterminated quotes are hard syntax errors.
8. Apostrophes and LaTeX backslashes survive normally.
9. Bracket loss must never expose control syntax as narration.
10. Generic runtime supports layered validators supplied by plugins.
11. No partial public effect from a rejected atomic group.
12. Public effects and private production diagnostics are separate channels.
13. Readiness waits are keyed, deadline-bounded, and generation-invalidated on interruption/reset.
14. Trace envelope is versioned by protocol + schema/plugin set + host adapter, with optional asset-manifest hash.
15. Lexical repair can be default-on; semantic inference/repair is opt-in.
16. Producer dialect commands may compile into a smaller canonical effect IR.
17. Host state such as globe, board, lesson, projector, chess position, or DOM article remains plugin-owned.

## Known upstream defects — do not reproduce accidentally

- Clio `claim.show`: declared but not schema-backed. Exclude until specified.
- Clio `map.timecursor`: docs/prose allow omitted `at` for live, schema/introspection require `at`. Choose an explicit canonical representation.
- Clio had parallel `COMMAND_SCHEMAS` / `TOOL_REGISTRY` drift. Generate both authoring affordances and runtime acceptance from one registry.

## Parser baseline

Use the hardened Virtual Classroom semantics as the generic target where they repair Clio's parser rather than express classroom policy:

- nested compounds;
- `[end]`;
- safe quote-position rules;
- whitespace-around-`=` handling;
- schema-aware multi-word recovery;
- command-shaped narration suppression;
- batch and streaming parity.

## Conformance seed

Import the 21 vectors in `conformance_results.json` as the first package tests. Preserve their intent even if implementation APIs change.

## Definition of done for SDK v0.1

- all Pass 7 golden/adversarial vectors pass in batch and streaming modes;
- all four host plugins can register commands without modifying core parser/runtime;
- schema introspection is generated from the validation registry;
- versioned trace replays committed effects deterministically with a mock host;
- readiness timeout/interruption tests pass;
- `claim.show` and `map.timecursor` decisions are explicit ADRs;
- no host-specific state type is imported by core packages;
- software license and provenance policy are explicit before public release.

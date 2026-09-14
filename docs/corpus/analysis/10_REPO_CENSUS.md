# 10 · Repository Census

## Target boundary

The extraction target is the **Stagehand protocol family**, not one host application. The lineage is:

1. **LLM-Chess** — origin mechanism: inline visual annotations embedded in narration and stripped from speech. [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts:1-300
2. **Clio** — first explicit “Stagehand Protocol”: typed command registry, parser, validator, runtime/canonicalization, domain adapters, compounds, introspection, visual validation, beats. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:1-1100
3. **Virtual Classroom** — independent retarget proving cross-domain reuse, while also repairing parser/trust/timing defects in Clio. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-260
4. **Vibe Coders Bible** — simplified presenter/reference dialect: `[stage.*]` commands bound to narration word positions. [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx:1-500

### Excluded namespace collision

`exhibit-of-shadows` was excluded as a namespace collision in the original census; this exclusion was not independently re-proven in Pass 7. [?] U-011.

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
4. Export/show integration is outside the portable SDK boundary; exact trace consumption entrypoints were not re-proven in this corpus. [?] U-012.

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

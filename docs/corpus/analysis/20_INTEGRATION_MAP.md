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

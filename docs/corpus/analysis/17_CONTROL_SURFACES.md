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

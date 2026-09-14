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

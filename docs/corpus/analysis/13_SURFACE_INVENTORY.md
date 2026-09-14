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


## Pass 7/8 scope disposition

- Dead surfaces: **1** — `SURF-027 claim.show`, excluded because the declared action has no schema-backed executable contract at the pinned Clio revision.
- Non-dead surfaces: **167**.
- Pass 8 exact-one-owner assignment: **167/167**.
- Orphans: **0**. Double claims: **0**.

## SC-P01 · LLM-Chess annotation commands

Discovery: pinned source registry/search described below.

Count: **4**

| ID | Surface | Kind | Application | Location | Notes | Dead? | FEAT |
|---|---|---|---|---|---|---|---|
| SURF-001 | `arrow` | protocol command | LLM-Chess | `Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts` | Draw an arrow between chess squares; optional color. | no | FEAT-016 |
| SURF-002 | `highlight` | protocol command | LLM-Chess | `Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts` | Highlight one chess square; optional color. | no | FEAT-016 |
| SURF-003 | `circle` | protocol command | LLM-Chess | `Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts` | Circle one chess square; optional color. | no | FEAT-016 |
| SURF-004 | `move` | protocol command | LLM-Chess | `Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts` | Encode a proposed/visualized move between squares; optional promotion. | no | FEAT-016 |

## SC-P02 · Clio Stagehand command actions

Discovery: pinned source registry/search described below.

Count: **47**

| ID | Surface | Kind | Application | Location | Notes | Dead? | FEAT |
|---|---|---|---|---|---|---|---|
| SURF-005 | `map.view` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Set camera coordinate/zoom. | no | FEAT-007 |
| SURF-006 | `map.focus` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Focus camera on one registered entity. | no | FEAT-007 |
| SURF-007 | `map.fit` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Frame multiple entities or explicit bounds. | no | FEAT-007 |
| SURF-008 | `map.mode` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Switch rhetorical map mode. | no | FEAT-007 |
| SURF-009 | `map.highlight` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Highlight an entity. | no | FEAT-008 |
| SURF-010 | `map.spotlight` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Dim scene except target aperture. | no | FEAT-008 |
| SURF-011 | `map.label` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Attach/update an entity label. | no | FEAT-008 |
| SURF-012 | `map.clear` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Clear classes of transient map state. | no | FEAT-008 |
| SURF-013 | `map.arrow` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Great-circle directed connector. | no | FEAT-008 |
| SURF-014 | `map.circle` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Ring an entity. | no | FEAT-008 |
| SURF-015 | `map.line` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Great-circle undirected connector. | no | FEAT-008 |
| SURF-016 | `layer.on` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Enable a named thematic layer. | no | FEAT-009 |
| SURF-017 | `layer.off` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Disable a named thematic layer. | no | FEAT-009 |
| SURF-018 | `flow.animate` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Animate a route/flow. | no | FEAT-009 |
| SURF-019 | `flow.clear` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Clear active flows. | no | FEAT-009 |
| SURF-020 | `piece.place` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Place/update globe-anchored simulation piece. | no | FEAT-010 |
| SURF-021 | `piece.move` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Move/restyle a piece. | no | FEAT-010 |
| SURF-022 | `piece.remove` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Remove one piece. | no | FEAT-010 |
| SURF-023 | `piece.clear` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Clear pieces. | no | FEAT-010 |
| SURF-024 | `chat.say` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Open a source-backed narration attribution scope. | no | FEAT-011 |
| SURF-025 | `source.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Display a source receipt. | no | FEAT-011 |
| SURF-026 | `source.hide` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Hide source receipts. | no | FEAT-011 |
| SURF-027 | `claim.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Declared in CommandAction but no schema entry found. | yes | — |
| SURF-028 | `entity.propose` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Propose a new registry entity. | no | FEAT-010 |
| SURF-029 | `mark.clip` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Mark export moment. | no | FEAT-004 |
| SURF-030 | `scene.fade` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Apply broadcast fade overlay. | no | FEAT-011 |
| SURF-031 | `scene.title` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Show/clear title/chapter card. | no | FEAT-011 |
| SURF-032 | `asset.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Display registered/inline evidence asset. | no | FEAT-011 |
| SURF-033 | `asset.clear` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Clear evidence assets. | no | FEAT-011 |
| SURF-034 | `whiteboard.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Show screen-space whiteboard. | no | FEAT-012 |
| SURF-035 | `whiteboard.hide` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Hide whiteboard. | no | FEAT-012 |
| SURF-036 | `whiteboard.clear` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Clear whiteboard. | no | FEAT-012 |
| SURF-037 | `whiteboard.text` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Place freeform text. | no | FEAT-012 |
| SURF-038 | `whiteboard.line` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Draw freeform line. | no | FEAT-012 |
| SURF-039 | `whiteboard.box` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Draw box/panel. | no | FEAT-012 |
| SURF-040 | `camera.center` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic camera centering primitive (v2). | no | FEAT-007 |
| SURF-041 | `camera.focus_region` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic region framing primitive (v2). | no | FEAT-007 |
| SURF-042 | `camera.establish_globe` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Globe-scale establishing camera (v2). | no | FEAT-007 |
| SURF-043 | `highlight.region` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic region highlight (v2). | no | FEAT-008 |
| SURF-044 | `highlight.location` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic point highlight (v2). | no | FEAT-008 |
| SURF-045 | `label.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic label primitive (v2). | no | FEAT-008 |
| SURF-046 | `route.draw` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Semantic route primitive (v2). | no | FEAT-008 |
| SURF-047 | `camera.follow_marker` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Set/clear chase-camera policy. | no | FEAT-007 |
| SURF-048 | `map.overlay.show` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Activate registered map overlay. | no | FEAT-009 |
| SURF-049 | `map.overlay.hide` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Hide one/all overlays. | no | FEAT-009 |
| SURF-050 | `map.basemap` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Switch named/registered basemap. | no | FEAT-009 |
| SURF-051 | `map.timecursor` | protocol command | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` | Set overlay time cursor. | no | FEAT-009 |

## SC-P03 · Virtual Classroom Stagehand command actions

Discovery: pinned source registry/search described below.

Count: **38**

| ID | Surface | Kind | Application | Location | Notes | Dead? | FEAT |
|---|---|---|---|---|---|---|---|
| SURF-052 | `avatar.move` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Move teacher to semantic anchor. | no | FEAT-013 |
| SURF-053 | `avatar.look` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Aim teacher gaze. | no | FEAT-013 |
| SURF-054 | `avatar.gesture` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Play semantic teaching gesture. | no | FEAT-013 |
| SURF-055 | `avatar.point` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Point at committed board element. | no | FEAT-013 |
| SURF-056 | `avatar.face` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Set facial expression. | no | FEAT-013 |
| SURF-057 | `whiteboard.show` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Activate board/new page. | no | FEAT-012 |
| SURF-058 | `whiteboard.hide` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Occlude/deactivate presentation without destroying content. | no | FEAT-012 |
| SURF-059 | `whiteboard.clear` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Clear board layer/page content. | no | FEAT-012 |
| SURF-060 | `whiteboard.text` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Commit exact text element. | no | FEAT-012 |
| SURF-061 | `whiteboard.math` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Commit typeset equation. | no | FEAT-012 |
| SURF-062 | `whiteboard.line` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Draw line. | no | FEAT-012 |
| SURF-063 | `whiteboard.box` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Draw box. | no | FEAT-012 |
| SURF-064 | `whiteboard.arrow` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Draw arrow. | no | FEAT-012 |
| SURF-065 | `whiteboard.highlight` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Highlight board element/region. | no | FEAT-012 |
| SURF-066 | `whiteboard.scribble` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Commit thinking-layer scribble. | no | FEAT-012 |
| SURF-067 | `whiteboard.dots` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Draw countable dots/tokens. | no | FEAT-012 |
| SURF-068 | `whiteboard.shape` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Draw named geometry. | no | FEAT-012 |
| SURF-069 | `whiteboard.count` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Count properties/items. | no | FEAT-012 |
| SURF-070 | `whiteboard.erase` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Erase target. | no | FEAT-012 |
| SURF-071 | `whiteboard.reveal` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Reveal concealed target. | no | FEAT-012 |
| SURF-072 | `projector.prepare` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Prepare media source asynchronously. | no | FEAT-014 |
| SURF-073 | `projector.lower` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Lower projection screen. | no | FEAT-014 |
| SURF-074 | `projector.source` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Attach prepared source. | no | FEAT-014 |
| SURF-075 | `projector.play` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Play source. | no | FEAT-014 |
| SURF-076 | `projector.wait` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Wait for media/interval. | no | FEAT-014 |
| SURF-077 | `projector.pause` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Pause source. | no | FEAT-014 |
| SURF-078 | `projector.raise` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Raise screen. | no | FEAT-014 |
| SURF-079 | `room.lights` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Change lighting zone/state. | no | FEAT-013 |
| SURF-080 | `room.mode` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Set semantic classroom mode. | no | FEAT-013 |
| SURF-081 | `camera.focus` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Focus student camera. | no | FEAT-013 |
| SURF-082 | `lesson.ask` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Open free-response question. | no | FEAT-015 |
| SURF-083 | `lesson.choice` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Open clickable choice question. | no | FEAT-015 |
| SURF-084 | `lesson.wait` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Pause for student boundary. | no | FEAT-015 |
| SURF-085 | `lesson.resume` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Resume lesson. | no | FEAT-015 |
| SURF-086 | `lesson.objective` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Set objective status. | no | FEAT-015 |
| SURF-087 | `lesson.phase` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Switch model/practice phase. | no | FEAT-015 |
| SURF-088 | `lesson.assess` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Record/judge answer. | no | FEAT-015 |
| SURF-089 | `lesson.complete` | protocol command | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` | Complete lesson. | no | FEAT-015 |

## SC-P04 · Vibe Coders Bible presenter commands

Discovery: pinned source registry/search described below.

Count: **8**

| ID | Surface | Kind | Application | Location | Notes | Dead? | FEAT |
|---|---|---|---|---|---|---|---|
| SURF-090 | `stage.focus` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Lock presentation focus to a paragraph. | no | FEAT-017 |
| SURF-091 | `stage.focus.off` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Release manual paragraph focus. | no | FEAT-017 |
| SURF-092 | `stage.auto` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Alias/path to automatic focus mode. | no | FEAT-017 |
| SURF-093 | `stage.highlight` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Highlight DOM element containing text. | no | FEAT-017 |
| SURF-094 | `stage.highlight.off` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Remove one/all text highlights. | no | FEAT-017 |
| SURF-095 | `stage.clear` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Clear manual focus and highlights. | no | FEAT-017 |
| SURF-096 | `stage.diagram` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Show diagram asset. | no | FEAT-017 |
| SURF-097 | `stage.diagram.off` | protocol command | Vibe Coders Bible | `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx` | Hide diagram asset. | no | FEAT-017 |

## SC-01 · Clio Stagehand module API exports

Discovery: pinned source registry/search described below.

Count: **20**

| ID | Surface | Kind | Application | Location | Notes | Dead? | FEAT |
|---|---|---|---|---|---|---|---|
| SURF-098 | `parseScript` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-001 |
| SURF-099 | `parseCommandString` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-001 |
| SURF-100 | `StreamingParser` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-001 |
| SURF-101 | `applyEntityProposeCommand` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-010 |
| SURF-102 | `canonicalizeCommandEntityRefs` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-003 |
| SURF-103 | `executeStagehandCommand` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-003 |
| SURF-104 | `validateCommand` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-002 |
| SURF-105 | `validateCommands` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-002 |
| SURF-106 | `COMMAND_SCHEMAS` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-002 |
| SURF-107 | `CommandAction` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-002 |
| SURF-108 | `StagehandCommand` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-001 |
| SURF-109 | `ScriptSegment` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-001 |
| SURF-110 | `CommandSchema` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-002 |
| SURF-111 | `CanonicalStagehandCommand` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-003 |
| SURF-112 | `CommandValidationResult` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-002 |
| SURF-113 | `CanonicalizeCommandOptions` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-003 |
| SURF-114 | `CanonicalizeCommandResult` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-003 |
| SURF-115 | `EntityResolutionMode` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-003 |
| SURF-116 | `ExecuteStagehandCommandOptions` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-003 |
| SURF-117 | `StagehandRuntimeEvent` | module export | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts` |  | no | FEAT-005 |

## SC-09A · Virtual Classroom public events

Discovery: pinned source registry/search described below.

Count: **20**

| ID | Surface | Kind | Application | Location | Notes | Dead? | FEAT |
|---|---|---|---|---|---|---|---|
| SURF-118 | `narration.started` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-119 | `narration.ended` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-120 | `narration.interrupted` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-121 | `caption` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-122 | `effect.committed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-123 | `board.revision.committed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-124 | `avatar.anchor.reached` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-013 |
| SURF-125 | `projector.state` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-014 |
| SURF-126 | `media.ready` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-014 |
| SURF-127 | `media.failed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-014 |
| SURF-128 | `beat.started` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-004 |
| SURF-129 | `beat.completed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-004 |
| SURF-130 | `lesson.awaiting_student` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-015 |
| SURF-131 | `lesson.choice.selected` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-015 |
| SURF-132 | `lesson.resumed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-015 |
| SURF-133 | `lesson.objective` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-015 |
| SURF-134 | `lesson.assessed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-015 |
| SURF-135 | `lesson.completed` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-015 |
| SURF-136 | `room.mode` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-013 |
| SURF-137 | `safe_failure` | public event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |

## SC-09B · Virtual Classroom private production events

Discovery: pinned source registry/search described below.

Count: **8**

| ID | Surface | Kind | Application | Location | Notes | Dead? | FEAT |
|---|---|---|---|---|---|---|---|
| SURF-138 | `stream.chunk` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-139 | `segment.parsed` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-140 | `command.accepted` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-141 | `command.rejected` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-142 | `gate.waited` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-006 |
| SURF-143 | `provider.request` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-144 | `provider.response` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |
| SURF-145 | `diagnostic` | private production event | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts` |  | no | FEAT-005 |

## SC-09C · Clio runtime events

Discovery: pinned source registry/search described below.

Count: **5**

| ID | Surface | Kind | Application | Location | Notes | Dead? | FEAT |
|---|---|---|---|---|---|---|---|
| SURF-146 | `invalid_command` | runtime event | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts` |  | no | FEAT-003 |
| SURF-147 | `unresolved_refs` | runtime event | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts` |  | no | FEAT-003 |
| SURF-148 | `entity_proposed` | runtime event | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts` |  | no | FEAT-010 |
| SURF-149 | `proposal_rejected` | runtime event | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts` |  | no | FEAT-010 |
| SURF-150 | `scene_command` | runtime event | Clio | `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts` |  | no | FEAT-003 |

## SC-12 · Virtual Classroom Stagehand-adjacent env/config keys

Discovery: pinned source registry/search described below.

Count: **12**

| ID | Surface | Kind | Application | Location | Notes | Dead? | FEAT |
|---|---|---|---|---|---|---|---|
| SURF-151 | `OPENAI_API_KEY` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-018 |
| SURF-152 | `OPENROUTER_API_KEY` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-018 |
| SURF-153 | `VC_DIRECTOR_MODEL` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-018 |
| SURF-154 | `VC_TTS_VOICE` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-018 |
| SURF-155 | `VC_TTS_MODEL` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-018 |
| SURF-156 | `VC_TTS_SPEED` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-018 |
| SURF-157 | `VC_MEDIA_PROVIDER` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-014 |
| SURF-158 | `VC_COMFY_URL` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-014 |
| SURF-159 | `VC_MINIMAX_BASE_URL` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-014 |
| SURF-160 | `VC_MINIMAX_MODEL` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-014 |
| SURF-161 | `VC_MINIMAX_API_KEY` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-014 |
| SURF-162 | `VC_MEDIA_DEADLINE_MS` | environment/config key | Virtual Classroom | `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example` |  | no | FEAT-014 |

## SC-17 · Wire/file formats

Discovery: pinned source registry/search described below.

Count: **6**

| ID | Surface | Kind | Application | Location | Notes | Dead? | FEAT |
|---|---|---|---|---|---|---|---|
| SURF-163 | `Stagehand bracket grammar` | wire/file format | Clio/Virtual Classroom | `multiple` | [action arg key=value] mixed inline with narration | no | FEAT-001 |
| SURF-164 | `Compound blocks` | wire/file format | Clio/Virtual Classroom | `multiple` | batch / sequence / parallel / beat plus closers | no | FEAT-004 |
| SURF-165 | `Beat agent object` | wire/file format | Clio | `multiple` | beat_id + narration + visual_intent + stagehand_sequence.steps | no | FEAT-004 |
| SURF-166 | `StagehandTrace` | wire/file format | Virtual Classroom | `multiple` | timestamped public and private event arrays | no | FEAT-005 |
| SURF-167 | `Chess annotation grammar` | wire/file format | LLM-Chess | `multiple` | [arrow]/[highlight]/[circle]/[move] | no | FEAT-016 |
| SURF-168 | `VCB presenter grammar` | wire/file format | Vibe Coders Bible | `multiple` | [stage.<type> key=value] word-index anchored | no | FEAT-017 |

## Non-applicable stock classes under SDK scope

SC-02 CLI commands, SC-04 HTTP routes, SC-05 GraphQL/gRPC/MCP, SC-10 scheduled jobs, SC-11 database tables, SC-13 feature flags, SC-14 auth roles/scopes, and SC-16 i18n string tables are **not Stagehand-core surfaces** in the extracted implementations. Host applications may have them, but they do not define the protocol boundary. They are intentionally excluded from this SDK reconstruction rather than silently counted as zero across entire host repos.

## Gate 1

**168/168 rows enumerated.** No “etc.” member stands in for an enumerable command/export/event/config/format set.

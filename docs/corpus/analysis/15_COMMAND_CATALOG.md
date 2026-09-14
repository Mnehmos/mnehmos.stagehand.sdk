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

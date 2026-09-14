# 00 · Traceability Matrix — Pass 10

Canonical chain: `SURF → FEAT → FR → CTR → T → TEST`. `SURF-027` is dead and terminates at DIV-001 instead of an implementation chain.

## Forward matrix

| SURF | Surface | Dead? | FEAT | FR | CTR | Task | TEST | Divergence |
|---|---|---|---|---|---|---|---|---|
| SURF-001 | `arrow` | no | FEAT-016 | FR-001 | CTR-001 | T-016 | TEST-001 | — |
| SURF-002 | `highlight` | no | FEAT-016 | FR-002 | CTR-002 | T-016 | TEST-002 | — |
| SURF-003 | `circle` | no | FEAT-016 | FR-003 | CTR-003 | T-016 | TEST-003 | — |
| SURF-004 | `move` | no | FEAT-016 | FR-004 | CTR-004 | T-016 | TEST-004 | — |
| SURF-005 | `map.view` | no | FEAT-007 | FR-005 | CTR-005 | T-008 | TEST-005 | — |
| SURF-006 | `map.focus` | no | FEAT-007 | FR-006 | CTR-006 | T-008 | TEST-006 | — |
| SURF-007 | `map.fit` | no | FEAT-007 | FR-007 | CTR-007 | T-008 | TEST-007 | — |
| SURF-008 | `map.mode` | no | FEAT-007 | FR-008 | CTR-008 | T-008 | TEST-008 | — |
| SURF-009 | `map.highlight` | no | FEAT-008 | FR-009 | CTR-009 | T-009 | TEST-009 | — |
| SURF-010 | `map.spotlight` | no | FEAT-008 | FR-010 | CTR-010 | T-009 | TEST-010 | — |
| SURF-011 | `map.label` | no | FEAT-008 | FR-011 | CTR-011 | T-009 | TEST-011 | — |
| SURF-012 | `map.clear` | no | FEAT-008 | FR-012 | CTR-012 | T-009 | TEST-012 | — |
| SURF-013 | `map.arrow` | no | FEAT-008 | FR-013 | CTR-013 | T-009 | TEST-013 | — |
| SURF-014 | `map.circle` | no | FEAT-008 | FR-014 | CTR-014 | T-009 | TEST-014 | — |
| SURF-015 | `map.line` | no | FEAT-008 | FR-015 | CTR-015 | T-009 | TEST-015 | — |
| SURF-016 | `layer.on` | no | FEAT-009 | FR-016 | CTR-016 | T-010 | TEST-016 | — |
| SURF-017 | `layer.off` | no | FEAT-009 | FR-017 | CTR-017 | T-010 | TEST-017 | — |
| SURF-018 | `flow.animate` | no | FEAT-009 | FR-018 | CTR-018 | T-010 | TEST-018 | — |
| SURF-019 | `flow.clear` | no | FEAT-009 | FR-019 | CTR-019 | T-010 | TEST-019 | — |
| SURF-020 | `piece.place` | no | FEAT-010 | FR-020 | CTR-020 | T-011 | TEST-020 | — |
| SURF-021 | `piece.move` | no | FEAT-010 | FR-021 | CTR-021 | T-011 | TEST-021 | — |
| SURF-022 | `piece.remove` | no | FEAT-010 | FR-022 | CTR-022 | T-011 | TEST-022 | — |
| SURF-023 | `piece.clear` | no | FEAT-010 | FR-023 | CTR-023 | T-011 | TEST-023 | — |
| SURF-024 | `chat.say` | no | FEAT-011 | FR-024 | CTR-024 | T-012 | TEST-024 | — |
| SURF-025 | `source.show` | no | FEAT-011 | FR-025 | CTR-025 | T-012 | TEST-025 | — |
| SURF-026 | `source.hide` | no | FEAT-011 | FR-026 | CTR-026 | T-012 | TEST-026 | — |
| SURF-027 | `claim.show` | yes | — | — | CTR-027 | — | — | DIV-001 |
| SURF-028 | `entity.propose` | no | FEAT-010 | FR-027 | CTR-028 | T-011 | TEST-027 | — |
| SURF-029 | `mark.clip` | no | FEAT-004 | FR-028 | CTR-029 | T-006 | TEST-028 | — |
| SURF-030 | `scene.fade` | no | FEAT-011 | FR-029 | CTR-030 | T-012 | TEST-029 | — |
| SURF-031 | `scene.title` | no | FEAT-011 | FR-030 | CTR-031 | T-012 | TEST-030 | — |
| SURF-032 | `asset.show` | no | FEAT-011 | FR-031 | CTR-032 | T-012 | TEST-031 | — |
| SURF-033 | `asset.clear` | no | FEAT-011 | FR-032 | CTR-033 | T-012 | TEST-032 | — |
| SURF-034 | `whiteboard.show` | no | FEAT-012 | FR-033 | CTR-034 | T-007 | TEST-033 | — |
| SURF-035 | `whiteboard.hide` | no | FEAT-012 | FR-034 | CTR-035 | T-007 | TEST-034 | — |
| SURF-036 | `whiteboard.clear` | no | FEAT-012 | FR-035 | CTR-036 | T-007 | TEST-035 | — |
| SURF-037 | `whiteboard.text` | no | FEAT-012 | FR-036 | CTR-037 | T-007 | TEST-036 | — |
| SURF-038 | `whiteboard.line` | no | FEAT-012 | FR-037 | CTR-038 | T-007 | TEST-037 | — |
| SURF-039 | `whiteboard.box` | no | FEAT-012 | FR-038 | CTR-039 | T-007 | TEST-038 | — |
| SURF-040 | `camera.center` | no | FEAT-007 | FR-039 | CTR-040 | T-008 | TEST-039 | — |
| SURF-041 | `camera.focus_region` | no | FEAT-007 | FR-040 | CTR-041 | T-008 | TEST-040 | — |
| SURF-042 | `camera.establish_globe` | no | FEAT-007 | FR-041 | CTR-042 | T-008 | TEST-041 | — |
| SURF-043 | `highlight.region` | no | FEAT-008 | FR-042 | CTR-043 | T-009 | TEST-042 | — |
| SURF-044 | `highlight.location` | no | FEAT-008 | FR-043 | CTR-044 | T-009 | TEST-043 | — |
| SURF-045 | `label.show` | no | FEAT-008 | FR-044 | CTR-045 | T-009 | TEST-044 | — |
| SURF-046 | `route.draw` | no | FEAT-008 | FR-045 | CTR-046 | T-009 | TEST-045 | — |
| SURF-047 | `camera.follow_marker` | no | FEAT-007 | FR-046 | CTR-047 | T-008 | TEST-046 | — |
| SURF-048 | `map.overlay.show` | no | FEAT-009 | FR-047 | CTR-048 | T-010 | TEST-047 | — |
| SURF-049 | `map.overlay.hide` | no | FEAT-009 | FR-048 | CTR-049 | T-010 | TEST-048 | — |
| SURF-050 | `map.basemap` | no | FEAT-009 | FR-049 | CTR-050 | T-010 | TEST-049 | — |
| SURF-051 | `map.timecursor` | no | FEAT-009 | FR-050 | CTR-051 | T-010 | TEST-050 | DIV-002 |
| SURF-052 | `avatar.move` | no | FEAT-013 | FR-051 | CTR-052 | T-013 | TEST-051 | — |
| SURF-053 | `avatar.look` | no | FEAT-013 | FR-052 | CTR-053 | T-013 | TEST-052 | — |
| SURF-054 | `avatar.gesture` | no | FEAT-013 | FR-053 | CTR-054 | T-013 | TEST-053 | — |
| SURF-055 | `avatar.point` | no | FEAT-013 | FR-054 | CTR-055 | T-013 | TEST-054 | — |
| SURF-056 | `avatar.face` | no | FEAT-013 | FR-055 | CTR-056 | T-013 | TEST-055 | — |
| SURF-057 | `whiteboard.show` | no | FEAT-012 | FR-056 | CTR-057 | T-007 | TEST-056 | — |
| SURF-058 | `whiteboard.hide` | no | FEAT-012 | FR-057 | CTR-058 | T-007 | TEST-057 | — |
| SURF-059 | `whiteboard.clear` | no | FEAT-012 | FR-058 | CTR-059 | T-007 | TEST-058 | — |
| SURF-060 | `whiteboard.text` | no | FEAT-012 | FR-059 | CTR-060 | T-007 | TEST-059 | — |
| SURF-061 | `whiteboard.math` | no | FEAT-012 | FR-060 | CTR-061 | T-007 | TEST-060 | — |
| SURF-062 | `whiteboard.line` | no | FEAT-012 | FR-061 | CTR-062 | T-007 | TEST-061 | — |
| SURF-063 | `whiteboard.box` | no | FEAT-012 | FR-062 | CTR-063 | T-007 | TEST-062 | — |
| SURF-064 | `whiteboard.arrow` | no | FEAT-012 | FR-063 | CTR-064 | T-007 | TEST-063 | — |
| SURF-065 | `whiteboard.highlight` | no | FEAT-012 | FR-064 | CTR-065 | T-007 | TEST-064 | — |
| SURF-066 | `whiteboard.scribble` | no | FEAT-012 | FR-065 | CTR-066 | T-007 | TEST-065 | — |
| SURF-067 | `whiteboard.dots` | no | FEAT-012 | FR-066 | CTR-067 | T-007 | TEST-066 | — |
| SURF-068 | `whiteboard.shape` | no | FEAT-012 | FR-067 | CTR-068 | T-007 | TEST-067 | — |
| SURF-069 | `whiteboard.count` | no | FEAT-012 | FR-068 | CTR-069 | T-007 | TEST-068 | — |
| SURF-070 | `whiteboard.erase` | no | FEAT-012 | FR-069 | CTR-070 | T-007 | TEST-069 | — |
| SURF-071 | `whiteboard.reveal` | no | FEAT-012 | FR-070 | CTR-071 | T-007 | TEST-070 | — |
| SURF-072 | `projector.prepare` | no | FEAT-014 | FR-071 | CTR-072 | T-014 | TEST-071 | — |
| SURF-073 | `projector.lower` | no | FEAT-014 | FR-072 | CTR-073 | T-014 | TEST-072 | — |
| SURF-074 | `projector.source` | no | FEAT-014 | FR-073 | CTR-074 | T-014 | TEST-073 | — |
| SURF-075 | `projector.play` | no | FEAT-014 | FR-074 | CTR-075 | T-014 | TEST-074 | — |
| SURF-076 | `projector.wait` | no | FEAT-014 | FR-075 | CTR-076 | T-014 | TEST-075 | — |
| SURF-077 | `projector.pause` | no | FEAT-014 | FR-076 | CTR-077 | T-014 | TEST-076 | — |
| SURF-078 | `projector.raise` | no | FEAT-014 | FR-077 | CTR-078 | T-014 | TEST-077 | — |
| SURF-079 | `room.lights` | no | FEAT-013 | FR-078 | CTR-079 | T-013 | TEST-078 | — |
| SURF-080 | `room.mode` | no | FEAT-013 | FR-079 | CTR-080 | T-013 | TEST-079 | — |
| SURF-081 | `camera.focus` | no | FEAT-013 | FR-080 | CTR-081 | T-013 | TEST-080 | — |
| SURF-082 | `lesson.ask` | no | FEAT-015 | FR-081 | CTR-082 | T-015 | TEST-081 | — |
| SURF-083 | `lesson.choice` | no | FEAT-015 | FR-082 | CTR-083 | T-015 | TEST-082 | — |
| SURF-084 | `lesson.wait` | no | FEAT-015 | FR-083 | CTR-084 | T-015 | TEST-083 | — |
| SURF-085 | `lesson.resume` | no | FEAT-015 | FR-084 | CTR-085 | T-015 | TEST-084 | — |
| SURF-086 | `lesson.objective` | no | FEAT-015 | FR-085 | CTR-086 | T-015 | TEST-085 | — |
| SURF-087 | `lesson.phase` | no | FEAT-015 | FR-086 | CTR-087 | T-015 | TEST-086 | — |
| SURF-088 | `lesson.assess` | no | FEAT-015 | FR-087 | CTR-088 | T-015 | TEST-087 | — |
| SURF-089 | `lesson.complete` | no | FEAT-015 | FR-088 | CTR-089 | T-015 | TEST-088 | — |
| SURF-090 | `stage.focus` | no | FEAT-017 | FR-089 | CTR-090 | T-017 | TEST-089 | — |
| SURF-091 | `stage.focus.off` | no | FEAT-017 | FR-090 | CTR-091 | T-017 | TEST-090 | — |
| SURF-092 | `stage.auto` | no | FEAT-017 | FR-091 | CTR-092 | T-017 | TEST-091 | — |
| SURF-093 | `stage.highlight` | no | FEAT-017 | FR-092 | CTR-093 | T-017 | TEST-092 | — |
| SURF-094 | `stage.highlight.off` | no | FEAT-017 | FR-093 | CTR-094 | T-017 | TEST-093 | — |
| SURF-095 | `stage.clear` | no | FEAT-017 | FR-094 | CTR-095 | T-017 | TEST-094 | — |
| SURF-096 | `stage.diagram` | no | FEAT-017 | FR-095 | CTR-096 | T-017 | TEST-095 | — |
| SURF-097 | `stage.diagram.off` | no | FEAT-017 | FR-096 | CTR-097 | T-017 | TEST-096 | — |
| SURF-098 | `parseScript` | no | FEAT-001 | FR-097 | CTR-101 | T-001 | TEST-097 | DIV-003 |
| SURF-099 | `parseCommandString` | no | FEAT-001 | FR-098 | CTR-102 | T-001 | TEST-098 | DIV-003 |
| SURF-100 | `StreamingParser` | no | FEAT-001 | FR-099 | CTR-103 | T-001 | TEST-099 | DIV-003 |
| SURF-101 | `applyEntityProposeCommand` | no | FEAT-010 | FR-100 | CTR-108 | T-011 | TEST-100 | — |
| SURF-102 | `canonicalizeCommandEntityRefs` | no | FEAT-003 | FR-101 | CTR-107 | T-003 | TEST-101 | — |
| SURF-103 | `executeStagehandCommand` | no | FEAT-003 | FR-102 | CTR-106 | T-003 | TEST-102 | — |
| SURF-104 | `validateCommand` | no | FEAT-002 | FR-103 | CTR-104 | T-002 | TEST-103 | — |
| SURF-105 | `validateCommands` | no | FEAT-002 | FR-104 | CTR-105 | T-002 | TEST-104 | — |
| SURF-106 | `COMMAND_SCHEMAS` | no | FEAT-002 | FR-105 | CTR-109 | T-002 | TEST-105 | DIV-006 |
| SURF-107 | `CommandAction` | no | FEAT-002 | FR-106 | CTR-110 | T-002 | TEST-106 | — |
| SURF-108 | `StagehandCommand` | no | FEAT-001 | FR-107 | CTR-111 | T-001 | TEST-107 | — |
| SURF-109 | `ScriptSegment` | no | FEAT-001 | FR-108 | CTR-112 | T-001 | TEST-108 | — |
| SURF-110 | `CommandSchema` | no | FEAT-002 | FR-109 | CTR-113 | T-002 | TEST-109 | DIV-006 |
| SURF-111 | `CanonicalStagehandCommand` | no | FEAT-003 | FR-110 | CTR-114 | T-003 | TEST-110 | — |
| SURF-112 | `CommandValidationResult` | no | FEAT-002 | FR-111 | CTR-115 | T-002 | TEST-111 | — |
| SURF-113 | `CanonicalizeCommandOptions` | no | FEAT-003 | FR-112 | CTR-116 | T-003 | TEST-112 | — |
| SURF-114 | `CanonicalizeCommandResult` | no | FEAT-003 | FR-113 | CTR-117 | T-003 | TEST-113 | — |
| SURF-115 | `EntityResolutionMode` | no | FEAT-003 | FR-114 | CTR-118 | T-003 | TEST-114 | — |
| SURF-116 | `ExecuteStagehandCommandOptions` | no | FEAT-003 | FR-115 | CTR-119 | T-003 | TEST-115 | — |
| SURF-117 | `StagehandRuntimeEvent` | no | FEAT-005 | FR-116 | CTR-120 | T-004 | TEST-116 | — |
| SURF-118 | `narration.started` | no | FEAT-005 | FR-117 | — | T-004 | TEST-117 | — |
| SURF-119 | `narration.ended` | no | FEAT-005 | FR-118 | — | T-004 | TEST-118 | — |
| SURF-120 | `narration.interrupted` | no | FEAT-005 | FR-119 | — | T-004 | TEST-119 | — |
| SURF-121 | `caption` | no | FEAT-005 | FR-120 | — | T-004 | TEST-120 | — |
| SURF-122 | `effect.committed` | no | FEAT-005 | FR-121 | — | T-004 | TEST-121 | — |
| SURF-123 | `board.revision.committed` | no | FEAT-005 | FR-122 | — | T-004 | TEST-122 | — |
| SURF-124 | `avatar.anchor.reached` | no | FEAT-013 | FR-123 | — | T-013 | TEST-123 | — |
| SURF-125 | `projector.state` | no | FEAT-014 | FR-124 | — | T-014 | TEST-124 | — |
| SURF-126 | `media.ready` | no | FEAT-014 | FR-125 | — | T-014 | TEST-125 | — |
| SURF-127 | `media.failed` | no | FEAT-014 | FR-126 | — | T-014 | TEST-126 | — |
| SURF-128 | `beat.started` | no | FEAT-004 | FR-127 | — | T-006 | TEST-127 | — |
| SURF-129 | `beat.completed` | no | FEAT-004 | FR-128 | — | T-006 | TEST-128 | — |
| SURF-130 | `lesson.awaiting_student` | no | FEAT-015 | FR-129 | — | T-015 | TEST-129 | — |
| SURF-131 | `lesson.choice.selected` | no | FEAT-015 | FR-130 | — | T-015 | TEST-130 | — |
| SURF-132 | `lesson.resumed` | no | FEAT-015 | FR-131 | — | T-015 | TEST-131 | — |
| SURF-133 | `lesson.objective` | no | FEAT-015 | FR-132 | — | T-015 | TEST-132 | — |
| SURF-134 | `lesson.assessed` | no | FEAT-015 | FR-133 | — | T-015 | TEST-133 | — |
| SURF-135 | `lesson.completed` | no | FEAT-015 | FR-134 | — | T-015 | TEST-134 | — |
| SURF-136 | `room.mode` | no | FEAT-013 | FR-135 | — | T-013 | TEST-135 | — |
| SURF-137 | `safe_failure` | no | FEAT-005 | FR-136 | — | T-004 | TEST-136 | — |
| SURF-138 | `stream.chunk` | no | FEAT-005 | FR-137 | — | T-004 | TEST-137 | — |
| SURF-139 | `segment.parsed` | no | FEAT-005 | FR-138 | — | T-004 | TEST-138 | — |
| SURF-140 | `command.accepted` | no | FEAT-005 | FR-139 | — | T-004 | TEST-139 | — |
| SURF-141 | `command.rejected` | no | FEAT-005 | FR-140 | — | T-004 | TEST-140 | — |
| SURF-142 | `gate.waited` | no | FEAT-006 | FR-141 | — | T-005 | TEST-141 | — |
| SURF-143 | `provider.request` | no | FEAT-005 | FR-142 | — | T-004 | TEST-142 | — |
| SURF-144 | `provider.response` | no | FEAT-005 | FR-143 | — | T-004 | TEST-143 | — |
| SURF-145 | `diagnostic` | no | FEAT-005 | FR-144 | — | T-004 | TEST-144 | — |
| SURF-146 | `invalid_command` | no | FEAT-003 | FR-145 | — | T-003 | TEST-145 | — |
| SURF-147 | `unresolved_refs` | no | FEAT-003 | FR-146 | — | T-003 | TEST-146 | — |
| SURF-148 | `entity_proposed` | no | FEAT-010 | FR-147 | — | T-011 | TEST-147 | — |
| SURF-149 | `proposal_rejected` | no | FEAT-010 | FR-148 | — | T-011 | TEST-148 | — |
| SURF-150 | `scene_command` | no | FEAT-003 | FR-149 | — | T-003 | TEST-149 | — |
| SURF-151 | `OPENAI_API_KEY` | no | FEAT-018 | FR-150 | — | T-018 | TEST-150 | DIV-007, DIV-009 |
| SURF-152 | `OPENROUTER_API_KEY` | no | FEAT-018 | FR-151 | — | T-018 | TEST-151 | DIV-007, DIV-009 |
| SURF-153 | `VC_DIRECTOR_MODEL` | no | FEAT-018 | FR-152 | — | T-018 | TEST-152 | DIV-007, DIV-009 |
| SURF-154 | `VC_TTS_VOICE` | no | FEAT-018 | FR-153 | — | T-018 | TEST-153 | DIV-009 |
| SURF-155 | `VC_TTS_MODEL` | no | FEAT-018 | FR-154 | — | T-018 | TEST-154 | DIV-009 |
| SURF-156 | `VC_TTS_SPEED` | no | FEAT-018 | FR-155 | — | T-018 | TEST-155 | DIV-009 |
| SURF-157 | `VC_MEDIA_PROVIDER` | no | FEAT-014 | FR-156 | — | T-014 | TEST-156 | DIV-009 |
| SURF-158 | `VC_COMFY_URL` | no | FEAT-014 | FR-157 | — | T-014 | TEST-157 | DIV-009 |
| SURF-159 | `VC_MINIMAX_BASE_URL` | no | FEAT-014 | FR-158 | — | T-014 | TEST-158 | DIV-009 |
| SURF-160 | `VC_MINIMAX_MODEL` | no | FEAT-014 | FR-159 | — | T-014 | TEST-159 | DIV-009 |
| SURF-161 | `VC_MINIMAX_API_KEY` | no | FEAT-014 | FR-160 | — | T-014 | TEST-160 | DIV-009 |
| SURF-162 | `VC_MEDIA_DEADLINE_MS` | no | FEAT-014 | FR-161 | — | T-014 | TEST-161 | DIV-009 |
| SURF-163 | `Stagehand bracket grammar` | no | FEAT-001 | FR-162 | — | T-001 | TEST-162 | DIV-003, DIV-004 |
| SURF-164 | `Compound blocks` | no | FEAT-004 | FR-163 | — | T-006 | TEST-163 | DIV-003 |
| SURF-165 | `Beat agent object` | no | FEAT-004 | FR-164 | — | T-006 | TEST-164 | — |
| SURF-166 | `StagehandTrace` | no | FEAT-005 | FR-165 | — | T-004 | TEST-165 | DIV-005 |
| SURF-167 | `Chess annotation grammar` | no | FEAT-016 | FR-166 | — | T-016 | TEST-166 | DIV-008 |
| SURF-168 | `VCB presenter grammar` | no | FEAT-017 | FR-167 | — | T-017 | TEST-167 | — |

## Reverse feature index

| Feature | Surfaces | FRs | Contracts | Task | Tests |
|---|---|---|---|---|---|
| FEAT-001 | SURF-098, SURF-099, SURF-100, SURF-108, SURF-109, SURF-163 | FR-097..FR-162 (6) | CTR-101, CTR-102, CTR-103, CTR-111, CTR-112, CTR-124 | T-001 | TEST-097..TEST-162 (6) |
| FEAT-002 | SURF-104, SURF-105, SURF-106, SURF-107, SURF-110, SURF-112 | FR-103..FR-111 (6) | CTR-104, CTR-105, CTR-109, CTR-110, CTR-113, CTR-115, CTR-121 | T-002 | TEST-103..TEST-111 (6) |
| FEAT-003 | SURF-102, SURF-103, SURF-111, SURF-113, SURF-114, SURF-115, SURF-116, SURF-146, SURF-147, SURF-150 | FR-101..FR-149 (10) | CTR-106, CTR-107, CTR-114, CTR-116, CTR-117, CTR-118, CTR-119 | T-003 | TEST-101..TEST-149 (10) |
| FEAT-005 | SURF-117, SURF-118, SURF-119, SURF-120, SURF-121, SURF-122, SURF-123, SURF-137, SURF-138, SURF-139, SURF-140, SURF-141, SURF-143, SURF-144, SURF-145, SURF-166 | FR-116..FR-165 (16) | CTR-120, CTR-122 | T-004 | TEST-116..TEST-165 (16) |
| FEAT-006 | SURF-142 | FR-141..FR-141 (1) | CTR-123 | T-005 | TEST-141..TEST-141 (1) |
| FEAT-004 | SURF-029, SURF-128, SURF-129, SURF-164, SURF-165 | FR-028..FR-164 (5) | CTR-029, CTR-125 | T-006 | TEST-028..TEST-164 (5) |
| FEAT-012 | SURF-034, SURF-035, SURF-036, SURF-037, SURF-038, SURF-039, SURF-057, SURF-058, SURF-059, SURF-060, SURF-061, SURF-062, SURF-063, SURF-064, SURF-065, SURF-066, SURF-067, SURF-068, SURF-069, SURF-070, SURF-071 | FR-033..FR-070 (21) | CTR-034, CTR-035, CTR-036, CTR-037, CTR-038, CTR-039, CTR-057, CTR-058, CTR-059, CTR-060, CTR-061, CTR-062, CTR-063, CTR-064, CTR-065, CTR-066, CTR-067, CTR-068, CTR-069, CTR-070, CTR-071 | T-007 | TEST-033..TEST-070 (21) |
| FEAT-007 | SURF-005, SURF-006, SURF-007, SURF-008, SURF-040, SURF-041, SURF-042, SURF-047 | FR-005..FR-046 (8) | CTR-005, CTR-006, CTR-007, CTR-008, CTR-040, CTR-041, CTR-042, CTR-047 | T-008 | TEST-005..TEST-046 (8) |
| FEAT-008 | SURF-009, SURF-010, SURF-011, SURF-012, SURF-013, SURF-014, SURF-015, SURF-043, SURF-044, SURF-045, SURF-046 | FR-009..FR-045 (11) | CTR-009, CTR-010, CTR-011, CTR-012, CTR-013, CTR-014, CTR-015, CTR-043, CTR-044, CTR-045, CTR-046 | T-009 | TEST-009..TEST-045 (11) |
| FEAT-009 | SURF-016, SURF-017, SURF-018, SURF-019, SURF-048, SURF-049, SURF-050, SURF-051 | FR-016..FR-050 (8) | CTR-016, CTR-017, CTR-018, CTR-019, CTR-048, CTR-049, CTR-050, CTR-051 | T-010 | TEST-016..TEST-050 (8) |
| FEAT-010 | SURF-020, SURF-021, SURF-022, SURF-023, SURF-028, SURF-101, SURF-148, SURF-149 | FR-020..FR-148 (8) | CTR-020, CTR-021, CTR-022, CTR-023, CTR-028, CTR-108 | T-011 | TEST-020..TEST-148 (8) |
| FEAT-011 | SURF-024, SURF-025, SURF-026, SURF-030, SURF-031, SURF-032, SURF-033 | FR-024..FR-032 (7) | CTR-024, CTR-025, CTR-026, CTR-030, CTR-031, CTR-032, CTR-033 | T-012 | TEST-024..TEST-032 (7) |
| FEAT-013 | SURF-052, SURF-053, SURF-054, SURF-055, SURF-056, SURF-079, SURF-080, SURF-081, SURF-124, SURF-136 | FR-051..FR-135 (10) | CTR-052, CTR-053, CTR-054, CTR-055, CTR-056, CTR-079, CTR-080, CTR-081 | T-013 | TEST-051..TEST-135 (10) |
| FEAT-014 | SURF-072, SURF-073, SURF-074, SURF-075, SURF-076, SURF-077, SURF-078, SURF-125, SURF-126, SURF-127, SURF-157, SURF-158, SURF-159, SURF-160, SURF-161, SURF-162 | FR-071..FR-161 (16) | CTR-072, CTR-073, CTR-074, CTR-075, CTR-076, CTR-077, CTR-078 | T-014 | TEST-071..TEST-161 (16) |
| FEAT-015 | SURF-082, SURF-083, SURF-084, SURF-085, SURF-086, SURF-087, SURF-088, SURF-089, SURF-130, SURF-131, SURF-132, SURF-133, SURF-134, SURF-135 | FR-081..FR-134 (14) | CTR-082, CTR-083, CTR-084, CTR-085, CTR-086, CTR-087, CTR-088, CTR-089 | T-015 | TEST-081..TEST-134 (14) |
| FEAT-016 | SURF-001, SURF-002, SURF-003, SURF-004, SURF-167 | FR-001..FR-166 (5) | CTR-001, CTR-002, CTR-003, CTR-004 | T-016 | TEST-001..TEST-166 (5) |
| FEAT-017 | SURF-090, SURF-091, SURF-092, SURF-093, SURF-094, SURF-095, SURF-096, SURF-097, SURF-168 | FR-089..FR-167 (9) | CTR-090, CTR-091, CTR-092, CTR-093, CTR-094, CTR-095, CTR-096, CTR-097 | T-017 | TEST-089..TEST-167 (9) |
| FEAT-018 | SURF-151, SURF-152, SURF-153, SURF-154, SURF-155, SURF-156 | FR-150..FR-155 (6) | — | T-018 | TEST-150..TEST-155 (6) |

## Extra API contracts without direct SURF rows

- CTR-121 → FEAT-002 → T-002.
- CTR-122 → FEAT-005 → T-004.
- CTR-123 → FEAT-006 → T-005.
- CTR-124 → FEAT-001 → T-001.
- CTR-125 → FEAT-004 → T-006.

## Gate 10 traceability result

- Surface IDs: 168 total = 167 live + 1 dead.
- Live surfaces with FEAT owner: 167/167.
- Live surfaces with FR: 167/167.
- Live surfaces with TEST: 167/167.
- API CTR-101..125 ownership: 25/25 exactly once.
- Feature tasks: 18/18.

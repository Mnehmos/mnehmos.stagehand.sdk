# Stagehand Reverse Engineering — Combined Pass 0–12 Corpus


---

<!-- SOURCE: README.md -->

# Stagehand Reverse Engineering — Passes 0–12

This is the completed reconstruction/specification corpus for extracting the Stagehand protocol family into a standalone FOSS SDK.

Start here:

1. `00_MANIFEST.md`
2. `00_CONSTITUTION.md`
3. `30_FEATURE_LEDGER.md`
4. `31_REBUILD_PLAN.md`
5. `32_PARITY_SUITE.md`
6. `00_TRACEABILITY.md`
7. `specs/`
8. `PASS11_SPEC_KIT_HANDOFF.md`
9. `PASS12_FINAL_ACCEPTANCE.md`

Important status distinction: the reverse-engineering/spec corpus is complete and locally consistency-validated. The full standalone SDK has **not** been implemented by Spec Kit in this container, so runtime parity of that future implementation is not claimed.


---

<!-- SOURCE: 00_MANIFEST.md -->

# Stagehand Reconstruction Corpus — Passes 0–12

**Target:** Mnehmos Stagehand protocol family → standalone FOSS SDK specification/rebuild corpus.
**Run date:** 2026-09-13.
**Surface denominator:** 168 total; 167 live/rebuild-relevant; 1 dead (`SURF-027`).
**Features:** 18.

| Pass | Name | Status | Gate |
|---:|---|---|---|
| 0 | Frame | complete | prior corpus |
| 1 | Surface Enumeration | complete | 168/168 |
| 2 | Structure | complete | prior corpus |
| 3 | Contracts | complete | prior corpus |
| 4 | State | complete | prior corpus |
| 5 | Cross-cutting | complete | prior corpus |
| 6 | Intent archaeology | complete | prior corpus |
| 7 | Adversarial sweep | PASS | 1 dead; 167 live; 0 explicit `[i]`; T0/T1 dispositions present |
| 8 | Feature synthesis | PASS | 167/167 exactly one FEAT owner |
| 9 | Spec emission | PASS | 18/18 specs, 167 FRs, CTR-101..125 owned once |
| 10 | Constitution/rebuild/parity/traceability | PASS | locally validated |
| 11 | Spec Kit handoff | READY | seed + local analyze complete; external implement/converge not claimed |
| 12 | Final acceptance/package | PASS | deterministic corpus acceptance; implementation parity remains Pass 11 external work |

Pass 12 is a maintainer-requested extension: the source `/reverse-engineer` prompt ends at Pass 11. It is defined here as final deterministic corpus acceptance and packaging.


---

<!-- SOURCE: 00_CONSTITUTION.md -->

# Stagehand Rebuild Constitution

## I. Trust Boundary First
Raw producer/model output is never a public effect. All control passes parse → registry validation → plugin/state validation → resolution → canonical effect compilation → authorized commit → trace. Rejection is terminal for the command or atomic group.

## II. One Registry, One Truth
Command validation, producer introspection, authoring help, and machine-readable schemas are generated from the same capability registry. Parallel hand-maintained vocabularies are forbidden (`FIND-011`, `DIV-006`).

## III. Core Is Headless and Model-Agnostic
`core`, `parser`, `registry`, `runtime`, `trace`, and `readiness` may not depend on model providers, renderers, maps, Three.js, chess, DOM, classroom state, TTS, or media providers (`DIV-007`, `DIV-009`).

## IV. Deterministic IR Over Host Commands
Producer dialects compile into canonical effects. Semantic references resolve through plugin registries; model-invented coordinates/object pointers are rejected unless a plugin explicitly authorizes them. The stable abstraction is the effect IR, not any one source app's command implementation.

## V. Parser Safety Is Security
Batch and streaming semantics converge. Compounds nest. Apostrophes and backslashes/LaTeX are preserved. Missing brackets may be lexically recovered or quarantined, but control-shaped text must never become narration. Semantic repair is disabled by default (`DIV-003`, `DIV-004`).

## VI. Bounded Synchronization
Every readiness wait has a deadline and cancellation generation. Interrupted work cannot resume from a stale generation. Timing/readiness behavior must be traceable.

## VII. Public and Production Channels Are Different Contracts
User-visible lifecycle/effect events and production diagnostics use separate typed channels. Provider request/response details, rejected command diagnostics, and parser internals are never emitted as public state by default.

## VIII. Replay Is Versioned
Trace envelopes include protocol version, schema-set version, plugin versions, host adapter version, and optional asset-manifest hash. Compatibility requires explicit migrators (`DIV-005`); replay must not call a model.

## IX. Plugins Own Domains
Geo, classroom, chess, whiteboard, and DOM presenter state belongs to plugins. Shared reusable capabilities are built once rather than copied between hosts. Host configuration remains host-owned.

## X. Evidence and Traceability Survive Implementation
Every implementation task maps FEAT → FR → SURF/CTR → TEST. IDs are permanent. A change that alters recovered behavior either preserves the governing test or introduces an explicit DIV with rationale and parity note.

## XI. FOSS Release Requires Provenance Closure
No compatibility/plugin code derived from sources with unresolved project licensing is released until U-002/U-003 are resolved. The new SDK receives an explicit software license and provenance notice before public release.

## XII. Forbidden Patterns
Forbidden: raw-model-to-renderer mutation; duplicated schema registries; unbounded readiness waits; hidden semantic repairs; silent unresolved-reference fallback; host dependencies in core; unversioned replay; swallowed validation errors; source-app copy/paste as architecture.


---

<!-- SOURCE: 00_TRACEABILITY.md -->

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


---

<!-- SOURCE: 30_FEATURE_LEDGER.md -->

# 30 · Feature Ledger

Pass 8 collapses source-repository surfaces into user/integrator-meaningful capabilities. `SURF-027` is dead and intentionally owns no feature.

| Rebuild | Feature | Capability | Tier | Complexity | Preserve? | Package owner | Dependencies | Surface count |
|---:|---|---|---|---|---|---|---|---:|
| 1 | FEAT-001 | Mixed-Stream Parsing & Syntax | T0 | high | yes | `packages/parser` | — | 6 |
| 2 | FEAT-002 | Capability Registry, Validation & Introspection | T0 | high | yes | `packages/registry` | FEAT-001 | 6 |
| 3 | FEAT-003 | Effect Compilation, Resolution & Safe Execution | T0 | high | yes | `packages/runtime` | FEAT-001, FEAT-002 | 10 |
| 4 | FEAT-005 | Trace, Replay & Diagnostics | T0 | high | yes | `packages/trace` | FEAT-003 | 16 |
| 5 | FEAT-006 | Readiness & Synchronization | T0 | high | yes | `packages/readiness` | FEAT-003, FEAT-005 | 1 |
| 6 | FEAT-004 | Compound Choreography & Beat IR | T0 | high | yes | `packages/core + packages/authoring` | FEAT-001, FEAT-002, FEAT-003 | 5 |
| 7 | FEAT-012 | Shared Whiteboard Canvas | T1 | medium | yes | `plugins/whiteboard` | FEAT-002, FEAT-003 | 21 |
| 8 | FEAT-007 | Geospatial Camera & View Framing | T1 | medium | yes | `plugins/geo-clio` | FEAT-002, FEAT-003 | 8 |
| 9 | FEAT-008 | Geospatial Highlighting & Annotation | T1 | medium | yes | `plugins/geo-clio` | FEAT-007 | 11 |
| 10 | FEAT-009 | Geospatial Layers, Flows & Temporal Overlays | T1 | high | yes-with-divergence | `plugins/geo-clio` | FEAT-007, FEAT-008 | 8 |
| 11 | FEAT-010 | World Pieces & Controlled Registry Proposals | T1 | high | yes | `plugins/geo-clio` | FEAT-002, FEAT-003, FEAT-007 | 8 |
| 12 | FEAT-011 | Evidence, Sources & Scene Presentation | T1 | medium | yes-with-dead-command-removed | `plugins/geo-clio + packages/authoring` | FEAT-003, FEAT-005 | 7 |
| 13 | FEAT-013 | Classroom Avatar, Room & Camera Staging | T1 | high | yes | `plugins/classroom` | FEAT-003, FEAT-005, FEAT-006 | 10 |
| 14 | FEAT-014 | Classroom Projector & Media Orchestration | T1 | high | yes | `plugins/classroom` | FEAT-003, FEAT-005, FEAT-006 | 16 |
| 15 | FEAT-015 | Lesson Interaction & Pedagogical State | T1 | high | yes | `plugins/classroom` | FEAT-003, FEAT-005, FEAT-006 | 14 |
| 16 | FEAT-016 | Chess Annotation Compatibility | T2 | medium | compatibility-only | `plugins/chess + packages/compatibility/llm-chess` | FEAT-001, FEAT-002, FEAT-003 | 5 |
| 17 | FEAT-017 | Word-Anchored DOM Presenter Choreography | T2 | medium | yes | `plugins/dom-presenter` | FEAT-001, FEAT-002, FEAT-003, FEAT-005 | 9 |
| 18 | FEAT-018 | Host Model & Narration Configuration | T3 | low | host-only-not-core | `examples/virtual-classroom-host` | FEAT-013, FEAT-014, FEAT-015 | 6 |

## Feature detail

### FEAT-001 · Mixed-Stream Parsing & Syntax
- **Intent:** Compile untrusted narration-plus-control streams into typed text, command, and compound segments without leaking control syntax into public narration.
- **Owned surfaces (6):** SURF-098, SURF-099, SURF-100, SURF-108, SURF-109, SURF-163
- **Dependencies:** None
- **Tier / complexity:** T0 / high
- **Preservation posture:** yes
- **Target package:** `packages/parser`

### FEAT-002 · Capability Registry, Validation & Introspection
- **Intent:** Give integrators one typed capability registry that drives validation and producer-facing introspection so executable and advertised vocabularies cannot drift.
- **Owned surfaces (6):** SURF-104, SURF-105, SURF-106, SURF-107, SURF-110, SURF-112
- **Dependencies:** FEAT-001
- **Tier / complexity:** T0 / high
- **Preservation posture:** yes
- **Target package:** `packages/registry`

### FEAT-003 · Effect Compilation, Resolution & Safe Execution
- **Intent:** Turn validated producer commands into canonical effects, resolve semantic references, commit only authorized effects, and emit deterministic runtime outcomes.
- **Owned surfaces (10):** SURF-102, SURF-103, SURF-111, SURF-113, SURF-114, SURF-115, SURF-116, SURF-146, SURF-147, SURF-150
- **Dependencies:** FEAT-001, FEAT-002
- **Tier / complexity:** T0 / high
- **Preservation posture:** yes
- **Target package:** `packages/runtime`

### FEAT-005 · Trace, Replay & Diagnostics
- **Intent:** Expose separate public and production event channels and record versioned replay material without exposing private diagnostics as user-facing effects.
- **Owned surfaces (16):** SURF-117, SURF-118, SURF-119, SURF-120, SURF-121, SURF-122, SURF-123, SURF-137, SURF-138, SURF-139, SURF-140, SURF-141, SURF-143, SURF-144, SURF-145, SURF-166
- **Dependencies:** FEAT-003
- **Tier / complexity:** T0 / high
- **Preservation posture:** yes
- **Target package:** `packages/trace`

### FEAT-006 · Readiness & Synchronization
- **Intent:** Bound asynchronous effect settling with deadlines and cancellation generations so narration and choreography cannot deadlock or resume stale work.
- **Owned surfaces (1):** SURF-142
- **Dependencies:** FEAT-003, FEAT-005
- **Tier / complexity:** T0 / high
- **Preservation posture:** yes
- **Target package:** `packages/readiness`

### FEAT-004 · Compound Choreography & Beat IR
- **Intent:** Let authors express atomic, ordered, parallel, and intent-bearing groups as a stable choreography IR rather than relying on accidental command adjacency.
- **Owned surfaces (5):** SURF-029, SURF-128, SURF-129, SURF-164, SURF-165
- **Dependencies:** FEAT-001, FEAT-002, FEAT-003
- **Tier / complexity:** T0 / high
- **Preservation posture:** yes
- **Target package:** `packages/core + packages/authoring`

### FEAT-012 · Shared Whiteboard Canvas
- **Intent:** Provide a reusable screen-space explanatory canvas for text, math, lines, boxes, arrows, highlights, dots, shapes, counting, erasure, and reveal operations.
- **Owned surfaces (21):** SURF-034, SURF-035, SURF-036, SURF-037, SURF-038, SURF-039, SURF-057, SURF-058, SURF-059, SURF-060, SURF-061, SURF-062, SURF-063, SURF-064, SURF-065, SURF-066, SURF-067, SURF-068, SURF-069, SURF-070, SURF-071
- **Dependencies:** FEAT-002, FEAT-003
- **Tier / complexity:** T1 / medium
- **Preservation posture:** yes
- **Target package:** `plugins/whiteboard`

### FEAT-007 · Geospatial Camera & View Framing
- **Intent:** Let a geospatial host establish, focus, fit, and follow meaningful views using semantic targets rather than renderer-specific pointers.
- **Owned surfaces (8):** SURF-005, SURF-006, SURF-007, SURF-008, SURF-040, SURF-041, SURF-042, SURF-047
- **Dependencies:** FEAT-002, FEAT-003
- **Tier / complexity:** T1 / medium
- **Preservation posture:** yes
- **Target package:** `plugins/geo-clio`

### FEAT-008 · Geospatial Highlighting & Annotation
- **Intent:** Annotate map entities and relationships with highlights, spotlights, labels, circles, lines, arrows, and semantic routes.
- **Owned surfaces (11):** SURF-009, SURF-010, SURF-011, SURF-012, SURF-013, SURF-014, SURF-015, SURF-043, SURF-044, SURF-045, SURF-046
- **Dependencies:** FEAT-007
- **Tier / complexity:** T1 / medium
- **Preservation posture:** yes
- **Target package:** `plugins/geo-clio`

### FEAT-009 · Geospatial Layers, Flows & Temporal Overlays
- **Intent:** Control thematic layers, animated flows, basemaps, overlays, and time-varying map state through explicit plugin contracts.
- **Owned surfaces (8):** SURF-016, SURF-017, SURF-018, SURF-019, SURF-048, SURF-049, SURF-050, SURF-051
- **Dependencies:** FEAT-007, FEAT-008
- **Tier / complexity:** T1 / high
- **Preservation posture:** yes-with-divergence
- **Target package:** `plugins/geo-clio`

### FEAT-010 · World Pieces & Controlled Registry Proposals
- **Intent:** Manipulate world-surface pieces and permit controlled semantic-entity proposals without allowing arbitrary model-authored host pointers.
- **Owned surfaces (8):** SURF-020, SURF-021, SURF-022, SURF-023, SURF-028, SURF-101, SURF-148, SURF-149
- **Dependencies:** FEAT-002, FEAT-003, FEAT-007
- **Tier / complexity:** T1 / high
- **Preservation posture:** yes
- **Target package:** `plugins/geo-clio`

### FEAT-011 · Evidence, Sources & Scene Presentation
- **Intent:** Coordinate source-backed narration, scene transitions, titles, and non-geographic evidence overlays while keeping provenance visible.
- **Owned surfaces (7):** SURF-024, SURF-025, SURF-026, SURF-030, SURF-031, SURF-032, SURF-033
- **Dependencies:** FEAT-003, FEAT-005
- **Tier / complexity:** T1 / medium
- **Preservation posture:** yes-with-dead-command-removed
- **Target package:** `plugins/geo-clio + packages/authoring`

### FEAT-013 · Classroom Avatar, Room & Camera Staging
- **Intent:** Stage embodied teaching with avatar movement, gaze, gesture, expression, room mode, lighting, and camera focus while exposing readiness-relevant state.
- **Owned surfaces (10):** SURF-052, SURF-053, SURF-054, SURF-055, SURF-056, SURF-079, SURF-080, SURF-081, SURF-124, SURF-136
- **Dependencies:** FEAT-003, FEAT-005, FEAT-006
- **Tier / complexity:** T1 / high
- **Preservation posture:** yes
- **Target package:** `plugins/classroom`

### FEAT-014 · Classroom Projector & Media Orchestration
- **Intent:** Prepare, lower, source, play, pause, wait for, and raise projected media with explicit readiness/failure events and host-only provider configuration.
- **Owned surfaces (16):** SURF-072, SURF-073, SURF-074, SURF-075, SURF-076, SURF-077, SURF-078, SURF-125, SURF-126, SURF-127, SURF-157, SURF-158, SURF-159, SURF-160, SURF-161, SURF-162
- **Dependencies:** FEAT-003, FEAT-005, FEAT-006
- **Tier / complexity:** T1 / high
- **Preservation posture:** yes
- **Target package:** `plugins/classroom`

### FEAT-015 · Lesson Interaction & Pedagogical State
- **Intent:** Represent questions, choices, waits, resume points, objectives, phases, assessment, and completion as explicit lesson-state effects and events.
- **Owned surfaces (14):** SURF-082, SURF-083, SURF-084, SURF-085, SURF-086, SURF-087, SURF-088, SURF-089, SURF-130, SURF-131, SURF-132, SURF-133, SURF-134, SURF-135
- **Dependencies:** FEAT-003, FEAT-005, FEAT-006
- **Tier / complexity:** T1 / high
- **Preservation posture:** yes
- **Target package:** `plugins/classroom`

### FEAT-016 · Chess Annotation Compatibility
- **Intent:** Preserve the original chess annotation vocabulary while quarantining natural-language visual inference behind an opt-in compatibility producer.
- **Owned surfaces (5):** SURF-001, SURF-002, SURF-003, SURF-004, SURF-167
- **Dependencies:** FEAT-001, FEAT-002, FEAT-003
- **Tier / complexity:** T2 / medium
- **Preservation posture:** compatibility-only
- **Target package:** `plugins/chess + packages/compatibility/llm-chess`

### FEAT-017 · Word-Anchored DOM Presenter Choreography
- **Intent:** Synchronize focus, highlight, clearing, and diagram presentation against narration word position without requiring world-state or 3D infrastructure.
- **Owned surfaces (9):** SURF-090, SURF-091, SURF-092, SURF-093, SURF-094, SURF-095, SURF-096, SURF-097, SURF-168
- **Dependencies:** FEAT-001, FEAT-002, FEAT-003, FEAT-005
- **Tier / complexity:** T2 / medium
- **Preservation posture:** yes
- **Target package:** `plugins/dom-presenter`

### FEAT-018 · Host Model & Narration Configuration
- **Intent:** Keep model-provider and narration/TTS configuration at the host boundary so core Stagehand remains model-provider independent.
- **Owned surfaces (6):** SURF-151, SURF-152, SURF-153, SURF-154, SURF-155, SURF-156
- **Dependencies:** FEAT-013, FEAT-014, FEAT-015
- **Tier / complexity:** T3 / low
- **Preservation posture:** host-only-not-core
- **Target package:** `examples/virtual-classroom-host`

## Gate 8

- Non-dead surfaces: **167**.
- Surfaces assigned to exactly one feature: **167**.
- Orphans: **0**.
- Double claims: **0**.
- Dead and intentionally unassigned: **SURF-027**.

**GATE 8: PASS — 167 == 167.**


---

<!-- SOURCE: 31_REBUILD_PLAN.md -->

# 31 · Rebuild Plan

## Target package topology

```text
packages/core
packages/parser
packages/registry
packages/runtime
packages/trace
packages/readiness
packages/authoring
packages/compatibility/llm-chess
plugins/whiteboard
plugins/geo-clio
plugins/classroom
plugins/chess
plugins/dom-presenter
examples/
```

## Vertical milestones

| Milestone | Features | Thin vertical result |
|---|---|---|
| M1 · Parser trust kernel | FEAT-001 | Close control leakage, syntax, streaming/batch equivalence first. |
| M2 · Registry and validation | FEAT-002 | Single-source capability registry and fail-closed validation. |
| M3 · Effect runtime and trace | FEAT-003, FEAT-005 | Canonical effect compilation, ref resolution, public/private trace. |
| M4 · Readiness and choreography | FEAT-006, FEAT-004 | Bound async effects; then compound/beat semantics on top of stable runtime. |
| M5 · Reusable whiteboard reference plugin | FEAT-012 | First nontrivial plugin proves domain isolation and shared reuse. |
| M6 · Geo reference plugin | FEAT-007, FEAT-008, FEAT-009, FEAT-010, FEAT-011 | Camera → annotations → overlays → pieces/proposals → evidence presentation. |
| M7 · Classroom plugin | FEAT-013, FEAT-014, FEAT-015, FEAT-018 | Embodiment/media/lesson state on readiness+trace foundation; host config remains outside core. |
| M8 · Compatibility plugins | FEAT-016, FEAT-017 | Chess and word-anchored DOM presenter prove small-plugin ergonomics. |
| M9 · Parity and release convergence | cross-cutting | Run full parity matrix, divergence expectations, provenance/license gates, package/API review. |

## Rebuild tasks

- **T-001** — implement FEAT-001 Mixed-Stream Parsing & Syntax in `packages/parser`, satisfy 6 surface-bound requirements, and pass all feature TEST IDs.
- **T-002** — implement FEAT-002 Capability Registry, Validation & Introspection in `packages/registry`, satisfy 6 surface-bound requirements, and pass all feature TEST IDs.
- **T-003** — implement FEAT-003 Effect Compilation, Resolution & Safe Execution in `packages/runtime`, satisfy 10 surface-bound requirements, and pass all feature TEST IDs.
- **T-004** — implement FEAT-005 Trace, Replay & Diagnostics in `packages/trace`, satisfy 16 surface-bound requirements, and pass all feature TEST IDs.
- **T-005** — implement FEAT-006 Readiness & Synchronization in `packages/readiness`, satisfy 1 surface-bound requirements, and pass all feature TEST IDs.
- **T-006** — implement FEAT-004 Compound Choreography & Beat IR in `packages/core + packages/authoring`, satisfy 5 surface-bound requirements, and pass all feature TEST IDs.
- **T-007** — implement FEAT-012 Shared Whiteboard Canvas in `plugins/whiteboard`, satisfy 21 surface-bound requirements, and pass all feature TEST IDs.
- **T-008** — implement FEAT-007 Geospatial Camera & View Framing in `plugins/geo-clio`, satisfy 8 surface-bound requirements, and pass all feature TEST IDs.
- **T-009** — implement FEAT-008 Geospatial Highlighting & Annotation in `plugins/geo-clio`, satisfy 11 surface-bound requirements, and pass all feature TEST IDs.
- **T-010** — implement FEAT-009 Geospatial Layers, Flows & Temporal Overlays in `plugins/geo-clio`, satisfy 8 surface-bound requirements, and pass all feature TEST IDs.
- **T-011** — implement FEAT-010 World Pieces & Controlled Registry Proposals in `plugins/geo-clio`, satisfy 8 surface-bound requirements, and pass all feature TEST IDs.
- **T-012** — implement FEAT-011 Evidence, Sources & Scene Presentation in `plugins/geo-clio + packages/authoring`, satisfy 7 surface-bound requirements, and pass all feature TEST IDs.
- **T-013** — implement FEAT-013 Classroom Avatar, Room & Camera Staging in `plugins/classroom`, satisfy 10 surface-bound requirements, and pass all feature TEST IDs.
- **T-014** — implement FEAT-014 Classroom Projector & Media Orchestration in `plugins/classroom`, satisfy 16 surface-bound requirements, and pass all feature TEST IDs.
- **T-015** — implement FEAT-015 Lesson Interaction & Pedagogical State in `plugins/classroom`, satisfy 14 surface-bound requirements, and pass all feature TEST IDs.
- **T-016** — implement FEAT-016 Chess Annotation Compatibility in `plugins/chess + packages/compatibility/llm-chess`, satisfy 5 surface-bound requirements, and pass all feature TEST IDs.
- **T-017** — implement FEAT-017 Word-Anchored DOM Presenter Choreography in `plugins/dom-presenter`, satisfy 9 surface-bound requirements, and pass all feature TEST IDs.
- **T-018** — implement FEAT-018 Host Model & Narration Configuration in `examples/virtual-classroom-host`, satisfy 6 surface-bound requirements, and pass all feature TEST IDs.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| RISK-001 · Parser trust regression | critical | Golden + adversarial vectors; never release raw producer text before parse/quarantine. |
| RISK-002 · Schema/introspection drift | critical | Generate both from one registry and enforce equality in tests. |
| RISK-003 · Readiness deadlock/stale resume | critical | Deadline-bounded waits + generation invalidation tests. |
| RISK-004 · Core/plugin leakage | high | Dependency boundary test forbids renderer/provider/domain packages from core. |
| RISK-005 · Replay incompatibility | high | Versioned trace envelope + migrator registry before 1.0. |
| RISK-006 · Host contract ambiguity | high | DIV-002 and contract schemas resolve known ambiguities before implementation. |
| RISK-007 · License/provenance | release-blocking | Resolve U-002/U-003 before publishing affected compatibility/plugin code. |

## Deliberate divergences

See `33_DIVERGENCE_REGISTER.md`; all divergences are normative and must be reflected in parity expectations.

## Explicit v1 exclusions

- `SURF-027 claim.show` (dead/orphaned).
- LLM-Chess natural-language visual inference from trusted core (compatibility-only).
- Source-app-specific provider/export pipelines as core features.
- Any plugin whose source provenance is not cleared for public release.

## Gate 10 milestone coverage

- Every T0/T1 feature is assigned to M1–M7.
- T2 compatibility features are assigned to M8.
- T3 host config is included only with the classroom vertical slice and never promoted into core.


---

<!-- SOURCE: 32_PARITY_SUITE.md -->

# 32 · Parity Suite

Parity is defined at the behavior boundary, not by source-code resemblance. Tests are written so the same vector can target the original host adapter (when runnable) and the rebuild.

| TEST | Surface | Feature | Method | Expected | Divergence |
|---|---|---|---|---|---|
| TEST-001 | SURF-001 `arrow` | FEAT-016 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-002 | SURF-002 `highlight` | FEAT-016 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-003 | SURF-003 `circle` | FEAT-016 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-004 | SURF-004 `move` | FEAT-016 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-005 | SURF-005 `map.view` | FEAT-007 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-006 | SURF-006 `map.focus` | FEAT-007 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-007 | SURF-007 `map.fit` | FEAT-007 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-008 | SURF-008 `map.mode` | FEAT-007 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-009 | SURF-009 `map.highlight` | FEAT-008 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-010 | SURF-010 `map.spotlight` | FEAT-008 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-011 | SURF-011 `map.label` | FEAT-008 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-012 | SURF-012 `map.clear` | FEAT-008 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-013 | SURF-013 `map.arrow` | FEAT-008 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-014 | SURF-014 `map.circle` | FEAT-008 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-015 | SURF-015 `map.line` | FEAT-008 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-016 | SURF-016 `layer.on` | FEAT-009 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-017 | SURF-017 `layer.off` | FEAT-009 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-018 | SURF-018 `flow.animate` | FEAT-009 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-019 | SURF-019 `flow.clear` | FEAT-009 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-020 | SURF-020 `piece.place` | FEAT-010 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-021 | SURF-021 `piece.move` | FEAT-010 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-022 | SURF-022 `piece.remove` | FEAT-010 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-023 | SURF-023 `piece.clear` | FEAT-010 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-024 | SURF-024 `chat.say` | FEAT-011 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-025 | SURF-025 `source.show` | FEAT-011 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-026 | SURF-026 `source.hide` | FEAT-011 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-027 | SURF-028 `entity.propose` | FEAT-010 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-028 | SURF-029 `mark.clip` | FEAT-004 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-029 | SURF-030 `scene.fade` | FEAT-011 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-030 | SURF-031 `scene.title` | FEAT-011 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-031 | SURF-032 `asset.show` | FEAT-011 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-032 | SURF-033 `asset.clear` | FEAT-011 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-033 | SURF-034 `whiteboard.show` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-034 | SURF-035 `whiteboard.hide` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-035 | SURF-036 `whiteboard.clear` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-036 | SURF-037 `whiteboard.text` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-037 | SURF-038 `whiteboard.line` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-038 | SURF-039 `whiteboard.box` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-039 | SURF-040 `camera.center` | FEAT-007 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-040 | SURF-041 `camera.focus_region` | FEAT-007 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-041 | SURF-042 `camera.establish_globe` | FEAT-007 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-042 | SURF-043 `highlight.region` | FEAT-008 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-043 | SURF-044 `highlight.location` | FEAT-008 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-044 | SURF-045 `label.show` | FEAT-008 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-045 | SURF-046 `route.draw` | FEAT-008 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-046 | SURF-047 `camera.follow_marker` | FEAT-007 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-047 | SURF-048 `map.overlay.show` | FEAT-009 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-048 | SURF-049 `map.overlay.hide` | FEAT-009 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-049 | SURF-050 `map.basemap` | FEAT-009 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-050 | SURF-051 `map.timecursor` | FEAT-009 | schema + golden/negative effect trace; differential host run when available | accepted divergence | DIV-002 |
| TEST-051 | SURF-052 `avatar.move` | FEAT-013 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-052 | SURF-053 `avatar.look` | FEAT-013 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-053 | SURF-054 `avatar.gesture` | FEAT-013 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-054 | SURF-055 `avatar.point` | FEAT-013 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-055 | SURF-056 `avatar.face` | FEAT-013 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-056 | SURF-057 `whiteboard.show` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-057 | SURF-058 `whiteboard.hide` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-058 | SURF-059 `whiteboard.clear` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-059 | SURF-060 `whiteboard.text` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-060 | SURF-061 `whiteboard.math` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-061 | SURF-062 `whiteboard.line` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-062 | SURF-063 `whiteboard.box` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-063 | SURF-064 `whiteboard.arrow` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-064 | SURF-065 `whiteboard.highlight` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-065 | SURF-066 `whiteboard.scribble` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-066 | SURF-067 `whiteboard.dots` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-067 | SURF-068 `whiteboard.shape` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-068 | SURF-069 `whiteboard.count` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-069 | SURF-070 `whiteboard.erase` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-070 | SURF-071 `whiteboard.reveal` | FEAT-012 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-071 | SURF-072 `projector.prepare` | FEAT-014 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-072 | SURF-073 `projector.lower` | FEAT-014 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-073 | SURF-074 `projector.source` | FEAT-014 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-074 | SURF-075 `projector.play` | FEAT-014 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-075 | SURF-076 `projector.wait` | FEAT-014 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-076 | SURF-077 `projector.pause` | FEAT-014 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-077 | SURF-078 `projector.raise` | FEAT-014 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-078 | SURF-079 `room.lights` | FEAT-013 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-079 | SURF-080 `room.mode` | FEAT-013 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-080 | SURF-081 `camera.focus` | FEAT-013 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-081 | SURF-082 `lesson.ask` | FEAT-015 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-082 | SURF-083 `lesson.choice` | FEAT-015 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-083 | SURF-084 `lesson.wait` | FEAT-015 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-084 | SURF-085 `lesson.resume` | FEAT-015 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-085 | SURF-086 `lesson.objective` | FEAT-015 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-086 | SURF-087 `lesson.phase` | FEAT-015 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-087 | SURF-088 `lesson.assess` | FEAT-015 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-088 | SURF-089 `lesson.complete` | FEAT-015 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-089 | SURF-090 `stage.focus` | FEAT-017 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-090 | SURF-091 `stage.focus.off` | FEAT-017 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-091 | SURF-092 `stage.auto` | FEAT-017 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-092 | SURF-093 `stage.highlight` | FEAT-017 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-093 | SURF-094 `stage.highlight.off` | FEAT-017 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-094 | SURF-095 `stage.clear` | FEAT-017 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-095 | SURF-096 `stage.diagram` | FEAT-017 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-096 | SURF-097 `stage.diagram.off` | FEAT-017 | schema + golden/negative effect trace; differential host run when available | behavioral equivalence | — |
| TEST-097 | SURF-098 `parseScript` | FEAT-001 | typed API/contract conformance | accepted divergence | DIV-003 |
| TEST-098 | SURF-099 `parseCommandString` | FEAT-001 | typed API/contract conformance | accepted divergence | DIV-003 |
| TEST-099 | SURF-100 `StreamingParser` | FEAT-001 | typed API/contract conformance | accepted divergence | DIV-003 |
| TEST-100 | SURF-101 `applyEntityProposeCommand` | FEAT-010 | typed API/contract conformance | behavioral equivalence | — |
| TEST-101 | SURF-102 `canonicalizeCommandEntityRefs` | FEAT-003 | typed API/contract conformance | behavioral equivalence | — |
| TEST-102 | SURF-103 `executeStagehandCommand` | FEAT-003 | typed API/contract conformance | behavioral equivalence | — |
| TEST-103 | SURF-104 `validateCommand` | FEAT-002 | typed API/contract conformance | behavioral equivalence | — |
| TEST-104 | SURF-105 `validateCommands` | FEAT-002 | typed API/contract conformance | behavioral equivalence | — |
| TEST-105 | SURF-106 `COMMAND_SCHEMAS` | FEAT-002 | typed API/contract conformance | behavioral equivalence | — |
| TEST-106 | SURF-107 `CommandAction` | FEAT-002 | typed API/contract conformance | behavioral equivalence | — |
| TEST-107 | SURF-108 `StagehandCommand` | FEAT-001 | typed API/contract conformance | behavioral equivalence | — |
| TEST-108 | SURF-109 `ScriptSegment` | FEAT-001 | typed API/contract conformance | behavioral equivalence | — |
| TEST-109 | SURF-110 `CommandSchema` | FEAT-002 | typed API/contract conformance | behavioral equivalence | — |
| TEST-110 | SURF-111 `CanonicalStagehandCommand` | FEAT-003 | typed API/contract conformance | behavioral equivalence | — |
| TEST-111 | SURF-112 `CommandValidationResult` | FEAT-002 | typed API/contract conformance | behavioral equivalence | — |
| TEST-112 | SURF-113 `CanonicalizeCommandOptions` | FEAT-003 | typed API/contract conformance | behavioral equivalence | — |
| TEST-113 | SURF-114 `CanonicalizeCommandResult` | FEAT-003 | typed API/contract conformance | behavioral equivalence | — |
| TEST-114 | SURF-115 `EntityResolutionMode` | FEAT-003 | typed API/contract conformance | behavioral equivalence | — |
| TEST-115 | SURF-116 `ExecuteStagehandCommandOptions` | FEAT-003 | typed API/contract conformance | behavioral equivalence | — |
| TEST-116 | SURF-117 `StagehandRuntimeEvent` | FEAT-005 | typed API/contract conformance | behavioral equivalence | — |
| TEST-117 | SURF-118 `narration.started` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-118 | SURF-119 `narration.ended` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-119 | SURF-120 `narration.interrupted` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-120 | SURF-121 `caption` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-121 | SURF-122 `effect.committed` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-122 | SURF-123 `board.revision.committed` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-123 | SURF-124 `avatar.anchor.reached` | FEAT-013 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-124 | SURF-125 `projector.state` | FEAT-014 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-125 | SURF-126 `media.ready` | FEAT-014 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-126 | SURF-127 `media.failed` | FEAT-014 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-127 | SURF-128 `beat.started` | FEAT-004 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-128 | SURF-129 `beat.completed` | FEAT-004 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-129 | SURF-130 `lesson.awaiting_student` | FEAT-015 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-130 | SURF-131 `lesson.choice.selected` | FEAT-015 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-131 | SURF-132 `lesson.resumed` | FEAT-015 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-132 | SURF-133 `lesson.objective` | FEAT-015 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-133 | SURF-134 `lesson.assessed` | FEAT-015 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-134 | SURF-135 `lesson.completed` | FEAT-015 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-135 | SURF-136 `room.mode` | FEAT-013 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-136 | SURF-137 `safe_failure` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-137 | SURF-138 `stream.chunk` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-138 | SURF-139 `segment.parsed` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-139 | SURF-140 `command.accepted` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-140 | SURF-141 `command.rejected` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-141 | SURF-142 `gate.waited` | FEAT-006 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-142 | SURF-143 `provider.request` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-143 | SURF-144 `provider.response` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-144 | SURF-145 `diagnostic` | FEAT-005 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-145 | SURF-146 `invalid_command` | FEAT-003 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-146 | SURF-147 `unresolved_refs` | FEAT-003 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-147 | SURF-148 `entity_proposed` | FEAT-010 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-148 | SURF-149 `proposal_rejected` | FEAT-010 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-149 | SURF-150 `scene_command` | FEAT-003 | trace event emission/channel snapshot | behavioral equivalence | — |
| TEST-150 | SURF-151 `OPENAI_API_KEY` | FEAT-018 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-151 | SURF-152 `OPENROUTER_API_KEY` | FEAT-018 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-152 | SURF-153 `VC_DIRECTOR_MODEL` | FEAT-018 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-153 | SURF-154 `VC_TTS_VOICE` | FEAT-018 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-154 | SURF-155 `VC_TTS_MODEL` | FEAT-018 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-155 | SURF-156 `VC_TTS_SPEED` | FEAT-018 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-156 | SURF-157 `VC_MEDIA_PROVIDER` | FEAT-014 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-157 | SURF-158 `VC_COMFY_URL` | FEAT-014 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-158 | SURF-159 `VC_MINIMAX_BASE_URL` | FEAT-014 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-159 | SURF-160 `VC_MINIMAX_MODEL` | FEAT-014 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-160 | SURF-161 `VC_MINIMAX_API_KEY` | FEAT-014 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-161 | SURF-162 `VC_MEDIA_DEADLINE_MS` | FEAT-014 | host configuration smoke/isolation test | behavioral equivalence | — |
| TEST-162 | SURF-163 `Stagehand bracket grammar` | FEAT-001 | golden parser/serializer fixture | accepted divergence | DIV-003 |
| TEST-163 | SURF-164 `Compound blocks` | FEAT-004 | golden parser/serializer fixture | accepted divergence | DIV-003 |
| TEST-164 | SURF-165 `Beat agent object` | FEAT-004 | golden parser/serializer fixture | behavioral equivalence | — |
| TEST-165 | SURF-166 `StagehandTrace` | FEAT-005 | golden parser/serializer fixture | behavioral equivalence | — |
| TEST-166 | SURF-167 `Chess annotation grammar` | FEAT-016 | golden parser/serializer fixture | behavioral equivalence | — |
| TEST-167 | SURF-168 `VCB presenter grammar` | FEAT-017 | golden parser/serializer fixture | behavioral equivalence | — |

## Dead surface

- `SURF-027 claim.show` has no parity requirement. It is intentionally absent from the canonical registry under DIV-001; a regression test must assert it is not advertised/executable unless a plugin explicitly defines a new contract.

## Suite-level gates

- Parser golden/adversarial corpus from Pass 7 remains mandatory.
- Every public effect has a production trace correlation; private events never appear in public channel snapshots.
- Every readiness wait has timeout and stale-generation vectors.
- Core dependency test rejects imports from provider/render/domain packages.


---

<!-- SOURCE: 33_DIVERGENCE_REGISTER.md -->

# Divergence Register

| ID | Change | Feature | Surfaces | Rationale |
|---|---|---|---|---|
| DIV-001 | Remove orphan `claim.show` from canonical registry | FEAT-011 | SURF-027 | A declared-but-unexecutable action is not a contract; plugins may reintroduce it only with a complete schema. |
| DIV-002 | Make `map.timecursor` unambiguous | FEAT-009 | SURF-051 | Use an explicit live-vs-at representation; omitted/empty timestamp ambiguity is forbidden. |
| DIV-003 | Use hardened VC parser semantics as the baseline | FEAT-001 | SURF-098, SURF-099, SURF-100, SURF-163, SURF-164 | Nesting, quote handling, bare-command quarantine, and batch/stream convergence supersede weaker Clio behavior. |
| DIV-004 | Disable semantic repair by default | FEAT-001 | SURF-163 | Lexical repair may recover framing; meaning-changing guesses require explicit plugin policy. |
| DIV-005 | Version the trace envelope | FEAT-005 | SURF-166 | Add protocol, schema-set, plugin, adapter, and optional asset-manifest versions plus migrator registry. |
| DIV-006 | Generate validation and introspection from one registry | FEAT-002 | SURF-106, SURF-110 | Eliminate parallel command catalogs that previously drifted. |
| DIV-007 | Keep core host- and provider-independent | FEAT-003 | SURF-151, SURF-152, SURF-153 | Map, Three.js, chess, DOM, classroom, and model provider dependencies remain outside core packages. |
| DIV-008 | Quarantine LLM-Chess natural-language visual inference | FEAT-016 | SURF-167 | Natural-language cue inference is opt-in compatibility producer behavior, never trusted core execution. |
| DIV-009 | Host configuration is not SDK core configuration | FEAT-018 | SURF-151, SURF-152, SURF-153, SURF-154, SURF-155, SURF-156, SURF-157, SURF-158, SURF-159, SURF-160, SURF-161, SURF-162 | Provider keys, TTS settings, media endpoints, and deadlines stay in hosts/plugins. |


---

<!-- SOURCE: PASS7_ADVERSARIAL_SWEEP.md -->

# Pass 7 — Adversarial Sweep

**Status: PASS for rebuild-relevant corpus closure.**

This report realigns Pass 7 to the original `/reverse-engineer` contract rather than treating execution/conformance as the whole pass. The prior conformance harness remains valid supporting evidence.

## Dead-code and scope sweep

- `SURF-027 claim.show` is marked **dead/orphaned for rebuild scope**: the Clio action union contains it, but the schema-first validator has no matching command schema. It is governed by `FIND-001` and `DIV-001`.
- All other 167 enumerated surfaces remain live/relevant or explicit compatibility/host surfaces. None is silently discarded.

## Undocumented behavior / contradictions carried forward

- Bracket-loss control leakage is promoted to a core trust invariant (`FIND-012`).
- Schema/introspection drift is promoted to a one-registry invariant (`FIND-011`).
- `map.timecursor` optional-vs-required semantics are a confirmed contradiction; the rebuild uses an explicit live-vs-at form (`DIV-002`).
- LLM-Chess natural-language visual inference is preserved only as opt-in compatibility behavior (`DIV-008`).

## Inference sweep

All surviving explicit `[i]` markers in the Pass 0–6 analysis tier were revisited. The three unique inferences that were not independently promotable from the available material were demoted to explicit unknowns `U-011..U-013`; the analysis tier now contains zero `[i]` markers.

## R2 sweep

The finite surface inventory remains 168/168 and contains no ellipsis/“etc.” substitution for an enumerable member.

## Unknown resolution discipline

Every T0/T1 unknown has a resolution or disposition:

- U-001 closed as verification-provenance limitation; portable conformance ran locally.
- U-002/U-003 remain release-governance blockers with explicit maintainer/license resolution.
- U-005 is converted into a required versioned trace/migrator design decision for 1.0.
- U-007 is confirmed orphaned and removed from canonical scope.
- U-008 is converted into `DIV-002`.
- U-009/U-010 are resolved as canonical parser/repair contracts.

## Gate 7

- Explicit `[i]` claims remaining in analysis tier: **0**.
- Enumerated-set ellipsis substitutions: **0**.
- T0/T1 unknowns without stated resolution/disposition: **0**.
- Dead surfaces identified: **1**.
- Non-dead rebuild denominator: **167**.

**GATE 7: PASS.**


---

<!-- SOURCE: PASS8_FEATURE_SYNTHESIS.md -->

# Pass 8 — Feature Synthesis

**Status: PASS.**

The 168 source/application surfaces were collapsed by user/integrator capability rather than by repository/module. `SURF-027 claim.show` is the sole dead/orphaned surface and is intentionally excluded from the rebuild denominator.

- Total enumerated surfaces: **168**
- Dead surfaces: **1**
- Non-dead surfaces: **167**
- FEAT capabilities: **18**
- Non-dead surfaces assigned to exactly one FEAT: **167/167**
- Orphans: **0**
- Double claims: **0**

The complete ownership ledger, dependency ordering, preservation posture, target package, tier, and complexity are in `30_FEATURE_LEDGER.md`.

**GATE 8: PASS — 167 == 167.**


---

<!-- SOURCE: PASS9_SPEC_EMISSION.md -->

# Pass 9 — Spec Emission

**Status: COMPLETE.**

- Features emitted: **18/18**.
- Every feature directory contains `spec.md`, `plan.md`, `data-model.md`, `quickstart.md`, and `contracts/`.
- Every `spec.md` contains all twelve required sections.
- Functional requirements: **167**, one per live SURF to prevent traceability compression.
- Parity tests referenced from specs: **167**.
- Machine-readable command/API contract manifests are emitted per feature; a shared core JSON Schema is in `contracts/stagehand-core.schema.json`.
- CTR-101..CTR-125 are each owned by exactly one feature contract set.
- `SURF-027` is not assigned an FR because Pass 7 marked it dead; DIV-001 records the deliberate removal.

**GATE 9: PASS for corpus/spec emission.**


---

<!-- SOURCE: PASS10_REBUILD_PLAN_AND_CONSTITUTION.md -->

# Pass 10 — Rebuild Plan + Constitution

**Status: COMPLETE.**

Outputs:
- `00_CONSTITUTION.md`
- `31_REBUILD_PLAN.md`
- `32_PARITY_SUITE.md`
- `33_DIVERGENCE_REGISTER.md`
- `00_TRACEABILITY.md`

Gate facts are validated by `tools/validate_corpus.py`: bidirectional ownership has no dangling SURF/FEAT/FR/TEST/task IDs; all T0/T1 features are placed in vertical milestones; every divergence has rationale and parity treatment.

**GATE 10: PASS.**


---

<!-- SOURCE: PASS11_SPEC_KIT_HANDOFF.md -->

# Pass 11 — Handoff to Spec Kit

## Status

**Corpus/seed preparation: COMPLETE. External Spec Kit implementation execution: NOT CLAIMED.**

Current Spec Kit documentation was re-checked on 2026-09-13. The supported production path still includes constitution, specify, clarify, plan, checklist, tasks, analyze, implement, and converge. The current non-interactive initialization form supports `specify init --here --force --non-interactive --integration claude`.

This environment has `uvx` but cannot fetch/install `github/spec-kit` over Git, so an actual `specify init` and agent slash-command run cannot be truthfully reported as executed here. `spec-kit-seed/` contains the exact command queue and bootstrap command for the rebuild runner.

## Re-grounding rule

At every Spec Kit phase, read the feature's canonical `spec.md` plus the named source artifacts. Never seed a phase solely from the previous phase's paraphrase. Stable IDs from `00_TRACEABILITY.md` survive task generation.

## Analyze equivalent performed locally

`tools/validate_corpus.py` performs the deterministic part of `/speckit.analyze`: feature ownership, required section coverage, FR/TEST counts, API contract ownership, trace membership, and parity-test coverage. Its output is stored in `PASS11_LOCAL_ANALYZE.json`.

## Gate 11

- Corpus cross-artifact consistency: evaluated locally.
- Actual `/speckit.analyze`: not executed because Spec Kit could not be installed in this container.
- Actual `/speckit.implement` / `/speckit.converge`: not executed; this corpus is the handoff to that implementation run.
- Runtime parity of the future full SDK: therefore **pending implementation**, not fabricated.

**GATE 11: HANDOFF READY; implementation/parity gate remains external to this reconstruction corpus.**


---

<!-- SOURCE: PASS12_FINAL_ACCEPTANCE.md -->

# Pass 12 — Final Acceptance & Release Handoff

**Status: PASS.**

Pass 12 is a maintainer-requested extension; the source `/reverse-engineer` prompt ends at Pass 11. This pass is therefore defined explicitly as deterministic corpus acceptance, packaging, and handoff — not as a fabricated upstream pass definition.

## Acceptance results

- Canonical corpus validator: **PASS**
- Surfaces: **168 total = 167 live + 1 dead**
- Features: **18**
- Requirements: **167**
- Parity tests: **167**
- API contracts CTR-101..125: **25/25 exactly one owner**
- Explicit `[i]` markers remaining in canonical `analysis/`: **0**
- Spec directories: **18**
- Missing required feature artifacts: **0**
- Traceability IDs discovered: SURF 168, FEAT 18, FR 167, T 18, TEST 167, DIV 9

## What is complete

The reverse-engineering corpus, feature synthesis, extended Spec Kit feature specifications, machine-readable contract manifests, rebuild constitution, vertical rebuild plan, divergence register, parity design, stable task seeds, and full traceability matrix are complete and locally consistency-validated.

## What is intentionally not claimed

The complete standalone Stagehand SDK has **not** been implemented by Spec Kit in this container. The container could not install `github/spec-kit`, so actual `/speckit.analyze`, `/speckit.implement`, `/speckit.converge`, and differential runtime parity against a future SDK are not represented as executed. `spec-kit-seed/` is the handoff for that run.

This distinction is part of the acceptance result: the specification corpus is DONE; implementation convergence is the next repository phase, not a reverse-engineering artifact.

**GATE 12: PASS for corpus acceptance and packaging.**


---

<!-- SOURCE: ASTRA_HANDOFF_PASS12.md -->

# Final Handoff — Stagehand SDK Reconstruction after Pass 12

## Canonical thesis

Stagehand is a headless, model-agnostic mixed-stream compiler/runtime that converts untrusted narration-plus-control into validated, traceable, synchronized host effects.

## Build order

1. parser trust kernel
2. one-source capability registry/validation
3. canonical effect runtime + trace
4. readiness + compound choreography
5. shared whiteboard reference plugin
6. geo plugin
7. classroom plugin
8. chess and DOM presenter compatibility plugins
9. parity/convergence/release

## Read first

- `00_CONSTITUTION.md`
- `30_FEATURE_LEDGER.md`
- `31_REBUILD_PLAN.md`
- `32_PARITY_SUITE.md`
- `00_TRACEABILITY.md`
- `spec-kit-seed/SPEC_KIT_COMMAND_QUEUE.md`

## Non-negotiable divergences

- no orphan `claim.show` in canonical registry
- explicit live-vs-at time cursor
- VC-hardened parser behavior
- semantic repair default-off
- versioned replay envelope
- generated validation/introspection from one registry
- domain/provider isolation from core
- LLM-Chess inference compatibility-only

## Release blockers

Resolve U-002/U-003 provenance/license posture before publishing source-derived compatibility/plugin code.

## Status

The reconstruction/specification corpus is accepted. Do not interpret this handoff as a claim that the standalone SDK implementation already exists or has passed differential parity.


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

## Pass 7 addendum

- **FIND-011:** Clio history confirms command-schema/introspection drift was a real tested failure; the extracted SDK must have one command registry.
- **FIND-012:** Virtual Classroom history confirms missing brackets caused control syntax to be spoken in a live run; command-shaped narration suppression is a core trust invariant.
- **FIND-013:** Cross-implementation evidence supports a compiler/IR model: producer dialect → canonical validated effect IR → host adapter.

See `PASS7_FINAL_FINDINGS.md` for final disposition.


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

## Pass 7 disposition

See `PASS7_FINAL_FINDINGS.md`. U-001 is closed as a verification-provenance limitation; U-009/U-010 are resolved as target-contract decisions. License/version-policy items remain explicit governance work. U-007/U-008 are now confirmed upstream defects/ambiguities rather than reconstruction uncertainty.


## U-011 · `exhibit-of-shadows` namespace-collision exclusion not re-proven
- **Tier:** T3.
- **Unknown:** whether a later revision added a true Stagehand mixed-stream implementation.
- **Resolution:** repository-wide search for parser/schema/runtime signatures before claiming lineage.
- **Blocks:** nothing in the current SDK extraction.

## U-012 · Exact Clio export/show trace-consumption entrypoint
- **Tier:** T2.
- **Unknown:** precise host entrypoint consuming trace/plan material outside the portable Stagehand module.
- **Resolution:** trace export/show imports in a materialized Clio checkout.
- **Blocks:** host export adapter only; not core SDK.

## U-013 · Exact classification of the remaining Virtual Classroom Stagehand files
- **Tier:** T2.
- **Unknown:** compact path-by-path classification for entries not named in the behavioral module summary.
- **Resolution:** materialized directory listing plus import graph.
- **Blocks:** no portable contract; behavioral modules are already mapped.


---

<!-- SOURCE: specs/001-mixed-stream-parser/spec.md -->

# FEAT-001 · Mixed-Stream Parsing & Syntax
> Status: specified | Source surfaces: 6 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Compile untrusted narration-plus-control streams into typed text, command, and compound segments without leaking control syntax into public narration.

## 2. User Scenarios

1. Given a token-fragmented producer stream, when it is parsed incrementally, then narration and controls are separated identically to batch parsing.
2. Given command-shaped text with missing brackets, when parsing, then it is recovered or quarantined as control and is never spoken as narration.

## 3. Functional Requirements

- **FR-097** The SDK MUST expose an equivalent typed public contract for `parseScript` at the capability boundary identified by this feature.  
   → SURF-098 → CTR-101 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-098** The SDK MUST expose an equivalent typed public contract for `parseCommandString` at the capability boundary identified by this feature.  
   → SURF-099 → CTR-102 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-099** The SDK MUST expose an equivalent typed public contract for `StreamingParser` at the capability boundary identified by this feature.  
   → SURF-100 → CTR-103 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-107** The SDK MUST expose an equivalent typed public contract for `StagehandCommand` at the capability boundary identified by this feature.  
   → SURF-108 → CTR-111 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-108** The SDK MUST expose an equivalent typed public contract for `ScriptSegment` at the capability boundary identified by this feature.  
   → SURF-109 → CTR-112 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-162** The SDK or owning compatibility plugin MUST read/write the `Stagehand bracket grammar` format with the recovered semantics: [action arg key=value] mixed inline with narration.  
   → SURF-163 · [v] analysis/13_SURFACE_INVENTORY.md#surf-163 · P0

## 4. Key Entities

ENT-001, ENT-002, ENT-004.

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-098 `parseScript` | FR-097 | CTR-101 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-099 `parseCommandString` | FR-098 | CTR-102 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-100 `StreamingParser` | FR-099 | CTR-103 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-108 `StagehandCommand` | FR-107 | CTR-111 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-109 `ScriptSegment` | FR-108 | CTR-112 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-163 `Stagehand bracket grammar` | FR-162 | — | [v] analysis/13_SURFACE_INVENTORY.md#surf-163 |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-001 fail closed on control leakage.
- NFR-006 batch/stream semantic equivalence.
- NFR-007 semantic repair default-off.

## 10. Divergence Register

- **DIV-003** — Use hardened VC parser semantics as the baseline. Rationale: Nesting, quote handling, bare-command quarantine, and batch/stream convergence supersede weaker Clio behavior.
- **DIV-004** — Disable semantic repair by default. Rationale: Lexical repair may recover framing; meaning-changing guesses require explicit plugin policy.

## 11. Parity Tests

- **TEST-097** — exercise SURF-098 `parseScript` against the recovered contract and assert trust-channel/state behavior.
- **TEST-098** — exercise SURF-099 `parseCommandString` against the recovered contract and assert trust-channel/state behavior.
- **TEST-099** — exercise SURF-100 `StreamingParser` against the recovered contract and assert trust-channel/state behavior.
- **TEST-107** — exercise SURF-108 `StagehandCommand` against the recovered contract and assert trust-channel/state behavior.
- **TEST-108** — exercise SURF-109 `ScriptSegment` against the recovered contract and assert trust-channel/state behavior.
- **TEST-162** — exercise SURF-163 `Stagehand bracket grammar` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.


---

<!-- SOURCE: specs/001-mixed-stream-parser/plan.md -->

# Plan — FEAT-001 Mixed-Stream Parsing & Syntax

## Target

Package owner: `packages/parser`. Dependencies: none.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: high. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/001-mixed-stream-parser/data-model.md -->

# Data model — FEAT-001

Primary entities: ENT-001, ENT-002, ENT-004. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/001-mixed-stream-parser/quickstart.md -->

# Quickstart — Mixed-Stream Parsing & Syntax

1. Register/enable the `packages/parser` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.


---

<!-- SOURCE: specs/001-mixed-stream-parser/tasks.md -->

# Tasks — FEAT-001 Mixed-Stream Parsing & Syntax

- [ ] **T-001** Implement the feature in `packages/parser` and satisfy the complete requirement/test set below.

  - [ ] FR-097 / TEST-097 — SURF-098 `parseScript`
  - [ ] FR-098 / TEST-098 — SURF-099 `parseCommandString`
  - [ ] FR-099 / TEST-099 — SURF-100 `StreamingParser`
  - [ ] FR-107 / TEST-107 — SURF-108 `StagehandCommand`
  - [ ] FR-108 / TEST-108 — SURF-109 `ScriptSegment`
  - [ ] FR-162 / TEST-162 — SURF-163 `Stagehand bracket grammar`


---

<!-- SOURCE: specs/002-capability-registry-validation/spec.md -->

# FEAT-002 · Capability Registry, Validation & Introspection
> Status: specified | Source surfaces: 6 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Give integrators one typed capability registry that drives validation and producer-facing introspection so executable and advertised vocabularies cannot drift.

## 2. User Scenarios

1. Given a plugin registry, when an action is advertised to a producer, then the same schema validates that action at runtime.
2. Given an unregistered action, when validation runs, then it is rejected without host mutation.

## 3. Functional Requirements

- **FR-103** The SDK MUST expose an equivalent typed public contract for `validateCommand` at the capability boundary identified by this feature.  
   → SURF-104 → CTR-104 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-104** The SDK MUST expose an equivalent typed public contract for `validateCommands` at the capability boundary identified by this feature.  
   → SURF-105 → CTR-105 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-105** The SDK MUST expose an equivalent typed public contract for `COMMAND_SCHEMAS` at the capability boundary identified by this feature.  
   → SURF-106 → CTR-109 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-106** The SDK MUST expose an equivalent typed public contract for `CommandAction` at the capability boundary identified by this feature.  
   → SURF-107 → CTR-110 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-109** The SDK MUST expose an equivalent typed public contract for `CommandSchema` at the capability boundary identified by this feature.  
   → SURF-110 → CTR-113 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-111** The SDK MUST expose an equivalent typed public contract for `CommandValidationResult` at the capability boundary identified by this feature.  
   → SURF-112 → CTR-115 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0

## 4. Key Entities

ENT-003, ENT-006, ENT-009.

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-104 `validateCommand` | FR-103 | CTR-104 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-105 `validateCommands` | FR-104 | CTR-105 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-106 `COMMAND_SCHEMAS` | FR-105 | CTR-109 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-107 `CommandAction` | FR-106 | CTR-110 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-110 `CommandSchema` | FR-109 | CTR-113 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-112 `CommandValidationResult` | FR-111 | CTR-115 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-005 schema/introspection single source of truth.

## 10. Divergence Register

- **DIV-006** — Generate validation and introspection from one registry. Rationale: Eliminate parallel command catalogs that previously drifted.

## 11. Parity Tests

- **TEST-103** — exercise SURF-104 `validateCommand` against the recovered contract and assert trust-channel/state behavior.
- **TEST-104** — exercise SURF-105 `validateCommands` against the recovered contract and assert trust-channel/state behavior.
- **TEST-105** — exercise SURF-106 `COMMAND_SCHEMAS` against the recovered contract and assert trust-channel/state behavior.
- **TEST-106** — exercise SURF-107 `CommandAction` against the recovered contract and assert trust-channel/state behavior.
- **TEST-109** — exercise SURF-110 `CommandSchema` against the recovered contract and assert trust-channel/state behavior.
- **TEST-111** — exercise SURF-112 `CommandValidationResult` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.


---

<!-- SOURCE: specs/002-capability-registry-validation/plan.md -->

# Plan — FEAT-002 Capability Registry, Validation & Introspection

## Target

Package owner: `packages/registry`. Dependencies: FEAT-001.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: high. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/002-capability-registry-validation/data-model.md -->

# Data model — FEAT-002

Primary entities: ENT-003, ENT-006, ENT-009. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/002-capability-registry-validation/quickstart.md -->

# Quickstart — Capability Registry, Validation & Introspection

1. Register/enable the `packages/registry` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.


---

<!-- SOURCE: specs/002-capability-registry-validation/tasks.md -->

# Tasks — FEAT-002 Capability Registry, Validation & Introspection

- [ ] **T-002** Implement the feature in `packages/registry` and satisfy the complete requirement/test set below.

  - [ ] FR-103 / TEST-103 — SURF-104 `validateCommand`
  - [ ] FR-104 / TEST-104 — SURF-105 `validateCommands`
  - [ ] FR-105 / TEST-105 — SURF-106 `COMMAND_SCHEMAS`
  - [ ] FR-106 / TEST-106 — SURF-107 `CommandAction`
  - [ ] FR-109 / TEST-109 — SURF-110 `CommandSchema`
  - [ ] FR-111 / TEST-111 — SURF-112 `CommandValidationResult`


---

<!-- SOURCE: specs/003-effect-runtime/spec.md -->

# FEAT-003 · Effect Compilation, Resolution & Safe Execution
> Status: specified | Source surfaces: 10 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Turn validated producer commands into canonical effects, resolve semantic references, commit only authorized effects, and emit deterministic runtime outcomes.

## 2. User Scenarios

1. Given a validated command with semantic references, when execution runs, then references resolve before commit and only canonical effects reach the host.

## 3. Functional Requirements

- **FR-101** The SDK MUST expose an equivalent typed public contract for `canonicalizeCommandEntityRefs` at the capability boundary identified by this feature.  
   → SURF-102 → CTR-107 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-102** The SDK MUST expose an equivalent typed public contract for `executeStagehandCommand` at the capability boundary identified by this feature.  
   → SURF-103 → CTR-106 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-110** The SDK MUST expose an equivalent typed public contract for `CanonicalStagehandCommand` at the capability boundary identified by this feature.  
   → SURF-111 → CTR-114 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-112** The SDK MUST expose an equivalent typed public contract for `CanonicalizeCommandOptions` at the capability boundary identified by this feature.  
   → SURF-113 → CTR-116 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-113** The SDK MUST expose an equivalent typed public contract for `CanonicalizeCommandResult` at the capability boundary identified by this feature.  
   → SURF-114 → CTR-117 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-114** The SDK MUST expose an equivalent typed public contract for `EntityResolutionMode` at the capability boundary identified by this feature.  
   → SURF-115 → CTR-118 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-115** The SDK MUST expose an equivalent typed public contract for `ExecuteStagehandCommandOptions` at the capability boundary identified by this feature.  
   → SURF-116 → CTR-119 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-145** The runtime MUST represent `invalid_command` as a typed runtime event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-146 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts · P0
- **FR-146** The runtime MUST represent `unresolved_refs` as a typed runtime event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-147 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts · P0
- **FR-149** The runtime MUST represent `scene_command` as a typed runtime event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-150 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts · P0

## 4. Key Entities

ENT-001, ENT-006, ENT-009, ENT-010.

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-102 `canonicalizeCommandEntityRefs` | FR-101 | CTR-107 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-103 `executeStagehandCommand` | FR-102 | CTR-106 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-111 `CanonicalStagehandCommand` | FR-110 | CTR-114 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-113 `CanonicalizeCommandOptions` | FR-112 | CTR-116 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-114 `CanonicalizeCommandResult` | FR-113 | CTR-117 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-115 `EntityResolutionMode` | FR-114 | CTR-118 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-116 `ExecuteStagehandCommandOptions` | FR-115 | CTR-119 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-146 `invalid_command` | FR-145 | — | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts |
| SURF-147 `unresolved_refs` | FR-146 | — | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts |
| SURF-150 `scene_command` | FR-149 | — | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-001 no raw producer effect may bypass validation.
- NFR-004 zero concrete host dependencies in core.

## 10. Divergence Register

- **DIV-007** — Keep core host- and provider-independent. Rationale: Map, Three.js, chess, DOM, classroom, and model provider dependencies remain outside core packages.

## 11. Parity Tests

- **TEST-101** — exercise SURF-102 `canonicalizeCommandEntityRefs` against the recovered contract and assert trust-channel/state behavior.
- **TEST-102** — exercise SURF-103 `executeStagehandCommand` against the recovered contract and assert trust-channel/state behavior.
- **TEST-110** — exercise SURF-111 `CanonicalStagehandCommand` against the recovered contract and assert trust-channel/state behavior.
- **TEST-112** — exercise SURF-113 `CanonicalizeCommandOptions` against the recovered contract and assert trust-channel/state behavior.
- **TEST-113** — exercise SURF-114 `CanonicalizeCommandResult` against the recovered contract and assert trust-channel/state behavior.
- **TEST-114** — exercise SURF-115 `EntityResolutionMode` against the recovered contract and assert trust-channel/state behavior.
- **TEST-115** — exercise SURF-116 `ExecuteStagehandCommandOptions` against the recovered contract and assert trust-channel/state behavior.
- **TEST-145** — exercise SURF-146 `invalid_command` against the recovered contract and assert trust-channel/state behavior.
- **TEST-146** — exercise SURF-147 `unresolved_refs` against the recovered contract and assert trust-channel/state behavior.
- **TEST-149** — exercise SURF-150 `scene_command` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.


---

<!-- SOURCE: specs/003-effect-runtime/plan.md -->

# Plan — FEAT-003 Effect Compilation, Resolution & Safe Execution

## Target

Package owner: `packages/runtime`. Dependencies: FEAT-001, FEAT-002.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: high. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/003-effect-runtime/data-model.md -->

# Data model — FEAT-003

Primary entities: ENT-001, ENT-006, ENT-009, ENT-010. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/003-effect-runtime/quickstart.md -->

# Quickstart — Effect Compilation, Resolution & Safe Execution

1. Register/enable the `packages/runtime` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.


---

<!-- SOURCE: specs/003-effect-runtime/tasks.md -->

# Tasks — FEAT-003 Effect Compilation, Resolution & Safe Execution

- [ ] **T-003** Implement the feature in `packages/runtime` and satisfy the complete requirement/test set below.

  - [ ] FR-101 / TEST-101 — SURF-102 `canonicalizeCommandEntityRefs`
  - [ ] FR-102 / TEST-102 — SURF-103 `executeStagehandCommand`
  - [ ] FR-110 / TEST-110 — SURF-111 `CanonicalStagehandCommand`
  - [ ] FR-112 / TEST-112 — SURF-113 `CanonicalizeCommandOptions`
  - [ ] FR-113 / TEST-113 — SURF-114 `CanonicalizeCommandResult`
  - [ ] FR-114 / TEST-114 — SURF-115 `EntityResolutionMode`
  - [ ] FR-115 / TEST-115 — SURF-116 `ExecuteStagehandCommandOptions`
  - [ ] FR-145 / TEST-145 — SURF-146 `invalid_command`
  - [ ] FR-146 / TEST-146 — SURF-147 `unresolved_refs`
  - [ ] FR-149 / TEST-149 — SURF-150 `scene_command`


---

<!-- SOURCE: specs/004-trace-replay/spec.md -->

# FEAT-005 · Trace, Replay & Diagnostics
> Status: specified | Source surfaces: 16 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Expose separate public and production event channels and record versioned replay material without exposing private diagnostics as user-facing effects.

## 2. User Scenarios

1. Given one session, when effects run, then public events and production diagnostics remain separate and replay metadata is version stamped.

## 3. Functional Requirements

- **FR-116** The SDK MUST expose an equivalent typed public contract for `StagehandRuntimeEvent` at the capability boundary identified by this feature.  
   → SURF-117 → CTR-120 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-117** The runtime MUST represent `narration.started` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-118 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-118** The runtime MUST represent `narration.ended` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-119 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-119** The runtime MUST represent `narration.interrupted` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-120 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-120** The runtime MUST represent `caption` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-121 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-121** The runtime MUST represent `effect.committed` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-122 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-122** The runtime MUST represent `board.revision.committed` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-123 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-136** The runtime MUST represent `safe_failure` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-137 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-137** The runtime MUST represent `stream.chunk` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-138 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-138** The runtime MUST represent `segment.parsed` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-139 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-139** The runtime MUST represent `command.accepted` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-140 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-140** The runtime MUST represent `command.rejected` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-141 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-142** The runtime MUST represent `provider.request` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-143 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-143** The runtime MUST represent `provider.response` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-144 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-144** The runtime MUST represent `diagnostic` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-145 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-165** The SDK or owning compatibility plugin MUST read/write the `StagehandTrace` format with the recovered semantics: timestamped public and private event arrays.  
   → SURF-166 · [v] analysis/13_SURFACE_INVENTORY.md#surf-166 · P0

## 4. Key Entities

ENT-007.

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-117 `StagehandRuntimeEvent` | FR-116 | CTR-120 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-118 `narration.started` | FR-117 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-119 `narration.ended` | FR-118 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-120 `narration.interrupted` | FR-119 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-121 `caption` | FR-120 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-122 `effect.committed` | FR-121 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-123 `board.revision.committed` | FR-122 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-137 `safe_failure` | FR-136 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-138 `stream.chunk` | FR-137 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-139 `segment.parsed` | FR-138 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-140 `command.accepted` | FR-139 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-141 `command.rejected` | FR-140 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-143 `provider.request` | FR-142 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-144 `provider.response` | FR-143 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-145 `diagnostic` | FR-144 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-166 `StagehandTrace` | FR-165 | — | [v] analysis/13_SURFACE_INVENTORY.md#surf-166 |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-002 replay envelope is versioned and deterministic.

## 10. Divergence Register

- **DIV-005** — Version the trace envelope. Rationale: Add protocol, schema-set, plugin, adapter, and optional asset-manifest versions plus migrator registry.

## 11. Parity Tests

- **TEST-116** — exercise SURF-117 `StagehandRuntimeEvent` against the recovered contract and assert trust-channel/state behavior.
- **TEST-117** — exercise SURF-118 `narration.started` against the recovered contract and assert trust-channel/state behavior.
- **TEST-118** — exercise SURF-119 `narration.ended` against the recovered contract and assert trust-channel/state behavior.
- **TEST-119** — exercise SURF-120 `narration.interrupted` against the recovered contract and assert trust-channel/state behavior.
- **TEST-120** — exercise SURF-121 `caption` against the recovered contract and assert trust-channel/state behavior.
- **TEST-121** — exercise SURF-122 `effect.committed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-122** — exercise SURF-123 `board.revision.committed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-136** — exercise SURF-137 `safe_failure` against the recovered contract and assert trust-channel/state behavior.
- **TEST-137** — exercise SURF-138 `stream.chunk` against the recovered contract and assert trust-channel/state behavior.
- **TEST-138** — exercise SURF-139 `segment.parsed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-139** — exercise SURF-140 `command.accepted` against the recovered contract and assert trust-channel/state behavior.
- **TEST-140** — exercise SURF-141 `command.rejected` against the recovered contract and assert trust-channel/state behavior.
- **TEST-142** — exercise SURF-143 `provider.request` against the recovered contract and assert trust-channel/state behavior.
- **TEST-143** — exercise SURF-144 `provider.response` against the recovered contract and assert trust-channel/state behavior.
- **TEST-144** — exercise SURF-145 `diagnostic` against the recovered contract and assert trust-channel/state behavior.
- **TEST-165** — exercise SURF-166 `StagehandTrace` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- U-005 — trace migration/version compatibility must be finalized before 1.0.


---

<!-- SOURCE: specs/004-trace-replay/plan.md -->

# Plan — FEAT-005 Trace, Replay & Diagnostics

## Target

Package owner: `packages/trace`. Dependencies: FEAT-003.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: high. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/004-trace-replay/data-model.md -->

# Data model — FEAT-005

Primary entities: ENT-007. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/004-trace-replay/quickstart.md -->

# Quickstart — Trace, Replay & Diagnostics

1. Register/enable the `packages/trace` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.


---

<!-- SOURCE: specs/004-trace-replay/tasks.md -->

# Tasks — FEAT-005 Trace, Replay & Diagnostics

- [ ] **T-004** Implement the feature in `packages/trace` and satisfy the complete requirement/test set below.

  - [ ] FR-116 / TEST-116 — SURF-117 `StagehandRuntimeEvent`
  - [ ] FR-117 / TEST-117 — SURF-118 `narration.started`
  - [ ] FR-118 / TEST-118 — SURF-119 `narration.ended`
  - [ ] FR-119 / TEST-119 — SURF-120 `narration.interrupted`
  - [ ] FR-120 / TEST-120 — SURF-121 `caption`
  - [ ] FR-121 / TEST-121 — SURF-122 `effect.committed`
  - [ ] FR-122 / TEST-122 — SURF-123 `board.revision.committed`
  - [ ] FR-136 / TEST-136 — SURF-137 `safe_failure`
  - [ ] FR-137 / TEST-137 — SURF-138 `stream.chunk`
  - [ ] FR-138 / TEST-138 — SURF-139 `segment.parsed`
  - [ ] FR-139 / TEST-139 — SURF-140 `command.accepted`
  - [ ] FR-140 / TEST-140 — SURF-141 `command.rejected`
  - [ ] FR-142 / TEST-142 — SURF-143 `provider.request`
  - [ ] FR-143 / TEST-143 — SURF-144 `provider.response`
  - [ ] FR-144 / TEST-144 — SURF-145 `diagnostic`
  - [ ] FR-165 / TEST-165 — SURF-166 `StagehandTrace`


---

<!-- SOURCE: specs/005-readiness-sync/spec.md -->

# FEAT-006 · Readiness & Synchronization
> Status: specified | Source surfaces: 1 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Bound asynchronous effect settling with deadlines and cancellation generations so narration and choreography cannot deadlock or resume stale work.

## 2. User Scenarios

1. Given an effect that never settles, when a wait reaches its deadline, then control returns with a timeout/degraded result rather than deadlocking.

## 3. Functional Requirements

- **FR-141** The runtime MUST represent `gate.waited` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-142 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0

## 4. Key Entities

ENT-008.

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-142 `gate.waited` | FR-141 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-003 every readiness wait is deadline-bounded and generation-safe.

## 10. Divergence Register

- None beyond global constitution rules.

## 11. Parity Tests

- **TEST-141** — exercise SURF-142 `gate.waited` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.


---

<!-- SOURCE: specs/005-readiness-sync/plan.md -->

# Plan — FEAT-006 Readiness & Synchronization

## Target

Package owner: `packages/readiness`. Dependencies: FEAT-003, FEAT-005.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: high. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/005-readiness-sync/data-model.md -->

# Data model — FEAT-006

Primary entities: ENT-008. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/005-readiness-sync/quickstart.md -->

# Quickstart — Readiness & Synchronization

1. Register/enable the `packages/readiness` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.


---

<!-- SOURCE: specs/005-readiness-sync/tasks.md -->

# Tasks — FEAT-006 Readiness & Synchronization

- [ ] **T-005** Implement the feature in `packages/readiness` and satisfy the complete requirement/test set below.

  - [ ] FR-141 / TEST-141 — SURF-142 `gate.waited`


---

<!-- SOURCE: specs/006-compound-choreography/spec.md -->

# FEAT-004 · Compound Choreography & Beat IR
> Status: specified | Source surfaces: 5 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Let authors express atomic, ordered, parallel, and intent-bearing groups as a stable choreography IR rather than relying on accidental command adjacency.

## 2. User Scenarios

1. Given a nested sequence/parallel/batch/beat script, when parsed and validated, then group boundaries and atomicity remain explicit.

## 3. Functional Requirements

- **FR-028** The feature MUST accept and validate the `mark.clip` command and preserve its recovered behavior: Mark export moment.  
   → SURF-029 → CTR-029 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P0
- **FR-127** The runtime MUST represent `beat.started` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-128 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-128** The runtime MUST represent `beat.completed` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-129 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-163** The SDK or owning compatibility plugin MUST read/write the `Compound blocks` format with the recovered semantics: batch / sequence / parallel / beat plus closers.  
   → SURF-164 · [v] analysis/13_SURFACE_INVENTORY.md#surf-164 · P0
- **FR-164** The SDK or owning compatibility plugin MUST read/write the `Beat agent object` format with the recovered semantics: beat_id + narration + visual_intent + stagehand_sequence.steps.  
   → SURF-165 · [v] analysis/13_SURFACE_INVENTORY.md#surf-165 · P0

## 4. Key Entities

ENT-004, ENT-005.

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-029 `mark.clip` | FR-028 | CTR-029 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-128 `beat.started` | FR-127 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-129 `beat.completed` | FR-128 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-164 `Compound blocks` | FR-163 | — | [v] analysis/13_SURFACE_INVENTORY.md#surf-164 |
| SURF-165 `Beat agent object` | FR-164 | — | [v] analysis/13_SURFACE_INVENTORY.md#surf-165 |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-006 nested compound behavior is deterministic.

## 10. Divergence Register

- None beyond global constitution rules.

## 11. Parity Tests

- **TEST-028** — exercise SURF-029 `mark.clip` against the recovered contract and assert trust-channel/state behavior.
- **TEST-127** — exercise SURF-128 `beat.started` against the recovered contract and assert trust-channel/state behavior.
- **TEST-128** — exercise SURF-129 `beat.completed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-163** — exercise SURF-164 `Compound blocks` against the recovered contract and assert trust-channel/state behavior.
- **TEST-164** — exercise SURF-165 `Beat agent object` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.


---

<!-- SOURCE: specs/006-compound-choreography/plan.md -->

# Plan — FEAT-004 Compound Choreography & Beat IR

## Target

Package owner: `packages/core + packages/authoring`. Dependencies: FEAT-001, FEAT-002, FEAT-003.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: high. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/006-compound-choreography/data-model.md -->

# Data model — FEAT-004

Primary entities: ENT-004, ENT-005. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/006-compound-choreography/quickstart.md -->

# Quickstart — Compound Choreography & Beat IR

1. Register/enable the `packages/core + packages/authoring` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `mark.clip`.


---

<!-- SOURCE: specs/006-compound-choreography/tasks.md -->

# Tasks — FEAT-004 Compound Choreography & Beat IR

- [ ] **T-006** Implement the feature in `packages/core + packages/authoring` and satisfy the complete requirement/test set below.

  - [ ] FR-028 / TEST-028 — SURF-029 `mark.clip`
  - [ ] FR-127 / TEST-127 — SURF-128 `beat.started`
  - [ ] FR-128 / TEST-128 — SURF-129 `beat.completed`
  - [ ] FR-163 / TEST-163 — SURF-164 `Compound blocks`
  - [ ] FR-164 / TEST-164 — SURF-165 `Beat agent object`


---

<!-- SOURCE: specs/007-whiteboard/spec.md -->

# FEAT-012 · Shared Whiteboard Canvas
> Status: specified | Source surfaces: 21 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Provide a reusable screen-space explanatory canvas for text, math, lines, boxes, arrows, highlights, dots, shapes, counting, erasure, and reveal operations.

## 2. User Scenarios

1. Given an integrator enabling Shared Whiteboard Canvas, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-033** The feature MUST accept and validate the `whiteboard.show` command and preserve its recovered behavior: Show screen-space whiteboard.  
   → SURF-034 → CTR-034 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-034** The feature MUST accept and validate the `whiteboard.hide` command and preserve its recovered behavior: Hide whiteboard.  
   → SURF-035 → CTR-035 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-035** The feature MUST accept and validate the `whiteboard.clear` command and preserve its recovered behavior: Clear whiteboard.  
   → SURF-036 → CTR-036 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-036** The feature MUST accept and validate the `whiteboard.text` command and preserve its recovered behavior: Place freeform text.  
   → SURF-037 → CTR-037 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-037** The feature MUST accept and validate the `whiteboard.line` command and preserve its recovered behavior: Draw freeform line.  
   → SURF-038 → CTR-038 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-038** The feature MUST accept and validate the `whiteboard.box` command and preserve its recovered behavior: Draw box/panel.  
   → SURF-039 → CTR-039 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-056** The feature MUST accept and validate the `whiteboard.show` command and preserve its recovered behavior: Activate board/new page.  
   → SURF-057 → CTR-057 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-057** The feature MUST accept and validate the `whiteboard.hide` command and preserve its recovered behavior: Occlude/deactivate presentation without destroying content.  
   → SURF-058 → CTR-058 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-058** The feature MUST accept and validate the `whiteboard.clear` command and preserve its recovered behavior: Clear board layer/page content.  
   → SURF-059 → CTR-059 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-059** The feature MUST accept and validate the `whiteboard.text` command and preserve its recovered behavior: Commit exact text element.  
   → SURF-060 → CTR-060 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-060** The feature MUST accept and validate the `whiteboard.math` command and preserve its recovered behavior: Commit typeset equation.  
   → SURF-061 → CTR-061 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-061** The feature MUST accept and validate the `whiteboard.line` command and preserve its recovered behavior: Draw line.  
   → SURF-062 → CTR-062 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-062** The feature MUST accept and validate the `whiteboard.box` command and preserve its recovered behavior: Draw box.  
   → SURF-063 → CTR-063 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-063** The feature MUST accept and validate the `whiteboard.arrow` command and preserve its recovered behavior: Draw arrow.  
   → SURF-064 → CTR-064 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-064** The feature MUST accept and validate the `whiteboard.highlight` command and preserve its recovered behavior: Highlight board element/region.  
   → SURF-065 → CTR-065 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-065** The feature MUST accept and validate the `whiteboard.scribble` command and preserve its recovered behavior: Commit thinking-layer scribble.  
   → SURF-066 → CTR-066 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-066** The feature MUST accept and validate the `whiteboard.dots` command and preserve its recovered behavior: Draw countable dots/tokens.  
   → SURF-067 → CTR-067 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-067** The feature MUST accept and validate the `whiteboard.shape` command and preserve its recovered behavior: Draw named geometry.  
   → SURF-068 → CTR-068 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-068** The feature MUST accept and validate the `whiteboard.count` command and preserve its recovered behavior: Count properties/items.  
   → SURF-069 → CTR-069 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-069** The feature MUST accept and validate the `whiteboard.erase` command and preserve its recovered behavior: Erase target.  
   → SURF-070 → CTR-070 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-070** The feature MUST accept and validate the `whiteboard.reveal` command and preserve its recovered behavior: Reveal concealed target.  
   → SURF-071 → CTR-071 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-034 `whiteboard.show` | FR-033 | CTR-034 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-035 `whiteboard.hide` | FR-034 | CTR-035 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-036 `whiteboard.clear` | FR-035 | CTR-036 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-037 `whiteboard.text` | FR-036 | CTR-037 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-038 `whiteboard.line` | FR-037 | CTR-038 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-039 `whiteboard.box` | FR-038 | CTR-039 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-057 `whiteboard.show` | FR-056 | CTR-057 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-058 `whiteboard.hide` | FR-057 | CTR-058 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-059 `whiteboard.clear` | FR-058 | CTR-059 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-060 `whiteboard.text` | FR-059 | CTR-060 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-061 `whiteboard.math` | FR-060 | CTR-061 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-062 `whiteboard.line` | FR-061 | CTR-062 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-063 `whiteboard.box` | FR-062 | CTR-063 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-064 `whiteboard.arrow` | FR-063 | CTR-064 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-065 `whiteboard.highlight` | FR-064 | CTR-065 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-066 `whiteboard.scribble` | FR-065 | CTR-066 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-067 `whiteboard.dots` | FR-066 | CTR-067 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-068 `whiteboard.shape` | FR-067 | CTR-068 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-069 `whiteboard.count` | FR-068 | CTR-069 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-070 `whiteboard.erase` | FR-069 | CTR-070 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-071 `whiteboard.reveal` | FR-070 | CTR-071 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- None beyond global constitution rules.

## 11. Parity Tests

- **TEST-033** — exercise SURF-034 `whiteboard.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-034** — exercise SURF-035 `whiteboard.hide` against the recovered contract and assert trust-channel/state behavior.
- **TEST-035** — exercise SURF-036 `whiteboard.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-036** — exercise SURF-037 `whiteboard.text` against the recovered contract and assert trust-channel/state behavior.
- **TEST-037** — exercise SURF-038 `whiteboard.line` against the recovered contract and assert trust-channel/state behavior.
- **TEST-038** — exercise SURF-039 `whiteboard.box` against the recovered contract and assert trust-channel/state behavior.
- **TEST-056** — exercise SURF-057 `whiteboard.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-057** — exercise SURF-058 `whiteboard.hide` against the recovered contract and assert trust-channel/state behavior.
- **TEST-058** — exercise SURF-059 `whiteboard.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-059** — exercise SURF-060 `whiteboard.text` against the recovered contract and assert trust-channel/state behavior.
- **TEST-060** — exercise SURF-061 `whiteboard.math` against the recovered contract and assert trust-channel/state behavior.
- **TEST-061** — exercise SURF-062 `whiteboard.line` against the recovered contract and assert trust-channel/state behavior.
- **TEST-062** — exercise SURF-063 `whiteboard.box` against the recovered contract and assert trust-channel/state behavior.
- **TEST-063** — exercise SURF-064 `whiteboard.arrow` against the recovered contract and assert trust-channel/state behavior.
- **TEST-064** — exercise SURF-065 `whiteboard.highlight` against the recovered contract and assert trust-channel/state behavior.
- **TEST-065** — exercise SURF-066 `whiteboard.scribble` against the recovered contract and assert trust-channel/state behavior.
- **TEST-066** — exercise SURF-067 `whiteboard.dots` against the recovered contract and assert trust-channel/state behavior.
- **TEST-067** — exercise SURF-068 `whiteboard.shape` against the recovered contract and assert trust-channel/state behavior.
- **TEST-068** — exercise SURF-069 `whiteboard.count` against the recovered contract and assert trust-channel/state behavior.
- **TEST-069** — exercise SURF-070 `whiteboard.erase` against the recovered contract and assert trust-channel/state behavior.
- **TEST-070** — exercise SURF-071 `whiteboard.reveal` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.


---

<!-- SOURCE: specs/007-whiteboard/plan.md -->

# Plan — FEAT-012 Shared Whiteboard Canvas

## Target

Package owner: `plugins/whiteboard`. Dependencies: FEAT-002, FEAT-003.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: medium. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/007-whiteboard/data-model.md -->

# Data model — FEAT-012

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/007-whiteboard/quickstart.md -->

# Quickstart — Shared Whiteboard Canvas

1. Register/enable the `plugins/whiteboard` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `whiteboard.show`, `whiteboard.hide`, `whiteboard.clear`, `whiteboard.text`, `whiteboard.line`, `whiteboard.box`, `whiteboard.show`, `whiteboard.hide` ….


---

<!-- SOURCE: specs/007-whiteboard/tasks.md -->

# Tasks — FEAT-012 Shared Whiteboard Canvas

- [ ] **T-007** Implement the feature in `plugins/whiteboard` and satisfy the complete requirement/test set below.

  - [ ] FR-033 / TEST-033 — SURF-034 `whiteboard.show`
  - [ ] FR-034 / TEST-034 — SURF-035 `whiteboard.hide`
  - [ ] FR-035 / TEST-035 — SURF-036 `whiteboard.clear`
  - [ ] FR-036 / TEST-036 — SURF-037 `whiteboard.text`
  - [ ] FR-037 / TEST-037 — SURF-038 `whiteboard.line`
  - [ ] FR-038 / TEST-038 — SURF-039 `whiteboard.box`
  - [ ] FR-056 / TEST-056 — SURF-057 `whiteboard.show`
  - [ ] FR-057 / TEST-057 — SURF-058 `whiteboard.hide`
  - [ ] FR-058 / TEST-058 — SURF-059 `whiteboard.clear`
  - [ ] FR-059 / TEST-059 — SURF-060 `whiteboard.text`
  - [ ] FR-060 / TEST-060 — SURF-061 `whiteboard.math`
  - [ ] FR-061 / TEST-061 — SURF-062 `whiteboard.line`
  - [ ] FR-062 / TEST-062 — SURF-063 `whiteboard.box`
  - [ ] FR-063 / TEST-063 — SURF-064 `whiteboard.arrow`
  - [ ] FR-064 / TEST-064 — SURF-065 `whiteboard.highlight`
  - [ ] FR-065 / TEST-065 — SURF-066 `whiteboard.scribble`
  - [ ] FR-066 / TEST-066 — SURF-067 `whiteboard.dots`
  - [ ] FR-067 / TEST-067 — SURF-068 `whiteboard.shape`
  - [ ] FR-068 / TEST-068 — SURF-069 `whiteboard.count`
  - [ ] FR-069 / TEST-069 — SURF-070 `whiteboard.erase`
  - [ ] FR-070 / TEST-070 — SURF-071 `whiteboard.reveal`


---

<!-- SOURCE: specs/008-geo-camera/spec.md -->

# FEAT-007 · Geospatial Camera & View Framing
> Status: specified | Source surfaces: 8 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Let a geospatial host establish, focus, fit, and follow meaningful views using semantic targets rather than renderer-specific pointers.

## 2. User Scenarios

1. Given an integrator enabling Geospatial Camera & View Framing, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-005** The feature MUST accept and validate the `map.view` command and preserve its recovered behavior: Set camera coordinate/zoom.  
   → SURF-005 → CTR-005 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-006** The feature MUST accept and validate the `map.focus` command and preserve its recovered behavior: Focus camera on one registered entity.  
   → SURF-006 → CTR-006 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-007** The feature MUST accept and validate the `map.fit` command and preserve its recovered behavior: Frame multiple entities or explicit bounds.  
   → SURF-007 → CTR-007 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-008** The feature MUST accept and validate the `map.mode` command and preserve its recovered behavior: Switch rhetorical map mode.  
   → SURF-008 → CTR-008 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-039** The feature MUST accept and validate the `camera.center` command and preserve its recovered behavior: Semantic camera centering primitive (v2).  
   → SURF-040 → CTR-040 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-040** The feature MUST accept and validate the `camera.focus_region` command and preserve its recovered behavior: Semantic region framing primitive (v2).  
   → SURF-041 → CTR-041 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-041** The feature MUST accept and validate the `camera.establish_globe` command and preserve its recovered behavior: Globe-scale establishing camera (v2).  
   → SURF-042 → CTR-042 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-046** The feature MUST accept and validate the `camera.follow_marker` command and preserve its recovered behavior: Set/clear chase-camera policy.  
   → SURF-047 → CTR-047 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-005 `map.view` | FR-005 | CTR-005 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-006 `map.focus` | FR-006 | CTR-006 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-007 `map.fit` | FR-007 | CTR-007 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-008 `map.mode` | FR-008 | CTR-008 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-040 `camera.center` | FR-039 | CTR-040 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-041 `camera.focus_region` | FR-040 | CTR-041 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-042 `camera.establish_globe` | FR-041 | CTR-042 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-047 `camera.follow_marker` | FR-046 | CTR-047 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- None beyond global constitution rules.

## 11. Parity Tests

- **TEST-005** — exercise SURF-005 `map.view` against the recovered contract and assert trust-channel/state behavior.
- **TEST-006** — exercise SURF-006 `map.focus` against the recovered contract and assert trust-channel/state behavior.
- **TEST-007** — exercise SURF-007 `map.fit` against the recovered contract and assert trust-channel/state behavior.
- **TEST-008** — exercise SURF-008 `map.mode` against the recovered contract and assert trust-channel/state behavior.
- **TEST-039** — exercise SURF-040 `camera.center` against the recovered contract and assert trust-channel/state behavior.
- **TEST-040** — exercise SURF-041 `camera.focus_region` against the recovered contract and assert trust-channel/state behavior.
- **TEST-041** — exercise SURF-042 `camera.establish_globe` against the recovered contract and assert trust-channel/state behavior.
- **TEST-046** — exercise SURF-047 `camera.follow_marker` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.


---

<!-- SOURCE: specs/008-geo-camera/plan.md -->

# Plan — FEAT-007 Geospatial Camera & View Framing

## Target

Package owner: `plugins/geo-clio`. Dependencies: FEAT-002, FEAT-003.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: medium. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/008-geo-camera/data-model.md -->

# Data model — FEAT-007

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/008-geo-camera/quickstart.md -->

# Quickstart — Geospatial Camera & View Framing

1. Register/enable the `plugins/geo-clio` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `map.view`, `map.focus`, `map.fit`, `map.mode`, `camera.center`, `camera.focus_region`, `camera.establish_globe`, `camera.follow_marker`.


---

<!-- SOURCE: specs/008-geo-camera/tasks.md -->

# Tasks — FEAT-007 Geospatial Camera & View Framing

- [ ] **T-008** Implement the feature in `plugins/geo-clio` and satisfy the complete requirement/test set below.

  - [ ] FR-005 / TEST-005 — SURF-005 `map.view`
  - [ ] FR-006 / TEST-006 — SURF-006 `map.focus`
  - [ ] FR-007 / TEST-007 — SURF-007 `map.fit`
  - [ ] FR-008 / TEST-008 — SURF-008 `map.mode`
  - [ ] FR-039 / TEST-039 — SURF-040 `camera.center`
  - [ ] FR-040 / TEST-040 — SURF-041 `camera.focus_region`
  - [ ] FR-041 / TEST-041 — SURF-042 `camera.establish_globe`
  - [ ] FR-046 / TEST-046 — SURF-047 `camera.follow_marker`


---

<!-- SOURCE: specs/009-geo-annotation/spec.md -->

# FEAT-008 · Geospatial Highlighting & Annotation
> Status: specified | Source surfaces: 11 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Annotate map entities and relationships with highlights, spotlights, labels, circles, lines, arrows, and semantic routes.

## 2. User Scenarios

1. Given an integrator enabling Geospatial Highlighting & Annotation, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-009** The feature MUST accept and validate the `map.highlight` command and preserve its recovered behavior: Highlight an entity.  
   → SURF-009 → CTR-009 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-010** The feature MUST accept and validate the `map.spotlight` command and preserve its recovered behavior: Dim scene except target aperture.  
   → SURF-010 → CTR-010 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-011** The feature MUST accept and validate the `map.label` command and preserve its recovered behavior: Attach/update an entity label.  
   → SURF-011 → CTR-011 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-012** The feature MUST accept and validate the `map.clear` command and preserve its recovered behavior: Clear classes of transient map state.  
   → SURF-012 → CTR-012 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-013** The feature MUST accept and validate the `map.arrow` command and preserve its recovered behavior: Great-circle directed connector.  
   → SURF-013 → CTR-013 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-014** The feature MUST accept and validate the `map.circle` command and preserve its recovered behavior: Ring an entity.  
   → SURF-014 → CTR-014 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-015** The feature MUST accept and validate the `map.line` command and preserve its recovered behavior: Great-circle undirected connector.  
   → SURF-015 → CTR-015 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-042** The feature MUST accept and validate the `highlight.region` command and preserve its recovered behavior: Semantic region highlight (v2).  
   → SURF-043 → CTR-043 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-043** The feature MUST accept and validate the `highlight.location` command and preserve its recovered behavior: Semantic point highlight (v2).  
   → SURF-044 → CTR-044 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-044** The feature MUST accept and validate the `label.show` command and preserve its recovered behavior: Semantic label primitive (v2).  
   → SURF-045 → CTR-045 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-045** The feature MUST accept and validate the `route.draw` command and preserve its recovered behavior: Semantic route primitive (v2).  
   → SURF-046 → CTR-046 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-009 `map.highlight` | FR-009 | CTR-009 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-010 `map.spotlight` | FR-010 | CTR-010 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-011 `map.label` | FR-011 | CTR-011 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-012 `map.clear` | FR-012 | CTR-012 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-013 `map.arrow` | FR-013 | CTR-013 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-014 `map.circle` | FR-014 | CTR-014 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-015 `map.line` | FR-015 | CTR-015 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-043 `highlight.region` | FR-042 | CTR-043 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-044 `highlight.location` | FR-043 | CTR-044 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-045 `label.show` | FR-044 | CTR-045 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-046 `route.draw` | FR-045 | CTR-046 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- None beyond global constitution rules.

## 11. Parity Tests

- **TEST-009** — exercise SURF-009 `map.highlight` against the recovered contract and assert trust-channel/state behavior.
- **TEST-010** — exercise SURF-010 `map.spotlight` against the recovered contract and assert trust-channel/state behavior.
- **TEST-011** — exercise SURF-011 `map.label` against the recovered contract and assert trust-channel/state behavior.
- **TEST-012** — exercise SURF-012 `map.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-013** — exercise SURF-013 `map.arrow` against the recovered contract and assert trust-channel/state behavior.
- **TEST-014** — exercise SURF-014 `map.circle` against the recovered contract and assert trust-channel/state behavior.
- **TEST-015** — exercise SURF-015 `map.line` against the recovered contract and assert trust-channel/state behavior.
- **TEST-042** — exercise SURF-043 `highlight.region` against the recovered contract and assert trust-channel/state behavior.
- **TEST-043** — exercise SURF-044 `highlight.location` against the recovered contract and assert trust-channel/state behavior.
- **TEST-044** — exercise SURF-045 `label.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-045** — exercise SURF-046 `route.draw` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.


---

<!-- SOURCE: specs/009-geo-annotation/plan.md -->

# Plan — FEAT-008 Geospatial Highlighting & Annotation

## Target

Package owner: `plugins/geo-clio`. Dependencies: FEAT-007.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: medium. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/009-geo-annotation/data-model.md -->

# Data model — FEAT-008

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/009-geo-annotation/quickstart.md -->

# Quickstart — Geospatial Highlighting & Annotation

1. Register/enable the `plugins/geo-clio` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `map.highlight`, `map.spotlight`, `map.label`, `map.clear`, `map.arrow`, `map.circle`, `map.line`, `highlight.region` ….


---

<!-- SOURCE: specs/009-geo-annotation/tasks.md -->

# Tasks — FEAT-008 Geospatial Highlighting & Annotation

- [ ] **T-009** Implement the feature in `plugins/geo-clio` and satisfy the complete requirement/test set below.

  - [ ] FR-009 / TEST-009 — SURF-009 `map.highlight`
  - [ ] FR-010 / TEST-010 — SURF-010 `map.spotlight`
  - [ ] FR-011 / TEST-011 — SURF-011 `map.label`
  - [ ] FR-012 / TEST-012 — SURF-012 `map.clear`
  - [ ] FR-013 / TEST-013 — SURF-013 `map.arrow`
  - [ ] FR-014 / TEST-014 — SURF-014 `map.circle`
  - [ ] FR-015 / TEST-015 — SURF-015 `map.line`
  - [ ] FR-042 / TEST-042 — SURF-043 `highlight.region`
  - [ ] FR-043 / TEST-043 — SURF-044 `highlight.location`
  - [ ] FR-044 / TEST-044 — SURF-045 `label.show`
  - [ ] FR-045 / TEST-045 — SURF-046 `route.draw`


---

<!-- SOURCE: specs/010-geo-layers-overlays/spec.md -->

# FEAT-009 · Geospatial Layers, Flows & Temporal Overlays
> Status: specified | Source surfaces: 8 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Control thematic layers, animated flows, basemaps, overlays, and time-varying map state through explicit plugin contracts.

## 2. User Scenarios

1. Given an integrator enabling Geospatial Layers, Flows & Temporal Overlays, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-016** The feature MUST accept and validate the `layer.on` command and preserve its recovered behavior: Enable a named thematic layer.  
   → SURF-016 → CTR-016 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-017** The feature MUST accept and validate the `layer.off` command and preserve its recovered behavior: Disable a named thematic layer.  
   → SURF-017 → CTR-017 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-018** The feature MUST accept and validate the `flow.animate` command and preserve its recovered behavior: Animate a route/flow.  
   → SURF-018 → CTR-018 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-019** The feature MUST accept and validate the `flow.clear` command and preserve its recovered behavior: Clear active flows.  
   → SURF-019 → CTR-019 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-047** The feature MUST accept and validate the `map.overlay.show` command and preserve its recovered behavior: Activate registered map overlay.  
   → SURF-048 → CTR-048 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-048** The feature MUST accept and validate the `map.overlay.hide` command and preserve its recovered behavior: Hide one/all overlays.  
   → SURF-049 → CTR-049 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-049** The feature MUST accept and validate the `map.basemap` command and preserve its recovered behavior: Switch named/registered basemap.  
   → SURF-050 → CTR-050 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-050** The feature MUST accept and validate the `map.timecursor` command and preserve its recovered behavior: Set overlay time cursor.  
   → SURF-051 → CTR-051 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-016 `layer.on` | FR-016 | CTR-016 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-017 `layer.off` | FR-017 | CTR-017 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-018 `flow.animate` | FR-018 | CTR-018 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-019 `flow.clear` | FR-019 | CTR-019 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-048 `map.overlay.show` | FR-047 | CTR-048 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-049 `map.overlay.hide` | FR-048 | CTR-049 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-050 `map.basemap` | FR-049 | CTR-050 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-051 `map.timecursor` | FR-050 | CTR-051 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- **DIV-002** — Make `map.timecursor` unambiguous. Rationale: Use an explicit live-vs-at representation; omitted/empty timestamp ambiguity is forbidden.

## 11. Parity Tests

- **TEST-016** — exercise SURF-016 `layer.on` against the recovered contract and assert trust-channel/state behavior.
- **TEST-017** — exercise SURF-017 `layer.off` against the recovered contract and assert trust-channel/state behavior.
- **TEST-018** — exercise SURF-018 `flow.animate` against the recovered contract and assert trust-channel/state behavior.
- **TEST-019** — exercise SURF-019 `flow.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-047** — exercise SURF-048 `map.overlay.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-048** — exercise SURF-049 `map.overlay.hide` against the recovered contract and assert trust-channel/state behavior.
- **TEST-049** — exercise SURF-050 `map.basemap` against the recovered contract and assert trust-channel/state behavior.
- **TEST-050** — exercise SURF-051 `map.timecursor` against the recovered contract and assert trust-channel/state behavior. Expected divergence: DIV-002.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.


---

<!-- SOURCE: specs/010-geo-layers-overlays/plan.md -->

# Plan — FEAT-009 Geospatial Layers, Flows & Temporal Overlays

## Target

Package owner: `plugins/geo-clio`. Dependencies: FEAT-007, FEAT-008.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: high. Preservation posture: yes-with-divergence. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/010-geo-layers-overlays/data-model.md -->

# Data model — FEAT-009

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/010-geo-layers-overlays/quickstart.md -->

# Quickstart — Geospatial Layers, Flows & Temporal Overlays

1. Register/enable the `plugins/geo-clio` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `layer.on`, `layer.off`, `flow.animate`, `flow.clear`, `map.overlay.show`, `map.overlay.hide`, `map.basemap`, `map.timecursor`.


---

<!-- SOURCE: specs/010-geo-layers-overlays/tasks.md -->

# Tasks — FEAT-009 Geospatial Layers, Flows & Temporal Overlays

- [ ] **T-010** Implement the feature in `plugins/geo-clio` and satisfy the complete requirement/test set below.

  - [ ] FR-016 / TEST-016 — SURF-016 `layer.on`
  - [ ] FR-017 / TEST-017 — SURF-017 `layer.off`
  - [ ] FR-018 / TEST-018 — SURF-018 `flow.animate`
  - [ ] FR-019 / TEST-019 — SURF-019 `flow.clear`
  - [ ] FR-047 / TEST-047 — SURF-048 `map.overlay.show`
  - [ ] FR-048 / TEST-048 — SURF-049 `map.overlay.hide`
  - [ ] FR-049 / TEST-049 — SURF-050 `map.basemap`
  - [ ] FR-050 / TEST-050 — SURF-051 `map.timecursor`


---

<!-- SOURCE: specs/011-geo-pieces-registry/spec.md -->

# FEAT-010 · World Pieces & Controlled Registry Proposals
> Status: specified | Source surfaces: 8 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Manipulate world-surface pieces and permit controlled semantic-entity proposals without allowing arbitrary model-authored host pointers.

## 2. User Scenarios

1. Given an integrator enabling World Pieces & Controlled Registry Proposals, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-020** The feature MUST accept and validate the `piece.place` command and preserve its recovered behavior: Place/update globe-anchored simulation piece.  
   → SURF-020 → CTR-020 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-021** The feature MUST accept and validate the `piece.move` command and preserve its recovered behavior: Move/restyle a piece.  
   → SURF-021 → CTR-021 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-022** The feature MUST accept and validate the `piece.remove` command and preserve its recovered behavior: Remove one piece.  
   → SURF-022 → CTR-022 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-023** The feature MUST accept and validate the `piece.clear` command and preserve its recovered behavior: Clear pieces.  
   → SURF-023 → CTR-023 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-027** The feature MUST accept and validate the `entity.propose` command and preserve its recovered behavior: Propose a new registry entity.  
   → SURF-028 → CTR-028 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-100** The SDK MUST expose an equivalent typed public contract for `applyEntityProposeCommand` at the capability boundary identified by this feature.  
   → SURF-101 → CTR-108 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P1
- **FR-147** The runtime MUST represent `entity_proposed` as a typed runtime event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-148 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts · P1
- **FR-148** The runtime MUST represent `proposal_rejected` as a typed runtime event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-149 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-020 `piece.place` | FR-020 | CTR-020 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-021 `piece.move` | FR-021 | CTR-021 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-022 `piece.remove` | FR-022 | CTR-022 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-023 `piece.clear` | FR-023 | CTR-023 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-028 `entity.propose` | FR-027 | CTR-028 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-101 `applyEntityProposeCommand` | FR-100 | CTR-108 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-148 `entity_proposed` | FR-147 | — | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts |
| SURF-149 `proposal_rejected` | FR-148 | — | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- None beyond global constitution rules.

## 11. Parity Tests

- **TEST-020** — exercise SURF-020 `piece.place` against the recovered contract and assert trust-channel/state behavior.
- **TEST-021** — exercise SURF-021 `piece.move` against the recovered contract and assert trust-channel/state behavior.
- **TEST-022** — exercise SURF-022 `piece.remove` against the recovered contract and assert trust-channel/state behavior.
- **TEST-023** — exercise SURF-023 `piece.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-027** — exercise SURF-028 `entity.propose` against the recovered contract and assert trust-channel/state behavior.
- **TEST-100** — exercise SURF-101 `applyEntityProposeCommand` against the recovered contract and assert trust-channel/state behavior.
- **TEST-147** — exercise SURF-148 `entity_proposed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-148** — exercise SURF-149 `proposal_rejected` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.


---

<!-- SOURCE: specs/011-geo-pieces-registry/plan.md -->

# Plan — FEAT-010 World Pieces & Controlled Registry Proposals

## Target

Package owner: `plugins/geo-clio`. Dependencies: FEAT-002, FEAT-003, FEAT-007.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: high. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/011-geo-pieces-registry/data-model.md -->

# Data model — FEAT-010

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/011-geo-pieces-registry/quickstart.md -->

# Quickstart — World Pieces & Controlled Registry Proposals

1. Register/enable the `plugins/geo-clio` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `piece.place`, `piece.move`, `piece.remove`, `piece.clear`, `entity.propose`.


---

<!-- SOURCE: specs/011-geo-pieces-registry/tasks.md -->

# Tasks — FEAT-010 World Pieces & Controlled Registry Proposals

- [ ] **T-011** Implement the feature in `plugins/geo-clio` and satisfy the complete requirement/test set below.

  - [ ] FR-020 / TEST-020 — SURF-020 `piece.place`
  - [ ] FR-021 / TEST-021 — SURF-021 `piece.move`
  - [ ] FR-022 / TEST-022 — SURF-022 `piece.remove`
  - [ ] FR-023 / TEST-023 — SURF-023 `piece.clear`
  - [ ] FR-027 / TEST-027 — SURF-028 `entity.propose`
  - [ ] FR-100 / TEST-100 — SURF-101 `applyEntityProposeCommand`
  - [ ] FR-147 / TEST-147 — SURF-148 `entity_proposed`
  - [ ] FR-148 / TEST-148 — SURF-149 `proposal_rejected`


---

<!-- SOURCE: specs/012-evidence-presentation/spec.md -->

# FEAT-011 · Evidence, Sources & Scene Presentation
> Status: specified | Source surfaces: 7 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Coordinate source-backed narration, scene transitions, titles, and non-geographic evidence overlays while keeping provenance visible.

## 2. User Scenarios

1. Given an integrator enabling Evidence, Sources & Scene Presentation, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-024** The feature MUST accept and validate the `chat.say` command and preserve its recovered behavior: Open a source-backed narration attribution scope.  
   → SURF-024 → CTR-024 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-025** The feature MUST accept and validate the `source.show` command and preserve its recovered behavior: Display a source receipt.  
   → SURF-025 → CTR-025 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-026** The feature MUST accept and validate the `source.hide` command and preserve its recovered behavior: Hide source receipts.  
   → SURF-026 → CTR-026 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-029** The feature MUST accept and validate the `scene.fade` command and preserve its recovered behavior: Apply broadcast fade overlay.  
   → SURF-030 → CTR-030 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-030** The feature MUST accept and validate the `scene.title` command and preserve its recovered behavior: Show/clear title/chapter card.  
   → SURF-031 → CTR-031 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-031** The feature MUST accept and validate the `asset.show` command and preserve its recovered behavior: Display registered/inline evidence asset.  
   → SURF-032 → CTR-032 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-032** The feature MUST accept and validate the `asset.clear` command and preserve its recovered behavior: Clear evidence assets.  
   → SURF-033 → CTR-033 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-024 `chat.say` | FR-024 | CTR-024 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-025 `source.show` | FR-025 | CTR-025 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-026 `source.hide` | FR-026 | CTR-026 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-030 `scene.fade` | FR-029 | CTR-030 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-031 `scene.title` | FR-030 | CTR-031 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-032 `asset.show` | FR-031 | CTR-032 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-033 `asset.clear` | FR-032 | CTR-033 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- **DIV-001** — Remove orphan `claim.show` from canonical registry. Rationale: A declared-but-unexecutable action is not a contract; plugins may reintroduce it only with a complete schema.

## 11. Parity Tests

- **TEST-024** — exercise SURF-024 `chat.say` against the recovered contract and assert trust-channel/state behavior.
- **TEST-025** — exercise SURF-025 `source.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-026** — exercise SURF-026 `source.hide` against the recovered contract and assert trust-channel/state behavior.
- **TEST-029** — exercise SURF-030 `scene.fade` against the recovered contract and assert trust-channel/state behavior.
- **TEST-030** — exercise SURF-031 `scene.title` against the recovered contract and assert trust-channel/state behavior.
- **TEST-031** — exercise SURF-032 `asset.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-032** — exercise SURF-033 `asset.clear` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- U-012 — exact Clio host export/show entrypoint is host-adapter work, not core blocker.


---

<!-- SOURCE: specs/012-evidence-presentation/plan.md -->

# Plan — FEAT-011 Evidence, Sources & Scene Presentation

## Target

Package owner: `plugins/geo-clio + packages/authoring`. Dependencies: FEAT-003, FEAT-005.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: medium. Preservation posture: yes-with-dead-command-removed. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/012-evidence-presentation/data-model.md -->

# Data model — FEAT-011

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/012-evidence-presentation/quickstart.md -->

# Quickstart — Evidence, Sources & Scene Presentation

1. Register/enable the `plugins/geo-clio + packages/authoring` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `chat.say`, `source.show`, `source.hide`, `scene.fade`, `scene.title`, `asset.show`, `asset.clear`.


---

<!-- SOURCE: specs/012-evidence-presentation/tasks.md -->

# Tasks — FEAT-011 Evidence, Sources & Scene Presentation

- [ ] **T-012** Implement the feature in `plugins/geo-clio + packages/authoring` and satisfy the complete requirement/test set below.

  - [ ] FR-024 / TEST-024 — SURF-024 `chat.say`
  - [ ] FR-025 / TEST-025 — SURF-025 `source.show`
  - [ ] FR-026 / TEST-026 — SURF-026 `source.hide`
  - [ ] FR-029 / TEST-029 — SURF-030 `scene.fade`
  - [ ] FR-030 / TEST-030 — SURF-031 `scene.title`
  - [ ] FR-031 / TEST-031 — SURF-032 `asset.show`
  - [ ] FR-032 / TEST-032 — SURF-033 `asset.clear`


---

<!-- SOURCE: specs/013-classroom-staging/spec.md -->

# FEAT-013 · Classroom Avatar, Room & Camera Staging
> Status: specified | Source surfaces: 10 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Stage embodied teaching with avatar movement, gaze, gesture, expression, room mode, lighting, and camera focus while exposing readiness-relevant state.

## 2. User Scenarios

1. Given an integrator enabling Classroom Avatar, Room & Camera Staging, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-051** The feature MUST accept and validate the `avatar.move` command and preserve its recovered behavior: Move teacher to semantic anchor.  
   → SURF-052 → CTR-052 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-052** The feature MUST accept and validate the `avatar.look` command and preserve its recovered behavior: Aim teacher gaze.  
   → SURF-053 → CTR-053 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-053** The feature MUST accept and validate the `avatar.gesture` command and preserve its recovered behavior: Play semantic teaching gesture.  
   → SURF-054 → CTR-054 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-054** The feature MUST accept and validate the `avatar.point` command and preserve its recovered behavior: Point at committed board element.  
   → SURF-055 → CTR-055 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-055** The feature MUST accept and validate the `avatar.face` command and preserve its recovered behavior: Set facial expression.  
   → SURF-056 → CTR-056 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-078** The feature MUST accept and validate the `room.lights` command and preserve its recovered behavior: Change lighting zone/state.  
   → SURF-079 → CTR-079 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-079** The feature MUST accept and validate the `room.mode` command and preserve its recovered behavior: Set semantic classroom mode.  
   → SURF-080 → CTR-080 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-080** The feature MUST accept and validate the `camera.focus` command and preserve its recovered behavior: Focus student camera.  
   → SURF-081 → CTR-081 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-123** The runtime MUST represent `avatar.anchor.reached` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-124 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P1
- **FR-135** The runtime MUST represent `room.mode` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-136 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-052 `avatar.move` | FR-051 | CTR-052 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-053 `avatar.look` | FR-052 | CTR-053 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-054 `avatar.gesture` | FR-053 | CTR-054 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-055 `avatar.point` | FR-054 | CTR-055 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-056 `avatar.face` | FR-055 | CTR-056 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-079 `room.lights` | FR-078 | CTR-079 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-080 `room.mode` | FR-079 | CTR-080 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-081 `camera.focus` | FR-080 | CTR-081 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-124 `avatar.anchor.reached` | FR-123 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-136 `room.mode` | FR-135 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- None beyond global constitution rules.

## 11. Parity Tests

- **TEST-051** — exercise SURF-052 `avatar.move` against the recovered contract and assert trust-channel/state behavior.
- **TEST-052** — exercise SURF-053 `avatar.look` against the recovered contract and assert trust-channel/state behavior.
- **TEST-053** — exercise SURF-054 `avatar.gesture` against the recovered contract and assert trust-channel/state behavior.
- **TEST-054** — exercise SURF-055 `avatar.point` against the recovered contract and assert trust-channel/state behavior.
- **TEST-055** — exercise SURF-056 `avatar.face` against the recovered contract and assert trust-channel/state behavior.
- **TEST-078** — exercise SURF-079 `room.lights` against the recovered contract and assert trust-channel/state behavior.
- **TEST-079** — exercise SURF-080 `room.mode` against the recovered contract and assert trust-channel/state behavior.
- **TEST-080** — exercise SURF-081 `camera.focus` against the recovered contract and assert trust-channel/state behavior.
- **TEST-123** — exercise SURF-124 `avatar.anchor.reached` against the recovered contract and assert trust-channel/state behavior.
- **TEST-135** — exercise SURF-136 `room.mode` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- U-003 — Virtual Classroom source license/provenance must be resolved before public extraction/reuse.


---

<!-- SOURCE: specs/013-classroom-staging/plan.md -->

# Plan — FEAT-013 Classroom Avatar, Room & Camera Staging

## Target

Package owner: `plugins/classroom`. Dependencies: FEAT-003, FEAT-005, FEAT-006.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: high. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/013-classroom-staging/data-model.md -->

# Data model — FEAT-013

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/013-classroom-staging/quickstart.md -->

# Quickstart — Classroom Avatar, Room & Camera Staging

1. Register/enable the `plugins/classroom` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `avatar.move`, `avatar.look`, `avatar.gesture`, `avatar.point`, `avatar.face`, `room.lights`, `room.mode`, `camera.focus`.


---

<!-- SOURCE: specs/013-classroom-staging/tasks.md -->

# Tasks — FEAT-013 Classroom Avatar, Room & Camera Staging

- [ ] **T-013** Implement the feature in `plugins/classroom` and satisfy the complete requirement/test set below.

  - [ ] FR-051 / TEST-051 — SURF-052 `avatar.move`
  - [ ] FR-052 / TEST-052 — SURF-053 `avatar.look`
  - [ ] FR-053 / TEST-053 — SURF-054 `avatar.gesture`
  - [ ] FR-054 / TEST-054 — SURF-055 `avatar.point`
  - [ ] FR-055 / TEST-055 — SURF-056 `avatar.face`
  - [ ] FR-078 / TEST-078 — SURF-079 `room.lights`
  - [ ] FR-079 / TEST-079 — SURF-080 `room.mode`
  - [ ] FR-080 / TEST-080 — SURF-081 `camera.focus`
  - [ ] FR-123 / TEST-123 — SURF-124 `avatar.anchor.reached`
  - [ ] FR-135 / TEST-135 — SURF-136 `room.mode`


---

<!-- SOURCE: specs/014-classroom-media/spec.md -->

# FEAT-014 · Classroom Projector & Media Orchestration
> Status: specified | Source surfaces: 16 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Prepare, lower, source, play, pause, wait for, and raise projected media with explicit readiness/failure events and host-only provider configuration.

## 2. User Scenarios

1. Given an integrator enabling Classroom Projector & Media Orchestration, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-071** The feature MUST accept and validate the `projector.prepare` command and preserve its recovered behavior: Prepare media source asynchronously.  
   → SURF-072 → CTR-072 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-072** The feature MUST accept and validate the `projector.lower` command and preserve its recovered behavior: Lower projection screen.  
   → SURF-073 → CTR-073 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-073** The feature MUST accept and validate the `projector.source` command and preserve its recovered behavior: Attach prepared source.  
   → SURF-074 → CTR-074 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-074** The feature MUST accept and validate the `projector.play` command and preserve its recovered behavior: Play source.  
   → SURF-075 → CTR-075 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-075** The feature MUST accept and validate the `projector.wait` command and preserve its recovered behavior: Wait for media/interval.  
   → SURF-076 → CTR-076 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-076** The feature MUST accept and validate the `projector.pause` command and preserve its recovered behavior: Pause source.  
   → SURF-077 → CTR-077 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-077** The feature MUST accept and validate the `projector.raise` command and preserve its recovered behavior: Raise screen.  
   → SURF-078 → CTR-078 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-124** The runtime MUST represent `projector.state` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-125 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P1
- **FR-125** The runtime MUST represent `media.ready` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-126 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P1
- **FR-126** The runtime MUST represent `media.failed` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-127 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P1
- **FR-156** The host adapter MUST support `VC_MEDIA_PROVIDER` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-157 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P1
- **FR-157** The host adapter MUST support `VC_COMFY_URL` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-158 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P1
- **FR-158** The host adapter MUST support `VC_MINIMAX_BASE_URL` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-159 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P1
- **FR-159** The host adapter MUST support `VC_MINIMAX_MODEL` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-160 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P1
- **FR-160** The host adapter MUST support `VC_MINIMAX_API_KEY` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-161 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P1
- **FR-161** The host adapter MUST support `VC_MEDIA_DEADLINE_MS` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-162 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-072 `projector.prepare` | FR-071 | CTR-072 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-073 `projector.lower` | FR-072 | CTR-073 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-074 `projector.source` | FR-073 | CTR-074 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-075 `projector.play` | FR-074 | CTR-075 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-076 `projector.wait` | FR-075 | CTR-076 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-077 `projector.pause` | FR-076 | CTR-077 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-078 `projector.raise` | FR-077 | CTR-078 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-125 `projector.state` | FR-124 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-126 `media.ready` | FR-125 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-127 `media.failed` | FR-126 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-157 `VC_MEDIA_PROVIDER` | FR-156 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |
| SURF-158 `VC_COMFY_URL` | FR-157 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |
| SURF-159 `VC_MINIMAX_BASE_URL` | FR-158 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |
| SURF-160 `VC_MINIMAX_MODEL` | FR-159 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |
| SURF-161 `VC_MINIMAX_API_KEY` | FR-160 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |
| SURF-162 `VC_MEDIA_DEADLINE_MS` | FR-161 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- None beyond global constitution rules.

## 11. Parity Tests

- **TEST-071** — exercise SURF-072 `projector.prepare` against the recovered contract and assert trust-channel/state behavior.
- **TEST-072** — exercise SURF-073 `projector.lower` against the recovered contract and assert trust-channel/state behavior.
- **TEST-073** — exercise SURF-074 `projector.source` against the recovered contract and assert trust-channel/state behavior.
- **TEST-074** — exercise SURF-075 `projector.play` against the recovered contract and assert trust-channel/state behavior.
- **TEST-075** — exercise SURF-076 `projector.wait` against the recovered contract and assert trust-channel/state behavior.
- **TEST-076** — exercise SURF-077 `projector.pause` against the recovered contract and assert trust-channel/state behavior.
- **TEST-077** — exercise SURF-078 `projector.raise` against the recovered contract and assert trust-channel/state behavior.
- **TEST-124** — exercise SURF-125 `projector.state` against the recovered contract and assert trust-channel/state behavior.
- **TEST-125** — exercise SURF-126 `media.ready` against the recovered contract and assert trust-channel/state behavior.
- **TEST-126** — exercise SURF-127 `media.failed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-156** — exercise SURF-157 `VC_MEDIA_PROVIDER` against the recovered contract and assert trust-channel/state behavior.
- **TEST-157** — exercise SURF-158 `VC_COMFY_URL` against the recovered contract and assert trust-channel/state behavior.
- **TEST-158** — exercise SURF-159 `VC_MINIMAX_BASE_URL` against the recovered contract and assert trust-channel/state behavior.
- **TEST-159** — exercise SURF-160 `VC_MINIMAX_MODEL` against the recovered contract and assert trust-channel/state behavior.
- **TEST-160** — exercise SURF-161 `VC_MINIMAX_API_KEY` against the recovered contract and assert trust-channel/state behavior.
- **TEST-161** — exercise SURF-162 `VC_MEDIA_DEADLINE_MS` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- U-003 — Virtual Classroom source license/provenance must be resolved before public extraction/reuse.


---

<!-- SOURCE: specs/014-classroom-media/plan.md -->

# Plan — FEAT-014 Classroom Projector & Media Orchestration

## Target

Package owner: `plugins/classroom`. Dependencies: FEAT-003, FEAT-005, FEAT-006.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: high. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/014-classroom-media/data-model.md -->

# Data model — FEAT-014

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/014-classroom-media/quickstart.md -->

# Quickstart — Classroom Projector & Media Orchestration

1. Register/enable the `plugins/classroom` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `projector.prepare`, `projector.lower`, `projector.source`, `projector.play`, `projector.wait`, `projector.pause`, `projector.raise`.


---

<!-- SOURCE: specs/014-classroom-media/tasks.md -->

# Tasks — FEAT-014 Classroom Projector & Media Orchestration

- [ ] **T-014** Implement the feature in `plugins/classroom` and satisfy the complete requirement/test set below.

  - [ ] FR-071 / TEST-071 — SURF-072 `projector.prepare`
  - [ ] FR-072 / TEST-072 — SURF-073 `projector.lower`
  - [ ] FR-073 / TEST-073 — SURF-074 `projector.source`
  - [ ] FR-074 / TEST-074 — SURF-075 `projector.play`
  - [ ] FR-075 / TEST-075 — SURF-076 `projector.wait`
  - [ ] FR-076 / TEST-076 — SURF-077 `projector.pause`
  - [ ] FR-077 / TEST-077 — SURF-078 `projector.raise`
  - [ ] FR-124 / TEST-124 — SURF-125 `projector.state`
  - [ ] FR-125 / TEST-125 — SURF-126 `media.ready`
  - [ ] FR-126 / TEST-126 — SURF-127 `media.failed`
  - [ ] FR-156 / TEST-156 — SURF-157 `VC_MEDIA_PROVIDER`
  - [ ] FR-157 / TEST-157 — SURF-158 `VC_COMFY_URL`
  - [ ] FR-158 / TEST-158 — SURF-159 `VC_MINIMAX_BASE_URL`
  - [ ] FR-159 / TEST-159 — SURF-160 `VC_MINIMAX_MODEL`
  - [ ] FR-160 / TEST-160 — SURF-161 `VC_MINIMAX_API_KEY`
  - [ ] FR-161 / TEST-161 — SURF-162 `VC_MEDIA_DEADLINE_MS`


---

<!-- SOURCE: specs/015-lesson-interaction/spec.md -->

# FEAT-015 · Lesson Interaction & Pedagogical State
> Status: specified | Source surfaces: 14 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Represent questions, choices, waits, resume points, objectives, phases, assessment, and completion as explicit lesson-state effects and events.

## 2. User Scenarios

1. Given an integrator enabling Lesson Interaction & Pedagogical State, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-081** The feature MUST accept and validate the `lesson.ask` command and preserve its recovered behavior: Open free-response question.  
   → SURF-082 → CTR-082 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-082** The feature MUST accept and validate the `lesson.choice` command and preserve its recovered behavior: Open clickable choice question.  
   → SURF-083 → CTR-083 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-083** The feature MUST accept and validate the `lesson.wait` command and preserve its recovered behavior: Pause for student boundary.  
   → SURF-084 → CTR-084 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-084** The feature MUST accept and validate the `lesson.resume` command and preserve its recovered behavior: Resume lesson.  
   → SURF-085 → CTR-085 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-085** The feature MUST accept and validate the `lesson.objective` command and preserve its recovered behavior: Set objective status.  
   → SURF-086 → CTR-086 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-086** The feature MUST accept and validate the `lesson.phase` command and preserve its recovered behavior: Switch model/practice phase.  
   → SURF-087 → CTR-087 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-087** The feature MUST accept and validate the `lesson.assess` command and preserve its recovered behavior: Record/judge answer.  
   → SURF-088 → CTR-088 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-088** The feature MUST accept and validate the `lesson.complete` command and preserve its recovered behavior: Complete lesson.  
   → SURF-089 → CTR-089 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-129** The runtime MUST represent `lesson.awaiting_student` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-130 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P1
- **FR-130** The runtime MUST represent `lesson.choice.selected` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-131 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P1
- **FR-131** The runtime MUST represent `lesson.resumed` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-132 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P1
- **FR-132** The runtime MUST represent `lesson.objective` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-133 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P1
- **FR-133** The runtime MUST represent `lesson.assessed` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-134 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P1
- **FR-134** The runtime MUST represent `lesson.completed` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-135 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-082 `lesson.ask` | FR-081 | CTR-082 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-083 `lesson.choice` | FR-082 | CTR-083 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-084 `lesson.wait` | FR-083 | CTR-084 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-085 `lesson.resume` | FR-084 | CTR-085 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-086 `lesson.objective` | FR-085 | CTR-086 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-087 `lesson.phase` | FR-086 | CTR-087 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-088 `lesson.assess` | FR-087 | CTR-088 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-089 `lesson.complete` | FR-088 | CTR-089 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-130 `lesson.awaiting_student` | FR-129 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-131 `lesson.choice.selected` | FR-130 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-132 `lesson.resumed` | FR-131 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-133 `lesson.objective` | FR-132 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-134 `lesson.assessed` | FR-133 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-135 `lesson.completed` | FR-134 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- None beyond global constitution rules.

## 11. Parity Tests

- **TEST-081** — exercise SURF-082 `lesson.ask` against the recovered contract and assert trust-channel/state behavior.
- **TEST-082** — exercise SURF-083 `lesson.choice` against the recovered contract and assert trust-channel/state behavior.
- **TEST-083** — exercise SURF-084 `lesson.wait` against the recovered contract and assert trust-channel/state behavior.
- **TEST-084** — exercise SURF-085 `lesson.resume` against the recovered contract and assert trust-channel/state behavior.
- **TEST-085** — exercise SURF-086 `lesson.objective` against the recovered contract and assert trust-channel/state behavior.
- **TEST-086** — exercise SURF-087 `lesson.phase` against the recovered contract and assert trust-channel/state behavior.
- **TEST-087** — exercise SURF-088 `lesson.assess` against the recovered contract and assert trust-channel/state behavior.
- **TEST-088** — exercise SURF-089 `lesson.complete` against the recovered contract and assert trust-channel/state behavior.
- **TEST-129** — exercise SURF-130 `lesson.awaiting_student` against the recovered contract and assert trust-channel/state behavior.
- **TEST-130** — exercise SURF-131 `lesson.choice.selected` against the recovered contract and assert trust-channel/state behavior.
- **TEST-131** — exercise SURF-132 `lesson.resumed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-132** — exercise SURF-133 `lesson.objective` against the recovered contract and assert trust-channel/state behavior.
- **TEST-133** — exercise SURF-134 `lesson.assessed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-134** — exercise SURF-135 `lesson.completed` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- U-003 — Virtual Classroom source license/provenance must be resolved before public extraction/reuse.


---

<!-- SOURCE: specs/015-lesson-interaction/plan.md -->

# Plan — FEAT-015 Lesson Interaction & Pedagogical State

## Target

Package owner: `plugins/classroom`. Dependencies: FEAT-003, FEAT-005, FEAT-006.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: high. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/015-lesson-interaction/data-model.md -->

# Data model — FEAT-015

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/015-lesson-interaction/quickstart.md -->

# Quickstart — Lesson Interaction & Pedagogical State

1. Register/enable the `plugins/classroom` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `lesson.ask`, `lesson.choice`, `lesson.wait`, `lesson.resume`, `lesson.objective`, `lesson.phase`, `lesson.assess`, `lesson.complete`.


---

<!-- SOURCE: specs/015-lesson-interaction/tasks.md -->

# Tasks — FEAT-015 Lesson Interaction & Pedagogical State

- [ ] **T-015** Implement the feature in `plugins/classroom` and satisfy the complete requirement/test set below.

  - [ ] FR-081 / TEST-081 — SURF-082 `lesson.ask`
  - [ ] FR-082 / TEST-082 — SURF-083 `lesson.choice`
  - [ ] FR-083 / TEST-083 — SURF-084 `lesson.wait`
  - [ ] FR-084 / TEST-084 — SURF-085 `lesson.resume`
  - [ ] FR-085 / TEST-085 — SURF-086 `lesson.objective`
  - [ ] FR-086 / TEST-086 — SURF-087 `lesson.phase`
  - [ ] FR-087 / TEST-087 — SURF-088 `lesson.assess`
  - [ ] FR-088 / TEST-088 — SURF-089 `lesson.complete`
  - [ ] FR-129 / TEST-129 — SURF-130 `lesson.awaiting_student`
  - [ ] FR-130 / TEST-130 — SURF-131 `lesson.choice.selected`
  - [ ] FR-131 / TEST-131 — SURF-132 `lesson.resumed`
  - [ ] FR-132 / TEST-132 — SURF-133 `lesson.objective`
  - [ ] FR-133 / TEST-133 — SURF-134 `lesson.assessed`
  - [ ] FR-134 / TEST-134 — SURF-135 `lesson.completed`


---

<!-- SOURCE: specs/016-chess-compatibility/spec.md -->

# FEAT-016 · Chess Annotation Compatibility
> Status: specified | Source surfaces: 5 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Preserve the original chess annotation vocabulary while quarantining natural-language visual inference behind an opt-in compatibility producer.

## 2. User Scenarios

1. Given an integrator enabling Chess Annotation Compatibility, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-001** The feature MUST accept and validate the `arrow` command and preserve its recovered behavior: Draw an arrow between chess squares; optional color.  
   → SURF-001 → CTR-001 · [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts · P2
- **FR-002** The feature MUST accept and validate the `highlight` command and preserve its recovered behavior: Highlight one chess square; optional color.  
   → SURF-002 → CTR-002 · [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts · P2
- **FR-003** The feature MUST accept and validate the `circle` command and preserve its recovered behavior: Circle one chess square; optional color.  
   → SURF-003 → CTR-003 · [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts · P2
- **FR-004** The feature MUST accept and validate the `move` command and preserve its recovered behavior: Encode a proposed/visualized move between squares; optional promotion.  
   → SURF-004 → CTR-004 · [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts · P2
- **FR-166** The SDK or owning compatibility plugin MUST read/write the `Chess annotation grammar` format with the recovered semantics: [arrow]/[highlight]/[circle]/[move].  
   → SURF-167 · [v] analysis/13_SURFACE_INVENTORY.md#surf-167 · P2

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-001 `arrow` | FR-001 | CTR-001 | [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts |
| SURF-002 `highlight` | FR-002 | CTR-002 | [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts |
| SURF-003 `circle` | FR-003 | CTR-003 | [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts |
| SURF-004 `move` | FR-004 | CTR-004 | [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts |
| SURF-167 `Chess annotation grammar` | FR-166 | — | [v] analysis/13_SURFACE_INVENTORY.md#surf-167 |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- **DIV-008** — Quarantine LLM-Chess natural-language visual inference. Rationale: Natural-language cue inference is opt-in compatibility producer behavior, never trusted core execution.

## 11. Parity Tests

- **TEST-001** — exercise SURF-001 `arrow` against the recovered contract and assert trust-channel/state behavior.
- **TEST-002** — exercise SURF-002 `highlight` against the recovered contract and assert trust-channel/state behavior.
- **TEST-003** — exercise SURF-003 `circle` against the recovered contract and assert trust-channel/state behavior.
- **TEST-004** — exercise SURF-004 `move` against the recovered contract and assert trust-channel/state behavior.
- **TEST-166** — exercise SURF-167 `Chess annotation grammar` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- U-002 — LLM-Chess source license/provenance must be resolved before public compatibility release.


---

<!-- SOURCE: specs/016-chess-compatibility/plan.md -->

# Plan — FEAT-016 Chess Annotation Compatibility

## Target

Package owner: `plugins/chess + packages/compatibility/llm-chess`. Dependencies: FEAT-001, FEAT-002, FEAT-003.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: medium. Preservation posture: compatibility-only. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/016-chess-compatibility/data-model.md -->

# Data model — FEAT-016

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/016-chess-compatibility/quickstart.md -->

# Quickstart — Chess Annotation Compatibility

1. Register/enable the `plugins/chess + packages/compatibility/llm-chess` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `arrow`, `highlight`, `circle`, `move`.


---

<!-- SOURCE: specs/016-chess-compatibility/tasks.md -->

# Tasks — FEAT-016 Chess Annotation Compatibility

- [ ] **T-016** Implement the feature in `plugins/chess + packages/compatibility/llm-chess` and satisfy the complete requirement/test set below.

  - [ ] FR-001 / TEST-001 — SURF-001 `arrow`
  - [ ] FR-002 / TEST-002 — SURF-002 `highlight`
  - [ ] FR-003 / TEST-003 — SURF-003 `circle`
  - [ ] FR-004 / TEST-004 — SURF-004 `move`
  - [ ] FR-166 / TEST-166 — SURF-167 `Chess annotation grammar`


---

<!-- SOURCE: specs/017-dom-presenter/spec.md -->

# FEAT-017 · Word-Anchored DOM Presenter Choreography
> Status: specified | Source surfaces: 9 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Synchronize focus, highlight, clearing, and diagram presentation against narration word position without requiring world-state or 3D infrastructure.

## 2. User Scenarios

1. Given an integrator enabling Word-Anchored DOM Presenter Choreography, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-089** The feature MUST accept and validate the `stage.focus` command and preserve its recovered behavior: Lock presentation focus to a paragraph.  
   → SURF-090 → CTR-090 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-090** The feature MUST accept and validate the `stage.focus.off` command and preserve its recovered behavior: Release manual paragraph focus.  
   → SURF-091 → CTR-091 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-091** The feature MUST accept and validate the `stage.auto` command and preserve its recovered behavior: Alias/path to automatic focus mode.  
   → SURF-092 → CTR-092 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-092** The feature MUST accept and validate the `stage.highlight` command and preserve its recovered behavior: Highlight DOM element containing text.  
   → SURF-093 → CTR-093 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-093** The feature MUST accept and validate the `stage.highlight.off` command and preserve its recovered behavior: Remove one/all text highlights.  
   → SURF-094 → CTR-094 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-094** The feature MUST accept and validate the `stage.clear` command and preserve its recovered behavior: Clear manual focus and highlights.  
   → SURF-095 → CTR-095 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-095** The feature MUST accept and validate the `stage.diagram` command and preserve its recovered behavior: Show diagram asset.  
   → SURF-096 → CTR-096 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-096** The feature MUST accept and validate the `stage.diagram.off` command and preserve its recovered behavior: Hide diagram asset.  
   → SURF-097 → CTR-097 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-167** The SDK or owning compatibility plugin MUST read/write the `VCB presenter grammar` format with the recovered semantics: [stage.<type> key=value] word-index anchored.  
   → SURF-168 · [v] analysis/13_SURFACE_INVENTORY.md#surf-168 · P2

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-090 `stage.focus` | FR-089 | CTR-090 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-091 `stage.focus.off` | FR-090 | CTR-091 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-092 `stage.auto` | FR-091 | CTR-092 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-093 `stage.highlight` | FR-092 | CTR-093 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-094 `stage.highlight.off` | FR-093 | CTR-094 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-095 `stage.clear` | FR-094 | CTR-095 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-096 `stage.diagram` | FR-095 | CTR-096 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-097 `stage.diagram.off` | FR-096 | CTR-097 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-168 `VCB presenter grammar` | FR-167 | — | [v] analysis/13_SURFACE_INVENTORY.md#surf-168 |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- None beyond global constitution rules.

## 11. Parity Tests

- **TEST-089** — exercise SURF-090 `stage.focus` against the recovered contract and assert trust-channel/state behavior.
- **TEST-090** — exercise SURF-091 `stage.focus.off` against the recovered contract and assert trust-channel/state behavior.
- **TEST-091** — exercise SURF-092 `stage.auto` against the recovered contract and assert trust-channel/state behavior.
- **TEST-092** — exercise SURF-093 `stage.highlight` against the recovered contract and assert trust-channel/state behavior.
- **TEST-093** — exercise SURF-094 `stage.highlight.off` against the recovered contract and assert trust-channel/state behavior.
- **TEST-094** — exercise SURF-095 `stage.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-095** — exercise SURF-096 `stage.diagram` against the recovered contract and assert trust-channel/state behavior.
- **TEST-096** — exercise SURF-097 `stage.diagram.off` against the recovered contract and assert trust-channel/state behavior.
- **TEST-167** — exercise SURF-168 `VCB presenter grammar` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.


---

<!-- SOURCE: specs/017-dom-presenter/plan.md -->

# Plan — FEAT-017 Word-Anchored DOM Presenter Choreography

## Target

Package owner: `plugins/dom-presenter`. Dependencies: FEAT-001, FEAT-002, FEAT-003, FEAT-005.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: medium. Preservation posture: yes. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/017-dom-presenter/data-model.md -->

# Data model — FEAT-017

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/017-dom-presenter/quickstart.md -->

# Quickstart — Word-Anchored DOM Presenter Choreography

1. Register/enable the `plugins/dom-presenter` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.
5. Representative owned commands: `stage.focus`, `stage.focus.off`, `stage.auto`, `stage.highlight`, `stage.highlight.off`, `stage.clear`, `stage.diagram`, `stage.diagram.off`.


---

<!-- SOURCE: specs/017-dom-presenter/tasks.md -->

# Tasks — FEAT-017 Word-Anchored DOM Presenter Choreography

- [ ] **T-017** Implement the feature in `plugins/dom-presenter` and satisfy the complete requirement/test set below.

  - [ ] FR-089 / TEST-089 — SURF-090 `stage.focus`
  - [ ] FR-090 / TEST-090 — SURF-091 `stage.focus.off`
  - [ ] FR-091 / TEST-091 — SURF-092 `stage.auto`
  - [ ] FR-092 / TEST-092 — SURF-093 `stage.highlight`
  - [ ] FR-093 / TEST-093 — SURF-094 `stage.highlight.off`
  - [ ] FR-094 / TEST-094 — SURF-095 `stage.clear`
  - [ ] FR-095 / TEST-095 — SURF-096 `stage.diagram`
  - [ ] FR-096 / TEST-096 — SURF-097 `stage.diagram.off`
  - [ ] FR-167 / TEST-167 — SURF-168 `VCB presenter grammar`


---

<!-- SOURCE: specs/018-host-model-narration-config/spec.md -->

# FEAT-018 · Host Model & Narration Configuration
> Status: specified | Source surfaces: 6 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Keep model-provider and narration/TTS configuration at the host boundary so core Stagehand remains model-provider independent.

## 2. User Scenarios

1. Given an integrator enabling Host Model & Narration Configuration, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-150** The host adapter MUST support `OPENAI_API_KEY` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-151 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P3
- **FR-151** The host adapter MUST support `OPENROUTER_API_KEY` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-152 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P3
- **FR-152** The host adapter MUST support `VC_DIRECTOR_MODEL` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-153 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P3
- **FR-153** The host adapter MUST support `VC_TTS_VOICE` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-154 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P3
- **FR-154** The host adapter MUST support `VC_TTS_MODEL` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-155 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P3
- **FR-155** The host adapter MUST support `VC_TTS_SPEED` as host configuration and MUST NOT make this key a dependency of generic Stagehand core packages.  
   → SURF-156 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example · P3

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-151 `OPENAI_API_KEY` | FR-150 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |
| SURF-152 `OPENROUTER_API_KEY` | FR-151 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |
| SURF-153 `VC_DIRECTOR_MODEL` | FR-152 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |
| SURF-154 `VC_TTS_VOICE` | FR-153 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |
| SURF-155 `VC_TTS_MODEL` | FR-154 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |
| SURF-156 `VC_TTS_SPEED` | FR-155 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example |

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid registered input in a valid host state | Accept, canonicalize if required, commit through owning adapter, trace outcome. |
| Unknown/unregistered action | Reject; no host mutation; production diagnostic only. |
| Invalid reference/state | Reject or safe-fail according to plugin policy; no partial commit. |
| Interrupted/stale generation where applicable | Do not resume stale work. |

## 7. Error Catalog

- `E_UNKNOWN_ACTION` — action absent from registry; non-retryable until schema/plugin changes.
- `E_SCHEMA` — arity/kwarg/value contract violation; producer must correct input.
- `E_UNRESOLVED_REF` — semantic target cannot be resolved; retryable only if registry/state changes.
- `E_STATE` — host state forbids the effect; retryable only after state transition.
- `E_TIMEOUT` — readiness deadline expired; runtime proceeds through explicit degraded/safe-failure policy.

## 8. State Transitions

proposal → parsed → validated → canonical/resolved → committed + public trace, or rejected + production diagnostic. Compound/host features insert their own state transitions without bypassing this trust boundary.

## 9. Non-Functional Envelope

- NFR-008 plugin behavior must be deterministic at the Stagehand contract boundary; unmeasured latency/throughput remains [?]..

## 10. Divergence Register

- **DIV-009** — Host configuration is not SDK core configuration. Rationale: Provider keys, TTS settings, media endpoints, and deadlines stay in hosts/plugins.

## 11. Parity Tests

- **TEST-150** — exercise SURF-151 `OPENAI_API_KEY` against the recovered contract and assert trust-channel/state behavior.
- **TEST-151** — exercise SURF-152 `OPENROUTER_API_KEY` against the recovered contract and assert trust-channel/state behavior.
- **TEST-152** — exercise SURF-153 `VC_DIRECTOR_MODEL` against the recovered contract and assert trust-channel/state behavior.
- **TEST-153** — exercise SURF-154 `VC_TTS_VOICE` against the recovered contract and assert trust-channel/state behavior.
- **TEST-154** — exercise SURF-155 `VC_TTS_MODEL` against the recovered contract and assert trust-channel/state behavior.
- **TEST-155** — exercise SURF-156 `VC_TTS_SPEED` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- U-003 — Virtual Classroom source license/provenance must be resolved before public extraction/reuse.


---

<!-- SOURCE: specs/018-host-model-narration-config/plan.md -->

# Plan — FEAT-018 Host Model & Narration Configuration

## Target

Package owner: `examples/virtual-classroom-host`. Dependencies: FEAT-013, FEAT-014, FEAT-015.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: low. Preservation posture: host-only-not-core. Any accepted differences must be represented by DIV IDs from spec.md.


---

<!-- SOURCE: specs/018-host-model-narration-config/data-model.md -->

# Data model — FEAT-018

Primary entities: ENT-010 HostState. Canonical definitions live in `analysis/18_STATE_MODEL.md`; implementations must reference rather than fork those semantics.


---

<!-- SOURCE: specs/018-host-model-narration-config/quickstart.md -->

# Quickstart — Host Model & Narration Configuration

1. Register/enable the `examples/virtual-classroom-host` capability.
2. Generate producer guidance from the live registry; do not hand-maintain a second vocabulary list.
3. Feed mixed narration/control through the parser/runtime.
4. Subscribe to public events for product state and production events for diagnostics.


---

<!-- SOURCE: specs/018-host-model-narration-config/tasks.md -->

# Tasks — FEAT-018 Host Model & Narration Configuration

- [ ] **T-018** Implement the feature in `examples/virtual-classroom-host` and satisfy the complete requirement/test set below.

  - [ ] FR-150 / TEST-150 — SURF-151 `OPENAI_API_KEY`
  - [ ] FR-151 / TEST-151 — SURF-152 `OPENROUTER_API_KEY`
  - [ ] FR-152 / TEST-152 — SURF-153 `VC_DIRECTOR_MODEL`
  - [ ] FR-153 / TEST-153 — SURF-154 `VC_TTS_VOICE`
  - [ ] FR-154 / TEST-154 — SURF-155 `VC_TTS_MODEL`
  - [ ] FR-155 / TEST-155 — SURF-156 `VC_TTS_SPEED`

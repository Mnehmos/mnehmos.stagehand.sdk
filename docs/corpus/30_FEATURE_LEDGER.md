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

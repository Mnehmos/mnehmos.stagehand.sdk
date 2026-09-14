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

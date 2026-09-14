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

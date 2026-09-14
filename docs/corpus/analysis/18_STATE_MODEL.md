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

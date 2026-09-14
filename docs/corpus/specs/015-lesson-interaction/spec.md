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

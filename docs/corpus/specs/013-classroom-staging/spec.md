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

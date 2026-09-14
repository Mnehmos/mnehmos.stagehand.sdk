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

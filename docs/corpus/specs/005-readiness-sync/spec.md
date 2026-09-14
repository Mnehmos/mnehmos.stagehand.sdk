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

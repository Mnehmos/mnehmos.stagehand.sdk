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

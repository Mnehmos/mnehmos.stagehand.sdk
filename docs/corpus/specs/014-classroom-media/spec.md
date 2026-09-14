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

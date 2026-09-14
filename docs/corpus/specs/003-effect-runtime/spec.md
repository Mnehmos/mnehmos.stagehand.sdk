# FEAT-003 · Effect Compilation, Resolution & Safe Execution
> Status: specified | Source surfaces: 10 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Turn validated producer commands into canonical effects, resolve semantic references, commit only authorized effects, and emit deterministic runtime outcomes.

## 2. User Scenarios

1. Given a validated command with semantic references, when execution runs, then references resolve before commit and only canonical effects reach the host.

## 3. Functional Requirements

- **FR-101** The SDK MUST expose an equivalent typed public contract for `canonicalizeCommandEntityRefs` at the capability boundary identified by this feature.  
   → SURF-102 → CTR-107 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-102** The SDK MUST expose an equivalent typed public contract for `executeStagehandCommand` at the capability boundary identified by this feature.  
   → SURF-103 → CTR-106 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-110** The SDK MUST expose an equivalent typed public contract for `CanonicalStagehandCommand` at the capability boundary identified by this feature.  
   → SURF-111 → CTR-114 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-112** The SDK MUST expose an equivalent typed public contract for `CanonicalizeCommandOptions` at the capability boundary identified by this feature.  
   → SURF-113 → CTR-116 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-113** The SDK MUST expose an equivalent typed public contract for `CanonicalizeCommandResult` at the capability boundary identified by this feature.  
   → SURF-114 → CTR-117 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-114** The SDK MUST expose an equivalent typed public contract for `EntityResolutionMode` at the capability boundary identified by this feature.  
   → SURF-115 → CTR-118 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-115** The SDK MUST expose an equivalent typed public contract for `ExecuteStagehandCommandOptions` at the capability boundary identified by this feature.  
   → SURF-116 → CTR-119 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-145** The runtime MUST represent `invalid_command` as a typed runtime event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-146 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts · P0
- **FR-146** The runtime MUST represent `unresolved_refs` as a typed runtime event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-147 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts · P0
- **FR-149** The runtime MUST represent `scene_command` as a typed runtime event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-150 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts · P0

## 4. Key Entities

ENT-001, ENT-006, ENT-009, ENT-010.

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-102 `canonicalizeCommandEntityRefs` | FR-101 | CTR-107 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-103 `executeStagehandCommand` | FR-102 | CTR-106 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-111 `CanonicalStagehandCommand` | FR-110 | CTR-114 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-113 `CanonicalizeCommandOptions` | FR-112 | CTR-116 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-114 `CanonicalizeCommandResult` | FR-113 | CTR-117 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-115 `EntityResolutionMode` | FR-114 | CTR-118 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-116 `ExecuteStagehandCommandOptions` | FR-115 | CTR-119 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-146 `invalid_command` | FR-145 | — | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts |
| SURF-147 `unresolved_refs` | FR-146 | — | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts |
| SURF-150 `scene_command` | FR-149 | — | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts |

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

- NFR-001 no raw producer effect may bypass validation.
- NFR-004 zero concrete host dependencies in core.

## 10. Divergence Register

- **DIV-007** — Keep core host- and provider-independent. Rationale: Map, Three.js, chess, DOM, classroom, and model provider dependencies remain outside core packages.

## 11. Parity Tests

- **TEST-101** — exercise SURF-102 `canonicalizeCommandEntityRefs` against the recovered contract and assert trust-channel/state behavior.
- **TEST-102** — exercise SURF-103 `executeStagehandCommand` against the recovered contract and assert trust-channel/state behavior.
- **TEST-110** — exercise SURF-111 `CanonicalStagehandCommand` against the recovered contract and assert trust-channel/state behavior.
- **TEST-112** — exercise SURF-113 `CanonicalizeCommandOptions` against the recovered contract and assert trust-channel/state behavior.
- **TEST-113** — exercise SURF-114 `CanonicalizeCommandResult` against the recovered contract and assert trust-channel/state behavior.
- **TEST-114** — exercise SURF-115 `EntityResolutionMode` against the recovered contract and assert trust-channel/state behavior.
- **TEST-115** — exercise SURF-116 `ExecuteStagehandCommandOptions` against the recovered contract and assert trust-channel/state behavior.
- **TEST-145** — exercise SURF-146 `invalid_command` against the recovered contract and assert trust-channel/state behavior.
- **TEST-146** — exercise SURF-147 `unresolved_refs` against the recovered contract and assert trust-channel/state behavior.
- **TEST-149** — exercise SURF-150 `scene_command` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.

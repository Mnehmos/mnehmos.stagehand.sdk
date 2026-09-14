# FEAT-002 · Capability Registry, Validation & Introspection
> Status: specified | Source surfaces: 6 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Give integrators one typed capability registry that drives validation and producer-facing introspection so executable and advertised vocabularies cannot drift.

## 2. User Scenarios

1. Given a plugin registry, when an action is advertised to a producer, then the same schema validates that action at runtime.
2. Given an unregistered action, when validation runs, then it is rejected without host mutation.

## 3. Functional Requirements

- **FR-103** The SDK MUST expose an equivalent typed public contract for `validateCommand` at the capability boundary identified by this feature.  
   → SURF-104 → CTR-104 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-104** The SDK MUST expose an equivalent typed public contract for `validateCommands` at the capability boundary identified by this feature.  
   → SURF-105 → CTR-105 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-105** The SDK MUST expose an equivalent typed public contract for `COMMAND_SCHEMAS` at the capability boundary identified by this feature.  
   → SURF-106 → CTR-109 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-106** The SDK MUST expose an equivalent typed public contract for `CommandAction` at the capability boundary identified by this feature.  
   → SURF-107 → CTR-110 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-109** The SDK MUST expose an equivalent typed public contract for `CommandSchema` at the capability boundary identified by this feature.  
   → SURF-110 → CTR-113 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-111** The SDK MUST expose an equivalent typed public contract for `CommandValidationResult` at the capability boundary identified by this feature.  
   → SURF-112 → CTR-115 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0

## 4. Key Entities

ENT-003, ENT-006, ENT-009.

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-104 `validateCommand` | FR-103 | CTR-104 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-105 `validateCommands` | FR-104 | CTR-105 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-106 `COMMAND_SCHEMAS` | FR-105 | CTR-109 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-107 `CommandAction` | FR-106 | CTR-110 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-110 `CommandSchema` | FR-109 | CTR-113 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-112 `CommandValidationResult` | FR-111 | CTR-115 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |

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

- NFR-005 schema/introspection single source of truth.

## 10. Divergence Register

- **DIV-006** — Generate validation and introspection from one registry. Rationale: Eliminate parallel command catalogs that previously drifted.

## 11. Parity Tests

- **TEST-103** — exercise SURF-104 `validateCommand` against the recovered contract and assert trust-channel/state behavior.
- **TEST-104** — exercise SURF-105 `validateCommands` against the recovered contract and assert trust-channel/state behavior.
- **TEST-105** — exercise SURF-106 `COMMAND_SCHEMAS` against the recovered contract and assert trust-channel/state behavior.
- **TEST-106** — exercise SURF-107 `CommandAction` against the recovered contract and assert trust-channel/state behavior.
- **TEST-109** — exercise SURF-110 `CommandSchema` against the recovered contract and assert trust-channel/state behavior.
- **TEST-111** — exercise SURF-112 `CommandValidationResult` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.

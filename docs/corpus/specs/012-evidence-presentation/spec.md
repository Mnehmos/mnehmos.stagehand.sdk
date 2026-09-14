# FEAT-011 · Evidence, Sources & Scene Presentation
> Status: specified | Source surfaces: 7 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Coordinate source-backed narration, scene transitions, titles, and non-geographic evidence overlays while keeping provenance visible.

## 2. User Scenarios

1. Given an integrator enabling Evidence, Sources & Scene Presentation, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-024** The feature MUST accept and validate the `chat.say` command and preserve its recovered behavior: Open a source-backed narration attribution scope.  
   → SURF-024 → CTR-024 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-025** The feature MUST accept and validate the `source.show` command and preserve its recovered behavior: Display a source receipt.  
   → SURF-025 → CTR-025 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-026** The feature MUST accept and validate the `source.hide` command and preserve its recovered behavior: Hide source receipts.  
   → SURF-026 → CTR-026 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-029** The feature MUST accept and validate the `scene.fade` command and preserve its recovered behavior: Apply broadcast fade overlay.  
   → SURF-030 → CTR-030 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-030** The feature MUST accept and validate the `scene.title` command and preserve its recovered behavior: Show/clear title/chapter card.  
   → SURF-031 → CTR-031 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-031** The feature MUST accept and validate the `asset.show` command and preserve its recovered behavior: Display registered/inline evidence asset.  
   → SURF-032 → CTR-032 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-032** The feature MUST accept and validate the `asset.clear` command and preserve its recovered behavior: Clear evidence assets.  
   → SURF-033 → CTR-033 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-024 `chat.say` | FR-024 | CTR-024 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-025 `source.show` | FR-025 | CTR-025 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-026 `source.hide` | FR-026 | CTR-026 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-030 `scene.fade` | FR-029 | CTR-030 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-031 `scene.title` | FR-030 | CTR-031 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-032 `asset.show` | FR-031 | CTR-032 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-033 `asset.clear` | FR-032 | CTR-033 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |

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

- **DIV-001** — Remove orphan `claim.show` from canonical registry. Rationale: A declared-but-unexecutable action is not a contract; plugins may reintroduce it only with a complete schema.

## 11. Parity Tests

- **TEST-024** — exercise SURF-024 `chat.say` against the recovered contract and assert trust-channel/state behavior.
- **TEST-025** — exercise SURF-025 `source.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-026** — exercise SURF-026 `source.hide` against the recovered contract and assert trust-channel/state behavior.
- **TEST-029** — exercise SURF-030 `scene.fade` against the recovered contract and assert trust-channel/state behavior.
- **TEST-030** — exercise SURF-031 `scene.title` against the recovered contract and assert trust-channel/state behavior.
- **TEST-031** — exercise SURF-032 `asset.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-032** — exercise SURF-033 `asset.clear` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- U-012 — exact Clio host export/show entrypoint is host-adapter work, not core blocker.

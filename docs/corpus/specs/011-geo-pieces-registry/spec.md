# FEAT-010 · World Pieces & Controlled Registry Proposals
> Status: specified | Source surfaces: 8 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Manipulate world-surface pieces and permit controlled semantic-entity proposals without allowing arbitrary model-authored host pointers.

## 2. User Scenarios

1. Given an integrator enabling World Pieces & Controlled Registry Proposals, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-020** The feature MUST accept and validate the `piece.place` command and preserve its recovered behavior: Place/update globe-anchored simulation piece.  
   → SURF-020 → CTR-020 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-021** The feature MUST accept and validate the `piece.move` command and preserve its recovered behavior: Move/restyle a piece.  
   → SURF-021 → CTR-021 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-022** The feature MUST accept and validate the `piece.remove` command and preserve its recovered behavior: Remove one piece.  
   → SURF-022 → CTR-022 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-023** The feature MUST accept and validate the `piece.clear` command and preserve its recovered behavior: Clear pieces.  
   → SURF-023 → CTR-023 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-027** The feature MUST accept and validate the `entity.propose` command and preserve its recovered behavior: Propose a new registry entity.  
   → SURF-028 → CTR-028 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-100** The SDK MUST expose an equivalent typed public contract for `applyEntityProposeCommand` at the capability boundary identified by this feature.  
   → SURF-101 → CTR-108 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P1
- **FR-147** The runtime MUST represent `entity_proposed` as a typed runtime event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-148 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts · P1
- **FR-148** The runtime MUST represent `proposal_rejected` as a typed runtime event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-149 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-020 `piece.place` | FR-020 | CTR-020 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-021 `piece.move` | FR-021 | CTR-021 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-022 `piece.remove` | FR-022 | CTR-022 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-023 `piece.clear` | FR-023 | CTR-023 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-028 `entity.propose` | FR-027 | CTR-028 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-101 `applyEntityProposeCommand` | FR-100 | CTR-108 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-148 `entity_proposed` | FR-147 | — | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts |
| SURF-149 `proposal_rejected` | FR-148 | — | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts |

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

- **TEST-020** — exercise SURF-020 `piece.place` against the recovered contract and assert trust-channel/state behavior.
- **TEST-021** — exercise SURF-021 `piece.move` against the recovered contract and assert trust-channel/state behavior.
- **TEST-022** — exercise SURF-022 `piece.remove` against the recovered contract and assert trust-channel/state behavior.
- **TEST-023** — exercise SURF-023 `piece.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-027** — exercise SURF-028 `entity.propose` against the recovered contract and assert trust-channel/state behavior.
- **TEST-100** — exercise SURF-101 `applyEntityProposeCommand` against the recovered contract and assert trust-channel/state behavior.
- **TEST-147** — exercise SURF-148 `entity_proposed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-148** — exercise SURF-149 `proposal_rejected` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.

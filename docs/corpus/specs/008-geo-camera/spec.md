# FEAT-007 · Geospatial Camera & View Framing
> Status: specified | Source surfaces: 8 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Let a geospatial host establish, focus, fit, and follow meaningful views using semantic targets rather than renderer-specific pointers.

## 2. User Scenarios

1. Given an integrator enabling Geospatial Camera & View Framing, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-005** The feature MUST accept and validate the `map.view` command and preserve its recovered behavior: Set camera coordinate/zoom.  
   → SURF-005 → CTR-005 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-006** The feature MUST accept and validate the `map.focus` command and preserve its recovered behavior: Focus camera on one registered entity.  
   → SURF-006 → CTR-006 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-007** The feature MUST accept and validate the `map.fit` command and preserve its recovered behavior: Frame multiple entities or explicit bounds.  
   → SURF-007 → CTR-007 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-008** The feature MUST accept and validate the `map.mode` command and preserve its recovered behavior: Switch rhetorical map mode.  
   → SURF-008 → CTR-008 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-039** The feature MUST accept and validate the `camera.center` command and preserve its recovered behavior: Semantic camera centering primitive (v2).  
   → SURF-040 → CTR-040 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-040** The feature MUST accept and validate the `camera.focus_region` command and preserve its recovered behavior: Semantic region framing primitive (v2).  
   → SURF-041 → CTR-041 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-041** The feature MUST accept and validate the `camera.establish_globe` command and preserve its recovered behavior: Globe-scale establishing camera (v2).  
   → SURF-042 → CTR-042 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-046** The feature MUST accept and validate the `camera.follow_marker` command and preserve its recovered behavior: Set/clear chase-camera policy.  
   → SURF-047 → CTR-047 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-005 `map.view` | FR-005 | CTR-005 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-006 `map.focus` | FR-006 | CTR-006 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-007 `map.fit` | FR-007 | CTR-007 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-008 `map.mode` | FR-008 | CTR-008 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-040 `camera.center` | FR-039 | CTR-040 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-041 `camera.focus_region` | FR-040 | CTR-041 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-042 `camera.establish_globe` | FR-041 | CTR-042 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-047 `camera.follow_marker` | FR-046 | CTR-047 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |

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

- **TEST-005** — exercise SURF-005 `map.view` against the recovered contract and assert trust-channel/state behavior.
- **TEST-006** — exercise SURF-006 `map.focus` against the recovered contract and assert trust-channel/state behavior.
- **TEST-007** — exercise SURF-007 `map.fit` against the recovered contract and assert trust-channel/state behavior.
- **TEST-008** — exercise SURF-008 `map.mode` against the recovered contract and assert trust-channel/state behavior.
- **TEST-039** — exercise SURF-040 `camera.center` against the recovered contract and assert trust-channel/state behavior.
- **TEST-040** — exercise SURF-041 `camera.focus_region` against the recovered contract and assert trust-channel/state behavior.
- **TEST-041** — exercise SURF-042 `camera.establish_globe` against the recovered contract and assert trust-channel/state behavior.
- **TEST-046** — exercise SURF-047 `camera.follow_marker` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.

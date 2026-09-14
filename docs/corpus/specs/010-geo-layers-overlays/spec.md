# FEAT-009 · Geospatial Layers, Flows & Temporal Overlays
> Status: specified | Source surfaces: 8 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Control thematic layers, animated flows, basemaps, overlays, and time-varying map state through explicit plugin contracts.

## 2. User Scenarios

1. Given an integrator enabling Geospatial Layers, Flows & Temporal Overlays, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-016** The feature MUST accept and validate the `layer.on` command and preserve its recovered behavior: Enable a named thematic layer.  
   → SURF-016 → CTR-016 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-017** The feature MUST accept and validate the `layer.off` command and preserve its recovered behavior: Disable a named thematic layer.  
   → SURF-017 → CTR-017 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-018** The feature MUST accept and validate the `flow.animate` command and preserve its recovered behavior: Animate a route/flow.  
   → SURF-018 → CTR-018 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-019** The feature MUST accept and validate the `flow.clear` command and preserve its recovered behavior: Clear active flows.  
   → SURF-019 → CTR-019 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-047** The feature MUST accept and validate the `map.overlay.show` command and preserve its recovered behavior: Activate registered map overlay.  
   → SURF-048 → CTR-048 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-048** The feature MUST accept and validate the `map.overlay.hide` command and preserve its recovered behavior: Hide one/all overlays.  
   → SURF-049 → CTR-049 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-049** The feature MUST accept and validate the `map.basemap` command and preserve its recovered behavior: Switch named/registered basemap.  
   → SURF-050 → CTR-050 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-050** The feature MUST accept and validate the `map.timecursor` command and preserve its recovered behavior: Set overlay time cursor.  
   → SURF-051 → CTR-051 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-016 `layer.on` | FR-016 | CTR-016 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-017 `layer.off` | FR-017 | CTR-017 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-018 `flow.animate` | FR-018 | CTR-018 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-019 `flow.clear` | FR-019 | CTR-019 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-048 `map.overlay.show` | FR-047 | CTR-048 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-049 `map.overlay.hide` | FR-048 | CTR-049 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-050 `map.basemap` | FR-049 | CTR-050 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-051 `map.timecursor` | FR-050 | CTR-051 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |

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

- **DIV-002** — Make `map.timecursor` unambiguous. Rationale: Use an explicit live-vs-at representation; omitted/empty timestamp ambiguity is forbidden.

## 11. Parity Tests

- **TEST-016** — exercise SURF-016 `layer.on` against the recovered contract and assert trust-channel/state behavior.
- **TEST-017** — exercise SURF-017 `layer.off` against the recovered contract and assert trust-channel/state behavior.
- **TEST-018** — exercise SURF-018 `flow.animate` against the recovered contract and assert trust-channel/state behavior.
- **TEST-019** — exercise SURF-019 `flow.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-047** — exercise SURF-048 `map.overlay.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-048** — exercise SURF-049 `map.overlay.hide` against the recovered contract and assert trust-channel/state behavior.
- **TEST-049** — exercise SURF-050 `map.basemap` against the recovered contract and assert trust-channel/state behavior.
- **TEST-050** — exercise SURF-051 `map.timecursor` against the recovered contract and assert trust-channel/state behavior. Expected divergence: DIV-002.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.

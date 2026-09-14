# FEAT-008 · Geospatial Highlighting & Annotation
> Status: specified | Source surfaces: 11 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Annotate map entities and relationships with highlights, spotlights, labels, circles, lines, arrows, and semantic routes.

## 2. User Scenarios

1. Given an integrator enabling Geospatial Highlighting & Annotation, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-009** The feature MUST accept and validate the `map.highlight` command and preserve its recovered behavior: Highlight an entity.  
   → SURF-009 → CTR-009 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-010** The feature MUST accept and validate the `map.spotlight` command and preserve its recovered behavior: Dim scene except target aperture.  
   → SURF-010 → CTR-010 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-011** The feature MUST accept and validate the `map.label` command and preserve its recovered behavior: Attach/update an entity label.  
   → SURF-011 → CTR-011 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-012** The feature MUST accept and validate the `map.clear` command and preserve its recovered behavior: Clear classes of transient map state.  
   → SURF-012 → CTR-012 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-013** The feature MUST accept and validate the `map.arrow` command and preserve its recovered behavior: Great-circle directed connector.  
   → SURF-013 → CTR-013 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-014** The feature MUST accept and validate the `map.circle` command and preserve its recovered behavior: Ring an entity.  
   → SURF-014 → CTR-014 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-015** The feature MUST accept and validate the `map.line` command and preserve its recovered behavior: Great-circle undirected connector.  
   → SURF-015 → CTR-015 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-042** The feature MUST accept and validate the `highlight.region` command and preserve its recovered behavior: Semantic region highlight (v2).  
   → SURF-043 → CTR-043 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-043** The feature MUST accept and validate the `highlight.location` command and preserve its recovered behavior: Semantic point highlight (v2).  
   → SURF-044 → CTR-044 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-044** The feature MUST accept and validate the `label.show` command and preserve its recovered behavior: Semantic label primitive (v2).  
   → SURF-045 → CTR-045 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-045** The feature MUST accept and validate the `route.draw` command and preserve its recovered behavior: Semantic route primitive (v2).  
   → SURF-046 → CTR-046 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-009 `map.highlight` | FR-009 | CTR-009 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-010 `map.spotlight` | FR-010 | CTR-010 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-011 `map.label` | FR-011 | CTR-011 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-012 `map.clear` | FR-012 | CTR-012 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-013 `map.arrow` | FR-013 | CTR-013 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-014 `map.circle` | FR-014 | CTR-014 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-015 `map.line` | FR-015 | CTR-015 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-043 `highlight.region` | FR-042 | CTR-043 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-044 `highlight.location` | FR-043 | CTR-044 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-045 `label.show` | FR-044 | CTR-045 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-046 `route.draw` | FR-045 | CTR-046 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |

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

- **TEST-009** — exercise SURF-009 `map.highlight` against the recovered contract and assert trust-channel/state behavior.
- **TEST-010** — exercise SURF-010 `map.spotlight` against the recovered contract and assert trust-channel/state behavior.
- **TEST-011** — exercise SURF-011 `map.label` against the recovered contract and assert trust-channel/state behavior.
- **TEST-012** — exercise SURF-012 `map.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-013** — exercise SURF-013 `map.arrow` against the recovered contract and assert trust-channel/state behavior.
- **TEST-014** — exercise SURF-014 `map.circle` against the recovered contract and assert trust-channel/state behavior.
- **TEST-015** — exercise SURF-015 `map.line` against the recovered contract and assert trust-channel/state behavior.
- **TEST-042** — exercise SURF-043 `highlight.region` against the recovered contract and assert trust-channel/state behavior.
- **TEST-043** — exercise SURF-044 `highlight.location` against the recovered contract and assert trust-channel/state behavior.
- **TEST-044** — exercise SURF-045 `label.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-045** — exercise SURF-046 `route.draw` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.

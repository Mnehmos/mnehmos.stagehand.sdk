# FEAT-016 · Chess Annotation Compatibility
> Status: specified | Source surfaces: 5 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Preserve the original chess annotation vocabulary while quarantining natural-language visual inference behind an opt-in compatibility producer.

## 2. User Scenarios

1. Given an integrator enabling Chess Annotation Compatibility, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-001** The feature MUST accept and validate the `arrow` command and preserve its recovered behavior: Draw an arrow between chess squares; optional color.  
   → SURF-001 → CTR-001 · [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts · P2
- **FR-002** The feature MUST accept and validate the `highlight` command and preserve its recovered behavior: Highlight one chess square; optional color.  
   → SURF-002 → CTR-002 · [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts · P2
- **FR-003** The feature MUST accept and validate the `circle` command and preserve its recovered behavior: Circle one chess square; optional color.  
   → SURF-003 → CTR-003 · [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts · P2
- **FR-004** The feature MUST accept and validate the `move` command and preserve its recovered behavior: Encode a proposed/visualized move between squares; optional promotion.  
   → SURF-004 → CTR-004 · [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts · P2
- **FR-166** The SDK or owning compatibility plugin MUST read/write the `Chess annotation grammar` format with the recovered semantics: [arrow]/[highlight]/[circle]/[move].  
   → SURF-167 · [v] analysis/13_SURFACE_INVENTORY.md#surf-167 · P2

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-001 `arrow` | FR-001 | CTR-001 | [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts |
| SURF-002 `highlight` | FR-002 | CTR-002 | [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts |
| SURF-003 `circle` | FR-003 | CTR-003 | [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts |
| SURF-004 `move` | FR-004 | CTR-004 | [v] Mnehmos/LLM-Chess@450bdbded7f34e94cffc02264082849714270af3:src/utils/board-annotations.ts |
| SURF-167 `Chess annotation grammar` | FR-166 | — | [v] analysis/13_SURFACE_INVENTORY.md#surf-167 |

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

- **DIV-008** — Quarantine LLM-Chess natural-language visual inference. Rationale: Natural-language cue inference is opt-in compatibility producer behavior, never trusted core execution.

## 11. Parity Tests

- **TEST-001** — exercise SURF-001 `arrow` against the recovered contract and assert trust-channel/state behavior.
- **TEST-002** — exercise SURF-002 `highlight` against the recovered contract and assert trust-channel/state behavior.
- **TEST-003** — exercise SURF-003 `circle` against the recovered contract and assert trust-channel/state behavior.
- **TEST-004** — exercise SURF-004 `move` against the recovered contract and assert trust-channel/state behavior.
- **TEST-166** — exercise SURF-167 `Chess annotation grammar` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- U-002 — LLM-Chess source license/provenance must be resolved before public compatibility release.

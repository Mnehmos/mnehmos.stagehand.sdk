# FEAT-001 · Mixed-Stream Parsing & Syntax
> Status: specified | Source surfaces: 6 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Compile untrusted narration-plus-control streams into typed text, command, and compound segments without leaking control syntax into public narration.

## 2. User Scenarios

1. Given a token-fragmented producer stream, when it is parsed incrementally, then narration and controls are separated identically to batch parsing.
2. Given command-shaped text with missing brackets, when parsing, then it is recovered or quarantined as control and is never spoken as narration.

## 3. Functional Requirements

- **FR-097** The SDK MUST expose an equivalent typed public contract for `parseScript` at the capability boundary identified by this feature.  
   → SURF-098 → CTR-101 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-098** The SDK MUST expose an equivalent typed public contract for `parseCommandString` at the capability boundary identified by this feature.  
   → SURF-099 → CTR-102 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-099** The SDK MUST expose an equivalent typed public contract for `StreamingParser` at the capability boundary identified by this feature.  
   → SURF-100 → CTR-103 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-107** The SDK MUST expose an equivalent typed public contract for `StagehandCommand` at the capability boundary identified by this feature.  
   → SURF-108 → CTR-111 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-108** The SDK MUST expose an equivalent typed public contract for `ScriptSegment` at the capability boundary identified by this feature.  
   → SURF-109 → CTR-112 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-162** The SDK or owning compatibility plugin MUST read/write the `Stagehand bracket grammar` format with the recovered semantics: [action arg key=value] mixed inline with narration.  
   → SURF-163 · [v] analysis/13_SURFACE_INVENTORY.md#surf-163 · P0

## 4. Key Entities

ENT-001, ENT-002, ENT-004.

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-098 `parseScript` | FR-097 | CTR-101 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-099 `parseCommandString` | FR-098 | CTR-102 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-100 `StreamingParser` | FR-099 | CTR-103 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-108 `StagehandCommand` | FR-107 | CTR-111 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-109 `ScriptSegment` | FR-108 | CTR-112 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-163 `Stagehand bracket grammar` | FR-162 | — | [v] analysis/13_SURFACE_INVENTORY.md#surf-163 |

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

- NFR-001 fail closed on control leakage.
- NFR-006 batch/stream semantic equivalence.
- NFR-007 semantic repair default-off.

## 10. Divergence Register

- **DIV-003** — Use hardened VC parser semantics as the baseline. Rationale: Nesting, quote handling, bare-command quarantine, and batch/stream convergence supersede weaker Clio behavior.
- **DIV-004** — Disable semantic repair by default. Rationale: Lexical repair may recover framing; meaning-changing guesses require explicit plugin policy.

## 11. Parity Tests

- **TEST-097** — exercise SURF-098 `parseScript` against the recovered contract and assert trust-channel/state behavior.
- **TEST-098** — exercise SURF-099 `parseCommandString` against the recovered contract and assert trust-channel/state behavior.
- **TEST-099** — exercise SURF-100 `StreamingParser` against the recovered contract and assert trust-channel/state behavior.
- **TEST-107** — exercise SURF-108 `StagehandCommand` against the recovered contract and assert trust-channel/state behavior.
- **TEST-108** — exercise SURF-109 `ScriptSegment` against the recovered contract and assert trust-channel/state behavior.
- **TEST-162** — exercise SURF-163 `Stagehand bracket grammar` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.

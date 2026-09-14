# FEAT-012 · Shared Whiteboard Canvas
> Status: specified | Source surfaces: 21 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Provide a reusable screen-space explanatory canvas for text, math, lines, boxes, arrows, highlights, dots, shapes, counting, erasure, and reveal operations.

## 2. User Scenarios

1. Given an integrator enabling Shared Whiteboard Canvas, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-033** The feature MUST accept and validate the `whiteboard.show` command and preserve its recovered behavior: Show screen-space whiteboard.  
   → SURF-034 → CTR-034 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-034** The feature MUST accept and validate the `whiteboard.hide` command and preserve its recovered behavior: Hide whiteboard.  
   → SURF-035 → CTR-035 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-035** The feature MUST accept and validate the `whiteboard.clear` command and preserve its recovered behavior: Clear whiteboard.  
   → SURF-036 → CTR-036 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-036** The feature MUST accept and validate the `whiteboard.text` command and preserve its recovered behavior: Place freeform text.  
   → SURF-037 → CTR-037 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-037** The feature MUST accept and validate the `whiteboard.line` command and preserve its recovered behavior: Draw freeform line.  
   → SURF-038 → CTR-038 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-038** The feature MUST accept and validate the `whiteboard.box` command and preserve its recovered behavior: Draw box/panel.  
   → SURF-039 → CTR-039 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts · P1
- **FR-056** The feature MUST accept and validate the `whiteboard.show` command and preserve its recovered behavior: Activate board/new page.  
   → SURF-057 → CTR-057 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-057** The feature MUST accept and validate the `whiteboard.hide` command and preserve its recovered behavior: Occlude/deactivate presentation without destroying content.  
   → SURF-058 → CTR-058 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-058** The feature MUST accept and validate the `whiteboard.clear` command and preserve its recovered behavior: Clear board layer/page content.  
   → SURF-059 → CTR-059 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-059** The feature MUST accept and validate the `whiteboard.text` command and preserve its recovered behavior: Commit exact text element.  
   → SURF-060 → CTR-060 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-060** The feature MUST accept and validate the `whiteboard.math` command and preserve its recovered behavior: Commit typeset equation.  
   → SURF-061 → CTR-061 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-061** The feature MUST accept and validate the `whiteboard.line` command and preserve its recovered behavior: Draw line.  
   → SURF-062 → CTR-062 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-062** The feature MUST accept and validate the `whiteboard.box` command and preserve its recovered behavior: Draw box.  
   → SURF-063 → CTR-063 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-063** The feature MUST accept and validate the `whiteboard.arrow` command and preserve its recovered behavior: Draw arrow.  
   → SURF-064 → CTR-064 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-064** The feature MUST accept and validate the `whiteboard.highlight` command and preserve its recovered behavior: Highlight board element/region.  
   → SURF-065 → CTR-065 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-065** The feature MUST accept and validate the `whiteboard.scribble` command and preserve its recovered behavior: Commit thinking-layer scribble.  
   → SURF-066 → CTR-066 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-066** The feature MUST accept and validate the `whiteboard.dots` command and preserve its recovered behavior: Draw countable dots/tokens.  
   → SURF-067 → CTR-067 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-067** The feature MUST accept and validate the `whiteboard.shape` command and preserve its recovered behavior: Draw named geometry.  
   → SURF-068 → CTR-068 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-068** The feature MUST accept and validate the `whiteboard.count` command and preserve its recovered behavior: Count properties/items.  
   → SURF-069 → CTR-069 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-069** The feature MUST accept and validate the `whiteboard.erase` command and preserve its recovered behavior: Erase target.  
   → SURF-070 → CTR-070 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1
- **FR-070** The feature MUST accept and validate the `whiteboard.reveal` command and preserve its recovered behavior: Reveal concealed target.  
   → SURF-071 → CTR-071 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts · P1

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-034 `whiteboard.show` | FR-033 | CTR-034 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-035 `whiteboard.hide` | FR-034 | CTR-035 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-036 `whiteboard.clear` | FR-035 | CTR-036 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-037 `whiteboard.text` | FR-036 | CTR-037 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-038 `whiteboard.line` | FR-037 | CTR-038 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-039 `whiteboard.box` | FR-038 | CTR-039 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts |
| SURF-057 `whiteboard.show` | FR-056 | CTR-057 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-058 `whiteboard.hide` | FR-057 | CTR-058 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-059 `whiteboard.clear` | FR-058 | CTR-059 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-060 `whiteboard.text` | FR-059 | CTR-060 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-061 `whiteboard.math` | FR-060 | CTR-061 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-062 `whiteboard.line` | FR-061 | CTR-062 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-063 `whiteboard.box` | FR-062 | CTR-063 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-064 `whiteboard.arrow` | FR-063 | CTR-064 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-065 `whiteboard.highlight` | FR-064 | CTR-065 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-066 `whiteboard.scribble` | FR-065 | CTR-066 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-067 `whiteboard.dots` | FR-066 | CTR-067 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-068 `whiteboard.shape` | FR-067 | CTR-068 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-069 `whiteboard.count` | FR-068 | CTR-069 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-070 `whiteboard.erase` | FR-069 | CTR-070 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |
| SURF-071 `whiteboard.reveal` | FR-070 | CTR-071 | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts |

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

- **TEST-033** — exercise SURF-034 `whiteboard.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-034** — exercise SURF-035 `whiteboard.hide` against the recovered contract and assert trust-channel/state behavior.
- **TEST-035** — exercise SURF-036 `whiteboard.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-036** — exercise SURF-037 `whiteboard.text` against the recovered contract and assert trust-channel/state behavior.
- **TEST-037** — exercise SURF-038 `whiteboard.line` against the recovered contract and assert trust-channel/state behavior.
- **TEST-038** — exercise SURF-039 `whiteboard.box` against the recovered contract and assert trust-channel/state behavior.
- **TEST-056** — exercise SURF-057 `whiteboard.show` against the recovered contract and assert trust-channel/state behavior.
- **TEST-057** — exercise SURF-058 `whiteboard.hide` against the recovered contract and assert trust-channel/state behavior.
- **TEST-058** — exercise SURF-059 `whiteboard.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-059** — exercise SURF-060 `whiteboard.text` against the recovered contract and assert trust-channel/state behavior.
- **TEST-060** — exercise SURF-061 `whiteboard.math` against the recovered contract and assert trust-channel/state behavior.
- **TEST-061** — exercise SURF-062 `whiteboard.line` against the recovered contract and assert trust-channel/state behavior.
- **TEST-062** — exercise SURF-063 `whiteboard.box` against the recovered contract and assert trust-channel/state behavior.
- **TEST-063** — exercise SURF-064 `whiteboard.arrow` against the recovered contract and assert trust-channel/state behavior.
- **TEST-064** — exercise SURF-065 `whiteboard.highlight` against the recovered contract and assert trust-channel/state behavior.
- **TEST-065** — exercise SURF-066 `whiteboard.scribble` against the recovered contract and assert trust-channel/state behavior.
- **TEST-066** — exercise SURF-067 `whiteboard.dots` against the recovered contract and assert trust-channel/state behavior.
- **TEST-067** — exercise SURF-068 `whiteboard.shape` against the recovered contract and assert trust-channel/state behavior.
- **TEST-068** — exercise SURF-069 `whiteboard.count` against the recovered contract and assert trust-channel/state behavior.
- **TEST-069** — exercise SURF-070 `whiteboard.erase` against the recovered contract and assert trust-channel/state behavior.
- **TEST-070** — exercise SURF-071 `whiteboard.reveal` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.

# FEAT-017 · Word-Anchored DOM Presenter Choreography
> Status: specified | Source surfaces: 9 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Synchronize focus, highlight, clearing, and diagram presentation against narration word position without requiring world-state or 3D infrastructure.

## 2. User Scenarios

1. Given an integrator enabling Word-Anchored DOM Presenter Choreography, when its owned surfaces are exercised, then observable behavior matches the recovered contract except for accepted divergences.

## 3. Functional Requirements

- **FR-089** The feature MUST accept and validate the `stage.focus` command and preserve its recovered behavior: Lock presentation focus to a paragraph.  
   → SURF-090 → CTR-090 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-090** The feature MUST accept and validate the `stage.focus.off` command and preserve its recovered behavior: Release manual paragraph focus.  
   → SURF-091 → CTR-091 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-091** The feature MUST accept and validate the `stage.auto` command and preserve its recovered behavior: Alias/path to automatic focus mode.  
   → SURF-092 → CTR-092 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-092** The feature MUST accept and validate the `stage.highlight` command and preserve its recovered behavior: Highlight DOM element containing text.  
   → SURF-093 → CTR-093 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-093** The feature MUST accept and validate the `stage.highlight.off` command and preserve its recovered behavior: Remove one/all text highlights.  
   → SURF-094 → CTR-094 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-094** The feature MUST accept and validate the `stage.clear` command and preserve its recovered behavior: Clear manual focus and highlights.  
   → SURF-095 → CTR-095 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-095** The feature MUST accept and validate the `stage.diagram` command and preserve its recovered behavior: Show diagram asset.  
   → SURF-096 → CTR-096 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-096** The feature MUST accept and validate the `stage.diagram.off` command and preserve its recovered behavior: Hide diagram asset.  
   → SURF-097 → CTR-097 · [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx · P2
- **FR-167** The SDK or owning compatibility plugin MUST read/write the `VCB presenter grammar` format with the recovered semantics: [stage.<type> key=value] word-index anchored.  
   → SURF-168 · [v] analysis/13_SURFACE_INVENTORY.md#surf-168 · P2

## 4. Key Entities

ENT-010 HostState (plugin-owned).

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-090 `stage.focus` | FR-089 | CTR-090 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-091 `stage.focus.off` | FR-090 | CTR-091 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-092 `stage.auto` | FR-091 | CTR-092 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-093 `stage.highlight` | FR-092 | CTR-093 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-094 `stage.highlight.off` | FR-093 | CTR-094 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-095 `stage.clear` | FR-094 | CTR-095 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-096 `stage.diagram` | FR-095 | CTR-096 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-097 `stage.diagram.off` | FR-096 | CTR-097 | [v] Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c:site/src/components/Stagehand.tsx |
| SURF-168 `VCB presenter grammar` | FR-167 | — | [v] analysis/13_SURFACE_INVENTORY.md#surf-168 |

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

- **TEST-089** — exercise SURF-090 `stage.focus` against the recovered contract and assert trust-channel/state behavior.
- **TEST-090** — exercise SURF-091 `stage.focus.off` against the recovered contract and assert trust-channel/state behavior.
- **TEST-091** — exercise SURF-092 `stage.auto` against the recovered contract and assert trust-channel/state behavior.
- **TEST-092** — exercise SURF-093 `stage.highlight` against the recovered contract and assert trust-channel/state behavior.
- **TEST-093** — exercise SURF-094 `stage.highlight.off` against the recovered contract and assert trust-channel/state behavior.
- **TEST-094** — exercise SURF-095 `stage.clear` against the recovered contract and assert trust-channel/state behavior.
- **TEST-095** — exercise SURF-096 `stage.diagram` against the recovered contract and assert trust-channel/state behavior.
- **TEST-096** — exercise SURF-097 `stage.diagram.off` against the recovered contract and assert trust-channel/state behavior.
- **TEST-167** — exercise SURF-168 `VCB presenter grammar` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- No blocking unknowns; non-measured performance values remain explicitly unspecified rather than invented.

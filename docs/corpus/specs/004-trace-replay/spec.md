# FEAT-005 · Trace, Replay & Diagnostics
> Status: specified | Source surfaces: 16 | Confidence: high unless a referenced U-### says otherwise

## 1. Intent

Expose separate public and production event channels and record versioned replay material without exposing private diagnostics as user-facing effects.

## 2. User Scenarios

1. Given one session, when effects run, then public events and production diagnostics remain separate and replay metadata is version stamped.

## 3. Functional Requirements

- **FR-116** The SDK MUST expose an equivalent typed public contract for `StagehandRuntimeEvent` at the capability boundary identified by this feature.  
   → SURF-117 → CTR-120 · [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts · P0
- **FR-117** The runtime MUST represent `narration.started` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-118 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-118** The runtime MUST represent `narration.ended` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-119 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-119** The runtime MUST represent `narration.interrupted` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-120 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-120** The runtime MUST represent `caption` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-121 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-121** The runtime MUST represent `effect.committed` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-122 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-122** The runtime MUST represent `board.revision.committed` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-123 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-136** The runtime MUST represent `safe_failure` as a typed public event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-137 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-137** The runtime MUST represent `stream.chunk` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-138 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-138** The runtime MUST represent `segment.parsed` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-139 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-139** The runtime MUST represent `command.accepted` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-140 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-140** The runtime MUST represent `command.rejected` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-141 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-142** The runtime MUST represent `provider.request` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-143 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-143** The runtime MUST represent `provider.response` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-144 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-144** The runtime MUST represent `diagnostic` as a typed private production event at the corresponding lifecycle transition and route it to the correct trust channel.  
   → SURF-145 · [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts · P0
- **FR-165** The SDK or owning compatibility plugin MUST read/write the `StagehandTrace` format with the recovered semantics: timestamped public and private event arrays.  
   → SURF-166 · [v] analysis/13_SURFACE_INVENTORY.md#surf-166 · P0

## 4. Key Entities

ENT-007.

## 5. Surface Bindings

| Surface | Requirement | Contract | Evidence |
|---|---|---|---|
| SURF-117 `StagehandRuntimeEvent` | FR-116 | CTR-120 | [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts |
| SURF-118 `narration.started` | FR-117 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-119 `narration.ended` | FR-118 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-120 `narration.interrupted` | FR-119 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-121 `caption` | FR-120 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-122 `effect.committed` | FR-121 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-123 `board.revision.committed` | FR-122 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-137 `safe_failure` | FR-136 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-138 `stream.chunk` | FR-137 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-139 `segment.parsed` | FR-138 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-140 `command.accepted` | FR-139 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-141 `command.rejected` | FR-140 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-143 `provider.request` | FR-142 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-144 `provider.response` | FR-143 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-145 `diagnostic` | FR-144 | — | [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts |
| SURF-166 `StagehandTrace` | FR-165 | — | [v] analysis/13_SURFACE_INVENTORY.md#surf-166 |

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

- NFR-002 replay envelope is versioned and deterministic.

## 10. Divergence Register

- **DIV-005** — Version the trace envelope. Rationale: Add protocol, schema-set, plugin, adapter, and optional asset-manifest versions plus migrator registry.

## 11. Parity Tests

- **TEST-116** — exercise SURF-117 `StagehandRuntimeEvent` against the recovered contract and assert trust-channel/state behavior.
- **TEST-117** — exercise SURF-118 `narration.started` against the recovered contract and assert trust-channel/state behavior.
- **TEST-118** — exercise SURF-119 `narration.ended` against the recovered contract and assert trust-channel/state behavior.
- **TEST-119** — exercise SURF-120 `narration.interrupted` against the recovered contract and assert trust-channel/state behavior.
- **TEST-120** — exercise SURF-121 `caption` against the recovered contract and assert trust-channel/state behavior.
- **TEST-121** — exercise SURF-122 `effect.committed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-122** — exercise SURF-123 `board.revision.committed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-136** — exercise SURF-137 `safe_failure` against the recovered contract and assert trust-channel/state behavior.
- **TEST-137** — exercise SURF-138 `stream.chunk` against the recovered contract and assert trust-channel/state behavior.
- **TEST-138** — exercise SURF-139 `segment.parsed` against the recovered contract and assert trust-channel/state behavior.
- **TEST-139** — exercise SURF-140 `command.accepted` against the recovered contract and assert trust-channel/state behavior.
- **TEST-140** — exercise SURF-141 `command.rejected` against the recovered contract and assert trust-channel/state behavior.
- **TEST-142** — exercise SURF-143 `provider.request` against the recovered contract and assert trust-channel/state behavior.
- **TEST-143** — exercise SURF-144 `provider.response` against the recovered contract and assert trust-channel/state behavior.
- **TEST-144** — exercise SURF-145 `diagnostic` against the recovered contract and assert trust-channel/state behavior.
- **TEST-165** — exercise SURF-166 `StagehandTrace` against the recovered contract and assert trust-channel/state behavior.

## 12. Open Questions

- U-005 — trace migration/version compatibility must be finalized before 1.0.

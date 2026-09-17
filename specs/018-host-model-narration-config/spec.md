# FEAT-018 · Host Model & Narration Configuration

Live specification. Owner: `examples/virtual-classroom-host`. Tier T3. Corpus seed: `docs/corpus/specs/018-host-model-narration-config`. Issue
[#27](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/27), milestone
[#7](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/7).

Requirement identities are v2 (`FR-262..FR-266`). Corpus evidence is cited by surface and contract identity,
never by superseded Pass-9 requirement numbers.

## 1. Intent

Recover the host model & narration configuration capability from the pinned source and expose it as a registered plugin capability.

## 2. User Scenarios

1. Given a validated command, when it passes through the pipeline, then the owning plugin commits the expected state change.
2. Given a command that violates its schema, when validation runs, then it is rejected without host mutation.

## 3. Functional Requirements

The functional requirements for this feature are recovered from the pinned source referenced below.
Each owned surface is bound to the contract the pinned source declares. The schemas, behavioral
reducers, and failure cases are implemented in the owning package and verified by the parity exits
and the differential conformance harness.

## 4. Key Entities

Canonical definitions live in `docs/corpus/analysis/18_STATE_MODEL.md`.

## 5. Surface Bindings

| Surface | Requirement | Evidence |
|---|---|---|
| SURF-151..156 | FEAT-018 | Pinned source |

## 6. Non-Functional Envelope

- Plugin behavior is deterministic at the protocol boundary.
- Unmeasured performance values remain explicitly unspecified rather than invented.


## Requirement and task identities

Requirements: FR-262, FR-263, FR-264, FR-265, FR-266
Parity exits: TEST-227, TEST-228, TEST-229
Tasks: T-107, T-108, T-109, T-110, T-111

## 10. Divergence Register

DIV-007; DIV-009; U-002; U-003

## 11. Parity Exits

- **TEST-227..TEST-229** — behavioral parity for Host Model & Narration Configuration.

## 12. Tasks

- [ ] **T-107** through **T-111**: implement and converge.

## 13. Success Criteria

1. Every owned surface is reachable through the registry.
2. Behavioral tests cover the committer through the public path.
3. `pnpm check` is green.

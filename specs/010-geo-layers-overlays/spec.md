# FEAT-009 · Geospatial Layers, Flows & Temporal Overlays

Live specification. Owner: `plugins/geo-clio`. Tier T1. Corpus seed: `docs/corpus/specs/010-geo-layers-overlays`. Issue
[#18](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/18), milestone
[#6](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/6).

Requirement identities are v2 (`FR-214..FR-218`). Corpus evidence is cited by surface and contract identity,
never by superseded Pass-9 requirement numbers.

## 1. Intent

Recover the geospatial layers, flows & temporal overlays capability from the pinned source and expose it as a registered plugin capability.

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
| SURF-016..019 | FEAT-009 | Pinned source |

## 6. Non-Functional Envelope

- Plugin behavior is deterministic at the protocol boundary.
- Unmeasured performance values remain explicitly unspecified rather than invented.


## Requirement and task identities

Requirements: FR-214, FR-215, FR-216, FR-217, FR-218
Parity exits: TEST-194, TEST-195, TEST-196
Tasks: T-059, T-060, T-061, T-062, T-063

## 10. Divergence Register

DIV-002

## 11. Parity Exits

- **TEST-194..TEST-196** — behavioral parity for Geospatial Layers, Flows & Temporal Overlays.

## 12. Tasks

- [ ] **T-059** through **T-063**: implement and converge.

## 13. Success Criteria

1. Every owned surface is reachable through the registry.
2. Behavioral tests cover the committer through the public path.
3. `pnpm check` is green.

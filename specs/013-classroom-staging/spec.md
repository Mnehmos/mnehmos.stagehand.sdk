# FEAT-013 · Classroom Avatar, Room & Camera Staging

Live specification. Owner: `plugins/classroom`. Tier T1. Corpus seed: `docs/corpus/specs/013-classroom-staging`. Issue
[#22](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/22), milestone
[#7](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/7).

Requirement identities are v2 (`FR-235..FR-240`). Corpus evidence is cited by surface and contract identity,
never by superseded Pass-9 requirement numbers.

## 1. Intent

Recover the classroom avatar, room & camera staging capability from the pinned source and expose it as a registered plugin capability.

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
| SURF-052..056 | FEAT-013 | Pinned source |
| 079..081 | FEAT-013 | Pinned source |
| 124 | FEAT-013 | Pinned source |
| 136 | FEAT-013 | Pinned source |

## 6. Non-Functional Envelope

- Plugin behavior is deterministic at the protocol boundary.
- Unmeasured performance values remain explicitly unspecified rather than invented.


## Requirement and task identities

Requirements: FR-235, FR-236, FR-237, FR-238, FR-239, FR-240
Parity exits: TEST-208, TEST-209, TEST-210, TEST-211
Tasks: T-080, T-081, T-082, T-083, T-084, T-085

## 10. Divergence Register

None beyond global constitution rules.

## 11. Parity Exits

- **TEST-208..TEST-211** — behavioral parity for Classroom Avatar, Room & Camera Staging.

## 12. Tasks

- [ ] **T-080** through **T-085**: implement and converge.

## 13. Success Criteria

1. Every owned surface is reachable through the registry.
2. Behavioral tests cover the committer through the public path.
3. `pnpm check` is green.

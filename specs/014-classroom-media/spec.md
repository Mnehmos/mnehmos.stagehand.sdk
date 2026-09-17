# FEAT-014 · Classroom Projector & Media Orchestration

Live specification. Owner: `plugins/classroom`. Tier T1. Corpus seed: `docs/corpus/specs/014-classroom-media`. Issue
[#23](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/23), milestone
[#7](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/7).

Requirement identities are v2 (`FR-241..FR-246`). Corpus evidence is cited by surface and contract identity,
never by superseded Pass-9 requirement numbers.

## 1. Intent

Recover the classroom projector & media orchestration capability from the pinned source and expose it as a registered plugin capability.

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
| SURF-072..078 | FEAT-014 | Pinned source |
| 125..127 | FEAT-014 | Pinned source |
| 157..162 | FEAT-014 | Pinned source |

## 6. Non-Functional Envelope

- Plugin behavior is deterministic at the protocol boundary.
- Unmeasured performance values remain explicitly unspecified rather than invented.


## Requirement and task identities

Requirements: FR-241, FR-242, FR-243, FR-244, FR-245, FR-246
Parity exits: TEST-212, TEST-213, TEST-214, TEST-215
Tasks: T-086, T-087, T-088, T-089, T-090

## 10. Divergence Register

DIV-009

## 11. Parity Exits

- **TEST-212..TEST-215** — behavioral parity for Classroom Projector & Media Orchestration.

## 12. Tasks

- [ ] **T-086** through **T-090**: implement and converge.

## 13. Success Criteria

1. Every owned surface is reachable through the registry.
2. Behavioral tests cover the committer through the public path.
3. `pnpm check` is green.

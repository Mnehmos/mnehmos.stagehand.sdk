# FEAT-011 · Evidence, Sources & Scene Presentation

Live specification. Owner: `plugins/geo-clio + packages/authoring`. Tier T1. Corpus seed: `docs/corpus/specs/012-evidence-presentation`. Issue
[#20](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/20), milestone
[#6](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/6).

Requirement identities are v2 (`FR-224..FR-227`). Corpus evidence is cited by surface and contract identity,
never by superseded Pass-9 requirement numbers.

## 1. Intent

Recover the evidence, sources & scene presentation capability from the pinned source and expose it as a registered plugin capability.

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
| SURF-024..026 | FEAT-011 | Pinned source |
| 030..033 | FEAT-011 | Pinned source |

## 6. Non-Functional Envelope

- Plugin behavior is deterministic at the protocol boundary.
- Unmeasured performance values remain explicitly unspecified rather than invented.


## Requirement and task identities

Requirements: FR-224, FR-225, FR-226, FR-227
Parity exits: TEST-200, TEST-201, TEST-202
Tasks: T-069, T-070, T-071, T-072, T-073

## 10. Divergence Register

None beyond global constitution rules.

## 11. Parity Exits

- **TEST-200..TEST-202** — behavioral parity for Evidence, Sources & Scene Presentation.

## 12. Tasks

- [ ] **T-069** through **T-073**: implement and converge.

## 13. Success Criteria

1. Every owned surface is reachable through the registry.
2. Behavioral tests cover the committer through the public path.
3. `pnpm check` is green.

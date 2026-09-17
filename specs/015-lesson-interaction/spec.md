# FEAT-015 · Lesson Interaction & Pedagogical State

Live specification. Owner: `plugins/classroom`. Tier T1. Corpus seed: `docs/corpus/specs/015-lesson-interaction`. Issue
[#24](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/24), milestone
[#7](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/7).

Requirement identities are v2 (`FR-247..FR-253`). Corpus evidence is cited by surface and contract identity,
never by superseded Pass-9 requirement numbers.

## 1. Intent

Recover the lesson interaction & pedagogical state capability from the pinned source and expose it as a registered plugin capability.

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
| SURF-082..089 | FEAT-015 | Pinned source |
| 130..135 | FEAT-015 | Pinned source |

## 6. Non-Functional Envelope

- Plugin behavior is deterministic at the protocol boundary.
- Unmeasured performance values remain explicitly unspecified rather than invented.


## Requirement and task identities

Requirements: FR-247, FR-248, FR-249, FR-250, FR-251, FR-252, FR-253
Parity exits: TEST-216, TEST-217, TEST-218, TEST-219, TEST-220
Tasks: T-091, T-092, T-093, T-094, T-095, T-096

## 10. Divergence Register

None beyond global constitution rules.

## 11. Parity Exits

- **TEST-216..TEST-220** — behavioral parity for Lesson Interaction & Pedagogical State.

## 12. Tasks

- [ ] **T-091** through **T-096**: implement and converge.

## 13. Success Criteria

1. Every owned surface is reachable through the registry.
2. Behavioral tests cover the committer through the public path.
3. `pnpm check` is green.

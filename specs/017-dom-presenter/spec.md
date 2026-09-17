# FEAT-017 · Word-Anchored DOM Presenter Choreography

Live specification. Owner: `plugins/dom-presenter`. Tier T2. Corpus seed: `docs/corpus/specs/017-dom-presenter`. Issue
[#26](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/26), milestone
[#8](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/8).

Requirement identities are v2 (`FR-258..FR-261`). Corpus evidence is cited by surface and contract identity,
never by superseded Pass-9 requirement numbers.

## 1. Intent

Recover the word-anchored dom presenter choreography capability from the pinned source and expose it as a registered plugin capability.

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
| SURF-090..097 | FEAT-017 | Pinned source |
| 168 | FEAT-017 | Pinned source |

## 6. Non-Functional Envelope

- Plugin behavior is deterministic at the protocol boundary.
- Unmeasured performance values remain explicitly unspecified rather than invented.


## Requirement and task identities

Requirements: FR-258, FR-259, FR-260, FR-261
Parity exits: TEST-224, TEST-225, TEST-226
Tasks: T-102, T-103, T-104, T-105, T-106

## 10. Divergence Register

None beyond global constitution rules.

## 11. Parity Exits

- **TEST-224..TEST-226** — behavioral parity for Word-Anchored DOM Presenter Choreography.

## 12. Tasks

- [ ] **T-102** through **T-106**: implement and converge.

## 13. Success Criteria

1. Every owned surface is reachable through the registry.
2. Behavioral tests cover the committer through the public path.
3. `pnpm check` is green.

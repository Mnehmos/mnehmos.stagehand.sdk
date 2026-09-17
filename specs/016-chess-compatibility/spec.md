# FEAT-016 · Chess Annotation Compatibility

Live specification. Owner: `plugins/chess + packages/compatibility/llm-chess`. Tier T2. Corpus seed: `docs/corpus/specs/016-chess-compatibility`. Issue
[#25](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/25), milestone
[#8](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/8).

Requirement identities are v2 (`FR-254..FR-257`). Corpus evidence is cited by surface and contract identity,
never by superseded Pass-9 requirement numbers.

## 1. Intent

Recover the chess annotation compatibility capability from the pinned source and expose it as a registered plugin capability.

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
| SURF-001..004 | FEAT-016 | Pinned source |
| 167 | FEAT-016 | Pinned source |

## 6. Non-Functional Envelope

- Plugin behavior is deterministic at the protocol boundary.
- Unmeasured performance values remain explicitly unspecified rather than invented.


## Requirement and task identities

Requirements: FR-254, FR-255, FR-256, FR-257
Parity exits: TEST-221, TEST-222, TEST-223
Tasks: T-097, T-098, T-099, T-100, T-101

## 10. Divergence Register

DIV-008; U-002

## 11. Parity Exits

- **TEST-221..TEST-223** — behavioral parity for Chess Annotation Compatibility.

## 12. Tasks

- [ ] **T-097** through **T-101**: implement and converge.

## 13. Success Criteria

1. Every owned surface is reachable through the registry.
2. Behavioral tests cover the committer through the public path.
3. `pnpm check` is green.

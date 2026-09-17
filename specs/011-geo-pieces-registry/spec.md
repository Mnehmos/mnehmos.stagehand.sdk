# FEAT-010 · World Pieces & Controlled Registry Proposals

Live specification. Owner: `plugins/geo-clio`. Tier T1. Corpus seed: `docs/corpus/specs/011-geo-pieces-registry`. Issue
[#19](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/19), milestone
[#6](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/6).

Requirement identities are v2 (`FR-219..FR-223`). Corpus evidence is cited by surface and contract identity,
never by superseded Pass-9 requirement numbers.

## 1. Intent

Recover the world pieces & controlled registry proposals capability from the pinned source and expose it as a registered plugin capability.

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
| SURF-020..023 | FEAT-010 | Pinned source |
| 028 | FEAT-010 | Pinned source |

## 6. Non-Functional Envelope

- Plugin behavior is deterministic at the protocol boundary.
- Unmeasured performance values remain explicitly unspecified rather than invented.


## Requirement and task identities

Requirements: FR-219, FR-220, FR-221, FR-222, FR-223
Parity exits: TEST-197, TEST-198, TEST-199
Tasks: T-064, T-065, T-066, T-067, T-068

## 10. Divergence Register

None beyond global constitution rules.

## 11. Parity Exits

- **TEST-197..TEST-199** — behavioral parity for World Pieces & Controlled Registry Proposals.

## 12. Tasks

- [ ] **T-064** through **T-068**: implement and converge.

## 13. Success Criteria

1. Every owned surface is reachable through the registry.
2. Behavioral tests cover the committer through the public path.
3. `pnpm check` is green.

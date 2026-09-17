# FEAT-008 · Geospatial Highlighting & Annotation

Live specification. Owner: `plugins/geo-clio`. Tier T1. Corpus seed: `docs/corpus/specs/009-geo-annotation`. Issue
[#17](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/17), milestone
[#6](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/6).

Requirement identities are v2 (`FR-209..FR-213`). Corpus evidence is cited by surface and contract identity,
never by superseded Pass-9 requirement numbers.

## 1. Intent

Recover the geospatial highlighting & annotation capability from the pinned source and expose it as a registered plugin capability.

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
| SURF-009..015 | FEAT-008 | Pinned source |

## 6. Non-Functional Envelope

- Plugin behavior is deterministic at the protocol boundary.
- Unmeasured performance values remain explicitly unspecified rather than invented.


## Requirement and task identities

Requirements: FR-209, FR-210, FR-211, FR-212, FR-213
Parity exits: TEST-191, TEST-192, TEST-193
Tasks: T-054, T-055, T-056, T-057, T-058

## 10. Divergence Register

None beyond global constitution rules.

## 11. Parity Exits

- **TEST-191..TEST-193** — behavioral parity for Geospatial Highlighting & Annotation.

## 12. Tasks

- [ ] **T-054** through **T-058**: implement and converge.

## 13. Success Criteria

1. Every owned surface is reachable through the registry.
2. Behavioral tests cover the committer through the public path.
3. `pnpm check` is green.

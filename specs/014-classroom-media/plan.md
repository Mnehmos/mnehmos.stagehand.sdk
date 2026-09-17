# Plan — FEAT-014 Classroom Projector & Media Orchestration

## Target

Package owner: `plugins/classroom`. Dependencies: `FEAT-003`, `FEAT-005`, `FEAT-006`, `FEAT-012`.

## Architecture

Implement the capability behind domain-independent interfaces. Validation precedes resolution and commit.
Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types and schemas.
2. Implement the committer as a pure function of validated commands.
3. Add parity vectors for every owned surface.
4. Run `pnpm check`.

## Risks

Complexity: T1. Preservation posture: yes. Divergences: DIV-009.

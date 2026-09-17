# Plan — FEAT-017 Word-Anchored DOM Presenter Choreography

## Target

Package owner: `plugins/dom-presenter`. Dependencies: `FEAT-001`, `FEAT-002`, `FEAT-003`, `FEAT-005`.

## Architecture

Implement the capability behind domain-independent interfaces. Validation precedes resolution and commit.
Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types and schemas.
2. Implement the committer as a pure function of validated commands.
3. Add parity vectors for every owned surface.
4. Run `pnpm check`.

## Risks

Complexity: T2. Preservation posture: yes. Divergences: None beyond global constitution rules..

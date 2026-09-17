# Plan — FEAT-018 Host Model & Narration Configuration

## Target

Package owner: `examples/virtual-classroom-host`. Dependencies: `FEAT-013`, `FEAT-014`, `FEAT-015`.

## Architecture

Implement the capability behind domain-independent interfaces. Validation precedes resolution and commit.
Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types and schemas.
2. Implement the committer as a pure function of validated commands.
3. Add parity vectors for every owned surface.
4. Run `pnpm check`.

## Risks

Complexity: T3. Preservation posture: yes. Divergences: DIV-007; DIV-009; U-002; U-003.

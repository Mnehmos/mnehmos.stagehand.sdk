# Plan — FEAT-009 Geospatial Layers, Flows & Temporal Overlays

## Target

Package owner: `plugins/geo-clio`. Dependencies: `FEAT-007`, `FEAT-008`.

## Architecture

Implement the capability behind domain-independent interfaces. Validation precedes resolution and commit.
Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types and schemas.
2. Implement the committer as a pure function of validated commands.
3. Add parity vectors for every owned surface.
4. Run `pnpm check`.

## Risks

Complexity: T1. Preservation posture: yes. Divergences: DIV-002.

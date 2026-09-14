# Plan — FEAT-016 Chess Annotation Compatibility

## Target

Package owner: `plugins/chess + packages/compatibility/llm-chess`. Dependencies: FEAT-001, FEAT-002, FEAT-003.

## Architecture

Implement the capability behind domain-independent interfaces where the feature is T0; host/domain behavior remains in plugins. Validation precedes resolution and commit. Effects are traceable and deterministic at the protocol boundary.

## Implementation sequence

1. Define public types/contracts and machine-readable schemas.
2. Implement validators and pure transformations first.
3. Add host adapter/effect compiler only after validation tests pass.
4. Add parity vectors for every owned SURF.
5. Run cross-feature integration through the trace boundary.

## Risk

Complexity: medium. Preservation posture: compatibility-only. Any accepted differences must be represented by DIV IDs from spec.md.

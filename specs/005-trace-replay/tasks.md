# Tasks — FEAT-005 Trace, Replay & Diagnostics

Task identities are the canonical v2 slice `T-040..T-044` from
[issue #14](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/14). Generated task work
reconciles to these; no new task numbers are minted.

- [x] **T-040** Event bus + typed channels — FR-193, FR-194, FR-195
  - [x] Two disjoint unions: 7 public types and 7 production types, each with a typed payload
  - [x] Channel is a property of the event *type*, resolved through one channel map
  - [x] Extendable map for plugin and later-feature event types; conflicting re-registration refused
  - [x] Separate public/production emit and subscribe; unsubscribe; recording without a subscriber
  - [x] Monotonic sequence shared across both channels
  - [x] Injected clock, so recording is reproducible

- [x] **T-041** Versioned trace schema/serializer — FR-196
  - [x] `TraceEnvelope` with protocol, schema-set, plugin, and adapter versions, optional asset-manifest hash, session id, start time, and both event arrays
  - [x] `serializeTrace` and `parseTrace`
  - [x] Parse failures reported with a reason, never accepted with defaults
  - [x] Rejects an envelope whose event payloads do not match their declared type

- [x] **T-042** Replay runner — FR-198
  - [x] Reconstructs the committed effect sequence from public events only
  - [x] `diagnosticsOf` exposes production events as audit material, separate from replay
  - [x] No provider, model, clock, or resolver seam reachable
  - [x] Deterministic: the same envelope yields byte-identical output

- [x] **T-043** Migrator registry — FR-197
  - [x] Explicit migrators keyed by the version they read
  - [x] Chains resolved and applied in order
  - [x] An unregistered older version is refused
  - [x] A chain with a missing link names the link
  - [x] An envelope newer than the target is refused
  - [x] A migrator is never applied to a version it does not claim to read

- [x] **T-044** Privacy/ordering tests — TEST-181, TEST-184
  - [x] Per-type leakage canary: every production type refused on the public path, and the reverse
  - [x] Both channels unchanged by a refused emission
  - [x] Cross-channel ordering preserved through record, serialize, parse, and replay
  - [x] Interruption ordering across narration, readiness, and effect events

## Parity exits

| Exit | Covers | Evidence |
|---|---|---|
| TEST-181 | Public/private leakage canary corpus | `packages/trace/test/leakage-canary.test.ts` |
| TEST-182 | Serialize → load → replay without model access | `packages/trace/test/replay.test.ts` |
| TEST-183 | Version mismatch + migrator registry | `packages/trace/test/migrators.test.ts` |
| TEST-184 | Interruption ordering across narration/readiness/effects | `packages/trace/test/ordering.test.ts` |

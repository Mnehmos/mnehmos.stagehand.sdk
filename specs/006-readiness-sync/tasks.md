# Tasks — FEAT-006 Readiness & Synchronization

Task identities are the canonical v2 slice `T-045..T-048` from
[issue #15](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/15). Generated task work
reconciles to these; no new task numbers are minted.

- [x] **T-045** ReadinessGate primitive — FR-199
  - [x] Per-key channel with marked/settled state and a mark timestamp
  - [x] `mark` refreshes a pending channel rather than creating a second one
  - [x] `settle` on an unmarked key is harmless, not an error
  - [x] `settleAll` resolves every pending channel without advancing the generation
  - [x] Read-only accessors: generation, pending keys, per-key state

- [x] **T-046** Injectable clock/deadline policy — FR-200, FR-202
  - [x] `GateClock` seam carrying both time and timers
  - [x] `systemClock()` for production and `createVirtualClock()` for determinism
  - [x] Configurable default deadline, overridden per wait
  - [x] No ambient clock or timer read anywhere in the package
  - [x] A wait with nothing pending resolves immediately and schedules nothing

- [x] **T-047** Generation invalidation — FR-201
  - [x] `invalidate` increments the generation, settles all channels, clears the set
  - [x] A wait captures its generation at entry and reports staleness against that capture
  - [x] `resumable = settled && !stale && !timedOut`, computed inside the gate
  - [x] A late `settle` after invalidation cannot un-stale an earlier wait

- [x] **T-048** Trace integration + race tests — FR-203
  - [x] `gate.waited` observation with keys, duration, outcome, and outstanding keys
  - [x] Production channel via FEAT-005's channel map, wired as an optional observer
  - [x] Reporting is observational only; a gate with no observer behaves identically
  - [x] Race tests: late settle, invalidation mid-wait, repeated invalidation

## Parity exits

| Exit | Covers | Evidence |
|---|---|---|
| TEST-185 | Fake-clock timeout | `packages/readiness/test/timeout.test.ts` |
| TEST-186 | Generation invalidation race with late settle callbacks | `packages/readiness/test/invalidation.test.ts` |
| TEST-187 | Multi-key partial settlement | `packages/readiness/test/multi-key.test.ts` |

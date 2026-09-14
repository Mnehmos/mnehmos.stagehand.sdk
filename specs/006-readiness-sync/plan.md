# Plan — FEAT-006 Readiness & Synchronization

## Target

Package owner: `packages/readiness`. Dependencies: `@stagehand/runtime` (FEAT-003) and
`@stagehand/trace` (FEAT-005). No ambient time, no host types.

## Architecture

One channel map, one generation counter, one clock seam. The whole feature is that small, and the
difficulty is entirely in the ordering of invalidation against settlement.

```text
  mark(key) ──┐
  settle(key) ─┼──▶ channels: key → { pending, resolve, markedAt }   (FR-199)
  settleAll() ─┘            │
                            │  invalidate(): ++generation,
                            │                settle all, clear       (FR-201)
                            ▼
  wait(keys, deadlineMs) ──▶ races "all pending settled" against clock.schedule(deadline)
                            │
                            ▼
                     WaitResult { settled, stale, timedOut, resumable, outstanding, waitedMs }
                            │
                            └──▶ observer(observation) ──▶ gate.waited on production   (FR-203)
```

| Module | Responsibility | Requirements |
|---|---|---|
| `src/types.ts` | `GateClock`, `GateObserver`, `WaitResult`, `ChannelState` | FR-199, FR-200, FR-203 |
| `src/clock.ts` | `systemClock()` and `createVirtualClock()` | FR-202 |
| `src/gate.ts` | `ReadinessGate` | FR-199..FR-203 |
| `src/trace-observer.ts` | `traceGateObserver(bus)` | FR-203 |
| `src/index.ts` | Public surface | — |

### `settled` and `resumable` are different fields, and that is the feature

The naive implementation reports success when every awaited channel is settled. Invalidation settles
every channel, so an invalidated wait reports success — and the interrupted turn resumes, speaking
over the turn that replaced it. That is `INV-007`'s failure, and it is invisible to any test that
only checks "did the wait return".

So the result carries both. `settled` answers "are the channels resolved"; `resumable` answers "may
this work continue". They differ in exactly the case that matters. `resumable` is computed inside
the gate (`settled && !stale && !timedOut`) so no caller re-derives the rule and gets it subtly
wrong, and `TEST-186` asserts the pair.

### The clock seam carries timers, not just time

A clock that only reports `now()` cannot bound a wait without a `setTimeout`, and an ambient
`setTimeout` makes deadline tests either slow or flaky. So `GateClock` provides `schedule` too, and
`createVirtualClock()` ships in `src` — not as test scaffolding, but as a legitimate deterministic
clock a host can use when it wants reproducible readiness behaviour, and one a replay harness would
need. `TEST-185` asserts a timeout by advancing virtual time, never by sleeping.

### Nothing pending schedules nothing

A `wait` with no pending keys resolves synchronously and does not schedule a deadline. This matters
beyond tidiness: scheduling then immediately clearing a timer is the shape of a leak, and a host
under load with many no-op waits would accumulate them.

### Why the gate does not decide what a timeout means

`E_TIMEOUT`'s degradation policy belongs to the caller. Proceeding without the effect, speaking
anyway, or abandoning the turn are host decisions, and `FEAT-014` is where that choice is really
made. The gate returns control in bounded time; it does not choose.

## Implementation sequence

1. `types.ts` and `clock.ts` — the clock first, because every deadline test needs it and a test
   written against an ambient timer has to be rewritten later.
2. `gate.ts` — channels and settlement, then invalidation, then `wait` last, since `wait` is the only
   part that composes the others.
3. `trace-observer.ts` — the composition with FEAT-005.
4. `TEST-185`, `TEST-187`, `TEST-186` in that order: timeout and multi-key are straightforward, and
   writing them first means `TEST-186` is the last thing checked rather than the first thing
   skipped.
5. `pnpm check`.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| A stale wait resumes interrupted work | critical | `settled` and `resumable` are separate; `resumable` computed in one place; `TEST-186` asserts the pair. |
| A wait never resolves | critical | Every path resolves by settle or deadline; a wait with nothing pending resolves immediately; timeout asserted with virtual time. |
| A deadline test that sleeps | high | Virtual clock shipped in `src`; `TEST-185` advances it. A walk-clock test would be the tell. |
| A late settle un-stales an earlier wait | high | The wait captures its generation at entry and reports against that capture, never against the gate's current value. |
| A second wait for the same key loses the first | medium | Channels are keyed and shared; `wait` reads the same channel state `settle` writes, and `settleAll` resolves all of them. |
| An observer that throws breaks the gate | medium | Reporting is documented as observational. A throwing observer propagates — consistent with `EventBus` and with Constitution XII, which prefers a loud failure to a swallowed one. |

## Divergences reflected

None. The corpus records no feature-level divergence for `FEAT-006`, and this plan introduces none:
the deadline, the generation counter, and the channel model all follow `ENT-008`, `INV-006`, and
`INV-007` directly.

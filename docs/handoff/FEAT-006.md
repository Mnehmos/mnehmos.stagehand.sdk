# Handoff — FEAT-006 · Readiness & Synchronization

Milestone [#4](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/4) (M2 · Trace, readiness &
choreography). Feature issue: [#15](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/15).
Predecessor: [FEAT-005.md](FEAT-005.md).

## What changed and why

**`packages/readiness` is implemented and converged.** `FR-199..FR-203` authored, tasks
`T-045..T-048` complete, parity exits `TEST-185..TEST-187` passing. `pnpm check` green (7/7),
**328 tests** across 19 files.

Three decisions shaped it, and one was forced by a test.

### 1. `settled` and `resumable` are separate fields, and that *is* the feature

`invalidate` settles every channel, so a wait interrupted by a barge-in reports `settled: true`. A
caller treating "settled" as "carry on" resumes the superseded turn and speaks over the turn that
replaced it — `INV-007`'s failure, invisible to any test that only asks whether the wait returned.
`resumable` (`settled && !stale && !timedOut`) is computed inside the gate so nobody re-derives it.
Verified by mutation: collapsing `resumable` to `settled` failed 4 tests, each naming the
stale-resume case.

### 2. The clock seam carries timers as well as time

A clock that only reports `now()` cannot bound a wait without an ambient `setTimeout`, and an ambient
timer makes deadline tests slow or flaky — the worst trade in the feature whose entire job is bounding
a wait. `createVirtualClock` therefore ships in `src` rather than a test folder: a host wanting
reproducible readiness needs it, a replay harness needs it, and it is what lets `TEST-185` assert a
timeout by advancing time. Every assertion in that file advances a clock; **none sleeps**.

### 3. A wait is over the channels that exist when it begins — found by a test

`TEST-187` initially failed on a scenario I had not specified: `wait(['a','b'])` where `b` is marked a
moment *after* the wait starts. Both readings are defensible, and that is the problem — left to
arrival order, whether the wait covered `b` would depend on a microtask boundary, and a
synchronization primitive whose meaning depends on a race is not one.

So the verdict is fixed by channel *identity*: a wait snapshots the channels that exist at entry, a
key with no channel is already settled for that wait, and a re-marked key holds a new channel
belonging to the next wait. Documented in `FR-200`, pinned by three tests.

## Evidence

| Gate | Result |
|---|---|
| 1 `check:corpus` | PASS — 176/176 hashes; corpus validator PASS |
| 2 `check:constitution` | PASS |
| 3 `check:ids` | PASS — six live specs each cover their declared range exactly |
| 4 `check:workspaces` | PASS |
| 5 `check:boundaries` | PASS — readiness depends on runtime and trace, all core |
| 6 `typecheck` | PASS |
| 7 `test` | PASS — 328 tests (17 timeout, 13 invalidation, 15 multi-key, 6 trace integration, plus earlier features and the guard) |

**Mutation performed and restored:** collapsing `resumable` to `settled` → 4 `TEST-186` failures.

**A behavioural detail worth remembering:** a wait whose deadline fires is never resumable, *even in
the tick where everything also settled*. Fail-closed in both directions. One of my own tests tripped
on this first — it set a 100 ms deadline and then advanced 120 ms before settling — which is the rule
working as intended, not a bug.

## Deferred

- **No deadline *policy* beyond a configurable default.** The corpus specifies none, and inventing one
  would be inventing a timing contract.
- **The gate does not decide what a timeout means.** Whether to proceed without the effect, speak
  anyway, or abandon the turn is the caller's policy, and `FEAT-014` is where it is actually made.
  Recorded as scope in §14 rather than left implied.
- **A throwing observer propagates.** Consistent with `EventBus` and with Article XII — a loud failure
  beats a swallowed one — but it does mean an observer is not isolated from the gate. If a host needs
  isolation it should wrap its own observer rather than have this package guess an error policy.
- **No wait cancellation seam.** `invalidate` is the cancellation mechanism; a caller wanting to
  abandon one wait without disturbing others has no API for it, and no corpus evidence asks for one.

## Next step

**FEAT-004 · Compound Choreography & Beat IR** (`packages/core` + `packages/authoring`,
[#13](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/13), `FR-187..192`, `T-035..039`,
`TEST-177..180`). It is the last feature in M2 and the only one left unstarted. Its five surfaces
are `SURF-029 mark.clip`, `SURF-128 beat.started`, `SURF-129 beat.completed`, `SURF-164 Compound
blocks`, `SURF-165 Beat agent object`.

Three things to carry forward:

1. **`TEST-178` is `TEST-174` one level up.** "Atomic rejection with a mutation-counting fake host"
   is the same claim — a rejected group produces zero mutations — applied to a compound rather than a
   command. The mutation-counting committer already exists in
   `packages/runtime/test/fake-host.ts`; the question to answer first is whether an atomic group
   commits through **one** `commit` call or several, because that decides whether the batch seam
   above is sufficient or a new one is needed.
2. **`beat.started` and `beat.completed` are public**, and are already registered in
   `packages/trace/test/ordering.test.ts`'s downstream channel map. Registering them again on the same
   channel is idempotent, so composing FEAT-004 with FEAT-005 is a one-line map extension.
3. **`packages/core` and `packages/authoring` are still scaffolded.** They are this feature's
   packages, and `FR-187..192` is the first real content either will hold — worth deciding early
   which of the two owns the compound AST, since `packages/core` currently has no dependents and
   `packages/authoring` is depended on by nobody either.

**A milestone note:** M2 has three features and three are now done except FEAT-004, so the milestone
does not close yet. The trace and readiness foundations it needs are in place, and both were built
with the seams FEAT-004 will consume — the runtime's batch commit, the trace's extendable channel
map, and the readiness gate's bounded waits.

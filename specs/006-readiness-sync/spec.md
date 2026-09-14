# FEAT-006 · Readiness & Synchronization

Live specification. Owner: `packages/readiness`. Tier T0, complexity high, preservation posture
`yes`. Corpus seed: `docs/corpus/specs/005-readiness-sync/`. Issue
[#15](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/15), milestone
[#4](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/4).

Requirement identities are v2 (`FR-199..FR-203`). Corpus evidence is cited by surface and contract
identity (`SURF-###`, `CTR-###`), never by superseded Pass-9 requirement numbers.

## 1. Intent

Bound asynchronous effect settling with deadlines and cancellation generations, so narration and
choreography cannot deadlock waiting for a host, and cannot resume work that a barge-in already
superseded.

This is the smallest feature in the corpus by surface count — one surface, `SURF-142` — and among
the largest by risk. Its failure modes are not wrong values but two hangs:

- **A deadlock.** An effect never settles and the wait never returns, so the session stops.
- **A stale resume.** A wait *appears* to succeed because invalidation settled its channels, and the
  interrupted turn continues as though nothing had happened. This one is worse: the first is loud,
  the second is a superseded turn speaking over the turn that replaced it.

`INV-007` exists because the second failure is easy to build. Sections 3 and 13 treat it as the
primary obligation.

## 2. User Scenarios

1. **A host that never answers.** A projector is lowered and never reports ready. The wait reaches
   its deadline and returns a degraded result the caller can act on, rather than blocking the turn.
2. **A barge-in during a wait.** The user interrupts while narration is waiting for a camera to
   settle. `invalidate` runs, the wait returns, and the interrupted turn does **not** resume.
3. **Partial settlement.** Three keys are awaited and two settle. The wait stays pending until
   either all three settle or the deadline arrives, and reports which key was outstanding.
4. **Traceability.** Every wait leaves a production-channel record of what was awaited, how long it
   took, and whether it timed out — so "why did this turn stall" is answerable after the fact.

## 3. Functional Requirements

- **FR-199 · Channels and the gate primitive.** The gate MUST maintain a per-key channel with a
  marked/settled state and a mark timestamp, and MUST expose `mark`, `settle`, `settleAll`, and
  `invalidate`. `settle` on an unmarked key MUST be harmless rather than an error — a host reporting
  readiness nobody asked for is normal. Marking a key that is already pending MUST refresh the mark
  rather than create a second channel.
  → ENT-008 · CTR-123

- **FR-200 · Deadline-bounded waits.** `wait(keys, deadlineMs?)` MUST resolve when every requested
  key has settled **or** when the deadline elapses, whichever comes first, and MUST return which keys
  were still outstanding and how long it waited. A wait MUST never remain pending indefinitely
  (`INV-006`, `NFR-003`). If no key is pending, the wait MUST resolve immediately without scheduling
  a timer — a gate with nothing to wait for must not consume a deadline.

  A wait is over the channels that exist **when it begins**, identified by channel rather than by key
  name. A requested key with no channel is already settled as far as that wait is concerned, and a key
  re-marked while the wait is in flight holds a *new* channel belonging to the next wait — it does not
  retroactively become outstanding, and it does not keep an earlier wait alive. This matters because
  the alternative is determined by arrival order: whether a wait covers a channel marked a microtask
  after it began would otherwise depend on scheduling, and a synchronization primitive whose meaning
  depends on a race is not a synchronization primitive.
  → CTR-123 · E_TIMEOUT

- **FR-201 · Generation invalidation.** The gate MUST hold a generation counter. `invalidate` MUST
  increment it, settle every pending channel, and clear the channel set. A wait MUST report whether
  the generation changed during its lifetime, and MUST expose whether its result may be acted upon:
  a wait that settled **because of** invalidation is settled and stale, and MUST NOT be resumable.
  This is `INV-007`, and it is the reason `settled` and `resumable` are separate fields — collapsing
  them is precisely how a stale turn resumes.
  → ENT-008 · INV-007

- **FR-202 · Injected clock and deadline policy.** The gate MUST take its time source and its timers
  from an injected clock, and MUST NOT read an ambient clock or schedule an ambient timer. A default
  deadline MUST be configurable, and a per-wait deadline MUST override it. A deterministic virtual
  clock MUST be provided, so a caller can assert deadline behaviour without sleeping — a readiness
  test that waits on wall-clock time is a flaky test with a passing badge.
  → CTR-123 · NFR-003

- **FR-203 · Traceable waits.** Every completed wait — settled, timed out, or stale — MUST be
  reportable as a `gate.waited` observation carrying the awaited keys, the waited duration, the
  outcome, and the outstanding keys, on the **production** channel. Reporting MUST be optional and
  MUST NOT be load-bearing: a gate with no observer behaves identically in every other respect.
  → SURF-142 → production channel · Constitution VII

## 4. Key Entities

`ENT-008` (`ReadinessChannel`) — canonical definition in
`docs/corpus/analysis/18_STATE_MODEL.md`. Two invariants from that record govern this feature:

- **`INV-006`** — every wait resolves by settle or deadline. There is no third outcome and no path
  that leaves a promise pending.
- **`INV-007`** — a stale generation cannot resume interrupted work. Expressed mechanically as
  `resumable = settled && !stale && !timedOut`, computed inside the gate so no caller has to
  re-derive the rule and get it subtly wrong.

## 5. Surface Bindings

| Surface | Requirement | Contract | Corpus evidence |
|---|---|---|---|
| SURF-142 `gate.waited` | FR-203 | — | `Mnehmos/virtual-classroom@cd72536:src/stagehand/events.ts` |

The single owned surface is bound. `CTR-123` (`ReadinessGate`) carries no surface row
(`docs/corpus/00_TRACEABILITY.md` lists it under "extra API contracts without direct SURF rows") and
is bound by FR-199..FR-202.

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Waited keys all settle before the deadline | `settled: true`, `stale: false`, `resumable: true`, `waitedMs` reflects elapsed time. |
| A key never settles | `timedOut: true`, `settled: false`, `resumable: false`, outstanding names the key. |
| Invalidation during a wait | `settled: true` (invalidation settled the channels), `stale: true`, `resumable: false`. |
| Nothing pending when `wait` is called | Resolves immediately, `waitedMs` 0, no timer scheduled. |
| A requested key is marked after the wait began | Not outstanding for that wait; it belongs to the next one. |
| A requested key is re-marked mid-wait | The earlier wait reports it settled; the new channel is not its concern. |
| `settle` on an unmarked key | No error; the channel is not created. |
| `mark` on an already-pending key | The mark is refreshed; one channel, not two. |
| Deadline elapses with some keys settled | Reports the settled outcome as outstanding, not as success. |
| No observer configured | Identical behaviour; nothing is reported. |

## 7. Error Catalog

This feature raises no new `E_*` codes. `E_TIMEOUT` is the *reported outcome* of a deadline
(`timedOut: true`), not an exception: a deadline is an expected path with a degradation policy, and
throwing would force every caller into a try/catch for a case the gate exists to make routine.

## 8. State Transitions

A channel moves `idle → marked/pending → settled → idle`. `invalidate` moves every channel to
settled and clears the set while advancing the generation. This feature does not parse, validate,
resolve, commit, or fill the trace envelope.

## 9. Non-Functional Envelope

- **NFR-003, deadline-bounded and generation-safe.** Asserted by `TEST-185` (fake-clock timeout) and
  `TEST-186` (late settle after invalidation).
- **NFR-004, interrupt safety.** In-flight waits are generation-stamped; late callbacks cannot resume
  a superseded turn.

## 10. Divergence Register

None beyond the global constitution rules. The corpus records no feature-level divergence for
`FEAT-006`, and none is proposed.

## 11. Parity Exits

- **TEST-185** — Fake-clock timeout.
- **TEST-186** — Generation invalidation race with late settle callbacks.
- **TEST-187** — Multi-key partial settlement.

## 12. Tasks

- **T-045** ReadinessGate primitive · **T-046** Injectable clock/deadline policy ·
  **T-047** Generation invalidation · **T-048** Trace integration + race tests

## 13. Success Criteria

1. A wait over a key that never settles resolves at its deadline with the virtual clock advanced,
   and the assertion involves no wall-clock sleeping.
2. A wait interrupted by `invalidate` reports `resumable: false` — the `INV-007` assertion, and the
   one most likely to be missed, since the naive implementation reports success.
3. A late `settle` after invalidation neither un-stales the earlier wait nor leaves a subsequent
   wait confused about its generation.
4. `pnpm check` is green.

## 14. Open Questions

No blocking unknowns. One scope decision is recorded rather than deferred: **the gate reports a
timeout; it does not decide what to do about one.** `E_TIMEOUT`'s "degraded/safe-failure policy" is
the caller's — whether to proceed without the effect, speak anyway, or abandon the turn is a host
decision, and `FEAT-014`'s media orchestration is where it is actually made. The gate's obligation
is to return control in bounded time, not to choose.

# @stagehand/readiness

Deadline-bounded, generation-stamped synchronization gates for asynchronous host effects.

| | |
|---|---|
| Layer | `core` |
| Kind | `package` |
| Directory | `packages/readiness` |
| Owner features | FEAT-006 |
| Internal dependencies | `@stagehand/runtime`, `@stagehand/trace` |
| Status | implemented — FEAT-006 converged through T-045..T-048 |

## Usage

```ts
import { ReadinessGate, traceGateObserver } from '@stagehand/readiness';
import { ChannelMap, EventBus } from '@stagehand/trace';

const channels = ChannelMap.core().extend({ 'gate.waited': 'production' });
const bus = new EventBus({ sessionId: 's1', channels });
const gate = new ReadinessGate({ defaultDeadlineMs: 2000, observer: traceGateObserver(bus) });

gate.mark('camera');
camera.onSettled(() => gate.settle('camera'));

const wait = await gate.wait(['camera']);          // bounded: settle or deadline, never neither
if (wait.resumable) continueTurn();
else if (wait.timedOut) proceedDegraded(wait.outstanding);
else if (wait.stale) { /* a barge-in superseded this turn — do not speak */ }
```

For deterministic tests and replay, inject a clock:

```ts
const clock = createVirtualClock();
const gate = new ReadinessGate({ clock, defaultDeadlineMs: 100 });
const waiting = gate.wait(['camera']);
clock.advance(100);            // fires the deadline; nothing sleeps
```

## What this module guarantees

- **A wait always returns** (`INV-006`, `NFR-003`). Every path resolves by settlement or by deadline;
  there is no third outcome and no path that leaves a promise pending.
- **`settled` and `resumable` are different fields** (`INV-007`). `invalidate` settles every channel,
  so a wait interrupted by a barge-in reports `settled: true`. A caller treating "settled" as "carry
  on" resumes the superseded turn and speaks over the turn that replaced it. `resumable`
  (`settled && !stale && !timedOut`) is computed inside the gate so nobody re-derives it.
- **No ambient time.** Time and timers both come from the injected clock, and a fired deadline is
  never resumable even in the tick where everything also settled.
- **A wait is over the channels that exist when it begins**, identified by channel rather than key
  name. Otherwise whether a wait covered a channel marked a microtask later would depend on
  scheduling, and a synchronization primitive whose meaning depends on a race is not one.

## What this module does *not* do

Decide what a timeout means. Whether to proceed without the effect, speak anyway, or abandon the turn
is the caller's policy — `FEAT-014`'s media orchestration is where that choice is actually made. The
gate's obligation is to return control in bounded time, and it reports a timeout rather than throwing
one, because a deadline is an expected path rather than an exception.

## Requirements owned

| Feature | v2 requirements | v2 tasks | Parity exits |
|---|---|---|---|
| FEAT-006 Readiness & Synchronization | FR-199..FR-203 | T-045, T-046, T-047, T-048 | TEST-185, TEST-186, TEST-187 |

## Corpus seed

- FEAT-006: `1` surfaces, `1` v1 requirements, `1` v1 tests — seed spec `docs/corpus/specs/`, issue [#15](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/15)

See [V2_ID_LEDGER.md](../../docs/governance/V2_ID_LEDGER.md) for the canonical identity allocation and
[SPEC_KIT_RUNBOOK.md](../../docs/governance/SPEC_KIT_RUNBOOK.md) for the per-feature workflow.

# Handoff — FEAT-003 · Effect Compilation, Resolution & Safe Execution

Closes milestone [#3](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/3) (**M1 · Trust
kernel**). Feature issue: [#12](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/12).
Predecessors: [M1.md](M1.md) (FEAT-001), [FEAT-002.md](FEAT-002.md) (FEAT-002).

## What changed and why

**`packages/runtime` is implemented and converged**, which completes the trust kernel. The chain is
now whole: `@stagehand/parser` → `@stagehand/registry` → `@stagehand/runtime`, with the host adapter
as the single place core can change anything. `pnpm check` green (7/7), 202 tests across 11 files.

Four decisions shaped it.

### 1. The fake host was written before the executor, and it mattered

The FEAT-002 handoff said to build the mutation-counting host first. That paid off in a way I did not
anticipate: a mutation that touched the committer on the *rejection* path was caught by
`commitCalls`, **not** `mutationCount`. The host had been asked without anything landing, and a
double counting only successful writes would have reported that mutation as clean. Recording
attempts and landed writes separately is what made the difference visible.

### 2. References are discovered from declared types, not from a list of actions

`entityRef` / `entityRefList` are the registry's own value types, so the runtime asks the schema
rather than consulting a table. A capability that starts carrying a reference is handled here with
no change to this package. A per-action list would be the drift class `DIV-006` removed,
reintroduced one package over.

### 3. Writing the tests found a real bug in the implementation

`referenceSlots` checked whether a value was a *list* but never whether its type was a *reference* —
so every kwarg was treated as an entity reference and `whiteboard.text id=t` came back unresolved.
Five tests failed on it. This shape of type confusion hides well: it presents as "the registry has
nothing" rather than "the code asked the wrong question".

### 4. One guarantee is stated, not overclaimed

`effector` receives the whole batch in one call; whether a partial write is possible *inside* that
call belongs to the adapter. Core cannot see host state, so `EffectCommitter`'s contract states the
split plainly and the README repeats it under **"what this module does *not* guarantee"**. The
alternative — a prepare/commit/rollback protocol — would force every adapter to implement two-phase
commit for a guarantee core cannot verify, and the corpus evidences a single "authorized commit"
step, not a distributed transaction.

## Evidence

| Gate | Result |
|---|---|
| 1 `check:corpus` | PASS — 176/176 hashes; corpus validator PASS |
| 2 `check:constitution` | PASS — verbatim region matches |
| 3 `check:ids` | PASS — four live specs each cover their declared range exactly; all cited DIVs registered |
| 4 `check:workspaces` | PASS |
| 5 `check:boundaries` | PASS — runtime depends only on parser and registry, all core; no host/library edge exists |
| 6 `typecheck` | PASS |
| 7 `test` | PASS — 202 tests (17 transactional, 15 compiler, 18 resolution-fuzz, plus parser/registry/guard) |

**Negative tests performed and restored:**

- Touching the committer on the rejection path → 3 `TEST-174` failures, naming `commitCalls`.
- Committing effect-by-effect instead of one batch → `TEST-175` failure on the single-call assertion.
- (`TEST-174` in this feature) `check:ids` rejecting an out-of-range FR, a `three` dependency, an
  unterminated span regression, and an unregistered `DIV-011` — all from earlier features, still
  standing.

**A test I wrote and then deleted.** It claimed to catch per-effect commits via a throwing host. But
the fake host throws before recording, so a per-effect implementation leaves exactly as many
mutations behind as a batched one: zero. The test passed on the mutation it was supposed to catch. It
now asserts the guarantee the runtime actually owns — one call, not retried — and points at
`TEST-175` for the batching shape. A test that cannot fail for the reason it names is worse than no
test, because it reads as coverage.

## Milestone M1 is closed

| Feature | Package | Requirements | Tasks | Parity exits | Tests |
|---|---|---|---|---|---|
| FEAT-001 | `packages/parser` | FR-168..174 | T-019..024 | TEST-168..170 | 45 |
| FEAT-002 | `packages/registry` | FR-175..180 | T-025..029 | TEST-171..173 | 96 |
| FEAT-003 | `packages/runtime` | FR-181..186 | T-030..034 | TEST-174..176 | 50 |

`@stagehand/core` and `@stagehand/authoring` remain scaffolded: they are **FEAT-004's** packages, not
unfinished M1 work.

## Deferred

- **No build pipeline.** `package.json#exports` still points at `dist/`, which does not exist.
  `vitest` resolves cross-package imports to workspace source via an alias map derived from
  `docs/governance/workspaces.json`. A real build is needed before anything consumes these packages
  from `dist/` — and it is now the largest structural gap, since three packages are implemented.
- **`spatial` validation layer has no core implementation**, by design: every concrete spatial rule
  belongs to a plugin. The slot exists and the ordering is enforced.
- **Differential run of the corpus conformance harness** against `@stagehand/parser` (carried forward
  from FEAT-001). Still the strongest available parity signal for the parser.
- **`E_TIMEOUT` is catalogued but never raised here** — it belongs to FEAT-006.

## Next step

**M2 · Trace, readiness & choreography.** Three features depend only on the now-closed trust kernel,
so they can proceed in this order:

1. **FEAT-005 · Trace, Replay & Diagnostics** (`packages/trace`, issue
   [#14](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/14), `FR-193..198`,
   `T-040..044`, `TEST-181..184`). **Do this first.** FEAT-006 depends on it, and it is the natural
   consumer of everything this milestone built: `RuntimeEvent` already carries its `channel`
   discriminant, precisely so the trace layer can split public from production without re-deriving
   which is which. `DIV-005` is normative — version the envelope *before* anything is written to it,
   because a migrator registry retrofitted to unversioned traces is a rewrite.
2. **FEAT-006 · Readiness & Synchronization** (`packages/readiness`,
   [#15](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/15), `FR-199..203`, `T-045..048`,
   `TEST-185..187`). Its governing risk is a deadlock or a stale-generation resume, so build the
   **injectable clock first** — `TEST-185` and `TEST-186` are both unusable without one, and a
   readiness test that sleeps is a flaky test wearing a passing badge.
3. **FEAT-004 · Compound Choreography & Beat IR** (`packages/core` + `packages/authoring`,
   [#13](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/13), `FR-187..192`, `T-035..039`,
   `TEST-177..180`). Last of the three, because it sits on top of a stable runtime: atomic-group
   rejection is `TEST-178`, and it should be asserted with the mutation-counting fake host that
   already exists — one `commit` call for the group, or none.

Two things to carry forward into all three:

- **`TEST-174`'s pattern generalises.** Assert the safety property once per path, not once in
  aggregate, and prefer a double that can testify over one that merely looks right. `TEST-178` is
  the same claim one level up (atomic groups) and deserves the same treatment.
- **`DIV-007` remains the easiest boundary to cross invisibly.** `check:boundaries` catches declared
  dependencies; it cannot catch a dynamic `require` or a type-only import. The review question is
  whether a package compiles against a seam it *declared* or a host it *found*.

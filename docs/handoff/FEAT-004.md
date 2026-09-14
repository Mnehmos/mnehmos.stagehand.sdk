# Handoff — FEAT-004 · Compound Choreography & Beat IR

Closes milestone [#4](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/4) (**M2 · Trace,
readiness & choreography**). Feature issue: [#13](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/13).
Predecessors: [FEAT-005.md](FEAT-005.md), [FEAT-006.md](FEAT-006.md).

## What changed and why

**`packages/core` and `packages/authoring` are implemented and converged.** `FR-187..FR-192`
authored, tasks `T-035..T-039` complete, parity exits `TEST-177..TEST-180` passing. `pnpm check`
green (7/7), **383 tests** across 23 files.

Four decisions shaped it.

### 1. Group execution composes the trust kernel rather than duplicating it

Per command it calls the runtime's exported stages — `validateCommand`, `runCompilerPasses`,
`canonicalizeCommandEntityRefs` — and commits **once**. A second validation path inside this package
would be a second place for the trust rules to live, and Constitution II exists to stop exactly that.
The only thing this package adds is the *ordering*: every member validated before any is committed.

That ordering is the whole of atomicity within `EffectCommitter`'s contract, since atomicity of the
write belongs to the adapter. A group cannot promise what a single command cannot.

### 2. A limitation declared rather than hidden

`ENT-004` records that the recovered segment model **flattens** nested compounds into their parent's
command list: "compounds form a tree during parsing even though current segment types flatten child
compounds to command arrays." So `[sequence][parallel][a][b][end][end]` compiles to **one** sequence
whose commands are `[a, b]` — the `parallel` boundary is gone, and so is any inner atomicity.

I did **not** build a tree I cannot construct. Reconstructing inner boundaries would mean a second
parser in this package or a tree-preserving output added to `FEAT-001`, and neither is justified by
corpus evidence. Instead the limitation is documented on `CompoundNode.commands`, declared in
`FR-188`, stated in the README, and **pinned by a golden** — a consumer that assumed otherwise would
build a scheduler on a boundary that was never there. `specs/006-compound-choreography/spec.md` §14
records where to revisit it.

This is the judgement call in this feature worth disagreeing with. The alternative reading — that
"Compound AST" implies a real tree — is defensible, and it would require extending a converged
feature. I chose faithful-and-declared over impressive-and-invented.

### 3. `mark.clip` is an ordinary capability

Registered with a schema and committed through the normal pipeline. A command with a privileged path
sits outside the trust boundary, and a boundary with an exception is a policy with a known hole,
not a boundary. Tested both ways.

### 4. Determinism proven by poisoning

`Date.now` and `setTimeout` are replaced with throwing functions while compiling and executing, and a
group with `pause=60000` is asserted to return immediately. The IR carries the number; it does not
honour it. Honouring it is a host's job, with `FEAT-006`'s bounded wait.

## Evidence

| Gate | Result |
|---|---|
| 1 `check:corpus` | PASS — 176/176 hashes; corpus validator PASS |
| 2 `check:constitution` | PASS |
| 3 `check:ids` | PASS — seven live specs each cover their declared range exactly |
| 4 `check:workspaces` | PASS |
| 5 `check:boundaries` | PASS — core depends on parser, registry, runtime; **not** trace |
| 6 `typecheck` | PASS |
| 7 `test` | PASS — 383 tests (15 nesting goldens, 14 atomic group, 9 scheduler metadata, 17 beat object, plus earlier features and the guard) |

**Mutations performed and restored:**

- Removing the atomic short-circuit → 4 `TEST-178` failures, including the per-kind `commitCalls`
  assertions.
- Committing per effect instead of once → 4 `TEST-178` failures on the single-call claim.

## Milestone M2 is closed

| Feature | Package(s) | Requirements | Tasks | Parity exits | Tests |
|---|---|---|---|---|---|
| FEAT-005 | `packages/trace` | FR-193..198 | T-040..044 | TEST-181..184 | 75 |
| FEAT-006 | `packages/readiness` | FR-199..203 | T-045..048 | TEST-185..187 | 51 |
| FEAT-004 | `packages/core`, `packages/authoring` | FR-187..192 | T-035..039 | TEST-177..180 | 55 |

The trust kernel (M1) plus M2 are now complete: **seven features converged, 383 tests, seven gates**.

## Deferred

- **Beat lifecycle reporting is wired, not connected.** `executeBeat` reports through an injected
  observer; a host must connect it to a bus whose channel map carries `beat.started` and
  `beat.completed` as `public`. `packages/trace` already registers both as such, so it is a one-line
  extension — but nothing asserts the end-to-end path the way `TEST-184` and the readiness
  integration test do for their events.
- **No build pipeline.** `exports` still points at `dist/`, which does not exist; `vitest` resolves
  workspace imports from source. With eight packages implemented this is now clearly the largest
  structural gap, and it should land before anything consumes a package from `dist/`.
- **The corpus conformance harness has still not been run *against* the parser** — ported, not
  differential. Carried forward since FEAT-001.
- **No intra-compound group boundaries** (see §2 above).
- **`packages/authoring`'s FEAT-011 surfaces remain scaffolded.** Presentation and receipt linting are
  that feature's, not unfinished FEAT-004 work.

## Next step

**Milestone M3 · FEAT-012 Shared Whiteboard Canvas** (`plugins/whiteboard`,
[#21](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/21), `FR-228..234`, `T-074..079`,
`TEST-203..207`). It is the first **plugin**, and therefore the first real test of whether the core
boundary holds from the other side.

Three things to carry forward:

1. **Build the build pipeline first, or at least decide the answer.** M3 introduces the first
   non-core package, and `check:boundaries` currently enforces dependency *declarations* — which is
   only half the boundary story once a plugin can legitimately import renderers. A build that emits
   `dist/` would also let the parity suite run against built artifacts, which is closer to how a
   consumer experiences the SDK.
2. **FEAT-012's dependency list is the first place the ledger and the corpus disagree**
   (`DR-002`). The issue graph includes `FEAT-005` and `FEAT-006` — trace and readiness — which the
   corpus ledger does not. That matters here because `T-074`'s board revision model and
   `T-077`'s truth/thinking reducers will want `board.revision.committed` on the trace, and
   `TEST-207`'s board-target resolution is a readiness question. Treat the issue graph as canonical,
   as `DR-002` says, and wire those seams rather than re-deriving them.
3. **`TEST-204` is a divergence regression** — "hide-vs-clear divergence regression" — so check
   `docs/corpus/33_DIVERGENCE_REGISTER.md` before implementing. `DIV-001` through `DIV-009` are
   normative, and `TEST-204` is the first parity exit that exists specifically to keep one of them
   from being undone.

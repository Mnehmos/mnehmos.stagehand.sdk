# Spec Kit Runbook

The per-feature workflow for this repository. It follows the queue in
`docs/corpus/spec-kit-seed/SPEC_KIT_COMMAND_QUEUE.md`, adjusted for this repository's paths and
for the v2 identity scheme.

## The loop

For each feature, in dependency order:

```
/speckit-specify → /speckit-clarify → /speckit-plan → /speckit-checklist
                 → /speckit-tasks → /speckit-analyze → implement → /speckit-converge
```

Then `pnpm check`. The feature is not done because generation stopped; it is done when its parity
exits pass and `pnpm check` is green.

Spec Kit 1.0.7 installs these as skills (`/speckit-<name>`), initialised for the `claude`
integration. If a command is unavailable in your agent, read the corresponding prompt at
`.claude/skills/speckit-<name>/SKILL.md` and follow it directly — the skills are prompt templates,
not magic.

## Re-grounding rule

**Never seed a phase from the previous phase's output.** Read the feature's canonical seed in
`docs/corpus/specs/` plus the named source artifacts, every time. A phase seeded from a summary of
the last phase compounds the summary's errors.

## Step 0 — pick the feature

`docs/governance/v2-ids.json` is the machine-readable ledger; `V2_ID_LEDGER.md` is the readable
one. Each feature entry carries:

- `v2.fr_range` — the requirement numbers you must author into (reserved, currently undefined)
- `v2.task_ids` — the task identities from the issue graph; your generated tasks must reconcile to
  these, not mint new ones
- `parity_exits` — the `TEST-###` exits with their acceptance criteria
- `v1_evidence` — the corpus surfaces, requirements, tests, and divergences to author from
- `deps_issue_graph` — what must land first
- `issue` / `milestone_issue` — the GitHub issue pair for this work

## Step 1 — `/speckit-specify`

Seed from the corpus spec, and author the requirement statements in **v2 ID space**.

| Input | Where |
|---|---|
| Corpus seed spec | `docs/corpus/specs/<NNN-slug>/spec.md` |
| Machine-readable contracts | `docs/corpus/specs/<NNN-slug>/contracts/` |
| Requirement numbers to author into | `v2.fr_range` for this feature in the ledger |
| Feature intent and task titles | the feature issue, e.g. [#10](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/10) |
| Traceability for each surface | `docs/corpus/00_TRACEABILITY.md` |

The corpus numbers requirements per owned surface; v2 numbers them per coherent capability. A
feature therefore authors *fewer* requirements than its corpus `v1_evidence.corpus_fr_count`,
covering the same surfaces. Consolidate; do not invent capability the corpus does not evidence.
Every v2 requirement must trace back to at least one corpus surface and requirement.

Output lands in `specs/<n>-<slug>/` — Spec Kit assigns `<n>` at creation; the slug is fixed in the
ledger.

## Step 2 — `/speckit-clarify`

Seed **only** from the feature's Open Questions and `U-###` references — those in
`docs/corpus/specs/<NNN-slug>/spec.md` and `docs/corpus/analysis/24_UNKNOWNS.md`. Do not invent
ambiguity to have something to clarify. `U-007`, `U-008`, `U-009`, and `U-010` are already resolved
as target-contract decisions; `U-002` and `U-003` are license questions for the maintainer, not
specification questions.

## Step 3 — `/speckit-plan`

Seed from `docs/corpus/specs/<NNN-slug>/plan.md`, `data-model.md`, and `contracts/`. The plan's
"Target" section names the owning package; that package is fixed by
`docs/governance/workspaces.json` and is checked by `pnpm check:workspaces`.

## Step 4 — `/speckit-checklist`

Seed from the feature's rows in `docs/corpus/32_PARITY_SUITE.md` — the `Method` and `Expected`
columns are the checklist's substance.

## Step 5 — `/speckit-tasks`

Reconcile generated tasks to the stable `T-###` identities in `v2.task_ids`. **Do not mint new task
numbers.** If the work genuinely needs more granularity than the issue graph provides, that is a
change to `docs/governance/v2-allocation.json` plus the corresponding issue — not a local
invention.

## Step 6 — `/speckit-analyze`

Cross-artifact consistency: specification ↔ plan ↔ tasks ↔ the corpus evidence. Any corpus
inconsistency gets fixed before implementation, not worked around during it.

## Step 7 — implement

- Behavior lives in the owning package only. Do not spread a feature across packages the ledger
  does not name.
- `pnpm check` before claiming anything.
- New behavior needs a test that would fail without it.
- Anything that changes recovered behavior needs an explicit `DIV-###` with rationale and a parity
  note (Constitution X). Check `docs/corpus/33_DIVERGENCE_REGISTER.md` first — `DIV-001..009` are
  already normative and your implementation must reflect them.

## Step 8 — `/speckit-converge`

Converge against the feature spec and `docs/corpus/32_PARITY_SUITE.md`. Append remaining work until
converged, or until an accepted `DIV-###` explains the difference. Then tick the feature's boxes
on its GitHub issue.

## Feature order

Dependency order from `deps_issue_graph`. The critical path is:

```
FEAT-001 parser
  └─ FEAT-002 registry
       └─ FEAT-003 runtime
            ├─ FEAT-005 trace ── FEAT-006 readiness
            │                     └─ FEAT-012 whiteboard
            └─ FEAT-004 choreography
```

Then the domain plugins (`FEAT-007..011` geo), then classroom (`FEAT-013..015`, `FEAT-018`), then
compatibility (`FEAT-016`, `FEAT-017`). The milestone grouping is in the ledger and on
[issue #1](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/1).

## What "converged" means

Not "the code is written". Converged means:

- Every `FR-###` in the feature's range has an implementation and at least one test.
- Every parity exit in `parity_exits` passes, or maps to an accepted `DIV-###`.
- Every owned corpus surface is reachable through the public contract it was specified at.
- `pnpm check` is green.
- No superseded Pass-9 identity appears anywhere in live code or specs.

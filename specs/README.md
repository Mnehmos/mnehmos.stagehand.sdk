# Live feature specs

This directory holds the **live** Spec Kit feature specs — the ones the implementation is built
from. It is empty at M0 by design.

## Why it is empty

The frozen corpus at `docs/corpus/specs/` already contains 18 fully-formed feature specs, but they
are numbered in the **superseded Pass-9 scheme** (one requirement per owned surface). The
implementation graph declares a consolidated **v2** scheme that replaces it:

| | Superseded (corpus) | Canonical (v2) |
|---|---|---|
| Requirements | `FR-001`..`FR-167` | `FR-168`..`FR-266` |
| Parity tests | `TEST-001`..`TEST-167` | `TEST-168`..`TEST-229` |
| Tasks | `T-001`..`T-018` | `T-019`..`T-111` |

The v2 ranges are reserved and enforced, but their **requirement statements do not exist as
artifacts yet**. Copying a corpus spec into this directory would import superseded identities into
live spec content, which `pnpm check:ids` rejects.

## What goes here

One directory per feature, created by `/speckit-specify`:

```text
specs/<n>-<slug>/spec.md        # authored in v2 ID space
specs/<n>-<slug>/plan.md
specs/<n>-<slug>/tasks.md       # reconciled to the ledger's T-### ids
specs/<n>-<slug>/data-model.md
specs/<n>-<slug>/contracts/
specs/<n>-<slug>/checklists/
```

Spec Kit assigns `<n>` at creation time. The `<slug>` is fixed per feature in
`docs/governance/v2-ids.json` (`v2.fr_range`, `v2.task_ids`, `parity_exits`, and `v1_evidence`
give you the numbers and the seed material).

The seed for each feature is `docs/corpus/specs/<NNN-slug>/`. The corpus directory numbering does
not match feature numbering — `FEAT-004` seeds from `docs/corpus/specs/006-compound-choreography/`,
for example. The ledger's `Corpus seed` line per feature gives the exact path. Do not guess it.

Full workflow: [`docs/governance/SPEC_KIT_RUNBOOK.md`](../docs/governance/SPEC_KIT_RUNBOOK.md).

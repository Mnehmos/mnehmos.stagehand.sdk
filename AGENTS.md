# AGENTS.md

Operating instructions for any coding agent working in this repository. Read this before
generating anything. It is deliberately short; the detail lives in the files it points to.

## Read first

1. `PROJECT_CONTEXT.md` — what this is, who it is for, the constraints that must never bend.
2. `.specify/memory/constitution.md` — the twelve governing articles. They win all disagreements.
3. `docs/governance/V2_ID_LEDGER.md` — the canonical identity allocation for the work you are
   about to do. Every requirement, task, and test you write is numbered from here.
4. `docs/governance/SPEC_KIT_RUNBOOK.md` — the per-feature workflow, in order.

## The validation command

```bash
pnpm check
```

This is the only definition of "green". It runs seven gates in order and stops at the first
failure:

| Gate | Command | What it proves |
|---|---|---|
| 1 | `pnpm check:corpus` | The imported corpus is byte-identical to its hash manifest **and** internally consistent (167 live surfaces, 167 requirements, 25 API contracts owned once). |
| 2 | `pnpm check:constitution` | `.specify/memory/constitution.md` still embeds `docs/corpus/00_CONSTITUTION.md` verbatim. |
| 3 | `pnpm check:ids` | The v2 identity ranges are a clean partition, every corpus surface has exactly one v2 feature owner, and no live spec reuses a superseded Pass-9 ID. |
| 4 | `pnpm check:workspaces` | The workspace tree is byte-identical to what `docs/governance/workspaces.json` generates. |
| 5 | `pnpm check:boundaries` | No core package depends on a renderer, map, model provider, speech, media, DOM, chess, plugin, or example. |
| 6 | `pnpm typecheck` | `tsc` over every workspace source. |
| 7 | `pnpm test` | `vitest run`. |

Run it yourself and report what actually ran. Do not claim a gate passed that you did not run,
and do not weaken a gate to make a change land — the gates are the product's trust boundary
expressed as code (Constitution XII: swallowed validation errors are forbidden).

## Operating model

**Propose → Validate → Commit.** One logical unit per proposal. Run `pnpm check` before you claim
anything. If you cannot run a gate, say which one and why.

**Re-ground every Spec Kit phase from the corpus, never from the previous phase's paraphrase.**
The corpus is the memory; a summary of it is not. Per-feature seed paths are in the runbook.

**Never mint a superseded identity.** `FR-001..167`, `TEST-001..167`, and `T-001..018` are frozen
Pass-9 aliases into `docs/corpus/`. New work uses v2 numbers only. `pnpm check:ids` will fail you
for a violation, and that failure is correct.

**Do not edit `docs/corpus/`.** It is a hash-verified artifact of record. If an implementation
must differ from it, that difference is an explicit `DIV-###` entry with rationale and a parity
note (Constitution X), not a quiet edit.

**Do not edit generated files by hand.** These are generated, and `pnpm check` compares them
byte-for-byte:

| Generated file | Regenerate with |
|---|---|
| `.specify/memory/constitution.md` | `pnpm seed:constitution` |
| `docs/governance/v2-ids.json`, `V2_ID_LEDGER.md` | `pnpm seed:ledger` |
| Every workspace `package.json`, `tsconfig.json`, `src/index.ts`, `README.md`, and the root `tsconfig.json` | `pnpm seed:workspaces` |

Change the declaration (`docs/governance/v2-allocation.json`, `workspaces.json`,
`boundaries.json`), then re-seed.

**When adding a rule, prefer the gate over the sentence.** If a rule matters, it belongs in a
validator or a test before it belongs in a prompt. When you add a guard, add a test that feeds it
a violating input and asserts rejection — `tests/boundaries-core.test.mjs` is the pattern. A check
that has only ever been observed passing has not been shown to be a check.

## Boundaries

Do not, without explicit scoped approval for that specific action:

- Commit secrets, API keys, tokens, or provider credentials — in code, fixtures, logs, or traces.
  `DIV-009` and Constitution Article XI make host configuration the host's business, and
  `TEST-229`/`TEST-215` are secret-canary tests that will eventually enforce redaction.
- Push to `origin`, open or merge pull requests, or comment on issues.
- Delete or rewrite anything under `docs/corpus/`.
- Weaken, skip, or delete a test or gate to make a change pass.
- Mix unrelated cleanup or refactoring into a feature change. Note it; do not silently do it.
- Invent a requirement, task, or test number. Allocate from the ledger.

## Licensing boundary

`U-002` (LLM-Chess root license) and `U-003` (Virtual Classroom root license) are unresolved.
Constitution Article XI forbids releasing source-derived compatibility or plugin material,
notably `FEAT-016` / `plugins/chess` / `packages/compatibility/llm-chess`, until they are
resolved. Implementing behind the boundary is fine; publishing is not.

## Handoff

End every incomplete session by writing a handoff the next agent can act on without
reconstructing your reasoning: what changed and why, what was deferred, open questions that need
a human, and one specific next step. Put it in the repository — `docs/handoff/` — not in a chat
log. `.specify/` scripts and the runbook both reference this convention.

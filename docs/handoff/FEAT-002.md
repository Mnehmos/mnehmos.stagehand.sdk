# Handoff — FEAT-002 · Capability Registry, Validation & Introspection

Milestone [#3](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/3) (M1 · Trust kernel).
Feature issue: [#11](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/11). Predecessor:
[M1.md](M1.md) (FEAT-001).

## What changed and why

**`packages/registry` is implemented and converged.** `FR-175..FR-180` authored, tasks
`T-025..T-029` complete, parity exits `TEST-171..TEST-173` passing. `pnpm check` green (7/7),
152 tests.

Three things are worth knowing, and the third was not planned.

### 1. DIV-006 is enforced, not respected

Validation, producer introspection, the authoring digest, and the JSON Schema projection are all
views of one `Map`. There is no second list to fall out of date — and `TEST-171` walks the registry
asserting the three vocabularies are the same set key-for-key, including required flags, arity, type
names, and defaults. Verified by mutation: making introspection silently drop an optional kwarg
failed 3 tests naming the action and the missing key.

### 2. Validation neither mutates nor repairs

- It does **not** fill in defaults. A default is a statement about what the host should do when a key
  is absent; writing it into the command would make the validator a mutator, and `INV-004`'s "no
  partial state mutation" would become a claim about a function that already mutates.
- It does **not** coerce. `speed=TELEPORT` is rejected, not matched case-insensitively; `1.5` where an
  integer is required is rejected, not rounded.
- Booleans are **exactly** the JSON literals `true`/`false` — not trimmed, not case-folded. The
  projected schema declares `{"type":"boolean"}`, whose only literals are lowercase. Accepting `TRUE`
  would make the advertised contract and the enforced contract disagree about the same value, which is
  this feature's own drift class applied to itself.

### 3. DIV-010 — a leak found by integration, not by review

Wiring a real registry into the parser's `lookupSchema` seam exposed a defect in FEAT-001's recovery
rule. The reconstructed rule consumes contiguous assignments and then narrates everything after the
first non-assignment token, so:

```
whiteboard.text id=t text=If exactly one split size=lg
```

spoke `exactly one split size=lg` — an assignment in the public narration channel. Constitution
Article V is explicit that control-shaped text must never become narration.

In a recovered region, every `key=value` token is now withheld from narration and **recorded on the
recovered command** — recorded rather than dropped, so the registry reports `Unknown keyword
argument` and the token stays visible in the production channel instead of vanishing (Article XII).

This diverges from the reconstructed harness's A-002 in the disposition of tokens *after* a recovered
command's kwargs run; A-002's own assertions (`action === 'avatar.move'`, `text === 'Hello student'`)
still hold. Declaring it required building a **live divergence register** — `DIV-001..009` are frozen
in the corpus — and gating it: `check:ids` now fails on a spec citing a divergence that appears in no
register.

Note what found this: not a test I wrote against my own implementation, but the first time the
recovery path ran against a vocabulary richer than the three-word fixture it was developed with. The
integration test that caught it (`packages/registry/test/parser-seam.test.ts`) is the kind that pays
for itself.

## Evidence

| Gate | Result |
|---|---|
| 1 `check:corpus` | PASS — 176/176 hashes; corpus validator PASS |
| 2 `check:constitution` | PASS — verbatim region matches |
| 3 `check:ids` | PASS — 99/62/93 partition intact; FEAT-001 and FEAT-002 specs each cover their range exactly; all cited DIVs registered |
| 4 `check:workspaces` | PASS — structural files byte-identical |
| 5 `check:boundaries` | PASS — registry depends only on parser, both core |
| 6 `typecheck` | PASS |
| 7 `test` | PASS — 152 tests (16 bijection, 41 properties, 29 adversarial, 10 seam, 15+22+8 parser, 11 guard) |

**Negative tests performed and restored:**

- Introspection mutation (dropping an optional kwarg) → 3 TEST-171 failures naming the action and key.
- A spec citing an unregistered `DIV-011` → `check:ids` failed with the expected message.
- (M1, still standing) unterminated-span removal → TEST-169; eager streaming emission → TEST-170.

**Three failures during development were my test expectations, not the implementation** — `2m`
correctly exceeds a 10 000 ms bound, and an empty *required* list is correctly caught by the
empty-required check before the item-count check. Each was corrected in the test; only the boolean
case changed the implementation, and that for the consistency reason above.

## Deferred

- **No build pipeline.** `package.json#exports` still points at `dist/`, which does not exist.
  `vitest` resolves cross-package imports to workspace source via an alias map derived from
  `docs/governance/workspaces.json` — not hand-listed, since that would be a second copy of the
  workspace graph. A real build is needed before anything consumes these packages from `dist/`.
- **No spatial stage.** The recovered five-layer order includes `spatial`, but every concrete spatial
  rule lives in a plugin; core supplies the slot and nothing else rather than inventing a rule.
- **`CTR-121`'s entity/state layers have no built-in implementation**, by design — they are
  contributed. FEAT-003 and the plugins supply them.
- **Kwarg aliases were declared and then removed.** `KwargSpec.aliases` plus `registry.resolveKey`
  existed but validation never consulted them, so `target=…` would have been rejected as an unknown
  kwarg while the schema advertised it as an alternative spelling — a dead field masquerading as a
  supported one. The corpus does not evidence aliases (the harness handles `pause`/`pause_ms` as two
  distinct keys in the compound opener, not as an alias mechanism), so the field was removed rather
  than an unevidenced feature implemented. If a feature needs aliases, it adds them with evidence and
  a parity exit.

## Next step

**FEAT-003 (`packages/runtime`), issue [#12](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/12).**

It is the last core trust-kernel feature and the largest: effect compilation, semantic reference
resolution, and transactional commit through an injected host adapter (`FR-181..FR-186`,
`T-030..T-034`, `TEST-174..TEST-176`). Its dependency on FEAT-002 is exactly the interface just
built — the runtime consumes `validateCommand`'s result and contributes the `entity` and `state`
`ValidationStage`s that this feature deliberately left as slots.

Two things to carry forward:

1. **`TEST-174` is the one to get right**: "rejected commands cause zero fake-host mutations." Build
   the mutation-counting fake host *first*, before the executor, and assert on the mutation count
   rather than on the returned events. A transactional executor that returns the right events while
   having mutated the host is the failure mode that test exists to catch.
2. **`DIV-007`** (keep core host- and provider-independent) is normative for that feature, and
   `check:boundaries` will enforce it — but only for declared dependencies. A dynamic `require` or a
   type-only import of a renderer would slip past it, so the review question is "does this compile
   against a host interface it declared, or against a host it found".

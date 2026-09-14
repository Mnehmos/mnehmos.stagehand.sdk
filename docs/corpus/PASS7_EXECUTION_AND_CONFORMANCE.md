# Pass 7 — Execution, Conformance, and Closeout

**Status: PASS — DONE**

Pass 7 closes the execution/conformance phase of the Stagehand reconstruction. Verification provenance is deliberately split into two classes:

1. **Upstream original-host evidence** — immutable source/commit evidence from the Mnehmos repositories, including historical build/test results recorded by the original projects.
2. **Local reconstructed-core execution** — an independent Node harness derived from the recovered cross-application contract and executed in this environment.

The complete original applications could not be cloned into the container because direct outbound Git transport is unavailable. Therefore this report does **not** claim that the pinned original repositories were rebuilt locally. That limitation is now provenance, not an unresolved behavioral gap: the portable contract was exercised locally, while original-host behavior is supported by pinned source, tests, and commit evidence.

## 7.1 Inputs

- `Mnehmos/LLM-Chess` — origin annotation/narration mechanism.
- `Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e` — formal Stagehand implementation.
- `Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f` — hardened cross-domain implementation.
- `Mnehmos/vibe-coders-bible@cb032732158f615331e00c27f688a3c847c0a97c` — DOM/audio presenter dialect.
- Passes 0–6 census: 168 surfaces, including 97 protocol command surfaces.

## 7.2 Upstream runtime evidence

### Clio
Commit `72cefc649437ea65792f7419c550f133c7d288a4` records the repair of a registry/schema introspection gap and a **641 / 641** full Vitest pass. The same commit explicitly registers `map.timecursor` with `at` required while its prose description says omitting `at` resets to live, preserving the contract contradiction discovered in Pass 6.

### Virtual Classroom
Commit `4bf55adca60bbbbb2482d8d88c5b1d2598d270f8` records the real production failure where a model omitted every Stagehand bracket and control syntax was spoken aloud. The fix hardened batch and streaming parsing, added tests for command recovery, and reports **147 tests, typecheck and build clean**.

These are upstream historical execution records, not local reruns.

## 7.3 Local reconstructed-core execution

Harness: `harness/stagehand-conformance.mjs`

Runtime: Node v22.16.0

Result: **21 / 21 PASS**

- Golden cases: 10 / 10
- Adversarial cases: 11 / 11
- Failures: 0

The harness is intentionally an informed independent implementation, not copied host code. It tests the contract selected for extraction rather than attempting to emulate rendering, geography, chess semantics, classroom pedagogy, or any other host domain.

## 7.4 Conformance coverage

Validated locally:

- bracketed mixed-stream command parsing;
- quoted values with spaces;
- apostrophes as literal content rather than accidental quote openers;
- LaTeX/backslash preservation;
- whitespace around `=` recovery;
- schema-aware unquoted multi-word recovery;
- nested compound composers;
- universal `[end]` closure;
- unmatched compound opener visible degradation;
- orphan closer suppression;
- strict unknown-action rejection;
- missing-bracket control syntax does not become narration;
- atomic compound rejection if any inner command fails;
- `claim.show` drift detection;
- `map.timecursor` missing-`at` mismatch detection;
- readiness timeout instead of deadlock;
- generation invalidation/stale waiter detection;
- public/private event partition;
- schema-generated authoring/introspection surface;
- generic core excludes host-domain state namespaces.

## 7.5 Confirmed upstream defects / ambiguities

### FIND-001 — `claim.show` remains orphaned
Repository code search at the pinned Clio revision finds `claim.show` in the action union and presentation metadata, but no schema implementation. No matching issue or PR was found. Under Clio's schema-first validator, it is therefore not a normally executable command. The reconstruction treats it as an upstream orphan and excludes it from the canonical SDK command registry until specified.

### FIND-008 — `map.timecursor` contract is internally contradictory
At the pinned Clio revision:

- `COMMAND_SCHEMAS`: `requiredKwargs: ['at']`;
- `TOOL_REGISTRY`: `at.required = true`;
- registry prose: “Omit `at` to reset ... live”;
- reference docs: omit `at` for live.

The SDK must not preserve this ambiguity. Recommended canonical form:

```text
map.timecursor(at?: ISO-8601)
```

where omitted `at` deterministically means `live`, or alternatively a tagged `{ mode: 'live' | 'at', at?: string }` IR. The latter is preferable for 1.0 because it removes empty/omitted-value ambiguity.

## 7.6 Pass 7 verdict

The reverse-engineered protocol is sufficiently closed to begin clean-room SDK implementation. Remaining unknowns are governance/versioning/license decisions or upstream defects, not missing knowledge about the portable execution model.

**Pass 7: PASS. Reconstruction phase: DONE.**

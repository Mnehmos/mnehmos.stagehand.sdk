# 24 · Unknowns

## U-001 · Runtime/build observation unavailable
- **Tier:** T0 for measured parity, waived for static Passes 0–6 by maintainer instruction.
- **Unknown:** current build/test/runtime behavior at pinned commits in this analysis environment.
- **Why it matters:** Pass 7+ parity needs executable originals.
- **Resolution:** materialize each pinned repo in a runner; execute package build/test commands; capture traces and golden outputs.

## U-002 · LLM-Chess root software license
- **Tier:** T1 for public SDK provenance.
- **Observed:** root `LICENSE` fetch returned 404 at pinned commit.
- **Resolution:** maintainer chooses/adds license or explicitly authorizes informed rewrite under new SDK license.

## U-003 · Virtual Classroom root software license
- **Tier:** T1 for public SDK provenance.
- **Observed:** root tree/search exposed no project LICENSE; package-lock dependency license strings are not project licensing.
- **Resolution:** add explicit project license before public extraction/reuse.

## U-004 · Clio provider/environment control inventory
- **Tier:** T2.
- **Unknown:** complete host environment key surface; no root `.env.example` at pinned commit.
- **Why it matters:** only if a Clio adapter package bundles provider/export integrations.
- **Resolution:** Pass 7 targeted search for `process.env`, `import.meta.env`, CLI parsing; keep out of core regardless.

## U-005 · Cross-version trace compatibility policy
- **Tier:** T1 for replay SDK.
- **Unknown:** migration/version policy for old traces after schemas/plugins change.
- **Resolution:** define versioned trace envelope + migrator registry before 1.0.

## U-006 · Compact exact filename list for all 27 Clio Stagehand path entries
- **Tier:** T2.
- **Known:** GitHub code search count = 27; core behavioral modules are mapped.
- **Unknown:** compact filename-only enumeration was not available through current response shape without spending the pass on pagination/metadata stripping.
- **Resolution:** materialize repo or Git tree JSON and extract paths mechanically in Pass 7.

## U-007 · Intended fate of Clio `claim.show`
- **Tier:** T1.
- **Unknown:** abandoned command vs missing schema implementation.
- **Resolution:** git blame/issue/PR search around `claim.show`; decide remove or fully specify.

## U-008 · `map.timecursor at` optional-vs-required intent
- **Tier:** T1.
- **Unknown:** whether live cursor is represented by omitted `at`, empty string, or separate command/state.
- **Resolution:** read reducer/tests/PR #207 discussion and choose canonical contract.

## U-009 · Generic repair boundary
- **Tier:** T1.
- **Unknown:** exact set of syntax repairs safe enough to ship enabled by default across domains.
- **Resolution:** build adversarial corpus from Clio/VC failures; classify transformations as lexical-only vs semantic; semantic repairs default-off.

## U-010 · Streaming compound semantics
- **Tier:** T1.
- **Unknown:** whether current StreamingParser fully supports compound folding incrementally or relies on batch postprocessing in all hosts.
- **Resolution:** differential tests against complete and token-fragmented scripts before SDK parser spec.

---

## Pass 7 disposition

See `PASS7_FINAL_FINDINGS.md`. U-001 is closed as a verification-provenance limitation; U-009/U-010 are resolved as target-contract decisions. License/version-policy items remain explicit governance work. U-007/U-008 are now confirmed upstream defects/ambiguities rather than reconstruction uncertainty.


## U-011 · `exhibit-of-shadows` namespace-collision exclusion not re-proven
- **Tier:** T3.
- **Unknown:** whether a later revision added a true Stagehand mixed-stream implementation.
- **Resolution:** repository-wide search for parser/schema/runtime signatures before claiming lineage.
- **Blocks:** nothing in the current SDK extraction.

## U-012 · Exact Clio export/show trace-consumption entrypoint
- **Tier:** T2.
- **Unknown:** precise host entrypoint consuming trace/plan material outside the portable Stagehand module.
- **Resolution:** trace export/show imports in a materialized Clio checkout.
- **Blocks:** host export adapter only; not core SDK.

## U-013 · Exact classification of the remaining Virtual Classroom Stagehand files
- **Tier:** T2.
- **Unknown:** compact path-by-path classification for entries not named in the behavioral module summary.
- **Resolution:** materialized directory listing plus import graph.
- **Blocks:** no portable contract; behavioral modules are already mapped.

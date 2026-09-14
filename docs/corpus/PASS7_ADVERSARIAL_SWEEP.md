# Pass 7 — Adversarial Sweep

**Status: PASS for rebuild-relevant corpus closure.**

This report realigns Pass 7 to the original `/reverse-engineer` contract rather than treating execution/conformance as the whole pass. The prior conformance harness remains valid supporting evidence.

## Dead-code and scope sweep

- `SURF-027 claim.show` is marked **dead/orphaned for rebuild scope**: the Clio action union contains it, but the schema-first validator has no matching command schema. It is governed by `FIND-001` and `DIV-001`.
- All other 167 enumerated surfaces remain live/relevant or explicit compatibility/host surfaces. None is silently discarded.

## Undocumented behavior / contradictions carried forward

- Bracket-loss control leakage is promoted to a core trust invariant (`FIND-012`).
- Schema/introspection drift is promoted to a one-registry invariant (`FIND-011`).
- `map.timecursor` optional-vs-required semantics are a confirmed contradiction; the rebuild uses an explicit live-vs-at form (`DIV-002`).
- LLM-Chess natural-language visual inference is preserved only as opt-in compatibility behavior (`DIV-008`).

## Inference sweep

All surviving explicit `[i]` markers in the Pass 0–6 analysis tier were revisited. The three unique inferences that were not independently promotable from the available material were demoted to explicit unknowns `U-011..U-013`; the analysis tier now contains zero `[i]` markers.

## R2 sweep

The finite surface inventory remains 168/168 and contains no ellipsis/“etc.” substitution for an enumerable member.

## Unknown resolution discipline

Every T0/T1 unknown has a resolution or disposition:

- U-001 closed as verification-provenance limitation; portable conformance ran locally.
- U-002/U-003 remain release-governance blockers with explicit maintainer/license resolution.
- U-005 is converted into a required versioned trace/migrator design decision for 1.0.
- U-007 is confirmed orphaned and removed from canonical scope.
- U-008 is converted into `DIV-002`.
- U-009/U-010 are resolved as canonical parser/repair contracts.

## Gate 7

- Explicit `[i]` claims remaining in analysis tier: **0**.
- Enumerated-set ellipsis substitutions: **0**.
- T0/T1 unknowns without stated resolution/disposition: **0**.
- Dead surfaces identified: **1**.
- Non-dead rebuild denominator: **167**.

**GATE 7: PASS.**

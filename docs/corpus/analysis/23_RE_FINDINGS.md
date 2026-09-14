# 23 · Reverse-Engineering Findings (partial through Pass 6)

## FIND-001 · `claim.show` is declared but not schema-backed in Clio

`CommandAction` includes `claim.show`; GitHub code search finds no `COMMAND_SCHEMAS` definition. `validateCommand` builds `SCHEMA_BY_ACTION` from that registry and rejects absent actions as unknown. Result: a type-level command that cannot pass the normal runtime. [v] `Mnehmos/clio@03b1e1f:src/stagehand/types.ts:1-1100` + `validator.ts:1-220`.

**Rebuild:** either specify the command fully or remove it; never let union and registry drift.

## FIND-002 · Clio’s “cross-domain reuse leaves parser/runtime unchanged” was directionally right but literally false

ADR-0009 predicted new domains would require only vocabulary plugins. Virtual Classroom reused the doctrine but had to change parser behavior, schema metadata, validation layering, readiness, event boundary, and runtime policies. [v] VC parser/types/events/readiness.

**Rebuild:** extract interfaces/invariants, not the Clio implementation wholesale.

## FIND-003 · Original timing property is necessary but insufficient

LLM-Chess/ADR insight: adjacency gives correct cue ordering “for free.” VC demonstrates effects with nonzero settle time require a second mechanism: readiness gates. These are complementary, not competing.

## FIND-004 · LLM-Chess natural-language inference weakens the trust story

The origin parser can infer annotations from prose and passive square mentions. Useful UX, but semantically it lets prose mutate visual state. VC explicitly declines to inherit this. [v] LLM board-annotations + VC types header.

**Rebuild:** put inference in an opt-in compatibility producer, never in trusted core execution.

## FIND-005 · Concrete VC `StagehandTrace` is less versioned than Clio doctrine expects

Clio doctrine calls for schema version in trace for replay determinism; VC trace stores session/time/public/private events but no schema version. [v] VC events; [v] Clio ADR-0009.

**Rebuild:** trace envelope must contain protocol version, schema-set/plugin versions, host adapter version, and optional renderer asset manifest hash.

## FIND-006 · Schema-generated command prompts do not eliminate policy-prompt contradictions

VC structurally generates command vocabulary, but its higher-level prompt contains contradictory pacing directions (mandatory final question vs later instruction not to end every turn with a question). [v] `src/lesson/director.ts`.

**Rebuild:** move enforceable authoring rules into policy/lint/state validators; reserve prompt prose for soft style.

## FIND-007 · Clio semantic-v2 adapter is an accidental compiler architecture

`compileV2Command` validates semantic author commands then compiles them into reducer-compatible v1 commands. This is exactly the abstraction an SDK should formalize: producer dialect → canonical effect IR → host adapter.

## FIND-008 · `map.timecursor` documentation/schema semantics appear contradictory

Clio schema lists `at` as required, while the reference documentation says “Omit to leave the cursor on live.” [v] types/reference doc. This must be resolved before spec emission.

## FIND-009 · Licenses are inconsistent for an SDK extraction

Clio is MIT; VCB is CC-BY-4.0; root license files were not discovered for LLM-Chess or Virtual Classroom snapshots. This is not a technical blocker for the maintainer's informed rewrite, but it is a distribution blocker until the new SDK has an explicit software license and provenance policy.

## FIND-010 · Existing implementations duplicate core code rather than consume one package

Clio and VC both carry parser/types/validator implementations in-app. That duplication enabled useful evolution but guarantees drift. The SDK extraction should preserve app plugins while deleting duplicated protocol kernels from hosts after migration.

---

## Pass 7 addendum

- **FIND-011:** Clio history confirms command-schema/introspection drift was a real tested failure; the extracted SDK must have one command registry.
- **FIND-012:** Virtual Classroom history confirms missing brackets caused control syntax to be spoken in a live run; command-shaped narration suppression is a core trust invariant.
- **FIND-013:** Cross-implementation evidence supports a compiler/IR model: producer dialect → canonical validated effect IR → host adapter.

See `PASS7_FINAL_FINDINGS.md` for final disposition.

# Plan — FEAT-001 Mixed-Stream Parsing & Syntax

## Target

Package owner: `packages/parser`. Dependencies: none (leaf module). Text in, segments out; no host
adapter, no registry, no I/O.

## Architecture

One lexer, three consumers. Streaming is not a second parser — it is the batch machinery driven
incrementally, which is what makes FR-172's equivalence a structural property rather than a
coincidence to be tested into existence.

```text
                   ┌─ parseCommandString ─→ StagehandCommand | null
lexer (tokens) ────┤
                   └─ parseScript ────────→ ScriptSegment[]  (fold compounds)
                                ▲
                    StreamingParser buffers an incomplete bracket span, then calls the same
                    batch path on each completed span. Equivalence is by construction.
```

| Module | Responsibility | Requirements |
|---|---|---|
| `src/types.ts` | `StagehandCommand`, `ScriptSegment` union, options, `StagehandSyntaxError` | FR-168, FR-174 |
| `src/lexer.ts` | Command-body tokenizer: quoting, `=`, whitespace, escape preservation | FR-169 |
| `src/command.ts` | `parseCommandString`, schema-aware arg/kwarg classification | FR-169, FR-174 |
| `src/script.ts` | Bracket scanning, compound folding, `parseScript` | FR-170, FR-171, FR-173 |
| `src/recover.ts` | Bare-command quarantine/recovery, unrolling unterminated compounds | FR-173, FR-174 |
| `src/streaming.ts` | `StreamingParser`: buffer incomplete spans, feed the batch path | FR-172 |
| `src/index.ts` | Public surface | — |

Cross-cutting shape: the grammar scanners are pure functions producing a `RoughSegment[]`, and
`foldCompounds` turns that flat list into the nested `ScriptSegment[]`. Recovery is a distinct pass
over the same flat list, so "did we leak control?" is answerable in one place instead of being
sprinkled through the scanners.

## Implementation sequence

1. `types.ts` — lock the IR first; every later decision is expressed in it.
2. `lexer.ts` + `command.ts` — pure, synchronous, fully unit-testable, no compounds involved.
3. `script.ts` — bracket scanning and compound folding (T-021).
4. `recover.ts` — the quarantine and unrolling rules (T-023).
5. `streaming.ts` — incremental driver over the same machinery (T-022).
6. Golden and adversarial corpus, then the seeded batch-vs-stream fuzz (T-024).
7. `pnpm check` before any claim of completion.

## Why the registry is not consulted

A tempting design is to have the parser reject unknown actions. That would be wrong: registry
validation is FEAT-002's boundary and Constitution Article I places it *after* parsing. The parser
produces command segments for unknown actions and lets the registry reject them downstream, which
is what makes the trust chain single-directional. The one place the parser uses action knowledge is
the recovery heuristic in FR-173, where it is an input to classification, never an authorization.

## Determinism

No wall-clock reads, no `Math.random` in library code. The fuzz harness takes an explicit seed and
records it, so a failure is reproducible (Constitution Article X and the runtime-design rule that
randomness has a named deterministic owner).

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Control leaks into narration on malformed input | critical | Adversarial corpus including the recorded missing-bracket incident; assert on emitted narration, not on intent. |
| Batch and streaming drift apart | high | Streaming reuses the batch path; equivalence fuzzed over randomized chunk boundaries. |
| Semantic repair creeps in as a convenience | high | DIV-004 is normative: recovery classifies extent, never meaning. Reviewed against FR-173/FR-174. |
| Quote handling regresses on LaTeX or apostrophes | medium | Golden vectors taken from the recovered cases, including `Newton's` and `\\frac{a}{b}`. |

## Divergences reflected

`DIV-003` (hardened Virtual Classroom semantics as baseline), `DIV-004` (semantic repair
default-off). Both are normative for this feature; no new divergence is proposed.

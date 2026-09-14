# Tasks — FEAT-001 Mixed-Stream Parsing & Syntax

Task identities are the canonical v2 slice `T-019..T-024` from
[issue #10](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/10). Generated task work
reconciles to these; no new task numbers are minted.

- [x] **T-019** Core command/segment types — FR-168
  - [x] `StagehandCommand` with `action`, `args`, `kwargs`, `raw`
  - [x] `ScriptSegment` union: `text` | `command` | `batch` | `sequence` | `parallel` | `beat`
  - [x] `StagehandSyntaxError` carrying `raw`
  - [x] Structurally distinguishable narration vs control

- [x] **T-020** Lexer + command parser — FR-169, FR-174
  - [x] Tokenizer: quoting, `=` key detection, whitespace normalization
  - [x] Apostrophes literal in unquoted values
  - [x] Backslash/LaTeX preservation
  - [x] Unterminated quote raises `StagehandSyntaxError`
  - [x] `parseCommandString` returns `null` for empty input
  - [x] Optional schema-aware args/kwargs classification

- [x] **T-021** Batch script parser + compounds — FR-170, FR-171
  - [x] Bracket scanning to flat command/narration segments
  - [x] Compound folding for `batch`, `sequence`, `parallel`, `beat`
  - [x] `end` closes innermost; typed closer closes to its match
  - [x] `sequence` `pause`/`pause_ms`, `batch` `mode`, `beat` `id`/`intent`/`narration`
  - [x] Source-order preservation

- [x] **T-022** Streaming parser on same machinery — FR-172
  - [x] Buffer incomplete bracket spans across chunks
  - [x] Drive the batch path per completed span
  - [x] `flush()` resolves trailing unterminated input
  - [x] Equivalence asserted by construction, fuzzed by TEST-170

- [x] **T-023** Bare-command quarantine/recovery — FR-173
  - [x] Unmatched compound opener degrades to a visible command segment
  - [x] Orphan closer neither executable nor narrated
  - [x] Unterminated compounds unrolled in order at flush
  - [x] Bare-command quarantine when framing is lost

- [x] **T-024** Parser fuzz + golden corpus — TEST-168, TEST-169, TEST-170
  - [x] Golden vectors: quoting, apostrophes, LaTeX, whitespace, nesting, chunk boundaries
  - [x] Adversarial: the recorded missing-bracket incident, asserting zero control in narration
  - [x] Seeded batch-vs-stream differential fuzz over randomized chunk boundaries

## Parity exits

| Exit | Covers | Evidence |
|---|---|---|
| TEST-168 | Golden corpus | `packages/parser/test/golden.test.ts` |
| TEST-169 | Missing-bracket incident, zero control leakage | `packages/parser/test/leakage.test.ts` |
| TEST-170 | Batch-vs-stream differential fuzz | `packages/parser/test/equivalence.test.ts` |

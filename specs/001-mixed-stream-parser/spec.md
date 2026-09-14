# FEAT-001 · Mixed-Stream Parsing & Syntax

Live specification. Owner: `packages/parser`. Tier T0, complexity high, preservation posture
`yes`. Corpus seed: `docs/corpus/specs/001-mixed-stream-parser/`. Issue
[#10](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/10), milestone
[#3](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/3).

Requirement identities are v2 (`FR-168..FR-174`). Corpus evidence is cited by surface and contract
identity (`SURF-###`, `CTR-###`), never by the superseded Pass-9 requirement numbers — see
`docs/governance/V2_ID_LEDGER.md`.

## 1. Intent

Compile an untrusted stream of narration with inline control into typed, ordered segments —
narration, single commands, and nested compound groups — without ever letting control-shaped text
reach the narration channel.

This is the SDK's first trust boundary. Everything downstream validates against the vocabulary this
feature produces, so the governing property is not "parses correctly" but **"never emits control
as narration"**.

## 2. User Scenarios

1. **Narration with inline control.** A producer emits `Venice grew rich [map.focus id=venice] on
   trade.` A host receives three ordered segments: narration, one command, narration — and speaks
   only the narration.
2. **Token-fragmented producer stream.** The same script arrives in arbitrary chunks, split
   mid-command. Parsing incrementally yields the same segments, in the same order, as parsing it
   whole.
3. **Missing bracket.** A producer emits `avatar.move teacher.home speed=stroll Hello students`
   with the brackets lost. The command is quarantined as control and never spoken; the remaining
   text is narration.
4. **Nested choreography.** `[sequence][map.highlight entity=iran][source.show id=s1][end][end]`
   yields one sequence segment containing two commands, not four flat commands.
5. **Malformed command.** `whiteboard.text id=t text="oops` is a typed syntax error, terminal for
   that command — not silently repaired into a guess about what the producer meant.

## 3. Functional Requirements

- **FR-168 · Segment and command IR.** The parser MUST expose a typed `StagehandCommand` carrying
  `action`, positional `args`, `kwargs`, and the original `raw` text, and a typed `ScriptSegment`
  union whose members are structurally distinguishable: a `text` segment carrying narration
  `content`, a `command` segment, and compound segment types for `batch`, `sequence`, `parallel`,
  and `beat`. A consumer MUST be able to partition a parsed script into narration and control
  without re-inspecting the source text.
  → SURF-108, SURF-109 → CTR-111, CTR-112

- **FR-169 · Command body syntax.** `parseCommandString` MUST compile a single command body into a
  `StagehandCommand`, returning `null` for empty or whitespace-only input. Values MUST survive
  lexing verbatim: a quoted value retains embedded whitespace, an apostrophe inside an unquoted
  value is literal text and does not open a quote, backslashes and LaTeX escapes are preserved
  byte-for-byte, and whitespace surrounding `=` is normalized away. `key = value` and `key= value`
  forms MUST parse identically to `key=value`.
  → SURF-099 → CTR-102, CTR-124 · DIV-003

- **FR-170 · Bracket grammar and nesting.** The parser MUST treat `[...]` as control framing: a
  bracketed span is control and never narration. Compound openers (`batch`, `sequence`, `parallel`,
  `beat`) MUST nest to arbitrary depth. The universal closer `end` MUST close the innermost open
  compound, and a typed closer MUST close to its matching opener, discarding any compounds left
  unclosed inside it. A compound's commands MUST be collected in source order.
  → SURF-163 · DIV-003

- **FR-171 · Batch compilation.** `parseScript` MUST compile a whole script into an ordered
  `ScriptSegment[]` in source order, in which every non-control region of the input appears as
  narration content and every bracketed command appears as a command or compound segment.
  `sequence` compounds MAY carry `pause`/`pause_ms` timing metadata, `batch` compounds a `mode`,
  and `beat` compounds their `id`, `intent`, and accumulated narration.
  → SURF-098 → CTR-101

- **FR-172 · Streaming equivalence.** `StreamingParser` MUST produce, for any chunking of a given
  input, a segment sequence equal to what batch `parseScript` produces for that input. A bracketed
  span split across chunks MUST be buffered until it closes rather than emitted in pieces, and an
  explicit flush MUST resolve trailing unterminated input by the same recovery rule as FR-173.
  → SURF-100 → CTR-103

- **FR-173 · No control leakage.** Control-shaped text MUST NOT be emitted as narration under any
  input, including malformed input. Specifically: an unmatched compound opener MUST degrade to a
  visible command segment rather than being dropped or spoken; an orphan closer MUST be neither
  executable nor narrated; and unbalanced openers at end of input MUST be unrolled with their
  opener and children preserved in place, in order.
  → SURF-163 · DIV-003, DIV-004

- **FR-174 · Typed, terminal syntax errors.** Malformed command syntax MUST raise a typed syntax
  error that carries the offending raw input. An error is terminal for the command that caused it,
  and for the enclosing atomic group when one exists; the parser MUST NOT repair it by guessing at
  meaning. Lexical framing repair — recovering a command's extent from lost brackets — is
  permitted and enabled by default; semantic repair is disabled by default.
  → SURF-099, SURF-163 · DIV-004

## 4. Key Entities

`ENT-001`, `ENT-002`, `ENT-004` — canonical definitions in `docs/corpus/analysis/18_STATE_MODEL.md`.
Implementations reference these semantics; they do not fork them.

## 5. Surface Bindings

| Surface | Requirement | Contract | Corpus evidence |
|---|---|---|---|
| SURF-098 `parseScript` | FR-171 | CTR-101 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-099 `parseCommandString` | FR-169, FR-174 | CTR-102, CTR-124 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-100 `StreamingParser` | FR-172 | CTR-103 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-108 `StagehandCommand` | FR-168 | CTR-111 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-109 `ScriptSegment` | FR-168 | CTR-112 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-163 `Stagehand bracket grammar` | FR-170, FR-173, FR-174 | — | `analysis/13_SURFACE_INVENTORY.md#surf-163` |

All 6 owned surfaces are bound. `SURF-164` (compound blocks) is owned by FEAT-004; this feature
supplies the framing and folding it builds on.

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Valid bracketed command, registered action | Parsed to a command segment; parsing does not judge registry validity (FEAT-002's job). |
| Unknown action | Parsed to a command segment. Registry rejection happens downstream; the parser MUST NOT silently drop it. |
| Command-shaped text with framing lost | Quarantined as control when it matches a registered action; otherwise remains narration. |
| Unmatched compound opener | Degrades to a visible command segment. |
| Orphan closer | Neither executable nor narrated. |
| Unterminated quote | Typed syntax error carrying the raw input. |
| Empty or whitespace-only input | No segments; `parseCommandString` returns `null`. |

## 7. Error Catalog

- **Syntax error** (`StagehandSyntaxError`) — malformed command framing or quoting; terminal for the
  command or enclosing atomic group; carries `raw`.
- `E_UNKNOWN_ACTION`, `E_SCHEMA`, `E_UNRESOLVED_REF`, `E_STATE`, `E_TIMEOUT` are catalogued here for
  completeness but are raised downstream — this feature only supplies the typed segments they are
  raised against.

## 8. State Transitions

`proposal → parsed → validated → canonical/resolved → committed + public trace`, or
`rejected + production diagnostic`. This feature owns the `proposal → parsed` transition only. It
does not validate, resolve, commit, or emit — and in particular it does not decide whether a parsed
action is registered.

## 9. Non-Functional Envelope

- **Leakage (NFR-001).** Fail closed. A parse that cannot classify a span MUST leave it as
  narration only when it is not control-shaped; control-shaped and unrecognized is never spoken.
- **Batch/stream equivalence (NFR-006).** Asserted by differential fuzzing, not by inspection.
- **Repair boundary (NFR-007).** Lexical framing repair default-on; semantic repair default-off.

## 10. Divergence Register

- **DIV-003** — Use hardened Virtual Classroom parser semantics as the baseline. Nesting, quote
  handling, bare-command quarantine, and batch/stream convergence supersede the weaker Clio
  behavior. This feature implements the hardened baseline.
- **DIV-004** — Semantic repair is disabled by default. Lexical repair may recover framing;
  meaning-changing guesses require explicit plugin policy.

## 11. Parity Exits

- **TEST-168** — Golden corpus across quoting, apostrophes, LaTeX/backslashes, whitespace,
  nested compounds, and chunk boundaries.
- **TEST-169** — Replay the Virtual Classroom missing-bracket incident and assert zero control
  tokens reach narration.
- **TEST-170** — Batch-vs-stream fuzz over randomized chunk boundaries.

## 12. Tasks

- **T-019** Core command/segment types · **T-020** Lexer + command parser ·
  **T-021** Batch script parser + compounds · **T-022** Streaming parser on same machinery ·
  **T-023** Bare-command quarantine/recovery · **T-024** Parser fuzz + golden corpus

## 13. Success Criteria

1. For every corpus and adversary vector, no token of a command that the parser classified as
   control appears in any emitted narration segment.
2. Batch and streaming outputs are identical under randomized chunking, asserted by a deterministic
   seeded fuzz (seed recorded, not wall-clock dependent).
3. All three parity exits pass in `pnpm test`.
4. `pnpm check` is green.

## 14. Open Questions

No blocking unknowns. The recovery rule for a bare command's extent is deliberately lexical and
conservative — it is specified in FR-173 and pinned by TEST-169 rather than left to judgement.
Non-measured performance values remain explicitly unspecified rather than invented.

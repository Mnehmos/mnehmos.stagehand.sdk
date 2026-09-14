# Pass 7 — Final Findings and Disposition

| Finding / unknown | Pass 7 disposition |
|---|---|
| U-001 original runtime not locally executable | **Closed as provenance limitation.** Full hosts were not rerun; upstream test/build evidence is recorded and portable core was executed locally. |
| U-002 LLM-Chess root license | **Open governance item.** No root license established in this reconstruction. |
| U-003 Virtual Classroom root license | **Open governance item.** Dependency license strings do not license the project. |
| U-004 Clio env/provider inventory | **De-scoped from core.** Search confirms export/site/provider env controls exist; adapter packaging should inventory them separately. |
| U-005 trace compatibility policy | **SDK design decision.** Require protocol/schema/plugin/adapter versions plus migrator registry before 1.0. |
| U-006 exact 27 Clio Stagehand filenames | **Non-blocking metadata item.** Count and behaviorally relevant modules are known; exact compact path dump is not required for extraction. |
| U-007 fate of `claim.show` | **Confirmed upstream orphan, intent unknown.** Exclude from canonical registry until explicitly specified. |
| U-008 `map.timecursor` optional/required | **Confirmed contradiction.** SDK must choose an unambiguous live-vs-at representation. |
| U-009 repair boundary | **Resolved for extraction.** Lexical recovery allowed; semantic repair default-off and plugin/policy controlled. |
| U-010 streaming compounds | **Resolved as target contract.** New core requires streaming and batch parsers to converge on the same compound IR; VC semantics are baseline. |

## New findings from Pass 7

### FIND-011 — Introspection drift already caused a failing invariant in production development
Clio commit `72cefc...` explicitly states that four A5 commands were present in `COMMAND_SCHEMAS` but missing from `TOOL_REGISTRY`, and that `registry.test.ts` existed to catch exactly this. This strengthens the SDK rule that one registry must generate both validation and introspection rather than maintaining parallel command catalogs.

### FIND-012 — Bracket-loss is a real observed trust-boundary failure, not a hypothetical parser edge case
Virtual Classroom commit `4bf55adc...` documents a live model turn where all brackets disappeared and control syntax was spoken to the student. The recovered core therefore treats “control-shaped text must never become narration” as a security/trust invariant.

### FIND-013 — The strongest Stagehand design is an IR compiler, not a command parser
Across Clio v2 adapters and Classroom retargeting, application commands are producer dialects. The stable unit is a validated effect IR plus trace/readiness lifecycle. This is the architecture the standalone SDK should expose.

# @stagehand/parser

Mixed-stream lexer and parser for narration-plus-control input, batch and streaming.

| | |
|---|---|
| Layer | `core` |
| Kind | `package` |
| Directory | `packages/parser` |
| Owner features | FEAT-001 |
| Internal dependencies | none |
| Status | implemented — FEAT-001 converged through T-019..T-024 |

## Usage

```ts
import { parseScript, splitChannels, StreamingParser } from '@stagehand/parser';

const segments = parseScript('Venice grew rich [map.focus id=venice] on trade.');
const { narration, commands } = splitChannels(segments);
// narration: ['Venice grew rich', 'on trade.']  ← the only channel a host may speak
// commands:  [{ action: 'map.focus', kwargs: { id: 'venice' }, ... }]

// Streaming drives the same machinery, so segmentation is identical for any chunking.
const parser = new StreamingParser({ lookupSchema: registry.lookup });
for (const chunk of chunks) host.handle(parser.feed(chunk));
host.handle(parser.flush());
```

## What this module guarantees

- **A `text` segment is safe to speak.** Any span the parser classified as control — including a
  malformed one, an unterminated one, or one whose brackets were lost — never becomes narration.
- **It classifies; it does not authorize.** An unknown action still parses to a command segment.
  Registry rejection is `packages/registry`'s boundary, and it rejects rather than reparses.
- **Batch and streaming agree.** Both drive one `CompoundFolder`, so equivalence is structural
  rather than maintained by hand.

## Requirements owned

| Feature | v2 requirements | v2 tasks | Parity exits |
|---|---|---|---|
| FEAT-001 Mixed-Stream Parsing & Syntax | FR-168..FR-174 | T-019, T-020, T-021, T-022, T-023, T-024 | TEST-168, TEST-169, TEST-170 |

## Corpus seed

- FEAT-001: `6` surfaces, `6` v1 requirements, `6` v1 tests — seed spec `docs/corpus/specs/`, issue [#10](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/10)

See [V2_ID_LEDGER.md](../../docs/governance/V2_ID_LEDGER.md) for the canonical identity allocation and
[SPEC_KIT_RUNBOOK.md](../../docs/governance/SPEC_KIT_RUNBOOK.md) for the per-feature workflow.

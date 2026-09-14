# 14 · API Catalog

Stagehand is not exposed as HTTP in the extracted implementations. The primary API surface is a TypeScript module/protocol API. Clio has the only explicit barrel export.

## Clio module API — 20/20 named exports

Evidence: [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts:1-25

### CTR-101 · `parseScript(script: string): ScriptSegment[]`
- Batch-compiles a complete narration/control stream.
- Strips `//` comment lines; emits paragraph text segments and command segments; folds compounds.
- Errors are largely represented downstream as command validation failures rather than thrown parse failures in Clio. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/parser.ts:1-360

### CTR-102 · `parseCommandString(raw: string): StagehandCommand | null`
- Quote-aware tokenization into action + positional args + string kwargs. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/parser.ts:260-420

### CTR-103 · `new StreamingParser(callback, options?)`
- `feed(chunk)` consumes arbitrary text chunks; `flush()` emits remaining text/incomplete bracket as text.
- Optional `onTextDelta` receives visible narration excluding bracketed controls. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/parser.ts:360-620

### CTR-104 · `validateCommand(command, options?): CommandValidationResult`
- Rejects unknown action, arity, missing/extra kwargs, invalid numeric/boolean/enums, invalid refs/coordinates/lists and asset-specific constraints.
- Unknown action error template: `Unknown Stagehand action: <action>`. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/validator.ts:1-420

### CTR-105 · `validateCommands(commands)`
- Maps CTR-104 across an array; no implied atomicity. Compound atomic validation is a separate concept in Clio internals. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/validator.ts:1-260

### CTR-106 · `executeStagehandCommand(registry, command, options): StagehandRuntimeEvent[]`
- Pipeline: validate → compile semantic-v2 command → canonicalize entity refs → proposal handling → emit scene command or private failure event.
- Entity resolution modes: `strict | propose-stub`. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts:1-180

### CTR-107 · `canonicalizeCommandEntityRefs(registry, command, options)`
- Resolves semantic refs and augments commands with concrete IDs/centers/bounds where required. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/runtime.ts:100-360

### CTR-108 · `applyEntityProposeCommand(...)`
- Domain-specific controlled registry mutation. It should leave the generic SDK and live in the geo plugin.

### CTR-109 · `COMMAND_SCHEMAS`
- Source-of-truth schema registry for Clio command vocabulary. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts:260-1100

### CTR-110..120 · exported types

`CommandAction`, `StagehandCommand`, `ScriptSegment`, `CommandSchema`, `CanonicalStagehandCommand`, `CommandValidationResult`, `CanonicalizeCommandOptions`, `CanonicalizeCommandResult`, `EntityResolutionMode`, `ExecuteStagehandCommandOptions`, `StagehandRuntimeEvent`. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts:1-25

## Virtual Classroom runtime contracts worth extracting

These are not barrel-exported today, but are architecturally stronger than corresponding Clio internals.

### CTR-121 · `validateCommand(command, ctx)`
Five ordered validation layers: syntax, registry, entity, state, spatial. Rejection is terminal and never repairs/substitutes. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/validator.ts:1-500

### CTR-122 · `EventBus`
`onPublic`, `onPrivate`, `emitPublic`, `emitPrivate`, with an in-memory `StagehandTrace`. Public and private events are separate discriminated unions. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts:1-180

### CTR-123 · `ReadinessGate`
`mark`, `settle`, `settleAll`, `invalidate`, `wait`; waits race all requested pending channels against deadline and report stale generation. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/readiness.ts:1-220

### CTR-124 · VC `parseCommandString`
Hardens quote semantics, repairs spaces around `=`, and can use known schema keys to recover unquoted multiword values. Unterminated quoted values raise `StagehandSyntaxError`. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/parser.ts:1-190

### CTR-125 · VC `foldCompoundSegments`
Stack-based arbitrary nesting with explicit closers or universal `[end]`; unmatched structures degrade to visible/rejectable commands rather than silently swallowing content. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/parser.ts:190-390

## Proposed generic SDK contract cut

The future API should expose only domain-independent equivalents of CTR-101–105 and CTR-121–125. Entity proposal, geo canonicalization, classroom validation policy, concrete renderers, and provider calls belong in plugins/hosts.

## Gate 3 API coverage

Clio barrel exports: **20/20 mapped**. Additional VC contracts are captured as extraction candidates rather than pretending they were already public SDK exports.

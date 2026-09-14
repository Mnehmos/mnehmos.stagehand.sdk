# 19 · Agent Architecture

## Core agent contract

The producer is untrusted and is constrained in two independent ways:

1. **Prompt-time discoverability:** present only the live schema/registry vocabulary.
2. **Runtime authority:** reject anything not valid at execution time.

Prompting is ergonomic guidance; runtime validation is the security/trust boundary.

## Clio Director doctrine

Clio ADR-0009 requires:

- system prompt generated from command schemas,
- entity IDs limited to registry/briefing packet,
- source IDs limited to source registry,
- sparse valid staging preferred over invented rich staging,
- runtime as final release authority. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0009-stagehand-protocol.md:40-150

## Virtual Classroom Teacher Director

`buildCommandDigest()` iterates `COMMAND_SCHEMAS` to generate one command line per registered action, including argument ranges, enums, kwargs, descriptions, and board-target hints. The system prompt then embeds that digest and named registry surfaces. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/lesson/director.ts:1-160

Every turn also receives host pedagogical/context state (course/section goals, knowledge graph, board state, plan brief). This is host-specific context assembly, not protocol core.

## Model control loop

```text
assemble current context
  ↓
model proposes mixed Stagehand+narration
  ↓
parse / repair-safe syntax
  ↓
validate against current registry + host state
  ↓ reject → private diagnostic (future turn may self-correct)
commit valid effects
  ↓
wait for readiness when required
  ↓
speak/display narration
  ↓
receive student/user/system event
  ↓
next turn with canonical state, not model memory alone
```

## Repair policy

There are three historical postures:

- LLM-Chess: forgiving normalization + natural-language inference.
- Clio: stricter typed commands but relatively simple parser.
- VC: conservative syntax repair/recovery **before** strict layered validation; repair attempts are private production events.

The SDK should expose repair as an explicit optional policy object. INV-010: repair may normalize syntax but must never invent semantic targets/content.

## Termination / waits

- Model generation termination is provider/host-specific.
- Protocol compounds terminate with explicit close markers; VC supports `[end]` universal close.
- Runtime waits terminate on settle or timeout; interruptions invalidate generation. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/readiness.ts:1-220

## Model pinning

VC exposes `VC_DIRECTOR_MODEL`; provider defaults are host configuration. Stagehand core should not import model SDKs or name models. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:.env.example:1-20

## Prompt contract caveat

The VC prompt text contains some guidance that conflicts with later comments/behavior (for example “EVERY message MUST end with lesson.ask” followed later by “Do NOT end every turn with a question”). [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/lesson/director.ts:150-420 This is FIND-006: schema generation prevents command-vocabulary drift, but it does not prevent higher-level policy contradictions. The SDK needs machine-checkable authoring policies/lints where possible.

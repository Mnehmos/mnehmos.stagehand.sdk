# 21 · Non-Functional Profile

No fresh runtime measurements were possible in the remote-source environment. Every numerical property below is source-defined rather than observed.

## NFR-001 · No raw-stream public leakage

Raw model output, parse failures, rejected commands, provider payloads, and repair attempts must stay private. VC enforces separate public/private event unions. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/events.ts:1-180

## NFR-002 · Deterministic validation

Given schema + host validation context, command acceptance should be deterministic and side-effect free until commit. VC validator is structured as ordered pure checks; Clio validator similarly canonicalizes after validation. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/validator.ts:1-500

## NFR-003 · Bounded readiness

Every wait has a deadline and returns settlement/outstanding/stale metadata. No renderer may freeze the performance indefinitely. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/readiness.ts:1-190

## NFR-004 · Interrupt safety

In-flight waits must be generation/cancellation stamped. Late callbacks cannot resume a superseded turn. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/readiness.ts:1-190

## NFR-005 · Schema-prompt anti-drift

Producer command vocabulary must be generated from schema registry. VC documents a prior Clio failure of ~397 invalid commands across ~70 scripts as the motivation. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:1-30

## NFR-006 · Accessibility / alternate surface

VC's structured board transcript is generated from the same canonical document, preventing visual/transcript drift. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:README.md:1-100 The generic SDK should support semantic effect events so hosts can expose non-visual equivalents.

## NFR-007 · Replayability

Accepted public effects must be serializable enough for deterministic replay/export. [?] Exact cross-version compatibility is unspecified → U-005.

## NFR-008 · Streaming latency

Stagehand's original value is that controls and narration share one stream, preserving positional timing without suspending generation for discrete tool calls. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0009-stagehand-protocol.md:1-220

Measured latency: **[?]** U-001.

## NFR-009 · Parser safety

Malformed/unclosed syntax cannot silently swallow large narration/control regions or leak command-shaped text to speech. VC improves Clio with hard unterminated-quote errors and control-shaped-text quarantine/recovery. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/parser.ts:1-420

## NFR-010 · Domain isolation

Core packages should be renderer- and domain-neutral. Current Clio/VC implementations violate this internally; the rebuild must enforce it by package dependency direction.

## Source-defined timing examples (not benchmarks)

VC schemas encode settle budgets such as teacher locomotion `5500ms` and gaze `400ms`; readiness maps independent actions to channels. These are host policy defaults, not core performance targets. [v] Mnehmos/virtual-classroom@cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts:180-260

## Security posture

Stagehand is an application-level capability sandbox: the model can only propose registered commands; entity IDs and state transitions are revalidated; public consumers subscribe only to validated events. It is **not** a process sandbox and should not be marketed as one.

## Gate 5

All numerical runtime performance characteristics that were not source-defined are marked `[?]`; no invented benchmark is presented.

# Tasks — FEAT-002 Capability Registry, Validation & Introspection

Task identities are the canonical v2 slice `T-025..T-029` from
[issue #11](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/11). Generated task work
reconciles to these; no new task numbers are minted.

- [x] **T-025** Registry data model — FR-175, FR-176
  - [x] `CommandSchema` with arity, typed args, required/optional kwargs, settle delay, metadata
  - [x] Typed kwarg values: string, enum, number, boolean, duration, color, entity ref, lists
  - [x] `CapabilityRegistry` with registration, duplicate rejection, lookup, action enumeration
  - [x] Core ships an empty vocabulary; domain namespaces are plugin-owned

- [x] **T-026** Schema lookup/introspection — FR-180
  - [x] `introspection()` — producer-facing action list with keys, types, defaults, examples
  - [x] `digest()` — stable authoring digest for a producer prompt
  - [x] `toJsonSchema()` — one definition per action, machine-readable
  - [x] `lookup` — explicit adapter to the parser's `SchemaLookup` seam

- [x] **T-027** Structural validator — FR-177, FR-179
  - [x] Unknown action, with the `Unknown Stagehand action: <action>` template
  - [x] Arity outside declared bounds
  - [x] Missing required kwarg and empty value for a required kwarg
  - [x] Undeclared kwarg rejected rather than ignored
  - [x] Typed value violations naming the key
  - [x] No repair, substitution, or coercion of a supplied value
  - [x] Discriminated result; `validateCommands` implies no atomicity

- [x] **T-028** Pluggable validation stages — FR-178
  - [x] Fixed layer order `syntax → registry → entity → state → spatial`
  - [x] Built-in syntax and registry stages
  - [x] Contributed stages for entity/state/spatial without core modification
  - [x] First rejection terminal; later stages do not run and cannot soften it

- [x] **T-029** Registry consistency test harness — FR-180
  - [x] Bijection across executable, introspected, and schema-projected vocabularies (TEST-171)
  - [x] Required/optional kwargs and defaults verified as properties over the fixture set (TEST-172)
  - [x] Adversarial corpus for unknown action, enum, numeric, duration, color, arity, kwargs (TEST-173)

## Parity exits

| Exit | Covers | Evidence |
|---|---|---|
| TEST-171 | Schema/introspection bijection | `packages/registry/test/bijection.test.ts` |
| TEST-172 | Kwarg and default properties over the fixture schemas | `packages/registry/test/schema-properties.test.ts` |
| TEST-173 | Unknown-action and typed-value adversarial corpus | `packages/registry/test/adversarial.test.ts` |

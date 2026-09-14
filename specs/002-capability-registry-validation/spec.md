# FEAT-002 · Capability Registry, Validation & Introspection

Live specification. Owner: `packages/registry`. Tier T0, complexity high, preservation posture
`yes`. Corpus seed: `docs/corpus/specs/002-capability-registry-validation/`. Issue
[#11](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/11), milestone
[#3](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/3).

Requirement identities are v2 (`FR-175..FR-180`). Corpus evidence is cited by surface and contract
identity (`SURF-###`, `CTR-###`), never by superseded Pass-9 requirement numbers.

## 1. Intent

Give integrators **one** typed capability registry from which validation, producer introspection,
authoring help, and machine-readable schemas are all derived, so the executable vocabulary and the
advertised vocabulary cannot drift apart.

The failure this feature exists to prevent is documented and specific: a prior host shipped a
command vocabulary that disagreed with its validator, producing roughly 397 invalid commands across
about 70 scripts (`NFR-005`). The fix is not better documentation of two lists — it is having one
list.

## 2. User Scenarios

1. **Advertise and enforce agree.** A plugin registers a capability. Introspection advertises it to
   a producer; validation enforces exactly the same arity, keys, and value types. Neither is
   hand-maintained.
2. **Unknown action.** A producer invents `claim.show`. Validation rejects it, no host state is
   touched, and the diagnostic names the action.
3. **Typed value violation.** A producer sends `map.timecursor at=yesterday` or
   `avatar.move speed=teleport`. Both are rejected with the offending key and the reason, not
   silently coerced.
4. **Ordered layers.** A command that would fail both a registry rule and a plugin state rule
   reports the registry failure first: layers run in a fixed order and the first rejection is
   terminal.
5. **Anti-drift is asserted, not promised.** A test walks the registry and proves that the
   introspection view and the JSON Schema view describe the same actions and the same keys.

## 3. Functional Requirements

- **FR-175 · Capability schema model.** The registry MUST model a capability as a typed schema
  carrying: the action, an optional description, positional arity bounds, per-position argument
  types, required kwargs, optional kwargs with declared defaults, an optional settle delay, and
  optional entity-resolution and authoring metadata. Kwarg values MUST be typed rather than free
  text, supporting at minimum: string, enum, number (with optional bounds and integrality),
  boolean, duration, color, semantic entity reference, and bounded lists of entity references or
  strings.

  Values arrive as strings, so each type has an explicit textual grammar rather than an implicit
  one. `number` is decimal with an optional exponent and no digit separators; `integer` rejects a
  fractional value instead of rounding it; `duration` is a number with an optional `ms`/`s`/`m`
  unit, bare numbers being milliseconds; `boolean` is exactly the JSON literals `true` and `false`,
  neither case-folded nor trimmed, so the enforced contract matches the projected JSON Schema;
  `color` is hex or `rgb()`/`rgba()`; an entity reference is a name with an optional `scope:`.
  A value that fails its grammar is rejected, never coerced.
  → SURF-110 → CTR-113 · ENT-003 · INV-003

- **FR-176 · One registry, one truth.** The SDK MUST expose a registry that is the single source for
  validation and introspection, implementing `COMMAND_SCHEMAS` and the `CommandAction` vocabulary as
  views of that one structure. Registration MUST reject a duplicate action, and lookup MUST be by
  action. Core MUST ship an **empty** vocabulary: domain actions belong to plugins, and core
  advertising `lesson.`/`projector.`/`piece.`/`room.` namespaces is forbidden.
  → SURF-106, SURF-107 → CTR-109, CTR-110 · DIV-006

- **FR-177 · Structural validation.** `validateCommand` MUST reject, with a named error: an action
  absent from the registry (message template `Unknown Stagehand action: <action>`), arity outside
  the declared bounds, a missing required kwarg, an empty value for a required kwarg, an undeclared
  kwarg, and any kwarg whose value does not satisfy its declared type. Validation MUST NOT repair,
  substitute, coerce, or default a value that the producer supplied.
  → SURF-104 → CTR-104

- **FR-178 · Ordered, pluggable layers.** Validation MUST run in the fixed layer order
  `syntax → registry → entity → state → spatial`. The syntax and registry layers are built in;
  hosts and plugins MUST be able to contribute further stages without modifying the core validator.
  The first rejecting stage is terminal for the command: later stages MUST NOT run, and no later
  stage may override or soften an earlier rejection.
  → CTR-121 · INV-004

- **FR-179 · Validation result contract.** Validation MUST return a discriminated result: an
  accepted variant carrying the command, or a rejected variant carrying the errors and the layer
  that rejected it. `validateCommands` MUST map the single-command result across an array **without
  implying atomicity** — group atomicity is a distinct concept that this feature does not provide
  and MUST NOT appear to provide. Rejection MUST NOT mutate any host state, in whole or in part.
  → SURF-105, SURF-112 → CTR-105, CTR-115 · ENT-006

- **FR-180 · Introspection and machine-readable schemas from the same registry.** The registry MUST
  derive, from itself and with no parallel list: a producer-facing introspection view (actions with
  arity, keys, types, defaults, and authoring examples), a stable authoring digest suitable for a
  producer prompt, and a machine-readable JSON Schema document with one definition per action.
  A test MUST assert the bijection between the executable, introspected, and schema-projected
  vocabularies.
  → SURF-104, SURF-106 → CTR-104, CTR-109 · NFR-005 · DIV-006

## 4. Key Entities

`ENT-003` (CommandSchema), `ENT-006` (ValidationResult), `ENT-009` (Capability/Entity Registry) —
canonical definitions in `docs/corpus/analysis/18_STATE_MODEL.md`. `INV-003` (one registry),
`INV-004` (rejection is terminal) are the invariants this feature is responsible for holding.

Note the deliberate scope line with `ENT-009`: this feature owns the *capability* registry and the
resolution **seam**. Resolving a semantic reference into a concrete host target is `FEAT-003`'s job
(`CTR-107`); `FEAT-002` only declares that a kwarg is an entity reference and provides the layer at
which resolution failures will be reported.

## 5. Surface Bindings

| Surface | Requirement | Contract | Corpus evidence |
|---|---|---|---|
| SURF-104 `validateCommand` | FR-177, FR-180 | CTR-104, CTR-121 | `Mnehmos/clio@03b1e1f:src/stagehand/validator.ts`, `Mnehmos/virtual-classroom@cd72536:src/stagehand/validator.ts` |
| SURF-105 `validateCommands` | FR-179 | CTR-105 | `Mnehmos/clio@03b1e1f:src/stagehand/validator.ts` |
| SURF-106 `COMMAND_SCHEMAS` | FR-176, FR-180 | CTR-109 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-107 `CommandAction` | FR-176 | CTR-110 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-110 `CommandSchema` | FR-175 | CTR-113 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |
| SURF-112 `CommandValidationResult` | FR-179 | CTR-115 | `Mnehmos/clio@03b1e1f:src/stagehand/index.ts` |

All 6 owned surfaces are bound. `CTR-121`'s five-layer ordering is recovered from Virtual Classroom
and supersedes Clio's flatter validator.

## 6. Observed Behavior Matrix

| Input/state | Required outcome |
|---|---|
| Registered action, valid arity and values | Accepted; carries the command onward. No mutation. |
| Unknown/unregistered action | Rejected at the registry layer; production diagnostic only; no host mutation. |
| Arity outside bounds | Rejected at the registry layer. |
| Missing required kwarg, or empty value for one | Rejected at the registry layer. |
| Undeclared kwarg | Rejected at the registry layer; never ignored. |
| Value failing its declared type | Rejected at the registry layer, naming the key. |
| Optional kwarg omitted | Accepted. A declared default applies downstream; the validator does not write it into the command. |
| Semantically unresolvable reference | Rejected at the entity layer by a contributed stage. |
| State forbidding the effect | Rejected at the state layer by a contributed stage. |

## 7. Error Catalog

| Code | Layer | Meaning |
|---|---|---|
| `E_SCHEMA` | syntax, registry, spatial | Arity, kwarg, or value contract violation; the producer must correct input. |
| `E_UNKNOWN_ACTION` | registry | Action absent from the registry; non-retryable until the schema set changes. |
| `E_UNRESOLVED_REF` | entity | Semantic target cannot be resolved; retryable only if registry or state changes. |
| `E_STATE` | state | Host state forbids the effect; retryable only after a state transition. |
| `E_TIMEOUT` | — | Readiness deadline; raised by `FEAT-006`, catalogued here for completeness. |

## 8. State Transitions

`proposal → parsed → validated → canonical/resolved → committed + public trace`, or
`rejected + production diagnostic`. This feature owns `parsed → validated`. It does not resolve,
compile, commit, or emit.

## 9. Non-Functional Envelope

- **NFR-005, schema-prompt anti-drift.** Vocabulary is generated from the registry. Asserted by the
  bijection test, not by convention.
- **Determinism.** Introspection, the digest, and the JSON Schema projection are stable under
  insertion order, so two registries with the same schema set produce byte-identical output.

## 10. Divergence Register

- **DIV-006** — Generate validation and introspection from one registry. Rationale: eliminate
  parallel command catalogs that previously drifted. This feature implements the divergence; it does
  not merely respect it.

## 11. Parity Exits

- **TEST-171** — Schema/introspection bijection.
- **TEST-172** — Required/optional kwargs + defaults property tests across the recovered schemas.
- **TEST-173** — Unknown-action and enum/numeric/duration adversarial corpus.

## 12. Tasks

- **T-025** Registry data model · **T-026** Schema lookup/introspection ·
  **T-027** Structural validator · **T-028** Pluggable validation stages ·
  **T-029** Registry consistency test harness

## 13. Success Criteria

1. `introspection()`, `toJsonSchema()`, and the registry's own action set are provably in bijection.
2. Every recovered schema's required kwargs are enforced and every declared default is itself a
   valid value for its key — asserted as a property across the whole fixture set, not case by case.
3. No rejection path mutates the command it was given.
4. `pnpm check` is green.

## 14. Open Questions

No blocking unknowns. The `spatial` layer is modelled as a slot with no core implementation: the
recovered five-layer order includes it, but every concrete spatial rule lives in a plugin, so core
would be inventing to supply one.

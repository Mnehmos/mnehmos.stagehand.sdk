/**
 * @stagehand/registry — capability registry, validation, and introspection.
 *
 * Owner of FEAT-002. Requirement range `FR-175..FR-180`; tasks `T-025..T-029`; parity exits
 * `TEST-171..TEST-173`. See `specs/002-capability-registry-validation/spec.md`.
 *
 * The invariant a caller may rely on: **the vocabulary a producer is told about and the vocabulary
 * the validator enforces are the same object.** Introspection, the authoring digest, and the JSON
 * Schema projection are all derived from the registry, so there is no second list to fall out of
 * date — which is the failure this feature exists to prevent (`NFR-005`, `DIV-006`).
 *
 * @example
 * ```ts
 * const registry = new CapabilityRegistry([mapFocusSchema]);
 *
 * // One source drives both sides of the producer contract.
 * const { digest } = registry.introspection();   // → into the prompt
 * const verdict = validateCommand(registry, command); // → enforced at runtime
 *
 * // And it plugs straight into the parser's recovery seam.
 * parseScript(script, { lookupSchema: registry.lookup });
 * ```
 */

export {
  CapabilityRegistry,
  COMMAND_SCHEMAS,
  DuplicateActionError,
  InvalidActionError,
  type JsonSchemaDocument,
  type JsonSchemaNode,
  type RegistryIntrospection,
  type RegistryIntrospectionEntry,
} from './registry.js';

export {
  isValid,
  validateCommand,
  validateCommands,
} from './validate.js';

export {
  checkValue,
  describeValueType,
  parseDurationMs,
  parseNumber,
  type ValueCheck,
} from './value-types.js';

export {
  CommandAction,
  VALIDATION_LAYERS,
  type Accepted,
  type AuthoringMetadata,
  type BooleanValue,
  type ColorValue,
  type CommandAction as CommandActionName,
  type CommandSchema,
  type CommandValidationEntry,
  type DurationValue,
  type EntityRefListValue,
  type EntityRefValue,
  type EntityResolutionPolicy,
  type EnumValue,
  type KwargSpec,
  type NumberValue,
  type Rejected,
  type StringListValue,
  type StringValue,
  type ValidateOptions,
  type ValidationContext,
  type ValidationError,
  type ValidationErrorCode,
  type ValidationLayer,
  type ValidationResult,
  type ValidationStage,
  type ValueType,
  type ValueTypeKind,
} from './types.js';

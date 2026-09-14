/**
 * Registry vocabulary (FR-175, FR-179).
 *
 * One schema model serves validation, introspection, the authoring digest, and the JSON Schema
 * projection. That is the whole point of DIV-006: if any of those four had its own type, it would
 * eventually have its own list.
 */

import type { StagehandCommand } from '@stagehand/parser';

/**
 * A capability name, e.g. `map.focus`.
 *
 * Dotted, lowercase, at least two segments. The grammar is deliberately narrow: a permissive
 * action name is how `claim.show` and other declared-but-unexecutable actions get advertised.
 */
export type CommandAction = string;

/** Runtime helpers for the {@link CommandAction} grammar. */
export const CommandAction = {
  /** Two or more dot-separated lowercase segments, allowing digits and underscores after the first. */
  pattern: /^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$/,

  isWellFormed(candidate: string): boolean {
    return CommandAction.pattern.test(candidate);
  },
} as const;

// ---------------------------------------------------------------------------------------------
// Value types (FR-175)
// ---------------------------------------------------------------------------------------------

export interface StringValue {
  readonly kind: 'string';
  readonly minLength?: number;
  readonly maxLength?: number;
}

export interface EnumValue {
  readonly kind: 'enum';
  readonly values: readonly string[];
  /** Defaults to `false`: enum members are matched exactly. */
  readonly caseSensitive?: boolean;
}

export interface NumberValue {
  readonly kind: 'number';
  readonly min?: number;
  readonly max?: number;
  /** When true, a fractional value is rejected rather than rounded. */
  readonly integer?: boolean;
}

export interface BooleanValue {
  readonly kind: 'boolean';
}

/** Duration in milliseconds, accepted as a bare number or with a unit suffix. */
export interface DurationValue {
  readonly kind: 'duration';
  readonly minMs?: number;
  readonly maxMs?: number;
}

/** CSS-style color. */
export interface ColorValue {
  readonly kind: 'color';
}

/**
 * A semantic entity reference, e.g. `country:iran`.
 *
 * The registry declares that a kwarg *is* a reference and checks its lexical shape. Turning it into
 * a concrete host target is FEAT-003's resolution phase (ENT-009) — this feature owns the seam, not
 * the resolution.
 */
export interface EntityRefValue {
  readonly kind: 'entityRef';
}

export interface EntityRefListValue {
  readonly kind: 'entityRefList';
  readonly minItems?: number;
  readonly maxItems?: number;
}

export interface StringListValue {
  readonly kind: 'stringList';
  readonly minItems?: number;
  readonly maxItems?: number;
}

export type ValueType =
  | StringValue
  | EnumValue
  | NumberValue
  | BooleanValue
  | DurationValue
  | ColorValue
  | EntityRefValue
  | EntityRefListValue
  | StringListValue;

export type ValueTypeKind = ValueType['kind'];

// ---------------------------------------------------------------------------------------------
// Schema (FR-175)
// ---------------------------------------------------------------------------------------------

export interface KwargSpec {
  readonly type: ValueType;
  /**
   * Value assumed when the producer omits the key. Exposed through introspection and JSON Schema
   * and applied downstream — validation never writes it into the command.
   */
  readonly default?: string;
  readonly description?: string;
}

export interface AuthoringMetadata {
  readonly summary?: string;
  readonly examples?: readonly string[];
}

export type EntityResolutionPolicy = 'none' | 'optional' | 'required';

/** What a capability is. The single source for validation, introspection, and schemas. */
export interface CommandSchema {
  readonly action: CommandAction;
  readonly description?: string;
  readonly minArgs: number;
  readonly maxArgs: number;
  /** Per-position value types; a position with no entry is an untyped string. */
  readonly argTypes?: readonly ValueType[];
  readonly requiredKwargs?: Readonly<Record<string, KwargSpec>>;
  readonly optionalKwargs?: Readonly<Record<string, KwargSpec>>;
  /** Expected settling time, for readiness planning in FEAT-006. */
  readonly settleMs?: number;
  readonly entityResolution?: EntityResolutionPolicy;
  readonly authoring?: AuthoringMetadata;
}

// ---------------------------------------------------------------------------------------------
// Validation (FR-178, FR-179)
// ---------------------------------------------------------------------------------------------

/**
 * Validation layers, in the order they run. Order is a property of the pipeline, not of stage
 * registration, so a contributed stage cannot reorder the diagnostics a producer sees.
 */
export const VALIDATION_LAYERS = ['syntax', 'registry', 'entity', 'state', 'spatial'] as const;

export type ValidationLayer = (typeof VALIDATION_LAYERS)[number];

export type ValidationErrorCode =
  | 'E_UNKNOWN_ACTION'
  | 'E_SCHEMA'
  | 'E_UNRESOLVED_REF'
  | 'E_STATE'
  | 'E_TIMEOUT';

export interface ValidationError {
  readonly code: ValidationErrorCode;
  readonly layer: ValidationLayer;
  readonly message: string;
  /** The kwarg or positional index at fault, when the error is attributable to one. */
  readonly subject?: string;
}

export interface ValidationContext {
  /** Stage-owned state, e.g. a resolver or host state view. Keyed by layer. */
  readonly [key: string]: unknown;
}

/** A contributed validation stage (FR-178). */
export interface ValidationStage {
  readonly layer: Exclude<ValidationLayer, 'syntax' | 'registry'>;
  /** Return errors to reject, or an empty array / undefined to pass. Must not mutate anything. */
  validate(command: StagehandCommand, context: ValidationContext): readonly ValidationError[] | undefined;
}

export interface Accepted {
  readonly ok: true;
  readonly command: StagehandCommand;
  /** The schema that accepted it, for downstream canonicalisation. */
  readonly schema: CommandSchema;
}

export interface Rejected {
  readonly ok: false;
  readonly command: StagehandCommand;
  /** The first rejecting layer. Later layers did not run. */
  readonly layer: ValidationLayer;
  readonly errors: readonly ValidationError[];
}

export type ValidationResult = Accepted | Rejected;

/** Per-command outcome from {@link validateCommands}. */
export interface CommandValidationEntry {
  readonly index: number;
  readonly result: ValidationResult;
}

export interface ValidateOptions {
  /** Contributed stages, run in pipeline order. */
  readonly stages?: readonly ValidationStage[];
  /** Context handed to every stage. */
  readonly context?: ValidationContext;
}

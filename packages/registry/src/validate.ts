/**
 * Validation pipeline (FR-177, FR-178, FR-179).
 *
 * Layers run in a fixed order — `syntax → registry → entity → state → spatial` — and the first
 * rejecting one is terminal. Order is a property of the pipeline rather than of registration order,
 * so a host adding a state stage cannot make state run before registry and change the diagnostic a
 * producer sees for the same input.
 *
 * Validation never mutates the command it was given, and never fills in a default. A validator that
 * writes to its input is a mutator wearing a validator's name, and `INV-004`'s "no partial state
 * mutation" would stop being true.
 */

import type { StagehandCommand } from '@stagehand/parser';
import { CapabilityRegistry, type RegistryIntrospection } from './registry.js';
import { checkValue } from './value-types.js';
import {
  CommandAction,
  VALIDATION_LAYERS,
  type CommandSchema,
  type CommandValidationEntry,
  type KwargSpec,
  type ValidationContext,
  type ValidationError,
  type ValidationLayer,
  type ValidationResult,
  type ValidationStage,
  type ValidateOptions,
} from './types.js';

/** Look up a kwarg spec across the required and optional maps. */
function specFor(schema: CommandSchema, key: string): KwargSpec | undefined {
  return schema.requiredKwargs?.[key] ?? schema.optionalKwargs?.[key];
}

/**
 * Syntax layer. The parser has already produced a command, so this layer checks the things a parser
 * cannot: that the action names a well-formed capability, and that no key is empty.
 */
function syntaxLayer(command: StagehandCommand): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!CommandAction.isWellFormed(command.action)) {
    errors.push({
      code: 'E_SCHEMA',
      layer: 'syntax',
      message: `Malformed Stagehand action: ${command.action}`,
      subject: command.action,
    });
  }
  for (const key of Object.keys(command.kwargs)) {
    if (key.trim() === '') {
      errors.push({ code: 'E_SCHEMA', layer: 'syntax', message: 'Empty keyword argument name' });
    }
  }
  return errors;
}

/**
 * Registry layer. The structural contract: unknown action, arity, required kwargs, undeclared
 * kwargs, and typed values. This is the layer DIV-006 is really about — it is generated from the
 * same schema introspection is generated from.
 */
function registryLayer(command: StagehandCommand, registry: CapabilityRegistry): ValidationError[] {
  const schema = registry.get(command.action);
  if (schema === undefined) {
    return [
      {
        code: 'E_UNKNOWN_ACTION',
        layer: 'registry',
        message: `Unknown Stagehand action: ${command.action}`,
        subject: command.action,
      },
    ];
  }

  const errors: ValidationError[] = [];

  if (command.args.length < schema.minArgs || command.args.length > schema.maxArgs) {
    errors.push({
      code: 'E_SCHEMA',
      layer: 'registry',
      message: `Action "${command.action}" expects ${schema.minArgs}..${schema.maxArgs} positional argument(s), got ${command.args.length}`,
      subject: 'args',
    });
  }

  const declared = new Set<string>();
  for (const key of Object.keys(schema.requiredKwargs ?? {})) declared.add(key);
  for (const key of Object.keys(schema.optionalKwargs ?? {})) declared.add(key);

  for (const key of Object.keys(command.kwargs)) {
    if (!declared.has(key)) {
      errors.push({
        code: 'E_SCHEMA',
        layer: 'registry',
        message: `Unknown keyword argument "${key}" for action "${command.action}"`,
        subject: key,
      });
    }
  }

  for (const [key, spec] of Object.entries(schema.requiredKwargs ?? {})) {
    const supplied = command.kwargs[key];
    if (supplied === undefined) {
      errors.push({
        code: 'E_SCHEMA',
        layer: 'registry',
        message: `Missing required keyword argument "${key}" for action "${command.action}"`,
        subject: key,
      });
      continue;
    }
    if (supplied === '') {
      errors.push({
        code: 'E_SCHEMA',
        layer: 'registry',
        message: `Required keyword argument "${key}" is empty for action "${command.action}"`,
        subject: key,
      });
      continue;
    }
    const check = checkValue(supplied, spec.type);
    if (!check.ok) {
      errors.push({
        code: 'E_SCHEMA',
        layer: 'registry',
        message: `Invalid value for "${key}": ${check.reason ?? 'failed type check'}`,
        subject: key,
      });
    }
  }

  for (const key of Object.keys(command.kwargs)) {
    const spec = specFor(schema, key);
    if (spec === undefined) continue;
    if (schema.requiredKwargs?.[key] !== undefined) continue; // already checked above
    const supplied = command.kwargs[key];
    if (supplied === undefined) continue;
    // An explicitly empty optional value is a producer statement, not an omission. Only a declared
    // default makes an empty value meaningful; otherwise the type decides.
    if (supplied === '' && spec.default !== undefined) continue;
    const check = checkValue(supplied, spec.type);
    if (!check.ok) {
      errors.push({
        code: 'E_SCHEMA',
        layer: 'registry',
        message: `Invalid value for "${key}": ${check.reason ?? 'failed type check'}`,
        subject: key,
      });
    }
  }

  for (let index = 0; index < command.args.length; index++) {
    const type = schema.argTypes?.[index];
    if (type === undefined) continue;
    const value = command.args[index];
    if (value === undefined) continue;
    const check = checkValue(value, type);
    if (!check.ok) {
      errors.push({
        code: 'E_SCHEMA',
        layer: 'registry',
        message: `Invalid positional argument ${index}: ${check.reason ?? 'failed type check'}`,
        subject: `args[${index}]`,
      });
    }
  }

  return errors;
}

/**
 * Validate one command.
 *
 * @returns An accepted result carrying the command and its schema, or a rejected result carrying the
 *   errors and the layer that rejected it. The command is never modified.
 */
export function validateCommand(
  registry: CapabilityRegistry,
  command: StagehandCommand,
  options: ValidateOptions = {},
): ValidationResult {
  const context: ValidationContext = options.context ?? {};

  const byLayer = new Map<ValidationLayer, readonly ValidationStage[]>();
  for (const stage of options.stages ?? []) {
    const bucket = byLayer.get(stage.layer);
    byLayer.set(stage.layer, bucket === undefined ? [stage] : [...bucket, stage]);
  }

  for (const layer of VALIDATION_LAYERS) {
    let errors: ValidationError[];
    switch (layer) {
      case 'syntax':
        errors = syntaxLayer(command);
        break;
      case 'registry':
        errors = registryLayer(command, registry);
        break;
      default: {
        errors = [];
        for (const stage of byLayer.get(layer) ?? []) {
          const produced = stage.validate(command, context) ?? [];
          if (produced.length > 0) {
            errors = [...errors, ...produced];
            break; // one rejecting stage is enough; later stages in this layer do not run
          }
        }
        break;
      }
    }

    if (errors.length > 0) {
      return { ok: false, command, layer, errors };
    }
  }

  const schema = registry.get(command.action);
  if (schema === undefined) {
    // Unreachable: the registry layer would have rejected. Kept as a type-narrowing guard.
    return {
      ok: false,
      command,
      layer: 'registry',
      errors: [
        { code: 'E_UNKNOWN_ACTION', layer: 'registry', message: `Unknown Stagehand action: ${command.action}` },
      ],
    };
  }
  return { ok: true, command, schema };
}

/**
 * Validate a list of commands, one result each.
 *
 * **No atomicity is implied.** A list where three of five commands are valid is not a partially
 * committed group; it is five independent verdicts. Group atomicity is a distinct concept owned by
 * `FEAT-004`'s compound handling, and this function must not appear to provide it.
 */
export function validateCommands(
  registry: CapabilityRegistry,
  commands: readonly StagehandCommand[],
  options: ValidateOptions = {},
): CommandValidationEntry[] {
  return commands.map((command, index) => ({
    index,
    result: validateCommand(registry, command, options),
  }));
}

/** Convenience predicate for callers that only need the verdict. */
export function isValid(result: ValidationResult): result is Extract<ValidationResult, { ok: true }> {
  return result.ok;
}

export type { RegistryIntrospection };

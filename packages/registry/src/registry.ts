/**
 * The capability registry (FR-176, FR-180).
 *
 * Registration, validation, introspection, the authoring digest, and the JSON Schema projection are
 * all views of the one map this class holds. Nothing here maintains a second list, which is what
 * makes DIV-006 enforceable: a bijection test can only pass if there is genuinely one source.
 *
 * Core ships an **empty** vocabulary. `lesson.`, `projector.`, `piece.`, and `room.` are plugin
 * domains (Constitution III); advertising them from core is tested against.
 */

import type { CommandSchemaLike, SchemaLookup } from '@stagehand/parser';
import { CommandAction, type CommandAction as Action, type CommandSchema } from './types.js';
import { describeValueType } from './value-types.js';

export interface RegistryIntrospectionEntry {
  readonly action: string;
  readonly description: string;
  readonly minArgs: number;
  readonly maxArgs: number;
  readonly required: readonly string[];
  readonly optional: readonly { readonly key: string; readonly type: string; readonly default?: string }[];
  readonly argTypes: readonly string[];
  readonly settleMs?: number;
  readonly entityResolution?: string;
  readonly examples: readonly string[];
}

export interface RegistryIntrospection {
  readonly actions: readonly RegistryIntrospectionEntry[];
  /** Stable hash-free digest of the whole vocabulary, suitable for a producer prompt. */
  readonly digest: string;
}

export type JsonSchemaNode = Readonly<Record<string, unknown>>;

export interface JsonSchemaDocument {
  readonly $schema: string;
  readonly $id: string;
  readonly title: string;
  readonly type: 'object';
  readonly $defs: Readonly<Record<string, JsonSchemaNode>>;
}

export class DuplicateActionError extends Error {
  readonly action: string;

  constructor(action: string) {
    super(`Capability "${action}" is already registered`);
    this.name = 'DuplicateActionError';
    this.action = action;
  }
}

export class InvalidActionError extends Error {
  readonly action: string;

  constructor(action: string) {
    super(`Capability name "${action}" is not well formed; expected dotted lowercase segments`);
    this.name = 'InvalidActionError';
    this.action = action;
  }
}

export class CapabilityRegistry {
  readonly #schemas = new Map<Action, CommandSchema>();

  constructor(schemas: readonly CommandSchema[] = []) {
    for (const schema of schemas) this.register(schema);
  }

  /** Register a capability. Throws rather than replacing: a silent overwrite is a drift source. */
  register(schema: CommandSchema): this {
    if (!CommandAction.isWellFormed(schema.action)) throw new InvalidActionError(schema.action);
    if (this.#schemas.has(schema.action)) throw new DuplicateActionError(schema.action);
    this.#schemas.set(schema.action, schema);
    return this;
  }

  get(action: string): CommandSchema | undefined {
    return this.#schemas.get(action);
  }

  has(action: string): boolean {
    return this.#schemas.has(action);
  }

  get size(): number {
    return this.#schemas.size;
  }

  /** Action names in stable sorted order. */
  get actions(): readonly string[] {
    return [...this.#schemas.keys()].sort();
  }

  /**
   * Adapter for `@stagehand/parser`'s `SchemaLookup` seam (FEAT-001 integration).
   *
   * Explicit rather than structural: the parser needs arity and the key set, the registry needs
   * types and defaults. Collapsing the two types would make the parser's schema the registry's
   * schema, which is how a vocabulary starts to drift.
   */
  get lookup(): SchemaLookup {
    return (action: string): CommandSchemaLike | undefined => {
      const schema = this.#schemas.get(action);
      if (schema === undefined) return undefined;
      const requiredKwargs = Object.keys(schema.requiredKwargs ?? {});
      const optionalKwargs: Record<string, string> = {};
      for (const [key, spec] of Object.entries(schema.optionalKwargs ?? {})) {
        optionalKwargs[key] = spec.default ?? '';
      }
      for (const [key, spec] of Object.entries(schema.requiredKwargs ?? {})) {
        if (spec.default !== undefined) optionalKwargs[key] = spec.default;
      }
      return { minArgs: schema.minArgs, maxArgs: schema.maxArgs, requiredKwargs, optionalKwargs };
    };
  }

  /** Producer-facing view: everything a model needs to emit a valid command (FR-180). */
  introspection(): RegistryIntrospection {
    const actions = this.actions.map((action) => this.#describe(action));
    return { actions, digest: renderDigest(actions) };
  }

  /** The authoring digest alone, for a producer prompt (NFR-005). */
  digest(): string {
    return this.introspection().digest;
  }

  /** Machine-readable schema projection, one definition per action (FR-180). */
  toJsonSchema(id = 'https://stagehand.mnehmos.dev/schema/capabilities-v1.json'): JsonSchemaDocument {
    const defs: Record<string, JsonSchemaNode> = {};
    for (const action of this.actions) {
      const schema = this.#schemas.get(action);
      if (schema === undefined) continue;
      defs[action] = projectAction(schema);
    }
    return {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      $id: id,
      title: 'Stagehand capability vocabulary',
      type: 'object',
      $defs: defs,
    };
  }

  #describe(action: string): RegistryIntrospectionEntry {
    const schema = this.#schemas.get(action);
    if (schema === undefined) throw new Error(`unreachable: ${action} not registered`);

    const required = Object.keys(schema.requiredKwargs ?? {});
    const optional = Object.entries(schema.optionalKwargs ?? {}).map(([key, spec]) => {
      const entry: { key: string; type: string; default?: string } = {
        key,
        type: describeValueType(spec.type),
      };
      if (spec.default !== undefined) entry.default = spec.default;
      return entry;
    });

    const entry: RegistryIntrospectionEntry = {
      action,
      description: schema.description ?? '',
      minArgs: schema.minArgs,
      maxArgs: schema.maxArgs,
      required,
      optional,
      argTypes: (schema.argTypes ?? []).map(describeValueType),
      examples: schema.authoring?.examples ?? [],
      ...(schema.settleMs === undefined ? {} : { settleMs: schema.settleMs }),
      ...(schema.entityResolution === undefined ? {} : { entityResolution: schema.entityResolution }),
    };
    return entry;
  }
}

/**
 * Stable digest text. Sorted, so two registries holding the same schemas produce identical output
 * regardless of registration order (Constitution IV: deterministic IR).
 */
function renderDigest(entries: readonly RegistryIntrospectionEntry[]): string {
  return entries
    .map((entry) => {
      const required = entry.required.join(',');
      const optional = entry.optional.map((o) => `${o.key}:${o.type}`).join(',');
      const args = entry.argTypes.join(',');
      return `${entry.action}|args=${entry.minArgs}-${entry.maxArgs}${args === '' ? '' : `[${args}]`}|required=${required}|optional=${optional}`;
    })
    .join('\n');
}

/** Project one capability into a JSON Schema object definition. */
function projectAction(schema: CommandSchema): JsonSchemaNode {
  const properties: Record<string, JsonSchemaNode> = {};
  const requiredKeys: string[] = [];

  const project = (spec: { type: import('./types.js').ValueType; default?: string }): JsonSchemaNode => {
    const node: Record<string, unknown> = { ...jsonSchemaFor(spec.type) };
    node['description'] = describeValueType(spec.type);
    if (spec.default !== undefined) node['default'] = spec.default;
    return node;
  };

  for (const [key, spec] of Object.entries(schema.requiredKwargs ?? {})) {
    properties[key] = project(spec);
    requiredKeys.push(key);
  }
  for (const [key, spec] of Object.entries(schema.optionalKwargs ?? {})) {
    properties[key] = project(spec);
  }

  const node: Record<string, unknown> = {
    type: 'object',
    properties,
    additionalProperties: false,
    'x-stagehand-action': schema.action,
    'x-stagehand-args': { min: schema.minArgs, max: schema.maxArgs },
  };
  if (requiredKeys.length > 0) node['required'] = requiredKeys;
  if (schema.settleMs !== undefined) node['x-stagehand-settle-ms'] = schema.settleMs;
  if (schema.entityResolution !== undefined) node['x-stagehand-entity-resolution'] = schema.entityResolution;
  return node;
}

function jsonSchemaFor(type: import('./types.js').ValueType): JsonSchemaNode {
  switch (type.kind) {
    case 'string':
      return { type: 'string' };
    case 'enum':
      return { type: 'string', enum: [...type.values] };
    case 'number':
      return { type: type.integer === true ? 'integer' : 'number' };
    case 'boolean':
      return { type: 'boolean' };
    case 'duration':
      return { type: 'string', pattern: '^[+-]?(?:\\d+\\.?\\d*|\\.\\d+)\\s*(?:ms|s|m)?$' };
    case 'color':
      return { type: 'string', pattern: '^(#[0-9a-fA-F]{3,8}|rgba?\\(.*\\))$' };
    case 'entityRef':
      return { type: 'string', pattern: '^[A-Za-z][A-Za-z0-9_-]*(?::[^\\s:]+)?$' };
    case 'entityRefList':
      return { type: 'string' };
    case 'stringList':
      return { type: 'string' };
  }
}

/**
 * The core vocabulary: empty, and that is the point.
 *
 * Core may not advertise a domain namespace (Constitution III). Plugins build their own registries
 * from `packages/*` schemas; `COMMAND_SCHEMAS` exists as the core surface so the shape of that table
 * is defined once rather than invented per host.
 */
export const COMMAND_SCHEMAS: Readonly<Record<string, CommandSchema>> = Object.freeze({});

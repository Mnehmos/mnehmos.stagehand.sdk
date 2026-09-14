/**
 * TEST-171 — schema/introspection bijection.
 *
 * The point of this file is that it would fail if anyone ever added a second vocabulary. Rather than
 * spot-checking a couple of actions, it walks the registry and asserts that the executable set, the
 * introspected set, and the JSON-Schema-projected set are the *same* set, key for key.
 *
 * Covers FR-180 and DIV-006. Tasks T-026, T-029.
 */

import { describe, expect, it } from 'vitest';
import {
  CapabilityRegistry,
  COMMAND_SCHEMAS,
  describeValueType,
  type CommandSchema,
} from '../src/index.js';
import { EXPECTED_VALUE_KINDS, FIXTURE_SCHEMAS } from './fixtures.js';

const registry = new CapabilityRegistry(FIXTURE_SCHEMAS);

describe('TEST-171 / the same vocabulary on both sides', () => {
  it('exposes exactly the registered actions, sorted and without duplicates', () => {
    const expected = FIXTURE_SCHEMAS.map((s) => s.action).sort();
    expect(registry.actions).toEqual(expected);
    expect(new Set(registry.actions).size).toBe(registry.actions.length);
    expect(registry.size).toBe(FIXTURE_SCHEMAS.length);
  });

  it('introspection covers exactly the executable actions', () => {
    const introspected = registry.introspection().actions.map((a) => a.action).sort();
    expect(introspected).toEqual(registry.actions);
  });

  it('the JSON Schema projection covers exactly the executable actions', () => {
    const projected = Object.keys(registry.toJsonSchema().$defs).sort();
    expect(projected).toEqual(registry.actions);
  });

  it('every executable key appears as a projected property, and vice versa', () => {
    const document = registry.toJsonSchema();
    for (const schema of FIXTURE_SCHEMAS) {
      const definition = document.$defs[schema.action] as
        | { properties: Record<string, unknown>; required?: string[] }
        | undefined;
      expect(definition, `${schema.action} missing from projection`).toBeDefined();
      if (definition === undefined) continue;

      const executable = [
        ...Object.keys(schema.requiredKwargs ?? {}),
        ...Object.keys(schema.optionalKwargs ?? {}),
      ].sort();
      expect(Object.keys(definition.properties).sort(), `${schema.action} key mismatch`).toEqual(executable);

      const introspected = registry.introspection().actions.find((a) => a.action === schema.action);
      expect(introspected, `${schema.action} missing from introspection`).toBeDefined();
      const introspectedKeys = [
        ...(introspected?.required ?? []),
        ...(introspected?.optional ?? []).map((o) => o.key),
      ].sort();
      expect(introspectedKeys, `${schema.action} introspection key mismatch`).toEqual(executable);
    }
  });

  it('required flags agree across executable, introspection, and projection', () => {
    const document = registry.toJsonSchema();
    for (const schema of FIXTURE_SCHEMAS) {
      const definition = document.$defs[schema.action] as { required?: string[] } | undefined;
      const projectedRequired = (definition?.required ?? []).slice().sort();
      const executableRequired = Object.keys(schema.requiredKwargs ?? {}).sort();
      const introspected = registry.introspection().actions.find((a) => a.action === schema.action);
      expect(projectedRequired, `${schema.action} projection required mismatch`).toEqual(executableRequired);
      expect((introspected?.required ?? []).slice().sort(), `${schema.action} introspection required mismatch`)
        .toEqual(executableRequired);
    }
  });

  it('declared optionals are never also declared required', () => {
    for (const schema of FIXTURE_SCHEMAS) {
      const required = new Set(Object.keys(schema.requiredKwargs ?? {}));
      for (const key of Object.keys(schema.optionalKwargs ?? {})) {
        expect(required.has(key), `${schema.action}.${key} declared both required and optional`).toBe(false);
      }
    }
  });

  it('arithmetic bounds agree across all three views', () => {
    const document = registry.toJsonSchema();
    for (const schema of FIXTURE_SCHEMAS) {
      const definition = document.$defs[schema.action] as
        | { 'x-stagehand-args': { min: number; max: number } }
        | undefined;
      expect(definition?.['x-stagehand-args']).toEqual({ min: schema.minArgs, max: schema.maxArgs });
      const introspected = registry.introspection().actions.find((a) => a.action === schema.action);
      expect([introspected?.minArgs, introspected?.maxArgs]).toEqual([schema.minArgs, schema.maxArgs]);
    }
  });

  it('projects each declared value type as its declared type name', () => {
    for (const schema of FIXTURE_SCHEMAS) {
      const introspected = registry.introspection().actions.find((a) => a.action === schema.action);
      for (const [key, spec] of Object.entries(schema.optionalKwargs ?? {})) {
        const entry = introspected?.optional.find((o) => o.key === key);
        expect(entry?.type, `${schema.action}.${key} type name`).toBe(describeValueType(spec.type));
      }
    }
  });

  it('carries declared defaults into introspection and projection', () => {
    const document = registry.toJsonSchema();
    for (const schema of FIXTURE_SCHEMAS) {
      for (const [key, spec] of Object.entries(schema.optionalKwargs ?? {})) {
        if (spec.default === undefined) continue;
        const definition = document.$defs[schema.action] as
          | { properties: Record<string, { default?: string }> }
          | undefined;
        expect(definition?.properties[key]?.default, `${schema.action}.${key} projected default`).toBe(spec.default);
        const introspected = registry.introspection().actions.find((a) => a.action === schema.action);
        expect(introspected?.optional.find((o) => o.key === key)?.default).toBe(spec.default);
      }
    }
  });
});

describe('TEST-171 / the fixture set exercises the whole value grammar', () => {
  it('covers every value type kind the registry models', () => {
    const used = new Set<string>();
    const record = (schema: CommandSchema): void => {
      for (const spec of Object.values(schema.requiredKwargs ?? {})) used.add(spec.type.kind);
      for (const spec of Object.values(schema.optionalKwargs ?? {})) used.add(spec.type.kind);
      for (const type of schema.argTypes ?? []) used.add(type.kind);
    };
    for (const schema of FIXTURE_SCHEMAS) record(schema);
    for (const kind of EXPECTED_VALUE_KINDS) {
      expect(used.has(kind), `no fixture schema exercises value type "${kind}"`).toBe(true);
    }
  });
});

describe('TEST-171 / determinism and the core vocabulary', () => {
  it('produces identical digests regardless of registration order', () => {
    const forward = new CapabilityRegistry(FIXTURE_SCHEMAS).digest();
    const reversed = new CapabilityRegistry([...FIXTURE_SCHEMAS].reverse()).digest();
    expect(reversed).toBe(forward);
    expect(forward.length).toBeGreaterThan(0);
  });

  it('produces a digest naming every action and its keys, for a producer prompt', () => {
    const digest = registry.digest();
    for (const schema of FIXTURE_SCHEMAS) {
      expect(digest, `${schema.action} absent from digest`).toContain(schema.action);
    }
    expect(digest).toContain('entity');
    expect(digest).toContain('speed');
  });

  it('changes the digest when the vocabulary changes', () => {
    const before = registry.digest();
    const extended = new CapabilityRegistry([
      ...FIXTURE_SCHEMAS,
      { action: 'map.temp', minArgs: 0, maxArgs: 0, optionalKwargs: {} },
    ]);
    expect(extended.digest()).not.toBe(before);
  });

  it('ships an empty core vocabulary, advertising no domain namespace', () => {
    // Constitution III / Article IX: core carries no lesson, projector, piece, or room actions.
    expect(Object.keys(COMMAND_SCHEMAS)).toEqual([]);
    for (const forbidden of ['lesson.', 'projector.', 'piece.', 'room.']) {
      for (const action of Object.keys(COMMAND_SCHEMAS)) {
        expect(action.startsWith(forbidden), `core advertises domain action ${action}`).toBe(false);
      }
    }
  });

  it('refuses a duplicate action rather than silently replacing it', () => {
    const duplicate = new CapabilityRegistry([FIXTURE_SCHEMAS[0] as CommandSchema]);
    expect(() => duplicate.register(FIXTURE_SCHEMAS[0] as CommandSchema)).toThrow(/already registered/);
  });

  it('refuses a malformed action name at registration', () => {
    expect(() => new CapabilityRegistry([{ action: 'NotDotted', minArgs: 0, maxArgs: 0 }])).toThrow(/not well formed/);
    expect(() => new CapabilityRegistry([{ action: 'a..b', minArgs: 0, maxArgs: 0 }])).toThrow(/not well formed/);
  });
});

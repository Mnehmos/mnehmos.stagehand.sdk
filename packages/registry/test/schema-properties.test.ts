/**
 * TEST-172 — required/optional kwargs and defaults, asserted as properties over the fixture set.
 *
 * These are properties rather than cases on purpose: a case-per-schema test only covers the schemas
 * someone remembered to write a case for. The sweeps below apply to every schema in the registry, so
 * a new capability is covered the moment it is registered.
 *
 * Covers FR-175, FR-177, FR-179. Tasks T-025, T-027, T-029.
 */

import { describe, expect, it } from 'vitest';
import {
  CapabilityRegistry,
  checkValue,
  isValid,
  validateCommand,
  validateCommands,
  type CommandSchema,
} from '../src/index.js';
import { FIXTURE_SCHEMAS, minimalCommand, sampleValue } from './fixtures.js';

const registry = new CapabilityRegistry(FIXTURE_SCHEMAS);

describe('TEST-172 / structural properties every schema must satisfy', () => {
  it('declares coherent arity bounds', () => {
    for (const schema of FIXTURE_SCHEMAS) {
      expect(schema.minArgs, `${schema.action} minArgs`).toBeGreaterThanOrEqual(0);
      expect(schema.maxArgs, `${schema.action} maxArgs`).toBeGreaterThanOrEqual(schema.minArgs);
      if (schema.argTypes !== undefined) {
        expect(schema.argTypes.length, `${schema.action} argTypes longer than maxArgs`)
          .toBeLessThanOrEqual(schema.maxArgs);
      }
    }
  });

  it('gives every declared default a value that satisfies its own type', () => {
    // A default that fails its own type is a schema bug that would surface as a rejection of a
    // command the producer never sent.
    for (const schema of FIXTURE_SCHEMAS) {
      for (const [key, spec] of Object.entries(schema.optionalKwargs ?? {})) {
        if (spec.default === undefined) continue;
        const check = checkValue(spec.default, spec.type);
        expect(check.ok, `${schema.action}.${key} default "${spec.default}" fails its own type: ${check.reason ?? ''}`)
          .toBe(true);
      }
    }
  });

  it('accepts a minimal valid command for every schema', () => {
    for (const schema of FIXTURE_SCHEMAS) {
      const result = validateCommand(registry, minimalCommand(schema.action));
      if (!result.ok) {
        throw new Error(`${schema.action} minimal command rejected at ${result.layer}: ${result.errors.map((e) => e.message).join('; ')}`);
      }
      expect(result.schema.action).toBe(schema.action);
    }
  });
});

describe('TEST-172 / required kwargs are enforced', () => {
  for (const schema of FIXTURE_SCHEMAS) {
    const requiredKeys = Object.keys(schema.requiredKwargs ?? {});
    if (requiredKeys.length === 0) continue;

    it(`${schema.action}: each required key is rejected when missing`, () => {
      for (const key of requiredKeys) {
        const command = minimalCommand(schema.action);
        delete command.kwargs[key];
        const result = validateCommand(registry, command);
        expect(result.ok, `${schema.action} accepted with "${key}" missing`).toBe(false);
        if (!result.ok) {
          expect(result.layer).toBe('registry');
          expect(result.errors.some((e) => e.subject === key)).toBe(true);
        }
      }
    });

    it(`${schema.action}: each required key is rejected when empty`, () => {
      for (const key of requiredKeys) {
        const command = minimalCommand(schema.action);
        command.kwargs[key] = '';
        const result = validateCommand(registry, command);
        expect(result.ok, `${schema.action} accepted with "${key}" empty`).toBe(false);
        if (!result.ok) expect(result.errors.some((e) => e.subject === key)).toBe(true);
      }
    });
  }
});

describe('TEST-172 / optional kwargs are accepted with their declared defaults', () => {
  for (const schema of FIXTURE_SCHEMAS) {
    const optionalEntries = Object.entries(schema.optionalKwargs ?? {});

    it(`${schema.action}: omitting every optional key is accepted`, () => {
      const result = validateCommand(registry, minimalCommand(schema.action));
      expect(result.ok).toBe(true);
    });

    if (optionalEntries.some(([, spec]) => spec.default !== undefined)) {
      it(`${schema.action}: supplying each declared default explicitly is accepted`, () => {
        const command = minimalCommand(schema.action);
        for (const [key, spec] of optionalEntries) {
          if (spec.default === undefined) continue;
          command.kwargs[key] = spec.default;
        }
        const result = validateCommand(registry, command);
        if (!result.ok) {
          throw new Error(`${schema.action} rejected its own declared defaults: ${result.errors.map((e) => e.message).join('; ')}`);
        }
        expect(result.ok).toBe(true);
      });
    }

    it(`${schema.action}: supplying a valid value for every optional key is accepted`, () => {
      const command = minimalCommand(schema.action);
      for (const [key, spec] of optionalEntries) {
        command.kwargs[key] = sampleValue(spec.type);
      }
      const result = validateCommand(registry, command);
      if (!result.ok) {
        throw new Error(`${schema.action} rejected valid optional values: ${result.errors.map((e) => e.message).join('; ')}`);
      }
    });
  }
});

describe('TEST-172 / the validator does not mutate what it is given', () => {
  it('leaves an accepted command structurally unchanged', () => {
    for (const schema of FIXTURE_SCHEMAS) {
      const command = minimalCommand(schema.action);
      const snapshot = structuredClone(command);
      validateCommand(registry, command);
      expect(command, `${schema.action} was mutated by validation`).toEqual(snapshot);
    }
  });

  it('leaves a rejected command structurally unchanged, and adds no defaults', () => {
    for (const schema of FIXTURE_SCHEMAS) {
      const command = minimalCommand(schema.action);
      command.kwargs['__nope__'] = 'x';
      const keysBefore = Object.keys(command.kwargs).sort();
      const snapshot = structuredClone(command);
      const result = validateCommand(registry, command);
      expect(result.ok).toBe(false);
      expect(command).toEqual(snapshot);
      expect(Object.keys(command.kwargs).sort()).toEqual(keysBefore);
    }
  });

  it('validates a deep-frozen command without throwing', () => {
    const command = minimalCommand('whiteboard.text');
    command.kwargs['text'] = 'frozen';
    const frozen = Object.freeze({
      ...command,
      kwargs: Object.freeze({ ...command.kwargs }),
      args: Object.freeze([...command.args]) as unknown as string[],
    });
    expect(() => validateCommand(registry, frozen)).not.toThrow();
    expect(validateCommand(registry, frozen).ok).toBe(true);
  });
});

describe('TEST-172 / validateCommands maps without implying atomicity', () => {
  it('returns one independent verdict per command, in order', () => {
    const commands = [
      minimalCommand('map.focus'),
      { action: 'nope.nothing', args: [], kwargs: {}, raw: '[nope.nothing]' },
      minimalCommand('whiteboard.text'),
    ];
    const entries = validateCommands(registry, commands);
    expect(entries.map((e) => e.index)).toEqual([0, 1, 2]);
    expect(entries.map((e) => e.result.ok)).toEqual([true, false, true]);
  });

  it('reports an all-invalid list as invalid without short-circuiting', () => {
    const commands = [
      { action: 'a.b', args: [], kwargs: {}, raw: '' },
      { action: 'c.d', args: [], kwargs: {}, raw: '' },
    ];
    const entries = validateCommands(registry, commands);
    expect(entries).toHaveLength(2);
    expect(entries.every((e) => !e.result.ok)).toBe(true);
  });

  it('returns an empty list for an empty input rather than throwing', () => {
    expect(validateCommands(registry, [])).toEqual([]);
  });
});

describe('TEST-172 / isValid narrows the result', () => {
  it('identifies acceptance and rejection correctly', () => {
    const accepted = validateCommand(registry, minimalCommand('map.focus'));
    const rejected = validateCommand(registry, { action: 'x.y', args: [], kwargs: {}, raw: '' });
    expect(isValid(accepted)).toBe(true);
    expect(isValid(rejected)).toBe(false);
  });
});

describe('TEST-172 / schema-dependent behaviour is not hardcoded', () => {
  it('a schema registered after the fact is enforced immediately, with no other change', () => {
    const extended = new CapabilityRegistry(FIXTURE_SCHEMAS);
    const extra: CommandSchema = {
      action: 'map.orbit',
      minArgs: 1,
      maxArgs: 1,
      argTypes: [{ kind: 'entityRef' }],
      optionalKwargs: { tilt: { type: { kind: 'number', min: 0, max: 90 }, default: '45' } },
    };
    extended.register(extra);

    expect(validateCommand(extended, { action: 'map.orbit', args: ['anchor:a'], kwargs: {}, raw: '' }).ok).toBe(true);
    expect(validateCommand(extended, { action: 'map.orbit', args: [], kwargs: {}, raw: '' }).ok).toBe(false);
    expect(validateCommand(extended, { action: 'map.orbit', args: ['anchor:a'], kwargs: { tilt: '120' }, raw: '' }).ok).toBe(false);
    // And it appears in both projections without any further wiring.
    expect(Object.keys(extended.toJsonSchema().$defs)).toContain('map.orbit');
    expect(extended.introspection().actions.map((a) => a.action)).toContain('map.orbit');
  });
});

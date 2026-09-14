/**
 * TEST-173 — unknown-action and typed-value adversarial corpus, plus layer ordering.
 *
 * Every case here is input a real producer could emit, and every one of them must be *rejected with
 * a reason* rather than accepted, coerced, or ignored (DIV-004: no semantic repair; Article XII:
 * swallowed validation errors are forbidden).
 *
 * Covers FR-177, FR-178. Tasks T-027, T-028, T-029.
 */

import { describe, expect, it } from 'vitest';
import type { StagehandCommand } from '@stagehand/parser';
import {
  CapabilityRegistry,
  checkValue,
  describeValueType,
  validateCommand,
  type CommandSchema,
  type ValidationStage,
  type ValueType,
} from '../src/index.js';
import { FIXTURE_SCHEMAS, minimalCommand, violatingValue } from './fixtures.js';

const registry = new CapabilityRegistry(FIXTURE_SCHEMAS);

const cmd = (action: string, kwargs: Record<string, string> = {}, args: string[] = []): StagehandCommand => ({
  action,
  args,
  kwargs,
  raw: `[${action}]`,
});

describe('TEST-173 / unknown actions', () => {
  it('rejects an unregistered action with the recovered message template', () => {
    const result = validateCommand(registry, cmd('claim.show', { id: 'x' }));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.layer).toBe('registry');
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.code).toBe('E_UNKNOWN_ACTION');
    expect(result.errors[0]?.message).toBe('Unknown Stagehand action: claim.show');
  });

  it('rejects an action that is a prefix of a registered one', () => {
    expect(validateCommand(registry, cmd('map')).ok).toBe(false);
    expect(validateCommand(registry, cmd('map.focus.deep')).ok).toBe(false);
    expect(validateCommand(registry, cmd('MAP.FOCUS')).ok).toBe(false);
  });

  it('rejects a malformed action at the syntax layer before the registry layer runs', () => {
    const result = validateCommand(registry, cmd('not_dotted'));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.layer).toBe('syntax');
    expect(result.errors[0]?.code).toBe('E_SCHEMA');
  });
});

describe('TEST-173 / arity', () => {
  it('rejects too few positional arguments', () => {
    const result = validateCommand(registry, cmd('avatar.move'));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.some((e) => e.subject === 'args')).toBe(true);
  });

  it('rejects too many positional arguments', () => {
    const result = validateCommand(registry, cmd('avatar.move', {}, ['a:1', 'b:2']));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.some((e) => e.subject === 'args')).toBe(true);
  });

  it('rejects a positional argument of the wrong declared type', () => {
    const result = validateCommand(registry, cmd('avatar.move', {}, ['!!! not an entity !!!']));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.some((e) => e.subject === 'args[0]')).toBe(true);
  });
});

describe('TEST-173 / kwargs', () => {
  it('rejects an undeclared kwarg rather than ignoring it', () => {
    const result = validateCommand(registry, cmd('map.focus', { id: 'venice', sneak: 'yes' }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const error = result.errors.find((e) => e.subject === 'sneak');
      expect(error?.code).toBe('E_SCHEMA');
      expect(error?.message).toContain('Unknown keyword argument');
    }
  });

  it('rejects a kwarg that belongs to a different action', () => {
    // `speed` is real, but it is avatar.move's, not map.focus's.
    expect(validateCommand(registry, cmd('map.focus', { speed: 'run' })).ok).toBe(false);
  });
});

describe('TEST-173 / typed values', () => {
  it('rejects a value that violates its declared type, for every declared type', () => {
    const checked = new Set<string>();
    for (const schema of FIXTURE_SCHEMAS) {
      for (const [key, spec] of Object.entries(schema.optionalKwargs ?? {})) {
        checked.add(spec.type.kind);
        const result = validateCommand(registry, cmd(schema.action, { [key]: violatingValue(spec.type) }));
        expect(result.ok, `${schema.action}.${key} accepted a violating ${spec.type.kind}`).toBe(false);
        if (!result.ok) {
          const error = result.errors.find((e) => e.subject === key);
          expect(error, `${schema.action}.${key} produced no attributable error`).toBeDefined();
          expect(error?.code).toBe('E_SCHEMA');
        }
      }
    }
    expect(checked.size).toBeGreaterThanOrEqual(6);
  });

  it('rejects an enum member that is not declared', () => {
    const result = validateCommand(registry, cmd('avatar.move', { speed: 'teleport' }, ['anchor:a']));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const error = result.errors.find((e) => e.subject === 'speed');
      expect(error?.message).toContain('expected one of [walk, stroll, run]');
    }
  });

  it('rejects a number outside its declared bounds', () => {
    expect(validateCommand(registry, cmd('map.focus', { zoom: '99' })).ok).toBe(false);
    expect(validateCommand(registry, cmd('map.focus', { zoom: '-1' })).ok).toBe(false);
    expect(validateCommand(registry, cmd('map.focus', { zoom: '9' })).ok).toBe(true);
  });

  it('rejects a fractional value where an integer is required, instead of rounding it', () => {
    const result = validateCommand(registry, cmd('piece.move', { steps: '1.5' }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.find((e) => e.subject === 'steps')?.message).toContain('expected an integer');
  });

  it('rejects a non-numeric and a non-finite value', () => {
    for (const bad of ['NaN', 'Infinity', 'abc', '', '1_000', '1,5']) {
      expect(checkValue(bad, { kind: 'number' }).ok, `number accepted "${bad}"`).toBe(false);
    }
    expect(checkValue('12', { kind: 'number' }).ok).toBe(true);
    expect(checkValue('1.5', { kind: 'number' }).ok).toBe(true);
  });

  it('rejects durations that are unparseable or outside their bounds', () => {
    // Grammar, with bounds wide enough not to interfere.
    const grammar: Array<[string, boolean]> = [
      ['250', true],
      ['250ms', true],
      ['1.5s', true],
      ['2m', true],
      ['', false],
      ['250 parsecs', false],
      ['soon', false],
      ['1_0ms', false],
    ];
    for (const [input, expected] of grammar) {
      expect(checkValue(input, { kind: 'duration', minMs: 0, maxMs: 600_000 }).ok, `duration grammar "${input}"`)
        .toBe(expected);
    }

    // Bounds, with the grammar exercised above.
    const bounds: Array<[string, boolean]> = [
      ['-5', false],
      ['-1ms', false],
      ['99999ms', false],
      ['10s', true],
      ['10000ms', true],
      ['10001ms', false],
    ];
    for (const [input, expected] of bounds) {
      expect(checkValue(input, { kind: 'duration', minMs: 0, maxMs: 10_000 }).ok, `duration bound "${input}"`)
        .toBe(expected);
    }
  });

  it('rejects malformed colors and accepts the recovered forms', () => {
    const good = ['#f00', '#ff0000', '#ff0000ff', 'rgb(255,0,0)', 'rgba(255,0,0,0.5)'];
    const bad = ['red', '#12345', 'ff0000', 'rgb(255 0 0)', ''];
    for (const input of good) expect(checkValue(input, { kind: 'color' }).ok, `color "${input}"`).toBe(true);
    for (const input of bad) expect(checkValue(input, { kind: 'color' }).ok, `color "${input}"`).toBe(false);
  });

  it('rejects booleans that are not exactly the JSON literals', () => {
    for (const input of ['yes', '1', 'TRUE', ' true', 'True', 'no', '']) {
      expect(checkValue(input, { kind: 'boolean' }).ok, `boolean accepted "${input}"`).toBe(false);
    }
    expect(checkValue('true', { kind: 'boolean' }).ok).toBe(true);
    expect(checkValue('false', { kind: 'boolean' }).ok).toBe(true);
  });

  it('rejects an empty required list before reaching the item-count check', () => {
    const result = validateCommand(registry, cmd('map.overlay.show', { ids: '' }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const error = result.errors.find((e) => e.subject === 'ids');
      expect(error?.message).toContain('is empty');
    }
  });

  it('enforces list item bounds', () => {
    expect(checkValue('', { kind: 'stringList', minItems: 1 }).ok).toBe(false);
    expect(checkValue('a', { kind: 'stringList', minItems: 1 }).ok).toBe(true);
    expect(checkValue(Array.from({ length: 13 }, (_, i) => `x${i}`).join(','), { kind: 'stringList', maxItems: 12 }).ok)
      .toBe(false);
    expect(checkValue('alpha,beta', { kind: 'stringList', maxItems: 12 }).ok).toBe(true);
  });

  it('rejects an over-long entity list through the registry, not just the type checker', () => {
    const many = Array.from({ length: 13 }, (_, i) => `anchor:${i}`).join(',');
    const result = validateCommand(registry, cmd('map.highlight', { entities: many }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.find((e) => e.subject === 'entities')?.message).toContain('at most 12');
  });

  it('rejects a malformed item inside an entity-reference list', () => {
    expect(checkValue('anchor:a,!!!bad', { kind: 'entityRefList' }).ok).toBe(false);
    expect(checkValue('anchor:a,country:iran', { kind: 'entityRefList' }).ok).toBe(true);
  });

  it('rejects a string shorter or longer than declared', () => {
    expect(checkValue('', { kind: 'string', minLength: 1 }).ok).toBe(false);
    expect(checkValue('x'.repeat(5), { kind: 'string', maxLength: 4 }).ok).toBe(false);
  });
});

describe('TEST-173 / layer ordering and pluggability', () => {
  it('reports the registry layer and does not run a contributed state stage after it', () => {
    let stateStageRan = false;
    const stateStage: ValidationStage = {
      layer: 'state',
      validate: () => {
        stateStageRan = true;
        return [{ code: 'E_STATE', layer: 'state', message: 'should never run' }];
      },
    };

    const result = validateCommand(registry, cmd('claim.show'), { stages: [stateStage] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.layer).toBe('registry');
    expect(stateStageRan, 'a later layer ran after an earlier rejection').toBe(false);
  });

  it('runs contributed stages in pipeline order, not registration order', () => {
    const order: string[] = [];
    const spatial: ValidationStage = { layer: 'spatial', validate: () => { order.push('spatial'); return []; } };
    const entity: ValidationStage = { layer: 'entity', validate: () => { order.push('entity'); return []; } };
    const state: ValidationStage = { layer: 'state', validate: () => { order.push('state'); return []; } };

    // Registered out of order on purpose.
    const result = validateCommand(registry, minimalCommand('map.focus'), { stages: [spatial, entity, state] });
    expect(result.ok).toBe(true);
    expect(order).toEqual(['entity', 'state', 'spatial']);
  });

  it('reports the contributing layer when a stage rejects', () => {
    const entityStage: ValidationStage = {
      layer: 'entity',
      validate: () => [{ code: 'E_UNRESOLVED_REF', layer: 'entity', message: 'no such anchor', subject: 'id' }],
    };
    const result = validateCommand(registry, cmd('map.focus', { id: 'nowhere' }), { stages: [entityStage] });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.layer).toBe('entity');
      expect(result.errors[0]?.code).toBe('E_UNRESOLVED_REF');
    }
  });

  it('cannot be softened by a later stage passing', () => {
    const entityStage: ValidationStage = {
      layer: 'entity',
      validate: () => [{ code: 'E_UNRESOLVED_REF', layer: 'entity', message: 'unresolved' }],
    };
    const stateStage: ValidationStage = { layer: 'state', validate: () => [] };
    const result = validateCommand(registry, cmd('map.focus', { id: 'x' }), { stages: [entityStage, stateStage] });
    expect(result.ok).toBe(false);
  });

  it('passes the supplied context through to contributed stages', () => {
    let seen: unknown;
    const stage: ValidationStage = {
      layer: 'entity',
      validate: (_command, context) => {
        seen = context['registry'];
        return [];
      },
    };
    validateCommand(registry, cmd('map.focus', { id: 'x' }), { stages: [stage], context: { registry: 'sentinel' } });
    expect(seen).toBe('sentinel');
  });

  it('validates unchanged with no stages contributed', () => {
    expect(validateCommand(registry, minimalCommand('avatar.move')).ok).toBe(true);
  });
});

describe('TEST-173 / type-name reporting', () => {
  it('describes every value type compactly for error and introspection output', () => {
    const cases: Array<[ValueType, string]> = [
      [{ kind: 'string' }, 'string'],
      [{ kind: 'enum', values: ['a', 'b'] }, 'enum(a|b)'],
      [{ kind: 'number' }, 'number'],
      [{ kind: 'number', integer: true, min: 0, max: 10 }, 'integer(>=0,<=10)'],
      [{ kind: 'boolean' }, 'boolean'],
      [{ kind: 'duration' }, 'duration'],
      [{ kind: 'color' }, 'color'],
      [{ kind: 'entityRef' }, 'entityRef'],
      [{ kind: 'entityRefList' }, 'entityRefList'],
      [{ kind: 'stringList' }, 'stringList'],
    ];
    for (const [type, expected] of cases) {
      expect(describeValueType(type)).toBe(expected);
    }
  });

  it('rejects a schema whose action collides with a fixture at registration', () => {
    const colliding: CommandSchema = { action: 'map.focus', minArgs: 0, maxArgs: 0 };
    expect(() => registry.register(colliding)).toThrow(/already registered/);
  });
});

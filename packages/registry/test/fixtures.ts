/**
 * Fixture capability set for TEST-171..TEST-173.
 *
 * Deliberately plugin-shaped (`map.*`, `avatar.*`, `whiteboard.*`, `lesson.*`, `piece.*`,
 * `projector.*`) because core advertises nothing: domain vocabulary belongs to plugins
 * (Constitution III). The set exists to exercise every value type the registry models, so the
 * property tests in TEST-172 sweep the whole grammar rather than the cases I happened to think of.
 */

import type { CommandSchema, ValueType } from '../src/index.js';

export const FIXTURE_SCHEMAS: readonly CommandSchema[] = [
  {
    action: 'map.focus',
    description: 'Focus the map view on a semantic target.',
    minArgs: 0,
    maxArgs: 0,
    optionalKwargs: {
      id: { type: { kind: 'string', minLength: 1 } },
      zoom: { type: { kind: 'number', min: 0, max: 22 } },
    },
    entityResolution: 'optional',
    authoring: { summary: 'Frame a place', examples: ['[map.focus id=venice zoom=9]'] },
  },
  {
    action: 'map.highlight',
    description: 'Highlight one or more entities.',
    minArgs: 0,
    maxArgs: 1,
    argTypes: [{ kind: 'entityRef' }],
    optionalKwargs: {
      entity: { type: { kind: 'entityRef' } },
      color: { type: { kind: 'color' }, default: '#ef4444' },
      entities: { type: { kind: 'entityRefList', minItems: 1, maxItems: 12 } },
    },
    entityResolution: 'required',
  },
  {
    action: 'map.timecursor',
    description: 'Place the time cursor. DIV-002: live versus at must be explicit.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: {
      at: { type: { kind: 'string', minLength: 1 } },
    },
    optionalKwargs: {
      mode: { type: { kind: 'enum', values: ['live', 'paused'] }, default: 'live' },
      transition: { type: { kind: 'duration', minMs: 0, maxMs: 10_000 }, default: '250ms' },
    },
  },
  {
    action: 'avatar.move',
    description: 'Move the avatar to a semantic anchor.',
    minArgs: 1,
    maxArgs: 1,
    argTypes: [{ kind: 'entityRef' }],
    optionalKwargs: {
      speed: { type: { kind: 'enum', values: ['walk', 'stroll', 'run'] }, default: 'walk' },
      settle: { type: { kind: 'duration', minMs: 0 }, default: '0' },
    },
  },
  {
    action: 'whiteboard.text',
    description: 'Write text on the board.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: {
      id: { type: { kind: 'string', minLength: 1 } },
    },
    optionalKwargs: {
      text: { type: { kind: 'string', maxLength: 4000 }, default: '' },
      size: { type: { kind: 'enum', values: ['sm', 'md', 'lg'] }, default: 'md' },
      visible: { type: { kind: 'boolean' }, default: 'true' },
    },
  },
  {
    action: 'piece.move',
    description: 'Move a world piece by a bounded step count.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: {
      steps: { type: { kind: 'number', integer: true, min: 1, max: 64 } },
    },
    optionalKwargs: {
      diagonal: { type: { kind: 'boolean' }, default: 'false' },
    },
  },
  {
    action: 'map.overlay.show',
    description: 'Show one or more registered overlays.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: {
      ids: { type: { kind: 'stringList', minItems: 1, maxItems: 8 } },
    },
  },
  {
    action: 'projector.lower',
    description: 'Lower the projector. Settle time drives readiness (FEAT-006).',
    minArgs: 0,
    maxArgs: 0,
    optionalKwargs: {
      tint: { type: { kind: 'color' }, default: '#000000' },
    },
    settleMs: 1200,
  },
];

/** Every value type kind the registry models, for coverage assertions. */
export const EXPECTED_VALUE_KINDS = [
  'string',
  'enum',
  'number',
  'boolean',
  'duration',
  'color',
  'entityRef',
  'entityRefList',
  'stringList',
] as const;

/** A minimal valid command for a schema, used to reach deeper assertions. */
export function minimalCommand(action: string): { action: string; args: string[]; kwargs: Record<string, string>; raw: string } {
  const schema = FIXTURE_SCHEMAS.find((s) => s.action === action);
  if (schema === undefined) throw new Error(`no fixture schema for ${action}`);
  const args = Array.from({ length: schema.minArgs }, (_, i) => (schema.argTypes?.[i]?.kind === 'entityRef' ? `anchor:${i}` : `arg${i}`));
  const kwargs: Record<string, string> = {};
  for (const [key, spec] of Object.entries(schema.requiredKwargs ?? {})) {
    kwargs[key] = sampleValue(spec.type);
  }
  return { action, args, kwargs, raw: `[${action}]` };
}

/** A value that satisfies a type, for building valid fixtures. */
export function sampleValue(type: ValueType): string {
  switch (type.kind) {
    case 'string':
      return 'x'.repeat(type.minLength ?? 1);
    case 'enum':
      return type.values[0] ?? '';
    case 'number':
      return String(type.min ?? 1);
    case 'boolean':
      return 'true';
    case 'duration':
      return String(type.minMs ?? 0);
    case 'color':
      return '#abcdef';
    case 'entityRef':
      return 'anchor:home';
    case 'entityRefList':
      return 'anchor:a,anchor:b';
    case 'stringList':
      return 'alpha,beta';
  }
}

/** A value that violates a type, for the adversarial corpus. */
export function violatingValue(type: ValueType): string {
  switch (type.kind) {
    case 'string':
      return type.minLength !== undefined && type.minLength > 0 ? '' : 'x'.repeat((type.maxLength ?? 1) + 1);
    case 'enum':
      return '__not_a_member__';
    case 'number':
      return 'not-a-number';
    case 'boolean':
      return 'yes';
    case 'duration':
      return 'soon';
    case 'color':
      return 'chartreuse-ish';
    case 'entityRef':
      return '   ';
    case 'entityRefList':
      return '';
    case 'stringList':
      return '';
  }
}

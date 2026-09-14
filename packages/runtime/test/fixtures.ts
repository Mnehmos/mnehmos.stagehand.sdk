/**
 * Fixtures for the runtime's parity exits.
 *
 * Two deliberate choices about naming:
 *
 * - The capability set is plugin-shaped (`map.*`, `whiteboard.*`, `avatar.*`, `piece.*`) because
 *   core advertises nothing (Constitution III) — the same convention `packages/registry` uses.
 * - The semantic-compilation fixture is named `fixture.semantic` and expands to `fixture.primitive.*`
 *   rather than to plausible geo actions. `TEST-175` exercises the *mechanism*: ordering, all-or-
 *   nothing expansion, and determinism. The real v2→primitive mappings belong to the plugins that own
 *   those dialects (`FEAT-007`, `FEAT-008`), and claiming them here with fixture data would be
 *   asserting parity against a mapping nobody has written.
 */

import type { StagehandCommand } from '@stagehand/parser';
import { CapabilityRegistry, type CommandSchema } from '@stagehand/registry';
import { defineCompilerPass } from '../src/index.js';

export const RUNTIME_SCHEMAS: readonly CommandSchema[] = [
  {
    action: 'map.focus',
    description: 'Focus the map on a semantic target.',
    minArgs: 0,
    maxArgs: 0,
    optionalKwargs: {
      id: { type: { kind: 'entityRef' } },
      zoom: { type: { kind: 'number', min: 0, max: 22 } },
    },
    entityResolution: 'optional',
  },
  {
    action: 'map.highlight',
    description: 'Highlight a positional entity and/or a list of entities.',
    minArgs: 0,
    maxArgs: 1,
    argTypes: [{ kind: 'entityRef' }],
    optionalKwargs: {
      entities: { type: { kind: 'entityRefList', minItems: 1, maxItems: 12 } },
      color: { type: { kind: 'color' } },
    },
    entityResolution: 'required',
  },
  {
    action: 'whiteboard.text',
    description: 'Write text on the board. Carries no references.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { id: { type: { kind: 'string', minLength: 1 } } },
    optionalKwargs: {
      text: { type: { kind: 'string' } },
      size: { type: { kind: 'enum', values: ['sm', 'md', 'lg'] } },
    },
    entityResolution: 'none',
  },
  {
    action: 'avatar.move',
    description: 'Move the avatar to a positional anchor.',
    minArgs: 1,
    maxArgs: 1,
    argTypes: [{ kind: 'entityRef' }],
    optionalKwargs: { speed: { type: { kind: 'enum', values: ['walk', 'stroll', 'run'] } } },
    entityResolution: 'required',
  },
  {
    action: 'piece.place',
    description: 'Place pieces at a semantic location.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { at: { type: { kind: 'entityRef' } } },
    optionalKwargs: { count: { type: { kind: 'number', integer: true, min: 1, max: 64 } } },
    entityResolution: 'required',
  },
  {
    action: 'fixture.semantic',
    description: 'Fixture semantic action used to exercise the compiler-pass mechanism.',
    minArgs: 0,
    maxArgs: 0,
    optionalKwargs: { id: { type: { kind: 'entityRef' } } },
    entityResolution: 'optional',
  },
];

export function makeRegistry(): CapabilityRegistry {
  return new CapabilityRegistry(RUNTIME_SCHEMAS);
}

/** Build a command literal without going through the parser. */
export function cmd(
  action: string,
  kwargs: Record<string, string> = {},
  args: string[] = [],
): StagehandCommand {
  return { action, args, kwargs, raw: `[${action}]` };
}

/** Reference strings the resolver fixtures treat as known, with their concrete targets. */
export const KNOWN_REFERENCES: Readonly<Record<string, { id: string; center: [number, number]; bounds: [number, number, number, number] }>> = {
  'country:iran': { id: 'IRN', center: [53.688, 32.4279], bounds: [44.03, 25.06, 63.32, 39.78] },
  'city:venice': { id: 'VEN', center: [12.3155, 45.4408], bounds: [12.24, 45.39, 12.39, 45.49] },
  'anchor:desk': { id: 'desk-01', center: [0, 0], bounds: [-1, -1, 1, 1] },
  'anchor:board': { id: 'board-01', center: [1, 1], bounds: [0, 0, 2, 2] },
};

/** References that must never resolve: stale (was real), missing, and ambiguous. */
export const STALE_REFERENCES: readonly string[] = [
  'country:ussr',
  'city:atlantis',
  'anchor:removed-desk',
];

/**
 * The canonical fixture mapping: one semantic action, two primitives, in a fixed order.
 *
 * Shared between TEST-174 (a refused batch must leave zero mutations *and* not be retried) and
 * TEST-175 (the expansion goldens), because those two properties are only jointly meaningful — a
 * batch that is retried is not atomic, and a batch that is atomic but retried is not idempotent.
 */
export const FIXTURE_PASS = defineCompilerPass('fixture-v2-to-primitive', {
  'fixture.semantic': [
    { action: 'fixture.primitive.begin', payload: { args: [], kwargs: { phase: 'begin' }, refs: [] } },
    { action: 'fixture.primitive.end', payload: { args: [], kwargs: { phase: 'end' }, refs: [] } },
  ],
});

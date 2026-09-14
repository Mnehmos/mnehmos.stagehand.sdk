/**
 * VC-superset capability schemas and the surface manifest (FR-229, FR-234).
 *
 * The corpus records **21 surfaces** because two hosts each declared their own list, and six actions
 * appear in both:
 *
 * | Actions | Clio | VC |
 * |---|---|---|
 * | `show` `hide` `clear` `text` `line` `box` | SURF-034..039 | SURF-057..063 |
 * | `math` | — | SURF-061 |
 * | `arrow` `highlight` `scribble` `dots` `shape` `count` `erase` `reveal` | — | SURF-064..071 |
 *
 * Registering 21 schemas would put two contracts on one action name, which the registry rightly
 * refuses as a duplicate. So the **union** (15) is registered once, and the 21 surfaces are tracked
 * in a manifest. `TEST-203` walks the manifest, which is the check that would notice a surface being
 * dropped during consolidation — counting actions never would, because 15 is the correct number
 * either way.
 *
 * Where the two hosts describe the same action differently, VC's wording is adopted and the
 * difference is recorded in `CLIO_COMPATIBILITY`. That is `FR-234`'s point: the choice is explicit.
 */

import type { CommandSchema } from '@stagehand/registry';

/** One owned surface: a corpus identity plus the action that serves it. */
export interface SurfaceBinding {
  readonly surface: string;
  readonly contract: string;
  readonly action: string;
  readonly host: 'Clio' | 'Virtual Classroom';
}

function surface(
  surfaceId: string,
  contractId: string,
  action: string,
  host: SurfaceBinding['host'],
): SurfaceBinding {
  return { surface: surfaceId, contract: contractId, action, host };
}

/** All 21 owned surfaces, in corpus order. */
export const SURFACE_MANIFEST: readonly SurfaceBinding[] = [
  surface('SURF-034', 'CTR-034', 'whiteboard.show', 'Clio'),
  surface('SURF-035', 'CTR-035', 'whiteboard.hide', 'Clio'),
  surface('SURF-036', 'CTR-036', 'whiteboard.clear', 'Clio'),
  surface('SURF-037', 'CTR-037', 'whiteboard.text', 'Clio'),
  surface('SURF-038', 'CTR-038', 'whiteboard.line', 'Clio'),
  surface('SURF-039', 'CTR-039', 'whiteboard.box', 'Clio'),
  surface('SURF-057', 'CTR-057', 'whiteboard.show', 'Virtual Classroom'),
  surface('SURF-058', 'CTR-058', 'whiteboard.hide', 'Virtual Classroom'),
  surface('SURF-059', 'CTR-059', 'whiteboard.clear', 'Virtual Classroom'),
  surface('SURF-060', 'CTR-060', 'whiteboard.text', 'Virtual Classroom'),
  surface('SURF-061', 'CTR-061', 'whiteboard.math', 'Virtual Classroom'),
  surface('SURF-062', 'CTR-062', 'whiteboard.line', 'Virtual Classroom'),
  surface('SURF-063', 'CTR-063', 'whiteboard.box', 'Virtual Classroom'),
  surface('SURF-064', 'CTR-064', 'whiteboard.arrow', 'Virtual Classroom'),
  surface('SURF-065', 'CTR-065', 'whiteboard.highlight', 'Virtual Classroom'),
  surface('SURF-066', 'CTR-066', 'whiteboard.scribble', 'Virtual Classroom'),
  surface('SURF-067', 'CTR-067', 'whiteboard.dots', 'Virtual Classroom'),
  surface('SURF-068', 'CTR-068', 'whiteboard.shape', 'Virtual Classroom'),
  surface('SURF-069', 'CTR-069', 'whiteboard.count', 'Virtual Classroom'),
  surface('SURF-070', 'CTR-070', 'whiteboard.erase', 'Virtual Classroom'),
  surface('SURF-071', 'CTR-071', 'whiteboard.reveal', 'Virtual Classroom'),
];

/** The layer selector a clear applies to. Absent means the whole board. */
const LAYER_KWARG = {
  layer: { type: { kind: 'enum', values: ['truth', 'thinking', 'all'] }, default: 'all' },
} as const;

/** Every schema shares a `target` kwarg where it addresses an existing element. */
const TARGET = { type: { kind: 'string', minLength: 1 } } as const;

export const WHITEBOARD_SCHEMAS: readonly CommandSchema[] = [
  {
    action: 'whiteboard.show',
    description: 'Activate the board. A hidden board returns with its content intact.',
    minArgs: 0,
    maxArgs: 0,
    optionalKwargs: { ...LAYER_KWARG },
    entityResolution: 'none',
    authoring: { summary: 'Present the board', examples: ['[whiteboard.show]'] },
  },
  {
    action: 'whiteboard.hide',
    description: 'Occlude the board without destroying content. Not the same as clear.',
    minArgs: 0,
    maxArgs: 0,
    optionalKwargs: {},
    entityResolution: 'none',
    authoring: { summary: 'Cover the board, keeping it', examples: ['[whiteboard.hide]'] },
  },
  {
    action: 'whiteboard.clear',
    description: 'Clear board content, on one layer or all.',
    minArgs: 0,
    maxArgs: 0,
    optionalKwargs: { ...LAYER_KWARG },
    entityResolution: 'none',
    authoring: { summary: 'Remove content', examples: ['[whiteboard.clear]', '[whiteboard.clear layer=thinking]'] },
  },
  {
    action: 'whiteboard.text',
    description: 'Commit exact text as an element.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { id: TARGET, text: { type: { kind: 'string' } } },
    optionalKwargs: { size: { type: { kind: 'enum', values: ['sm', 'md', 'lg'] }, default: 'md' } },
    entityResolution: 'none',
  },
  {
    action: 'whiteboard.math',
    description: 'Commit a typeset equation.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { id: TARGET, latex: { type: { kind: 'string', minLength: 1 } } },
    entityResolution: 'none',
  },
  {
    action: 'whiteboard.line',
    description: 'Draw a line. Ends are element references or freeform coordinates the host supplies.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { id: TARGET },
    optionalKwargs: {
      from: { type: { kind: 'string' } },
      to: { type: { kind: 'string' } },
      color: { type: { kind: 'color' } },
    },
    entityResolution: 'none',
  },
  {
    action: 'whiteboard.box',
    description: 'Draw a box or panel.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { id: TARGET },
    optionalKwargs: { region: { type: { kind: 'string' } }, color: { type: { kind: 'color' } } },
    entityResolution: 'none',
  },
  {
    action: 'whiteboard.arrow',
    description: 'Draw an arrow.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { id: TARGET },
    optionalKwargs: { from: { type: { kind: 'string' } }, to: { type: { kind: 'string' } } },
    entityResolution: 'none',
  },
  {
    action: 'whiteboard.highlight',
    description: 'Highlight an existing board element.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { target: TARGET },
    optionalKwargs: { color: { type: { kind: 'color' } } },
    entityResolution: 'none',
  },
  {
    action: 'whiteboard.scribble',
    description: "Commit rough working to the thinking layer, where a learner-facing view cannot see it.",
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { id: TARGET },
    optionalKwargs: { strokes: { type: { kind: 'string' } } },
    entityResolution: 'none',
  },
  {
    action: 'whiteboard.dots',
    description: 'Draw countable dots or tokens.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { id: TARGET, count: { type: { kind: 'number', integer: true, min: 1, max: 500 } } },
    optionalKwargs: { color: { type: { kind: 'color' } } },
    entityResolution: 'none',
  },
  {
    action: 'whiteboard.shape',
    description: 'Draw a named geometric figure.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: {
      id: TARGET,
      shape: { type: { kind: 'enum', values: ['triangle', 'square', 'rectangle', 'circle', 'pentagon', 'hexagon'] } },
    },
    optionalKwargs: { sides: { type: { kind: 'number', integer: true, min: 3, max: 12 } } },
    entityResolution: 'none',
  },
  {
    action: 'whiteboard.count',
    description: 'Count items or properties.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { of: { type: { kind: 'string', minLength: 1 } }, value: { type: { kind: 'number', integer: true, min: 0 } } },
    entityResolution: 'none',
  },
  {
    action: 'whiteboard.erase',
    description: 'Erase an existing board element.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { target: TARGET },
    entityResolution: 'none',
  },
  {
    action: 'whiteboard.reveal',
    description: 'Reveal a concealed element.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { target: TARGET },
    entityResolution: 'none',
  },
];

/** Action names, exported so callers never retype a string that must match a schema. */
export const WHITEBOARD_ACTIONS: readonly string[] = WHITEBOARD_SCHEMAS.map((schema) => schema.action);

/** The six actions that carry two surface identities, and the host whose semantics were adopted. */
export const CLIO_COMPATIBILITY: readonly {
  readonly action: string;
  readonly clioSurface: string;
  readonly clioBehavior: string;
  readonly adoptedBehavior: string;
  readonly note: string;
}[] = [
  {
    action: 'whiteboard.show',
    clioSurface: 'SURF-034',
    clioBehavior: 'Show screen-space whiteboard.',
    adoptedBehavior: 'Activate board/new page.',
    note: 'VC wording adopted. Both mean "make it visible"; VC additionally names the page.',
  },
  {
    action: 'whiteboard.hide',
    clioSurface: 'SURF-035',
    clioBehavior: 'Hide whiteboard.',
    adoptedBehavior: 'Occlude/deactivate presentation without destroying content.',
    note: 'VC semantics adopted, and this is the load-bearing one: Clio\'s wording leaves "hide" open to meaning "clear", and collapsing them destroys a lesson\'s work. TEST-204 protects the distinction.',
  },
  {
    action: 'whiteboard.clear',
    clioSurface: 'SURF-036',
    clioBehavior: 'Clear whiteboard.',
    adoptedBehavior: 'Clear board layer/page content.',
    note: 'VC wording adopted. VC scopes the clear to a layer, which Clio\'s does not express.',
  },
  {
    action: 'whiteboard.text',
    clioSurface: 'SURF-037',
    clioBehavior: 'Place freeform text.',
    adoptedBehavior: 'Commit exact text element.',
    note: 'VC wording adopted: "commit exact" is the stronger contract, and byte-fidelity is testable.',
  },
  {
    action: 'whiteboard.line',
    clioSurface: 'SURF-038',
    clioBehavior: 'Draw freeform line.',
    adoptedBehavior: 'Draw line.',
    note: 'Equivalent; VC wording adopted for consistency.',
  },
  {
    action: 'whiteboard.box',
    clioSurface: 'SURF-039',
    clioBehavior: 'Draw box/panel.',
    adoptedBehavior: 'Draw box.',
    note: 'Equivalent; VC wording adopted for consistency.',
  },
];

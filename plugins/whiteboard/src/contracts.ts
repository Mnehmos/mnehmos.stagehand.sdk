/**
 * Recovered whiteboard contracts (FR-229, FR-234).
 *
 * Transcribed from the pinned sources, not from the corpus's compressed Pass-9 summaries. The
 * corpus owns identities and traceability; the exact wire contract lives in the source, and this
 * table is that contract in a form a test can compare against:
 *
 * - Virtual Classroom `cd7253608297efd57921c965b7440f4d4081842f:src/stagehand/types.ts` lines 313-550
 * - Clio `03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/types.ts` lines 730-810
 *
 * Both are recorded with hashes in `docs/evidence/virtual-classroom-whiteboard.json`, and `TEST-203`
 * compares this table against that file field by field. The schemas the plugin registers are
 * **derived** from this table rather than authored alongside it, so there is one place a contract is
 * stated and no way for the two to disagree.
 *
 * Getting here took a correction: the first implementation transcribed `whiteboard.count` as
 * `{of, value}` from the corpus's one-line behavior string and omitted `content_ref` from text and
 * math entirely, because a Pass-9 summary is an index and not a specification. The registered action
 * set was still 15, so a presence-counting conformance test stayed green through both errors. That is
 * what `TEST-203` now checks instead.
 */

import type { CommandSchema, KwargSpec, ValueType } from '@stagehand/registry';

/** Entity namespace a target must resolve against, as the pinned source declares it. */
export type EntityKind = 'anchor' | 'board';

/** Authoring metadata the source carries alongside each contract. */
export interface ContractAuthoring {
  readonly role: string;
  readonly guidance: string;
  readonly requiresFollowingText?: boolean;
  readonly nextTextShouldMentionTarget?: boolean;
}

/** One recovered command contract, in the shape the pinned source declares it. */
export interface RecoveredContract {
  readonly action: string;
  readonly description: string;
  readonly minArgs: number;
  readonly maxArgs: number;
  readonly requiredKwargs: readonly string[];
  readonly optionalKwargs: Readonly<Record<string, string>>;
  readonly resolvesEntity: EntityKind | null;
  readonly settleMs: number;
  readonly enums?: Readonly<Record<string, readonly string[]>>;
  readonly numeric?: readonly string[];
  readonly durations?: readonly string[];
  readonly colors?: readonly string[];
  readonly entityLists?: Readonly<Record<string, EntityKind>>;
  readonly authoring: ContractAuthoring;
}

// ── shared vocabulary, transcribed ──────────────────────────────────────────────────────────────

/** Named ink colours. A colour kwarg accepts one of these or an explicit `#rrggbb`. */
export const INK_COLORS = ['ink', 'dim', 'accent', 'warm', 'rose', 'green'] as const;
export const TEXT_SIZES = ['sm', 'md', 'lg', 'xl'] as const;
export const DOT_ARRANGEMENTS = [
  'line', 'array', 'five_frame', 'ten_frame', 'scatter', 'number_cube',
] as const;
export const DOT_TOKENS = ['dot', 'cube', 'square', 'triangle', 'star', 'counter'] as const;
export const SHAPES = [
  'circle', 'oval', 'square', 'rectangle', 'triangle',
  'hexagon', 'trapezoid', 'rhombus', 'pentagon',
  'cube', 'sphere', 'cone', 'cylinder', 'pyramid',
] as const;
export const COUNTABLES = ['items', 'corners', 'sides'] as const;
export const CLEAR_LAYERS = ['all', 'truth', 'thinking'] as const;
export const HIGHLIGHT_COLORS = ['yellow', 'cyan', 'rose', 'green'] as const;
export const BOOLEANS = ['true', 'false'] as const;

/**
 * The 15 whiteboard contracts, exactly as the pinned Virtual Classroom source declares them.
 *
 * Order matches the source so a diff against it is readable.
 */
export const RECOVERED_CONTRACTS: readonly RecoveredContract[] = [
  {
    action: 'whiteboard.show',
    description: 'Make the board active and start a new page',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: [],
    optionalKwargs: { title: '', page: '' },
    resolvesEntity: null,
    settleMs: 600,
    authoring: { role: 'setup', guidance: 'Open a board page before placing elements on it.' },
  },
  {
    action: 'whiteboard.hide',
    description: 'Stop presenting the board without destroying its content',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: [],
    optionalKwargs: {},
    resolvesEntity: null,
    settleMs: 400,
    authoring: {
      role: 'clear',
      guidance: 'Hides the board. Content survives — use whiteboard.clear to actually erase.',
    },
  },
  {
    action: 'whiteboard.clear',
    description: 'Erase the current board page, committing a new revision',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: [],
    optionalKwargs: { layer: 'all' },
    resolvesEntity: null,
    settleMs: 800,
    enums: { layer: CLEAR_LAYERS },
    authoring: {
      role: 'clear',
      guidance: 'Prefer `layer=thinking` to wipe scribbles while leaving verified content standing.',
    },
  },
  {
    action: 'whiteboard.text',
    description: 'Place exact text on the board truth surface',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['id'],
    optionalKwargs: {
      x: '50', y: '50', text: '', content_ref: '', size: 'md', color: '', region: '', conceal: 'false',
    },
    resolvesEntity: null,
    settleMs: 1000,
    enums: { conceal: BOOLEANS, size: TEXT_SIZES },
    numeric: ['x', 'y'],
    colors: ['color'],
    authoring: {
      role: 'inline_cue',
      requiresFollowingText: true,
      guidance: 'Give every element a stable `id` — that id is how the avatar points at it later. Long prose belongs in `content_ref`, not inline.',
    },
  },
  {
    action: 'whiteboard.math',
    description: 'Typeset an equation on the board truth surface',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['id'],
    optionalKwargs: {
      x: '50', y: '50', latex: '', content_ref: '', size: 'lg', color: '', region: '', conceal: 'false',
    },
    resolvesEntity: null,
    settleMs: 1100,
    enums: { conceal: BOOLEANS, size: TEXT_SIZES },
    numeric: ['x', 'y'],
    colors: ['color'],
    authoring: {
      role: 'inline_cue',
      requiresFollowingText: true,
      nextTextShouldMentionTarget: true,
      guidance: 'Equations are truth-surface content. Use `content_ref` for anything with braces or spaces.',
    },
  },
  {
    action: 'whiteboard.line',
    description: 'Draw a line on the board',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['id'],
    optionalKwargs: { x1: '20', y1: '50', x2: '80', y2: '50', color: '', stroke: '3', style: 'solid' },
    resolvesEntity: null,
    settleMs: 1000,
    enums: { style: ['solid', 'dashed'] },
    numeric: ['x1', 'y1', 'x2', 'y2', 'stroke'],
    colors: ['color'],
    authoring: {
      role: 'inline_cue',
      requiresFollowingText: true,
      guidance: 'Dividers and axes. For explanatory strokes use whiteboard.scribble.',
    },
  },
  {
    action: 'whiteboard.box',
    description: 'Draw a labelled box or panel on the board',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['id'],
    optionalKwargs: { x: '50', y: '50', width: '28', height: '18', color: '', label: '', conceal: 'false' },
    resolvesEntity: null,
    settleMs: 1000,
    enums: { conceal: BOOLEANS },
    numeric: ['x', 'y', 'width', 'height'],
    colors: ['color'],
    authoring: {
      role: 'inline_cue',
      requiresFollowingText: true,
      guidance: 'Groups related elements. The label reads as a heading.',
    },
  },
  {
    action: 'whiteboard.arrow',
    description: 'Draw an arrow between two board points',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['id'],
    optionalKwargs: { x1: '30', y1: '50', x2: '70', y2: '50', color: '', label: '' },
    resolvesEntity: null,
    settleMs: 1000,
    numeric: ['x1', 'y1', 'x2', 'y2'],
    colors: ['color'],
    authoring: {
      role: 'inline_cue',
      requiresFollowingText: true,
      guidance: 'Shows direction or causation between committed elements.',
    },
  },
  {
    action: 'whiteboard.highlight',
    description: 'Emphasise a committed board element',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['target'],
    optionalKwargs: { color: 'yellow', duration: '3000' },
    resolvesEntity: 'board',
    settleMs: 500,
    enums: { color: HIGHLIGHT_COLORS },
    durations: ['duration'],
    authoring: {
      role: 'inline_cue',
      requiresFollowingText: true,
      nextTextShouldMentionTarget: true,
      guidance: 'Highlight is a thinking-surface mark over a truth-surface element. It never alters the element.',
    },
  },
  {
    action: 'whiteboard.scribble',
    description: 'Add a temporary hand-drawn mark to the thinking surface',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['id'],
    optionalKwargs: { points: '', color: '', target: '' },
    resolvesEntity: null,
    settleMs: 700,
    colors: ['color'],
    authoring: {
      role: 'inline_cue',
      requiresFollowingText: true,
      guidance: 'Provisional working. Thinking-surface marks never become truth-surface content.',
    },
  },
  {
    action: 'whiteboard.dots',
    description: 'Draw a countable group of dots, optionally in a 5-frame or 10-frame',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['id', 'count'],
    optionalKwargs: {
      arrange: 'line', token: 'dot', x: '50', y: '50', color: '', label: '', region: '', conceal: 'false',
    },
    resolvesEntity: null,
    settleMs: 900,
    enums: { conceal: BOOLEANS, arrange: DOT_ARRANGEMENTS, token: DOT_TOKENS },
    numeric: ['count', 'x', 'y'],
    colors: ['color'],
    authoring: {
      role: 'inline_cue',
      requiresFollowingText: true,
      nextTextShouldMentionTarget: true,
      guidance:
        'The main teaching tool for early number. Draw the quantity, then ask the child to count it with you.',
    },
  },
  {
    action: 'whiteboard.shape',
    description: 'Draw a named flat or solid shape',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['id', 'shape'],
    optionalKwargs: {
      x: '50', y: '50', size: 'md', color: '', label: '', fill: 'false', region: '', conceal: 'false',
    },
    resolvesEntity: null,
    settleMs: 800,
    enums: { conceal: BOOLEANS, shape: SHAPES, size: TEXT_SIZES, fill: BOOLEANS },
    numeric: ['x', 'y'],
    colors: ['color'],
    authoring: {
      role: 'inline_cue',
      requiresFollowingText: true,
      nextTextShouldMentionTarget: true,
      guidance: 'Draw the shape, then ask about its sides and corners. Give it an id so it can be a clickable answer.',
    },
  },
  {
    action: 'whiteboard.count',
    description: 'Number each part of something on the board, one at a time',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['target'],
    optionalKwargs: { what: 'items', from: '1', pace: '600', color: '', id: '' },
    resolvesEntity: 'board',
    settleMs: 4000,
    enums: { what: COUNTABLES },
    numeric: ['from'],
    durations: ['pace'],
    colors: ['color'],
    authoring: {
      role: 'inline_cue',
      requiresFollowingText: true,
      nextTextShouldMentionTarget: true,
      guidance:
        'Use this whenever you count anything aloud. Each dot, corner or side is ringed and numbered in turn. ' +
        'what=items counts dots, what=corners and what=sides count a shape.',
    },
  },
  {
    action: 'whiteboard.erase',
    description: 'Remove one committed board element by id',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['target'],
    optionalKwargs: {},
    resolvesEntity: 'board',
    settleMs: 500,
    authoring: {
      role: 'clear',
      guidance: 'Commits a revision. The element is gone from the live board but stays in the trace.',
    },
  },
  {
    action: 'whiteboard.reveal',
    description: 'Animate a committed element into view over a duration',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: ['target'],
    optionalKwargs: { duration: '1200' },
    resolvesEntity: 'board',
    settleMs: 1200,
    durations: ['duration'],
    authoring: {
      role: 'inline_cue',
      requiresFollowingText: true,
      nextTextShouldMentionTarget: true,
      guidance: 'Use when the writing should land exactly as the teacher names it.',
    },
  },
];

// ── deriving the registry schemas ───────────────────────────────────────────────────────────────

/**
 * The value type for one kwarg, derived from the recovered metadata.
 *
 * Priority mirrors how the source declares it: an enum wins over numeric, which wins over duration,
 * which wins over colour; anything with no declaration is a plain string. Deriving rather than
 * authoring is what makes a contract change impossible to apply to one list and not the other.
 */
function valueTypeFor(
  action: string,
  key: string,
  contract: RecoveredContract,
): ValueType {
  const enumValues = contract.enums?.[key];
  if (enumValues !== undefined) return { kind: 'enum', values: enumValues };
  if (contract.entityLists?.[key] !== undefined) return { kind: 'entityRefList' };
  if (contract.numeric?.includes(key) === true) return { kind: 'number' };
  if (contract.durations?.includes(key) === true) return { kind: 'duration' };
  if (contract.colors?.includes(key) === true) {
    // "A named ink colour or an explicit #rrggbb" — the names the source declares. The colour kwarg
    // of `highlight` is an enum instead, because the source narrows it to four highlight colours.
    return { kind: 'color', named: INK_COLORS };
  }
  void action;
  return { kind: 'string' };
}

/** Derive the registry schema for one recovered contract. */
export function schemaFor(contract: RecoveredContract): CommandSchema {
  const requiredKwargs: Record<string, KwargSpec> = {};
  for (const key of contract.requiredKwargs) {
    requiredKwargs[key] = { type: valueTypeFor(contract.action, key, contract) };
  }

  const optionalKwargs: Record<string, KwargSpec> = {};
  for (const [key, defaultValue] of Object.entries(contract.optionalKwargs)) {
    optionalKwargs[key] = { type: valueTypeFor(contract.action, key, contract), default: defaultValue };
  }

  return {
    action: contract.action,
    description: contract.description,
    minArgs: contract.minArgs,
    maxArgs: contract.maxArgs,
    requiredKwargs,
    optionalKwargs,
    settleMs: contract.settleMs,
    // The plugin resolves board targets itself in a contributed stage, so core's resolver is not
    // asked to participate. `resolvesEntity` is carried on the contract instead, and TEST-203 checks
    // it against the evidence — core has no notion of entity *namespaces* and should not gain one.
    entityResolution: 'none',
    authoring: {
      summary: contract.authoring.guidance,
      examples: [],
    },
  };
}

/** Every whiteboard schema, derived from the recovered contracts. */
export const WHITEBOARD_SCHEMAS: readonly CommandSchema[] = RECOVERED_CONTRACTS.map(schemaFor);

/** Action names, in contract order. */
export const WHITEBOARD_ACTIONS: readonly string[] = RECOVERED_CONTRACTS.map((c) => c.action);

/** The contract for one action, or `undefined`. */
export function contractFor(action: string): RecoveredContract | undefined {
  return RECOVERED_CONTRACTS.find((contract) => contract.action === action);
}

/** Actions whose target must resolve to a committed board element. */
export const TARGET_ACTIONS: readonly string[] = RECOVERED_CONTRACTS
  .filter((contract) => contract.resolvesEntity === 'board')
  .map((contract) => contract.action);

/**
 * Actions that create an element and therefore need an id that is not already taken.
 *
 * `whiteboard.count` is excluded despite declaring an optional `id`: its id names an annotation
 * group rather than a new truth-surface element, and its required kwarg is `target`.
 */
export const CREATING_ACTIONS: readonly string[] = RECOVERED_CONTRACTS
  .filter((contract) => contract.requiredKwargs.includes('id'))
  .map((contract) => contract.action);

/** Actions whose marks belong to the thinking surface, as the source states it. */
export const THINKING_ACTIONS: readonly string[] = [
  // "Provisional working. Thinking-surface marks never become truth-surface content."
  'whiteboard.scribble',
  // "Highlight is a thinking-surface mark over a truth-surface element. It never alters the element."
  'whiteboard.highlight',
  // The count marks are a thinking-layer annotation over the counted element.
  'whiteboard.count',
];

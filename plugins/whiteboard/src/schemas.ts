/**
 * Surface manifest and the Clio compatibility record (FR-229, FR-234).
 *
 * The **schemas** live in `contracts.ts`, derived from the pinned source. This module holds the two
 * things that are not schema data:
 *
 * - **The surface manifest.** The corpus records 21 surfaces because two hosts each declared their
 *   own list, and six actions appear in both. The union is registered once; the surfaces are tracked
 *   here so `TEST-203` can walk the *surface ids*, which is the check that notices a surface lost
 *   during consolidation. Counting actions never would — 15 is correct either way.
 * - **The Clio compatibility record.** The six actions Clio declares, and which of the two hosts'
 *   contracts was adopted for each. Where they differ the Virtual Classroom superset wins, and that
 *   choice is a registered divergence (`DIV-011`) rather than an accident.
 */

import { contractFor } from './contracts.js';

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

/** A recorded difference between the two hosts' contracts for one action. */
export interface CompatibilityDifference {
  readonly field: string;
  readonly clio: string;
  readonly adopted: string;
}

/** One entry of the Clio compatibility record. */
export interface CompatibilityEntry {
  readonly action: string;
  readonly clioSurface: string;
  readonly clioBehavior: string;
  readonly adoptedBehavior: string;
  readonly differences: readonly CompatibilityDifference[];
  readonly note: string;
}

/**
 * The six actions both hosts declare, with the differences recorded.
 *
 * `differences` is compared against the evidence file by `TEST-203`, so a contract change that is
 * not reflected here fails rather than passing quietly.
 */
export const CLIO_COMPATIBILITY: readonly CompatibilityEntry[] = [
  {
    action: 'whiteboard.show',
    clioSurface: 'SURF-034',
    clioBehavior: 'Show the full-screen whiteboard surface over the globe',
    adoptedBehavior: 'Make the board active and start a new page',
    differences: [
      { field: 'optionalKwargs', clio: 'title, subtitle, style, background, opacity', adopted: 'title, page' },
      { field: 'settleMs', clio: 'absent', adopted: '600' },
    ],
    note:
      'Both make the board visible, but they take different kwargs: Clio styles a full-screen overlay while ' +
      'VC names a page. VC adopted. A Clio producer sending subtitle/style/background/opacity must be ' +
      'corrected rather than silently ignored, which is why they are not carried forward as accepted extras.',
  },
  {
    action: 'whiteboard.hide',
    clioSurface: 'SURF-035',
    clioBehavior: 'Hide the full-screen whiteboard surface',
    adoptedBehavior: 'Stop presenting the board without destroying its content',
    differences: [
      { field: 'content', clio: 'ends the beat, wiping marks', adopted: 'preserves every element' },
      { field: 'settleMs', clio: 'absent', adopted: '400' },
    ],
    note:
      'The load-bearing one, and the reason DIV-011 exists. The VC source itself calls this a deliberate ' +
      'divergence from Clio. Collapsing hide into clear destroys a lesson the moment a teacher covers the ' +
      'board to talk over it, and does so silently. TEST-204 protects the distinction.',
  },
  {
    action: 'whiteboard.clear',
    clioSurface: 'SURF-036',
    clioBehavior: 'Clear all whiteboard marks',
    adoptedBehavior: 'Erase the current board page, committing a new revision',
    differences: [
      { field: 'optionalKwargs', clio: 'none', adopted: 'layer (all|truth|thinking)' },
      { field: 'settleMs', clio: 'absent', adopted: '800' },
    ],
    note: 'VC adopts a layer-scoped clear, which Clio cannot express. Prefer layer=thinking to wipe scribbles only.',
  },
  {
    action: 'whiteboard.text',
    clioSurface: 'SURF-037',
    clioBehavior: 'Place freeform text on the whiteboard using screen-space coordinates',
    adoptedBehavior: 'Place exact text on the board truth surface',
    differences: [
      { field: 'maxArgs', clio: '1', adopted: '0' },
      { field: 'requiredKwargs', clio: 'none (id optional)', adopted: 'id' },
      { field: 'optionalKwargs', clio: 'id, x, y, text, size, color', adopted: '+ content_ref, region, conceal' },
      { field: 'colorDefault', clio: '#f8fafc', adopted: "'' (unset)" },
      { field: 'enums', clio: 'none', adopted: 'conceal, size' },
      { field: 'numeric', clio: 'none', adopted: 'x, y' },
      { field: 'settleMs', clio: 'absent', adopted: '1000' },
    ],
    note:
      'VC makes `id` required — the id is how the avatar points at the element later, so an unnamed ' +
      'element is one nothing can refer to. content_ref is how long prose travels without being re-typed.',
  },
  {
    action: 'whiteboard.line',
    clioSurface: 'SURF-038',
    clioBehavior: 'Draw a freeform line on the whiteboard using screen-space coordinates',
    adoptedBehavior: 'Draw a line on the board',
    differences: [
      { field: 'requiredKwargs', clio: 'none (id optional)', adopted: 'id' },
      { field: 'colorDefault', clio: '#38bdf8', adopted: "'' (unset)" },
      { field: 'numeric', clio: 'none', adopted: 'x1, y1, x2, y2, stroke' },
      { field: 'enums', clio: 'none', adopted: 'style' },
      { field: 'settleMs', clio: 'absent', adopted: '1000' },
    ],
    note: 'Same geometry kwargs; VC requires the id and constrains the values.',
  },
  {
    action: 'whiteboard.box',
    clioSurface: 'SURF-039',
    clioBehavior: 'Draw a freeform box or panel on the whiteboard',
    adoptedBehavior: 'Draw a labelled box or panel on the board',
    differences: [
      { field: 'requiredKwargs', clio: 'none (id optional)', adopted: 'id' },
      { field: 'optionalKwargs', clio: 'id, x, y, width, height, color, opacity, label', adopted: 'drops opacity' },
      { field: 'colorDefault', clio: '#fbbf24', adopted: "'' (unset)" },
      { field: 'enums', clio: 'none', adopted: 'conceal' },
      { field: 'numeric', clio: 'none', adopted: 'x, y, width, height' },
      { field: 'settleMs', clio: 'absent', adopted: '1000' },
    ],
    note:
      'Same geometry kwargs; VC requires the id, adds conceal, constrains the numerics, and drops ' +
      "Clio's opacity. Dropping a kwarg is a real difference, not a simplification: a Clio producer " +
      'relying on opacity must be corrected instead of having it silently ignored.',
  },
];

/** Cross-cutting differences true of every shared action. */
export const CLIO_CROSS_CUTTING: readonly CompatibilityDifference[] = [
  { field: 'settleMs', clio: 'field absent on every Clio schema', adopted: 'declared per action' },
  { field: 'resolvesEntity', clio: 'boolean', adopted: "null | 'anchor' | 'board'" },
  { field: 'vocabulary', clio: '6 actions', adopted: '15 actions (VC superset)' },
];

/** The contract for a shared action, for callers that need the adopted values. */
export function adoptedContract(action: string): ReturnType<typeof contractFor> {
  return contractFor(action);
}

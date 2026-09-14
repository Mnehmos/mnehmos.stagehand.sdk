/**
 * @stagehand/plugin-whiteboard — shared whiteboard canvas.
 *
 * Owner of FEAT-012. Requirement range `FR-228..FR-234`; tasks `T-074..T-079`; parity exits
 * `TEST-203..TEST-207`. See `specs/007-whiteboard/spec.md`.
 *
 * The SDK's first plugin, and therefore the first test of whether the core boundary holds from the
 * other side. It owns a board document (`ENT-010`: `HostState` is plugin-owned, never core's) and
 * contributes exactly three things to the pipeline: schemas, an entity-layer stage, and a committer.
 * It adds no trust path of its own.
 *
 * Two recovered semantics are load-bearing and easy to lose:
 *
 * - **`hide` occludes; `clear` removes.** Collapsing them destroys a lesson's work silently, which
 *   is what `TEST-204` exists to prevent.
 * - **`scribble` goes to the `thinking` layer.** A truth-layer read cannot contain a teacher's rough
 *   working, because the layer is a property of the element rather than of the view.
 *
 * @example
 * ```ts
 * const whiteboard = new WhiteboardPlugin();
 * const registry = whiteboard.registry;   // the 15 VC-superset actions
 *
 * executeStagehandCommand(registry, command, {
 *   committer: whiteboard,                // applies accepted effects to the document
 *   stages: whiteboard.stages,            // resolves board targets and content_ref
 * });
 *
 * whiteboard.revision;                    // advances only on a committed change
 * ```
 */

export {
  BOOLEANS,
  CLEAR_LAYERS,
  contractFor,
  COUNTABLES,
  CREATING_ACTIONS,
  DOT_ARRANGEMENTS,
  DOT_TOKENS,
  HIGHLIGHT_COLORS,
  INK_COLORS,
  RECOVERED_CONTRACTS,
  schemaFor,
  SHAPES,
  TARGET_ACTIONS,
  TEXT_SIZES,
  THINKING_ACTIONS,
  WHITEBOARD_ACTIONS,
  WHITEBOARD_SCHEMAS,
  type ContractAuthoring,
  type EntityKind,
  type RecoveredContract,
} from './contracts.js';

export {
  CLIO_COMPATIBILITY,
  CLIO_CROSS_CUTTING,
  SURFACE_MANIFEST,
  type CompatibilityDifference,
  type CompatibilityEntry,
  type SurfaceBinding,
} from './schemas.js';

export {
  boardResolutionStage,
  isTargetAction,
  resolveContentRef,
  resolveTarget,
  type BoardResolution,
} from './resolve.js';

export { WhiteboardPlugin, whiteboardCommitter, type WhiteboardPluginOptions } from './plugin.js';

/** The event type whose producer this plugin is; the type itself belongs to `FEAT-005`. */
export const BOARD_REVISION_COMMITTED = 'board.revision.committed';

export {
  elementById,
  elementsOn,
  EMPTY_BOARD,
  isLayerEmpty,
  reduce,
  type BoardChange,
  type BoardDocument,
  type BoardElement,
  type BoardElementKind,
  type BoardLayer,
} from './types.js';

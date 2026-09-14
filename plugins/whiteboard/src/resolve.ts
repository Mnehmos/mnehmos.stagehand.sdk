/**
 * Board target and `content_ref` resolution (FR-232, FR-233).
 *
 * Delivered as a **contributed entity-layer validation stage**, not as a bypass. The plugin adds no
 * stage that could run before core's or replace it; it registers something core calls at the point
 * core decides. That is why an unresolved board target produces `E_UNRESOLVED_REF` through the same
 * pipeline as an unresolved semantic reference anywhere else.
 *
 * Resolution never guesses. A target that is not on the board is unresolved — not "the closest id",
 * not "the only element of that kind". Applying an erase to a guessed element is the failure this
 * rule prevents, and it is invisible in a test that only checks that *something* was erased.
 */

import type { ValidationError, ValidationStage } from '@stagehand/registry';
import { CREATING_ACTIONS, TARGET_ACTIONS } from './contracts.js';
import { elementById, type BoardDocument } from './types.js';

/** Board coordinates live in a recovered 0-100 space. */
export const BOARD_MIN = 0;
export const BOARD_MAX = 100;

export { CREATING_ACTIONS, TARGET_ACTIONS };

export interface BoardResolution {
  readonly ok: boolean;
  readonly errors: readonly ValidationError[];
}

/** Resolve one target id against the board. */
export function resolveTarget(document: BoardDocument, id: string): BoardResolution {
  if (elementById(document, id) !== undefined) return { ok: true, errors: [] };
  return {
    ok: false,
    errors: [
      {
        code: 'E_UNRESOLVED_REF',
        layer: 'entity',
        message: `No board element "${id}"`,
        subject: 'target',
      },
    ],
  };
}

/**
 * A lesson-content resolver, injected by the host.
 *
 * `content_ref` names a payload in the **lesson content pack**, not another board element. The pinned
 * runtime injects `opts.resolveContent` and its test resolves `equation.k` through an external pack;
 * an earlier version of this plugin looked the reference up among the board's own elements, which was
 * a different protocol wearing the same kwarg.
 *
 * Returning `undefined` is the source's behaviour for a reference the pack does not hold: the content
 * becomes empty, and the element is still committed. That is deliberately *not* a rejection — the
 * content pack is the host's, and a reference it cannot resolve is the host's problem to surface, not
 * a reason for the protocol layer to refuse an otherwise valid command.
 */
export type ContentResolver = (reference: string) => string | undefined;

/**
 * The last-resort resolver: resolves nothing.
 *
 * Installed so `content_ref` behaves predictably when a host forgets to inject one — every reference
 * yields empty content rather than throwing at render time.
 */
export const NULL_CONTENT_RESOLVER: ContentResolver = () => undefined;

/**
 * The **registry-layer** stage: cross-field and spatial rules over this plugin's own actions.
 *
 * The pinned validator fails these before entity resolution, so they belong in the same layer here
 * rather than surfacing as an entity-layer failure a producer would read wrongly.
 */
export function boardRegistryStage(): ValidationStage {
  return {
    layer: 'registry',
    validate(command): readonly ValidationError[] {
      const kwargs = command.kwargs;
      const errors: ValidationError[] = [];

      // "Content is either inline or referenced, never both — otherwise the renderer has to pick a
      // winner and the trace becomes ambiguous."
      const contentRef = kwargs['content_ref'];
      if (
        contentRef !== undefined &&
        contentRef !== '' &&
        ((kwargs['text'] ?? '') !== '' || (kwargs['latex'] ?? '') !== '')
      ) {
        errors.push({
          code: 'E_SCHEMA',
          layer: 'registry',
          message: `${command.action}: use content_ref or inline text/latex, not both`,
        });
      }

      // "An element placed off the board is valid syntax and invisible teaching."
      for (const [xKey, yKey] of [['x', 'y'], ['x1', 'y1'], ['x2', 'y2']] as const) {
        for (const key of [xKey, yKey]) {
          const raw = kwargs[key];
          if (raw === undefined || raw === '') continue;
          const value = Number(raw);
          if (!Number.isFinite(value)) {
            errors.push({ code: 'E_SCHEMA', layer: 'registry', message: `${command.action}: ${key}=${raw} is not a number`, subject: key });
            continue;
          }
          if (value < BOARD_MIN || value > BOARD_MAX) {
            errors.push({
              code: 'E_SCHEMA',
              layer: 'registry',
              message: `${command.action}: ${key}=${raw} is outside the 0-100 board space`,
              subject: key,
            });
          }
        }
      }

      const width = Number(kwargs['width']);
      const centerX = Number(kwargs['x']);
      if (Number.isFinite(width) && Number.isFinite(centerX)) {
        if (centerX - width / 2 < BOARD_MIN || centerX + width / 2 > BOARD_MAX) {
          errors.push({
            code: 'E_SCHEMA',
            layer: 'registry',
            message: `${command.action}: box spans past the board edge horizontally`,
            subject: 'width',
          });
        }
      }

      return errors;
    },
  };
}

/**
 * The entity-layer stage: board target resolution.
 *
 * @param read A reader over the current board state. Called per command, so the stage always resolves
 *   against the board as it is *now* rather than against a snapshot taken at registration.
 */
export function boardResolutionStage(read: () => BoardDocument): ValidationStage {
  return {
    layer: 'entity',
    // `command` is contextually typed by `ValidationStage`, so this module needs no dependency on
    // the parser package. Naming the type would mean importing it, and the plugin's declared
    // dependency closure is the feature graph's, not whatever a type annotation happens to need.
    validate(command): readonly ValidationError[] {
      const document = read();
      const kwargs = command.kwargs;
      const errors: ValidationError[] = [];

      // "if (schema.resolvesEntity) { const ref = kwargs.target ?? args[0]; if (!ref) fail(...) }" —
      // the target may arrive as the first positional argument, which an earlier version of this stage
      // ignored.
      if (TARGET_ACTIONS.includes(command.action)) {
        const target = kwargs['target'] ?? command.args[0];
        if (target === undefined || target === '') {
          errors.push({
            code: 'E_UNRESOLVED_REF',
            layer: 'entity',
            message: `${command.action} requires a board target`,
            subject: 'target',
          });
        } else {
          errors.push(...resolveTarget(document, target).errors);
        }
      }

      // `whiteboard.scribble` takes an optional `target` its schema does not declare as an entity, and
      // the pinned reducer *falls back* when it cannot be found rather than refusing. An earlier
      // version rejected an unknown scribble target, which was a behaviour change presented as parity.
      if (CREATING_ACTIONS.includes(command.action)) {
        const id = kwargs['id'];
        // A commit that reuses an id would produce two elements the board cannot tell apart, and every
        // later target reference would resolve to whichever sorting happens to favour.
        if (id !== undefined && id !== '' && elementById(document, id) !== undefined) {
          errors.push({
            code: 'E_STATE',
            layer: 'state',
            message: `Board element "${id}" already exists`,
            subject: 'id',
          });
        }
      }

      return errors;
    },
  };
}

/** Whether a command addresses an element that must already exist. */
export function isTargetAction(action: string): boolean {
  return TARGET_ACTIONS.includes(action);
}

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
 * Resolve a `content_ref` to the board's stored content, **byte for byte** (FR-232).
 *
 * The stored string is returned as it was committed. Re-serialising or re-parsing here would produce
 * content that is equivalent and not identical, which is the failure `TEST-206` is written to catch —
 * it compares against what was committed rather than against a literal, so a change in this function
 * cannot make the test agree with the bug.
 */
export function resolveContentRef(document: BoardDocument, reference: string): string | undefined {
  return elementById(document, reference)?.content;
}

/**
 * The entity-layer stage this plugin contributes.
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
      const errors: ValidationError[] = [];

      if (TARGET_ACTIONS.includes(command.action)) {
        const target = command.kwargs['target'];
        if (target !== undefined && target !== '') errors.push(...resolveTarget(document, target).errors);
      }

      if (CREATING_ACTIONS.includes(command.action)) {
        const id = command.kwargs['id'];
        // A commit that reuses an id would produce two elements the board cannot tell apart, and
        // every later target reference would resolve to whichever sorting happens to favour.
        if (id !== undefined && id !== '' && elementById(document, id) !== undefined) {
          errors.push({
            code: 'E_STATE',
            layer: 'state',
            message: `Board element "${id}" already exists`,
            subject: 'id',
          });
        }
      }

      // `whiteboard.scribble` accepts an optional `target` linking a mark to an element, so it
      // resolves even though it does not require one: the source declares the kwarg, so a non-empty
      // value must name something.
      if (command.action === 'whiteboard.scribble') {
        const target = command.kwargs['target'];
        if (target !== undefined && target !== '') errors.push(...resolveTarget(document, target).errors);
      }

      const contentRef = command.kwargs['content_ref'];
      if (contentRef !== undefined && contentRef !== '' && resolveContentRef(document, contentRef) === undefined) {
        errors.push({
          code: 'E_UNRESOLVED_REF',
          layer: 'entity',
          message: `No board content "${contentRef}"`,
          subject: 'content_ref',
        });
      }

      return errors;
    },
  };
}

/** Whether a command addresses an element that must already exist. */
export function isTargetAction(action: string): boolean {
  return TARGET_ACTIONS.includes(action);
}

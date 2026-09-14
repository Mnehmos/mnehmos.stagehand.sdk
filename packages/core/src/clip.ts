/**
 * `mark.clip` (FR-189, `SURF-029` → `CTR-029`).
 *
 * The corpus records one line for this surface — "Mark export moment" — and no more. So that is what
 * it does: names a point in a session that a host may cut at.
 *
 * It is delivered as an ordinary registered capability rather than intercepted in the executor. A
 * command with a privileged path is a command outside the trust boundary, and a trust boundary with
 * an exception is not a boundary — it is a policy with a known hole in it.
 */

import type { CommandSchema } from '@stagehand/registry';

/**
 * The core-owned protocol command marking an export moment.
 *
 * `label` is required because an unlabelled export moment cannot be referred to afterwards, which is
 * the only thing the command is for. `note` is optional because the corpus records no second field.
 */
export const MARK_CLIP_SCHEMA: CommandSchema = {
  action: 'mark.clip',
  description: 'Mark an export moment a host may cut at.',
  minArgs: 0,
  maxArgs: 0,
  requiredKwargs: {
    label: { type: { kind: 'string', minLength: 1, maxLength: 120 } },
  },
  optionalKwargs: {
    note: { type: { kind: 'string', maxLength: 500 } },
  },
  // Nothing to settle: marking a point is instantaneous, and a host that waits for it would be
  // waiting for nothing.
  settleMs: 0,
  entityResolution: 'none',
  authoring: {
    summary: 'Mark a cut point in the session',
    examples: ['[mark.clip label=chapter-1]', '[mark.clip label=recap note="before the summary"]'],
  },
};

/** Action name, exported so callers do not retype a string that must match the schema. */
export const MARK_CLIP = 'mark.clip';

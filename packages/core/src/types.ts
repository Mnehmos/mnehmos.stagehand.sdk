/**
 * Choreography IR (FR-187, FR-188, FR-192).
 *
 * A group-level view over the parser's compound segments: kind, order, declared metadata, and a
 * stable identity. It is deliberately **not** a fully nested tree, and the reason is recorded in the
 * corpus rather than invented here — `ENT-004`:
 *
 * > VC nesting means compounds form a tree during parsing even though current segment types flatten
 * > child compounds to command arrays.
 *
 * So `[sequence][parallel][a][b][end][end]` compiles to **one** sequence node whose commands are
 * `[a, b]`. The `parallel` boundary did not survive parsing. A consumer that assumes otherwise would
 * build a scheduler on a boundary that was never there, so `CompoundNode.commands` says so in its
 * own documentation and `TEST-177` pins it with a golden.
 *
 * Reconstructing the inner boundaries would mean either a second parser in this package or a
 * tree-preserving output added to `FEAT-001`. Neither is justified by corpus evidence; if a later
 * feature needs scheduler control *inside* a compound, extending the parser's fold is the natural
 * change and `specs/006-compound-choreography/spec.md` §14 is where to record the need first.
 */

import type { StagehandCommand } from '@stagehand/parser';

export type CompoundKind = 'batch' | 'sequence' | 'parallel' | 'beat';

interface NodeBase {
  /**
   * Stable identity derived from position in the document: `0`, `0.1`, `0.1.2`.
   *
   * Deterministic by construction — no counter, clock, or randomness — so two compilations of the
   * same segments yield identical ids and a scheduler can reference a node across a re-compile.
   */
  readonly id: string;
  /** Source text of the node, including framing for a group. */
  readonly raw: string;
}

/** A single control instruction, at group level. */
export interface CommandNode extends NodeBase {
  readonly kind: 'command';
  readonly command: StagehandCommand;
}

/** A group of commands with one semantic. */
export interface CompoundNode extends NodeBase {
  readonly kind: CompoundKind;
  /**
   * The group's commands, in source order.
   *
   * Flattened: a nested compound's commands are promoted into this list, so group boundaries *inside*
   * a group are not represented. See this module's header.
   */
  readonly commands: readonly StagehandCommand[];
  /** `batch` only: `atomic` (the default) or `best_effort`. */
  readonly mode?: string;
  /** `sequence` only: declared inter-command pause, in milliseconds. */
  readonly pauseMs?: number;
  /** `beat` only: stable id from `[beat id=...]`. */
  readonly beatId?: string;
  /** `beat` only: the WHY behind the visuals, from `[beat intent=...]`. */
  readonly visualIntent?: string;
  /** `beat` only: narration collected inside the beat, joined by newline. */
  readonly narration?: string;
}

export type ChoreographyNode = CommandNode | CompoundNode;

/** True for a node that is a group rather than a single command. */
export function isCompound(node: ChoreographyNode): node is CompoundNode {
  return node.kind !== 'command';
}

/** True when a group must commit all-or-nothing. `best_effort` is the only other mode. */
export function isAtomic(node: CompoundNode): boolean {
  return node.kind === 'batch' && (node.mode ?? 'atomic') === 'atomic';
}

// ---------------------------------------------------------------------------------------------
// Group execution (FR-190, FR-192)
// ---------------------------------------------------------------------------------------------

/** The outcome of one command inside a group. */
export interface GroupCommandOutcome {
  readonly command: StagehandCommand;
  readonly committed: boolean;
  /** Populated when the command did not commit. */
  readonly errors: readonly { readonly code: string; readonly message: string }[];
}

export interface GroupResult {
  /** True when the group's effects reached the committer. */
  readonly committed: boolean;
  /** Effects handed over, zero whenever `committed` is false. */
  readonly effectCount: number;
  /** One entry per command, in source order, whether or not the group committed. */
  readonly outcomes: readonly GroupCommandOutcome[];
  /** Groups whose failure rejects every member: a `batch` in `atomic` mode. */
  readonly atomic: boolean;
}

/**
 * Receives beat lifecycle boundaries (FR-192).
 *
 * Injected rather than emitted directly because `FEAT-004` does not depend on `FEAT-005` — the
 * dependency runs the other way. The host wires this to a bus whose channel map carries
 * `beat.started` and `beat.completed` on the public channel; `packages/trace` already registers both
 * as such.
 *
 * A `beat.started` is reported only once the group is known to be executing, and `beat.completed`
 * only after the commit returned — so the pair always brackets a group that actually happened.
 */
export interface ChoreographyObserver {
  onBeatStarted?(node: CompoundNode): void;
  onBeatCompleted?(node: CompoundNode, result: GroupResult): void;
}

/** The two public event type names this feature owns. Exported so hosts do not retype them. */
export const BEAT_STARTED = 'beat.started';
export const BEAT_COMPLETED = 'beat.completed';

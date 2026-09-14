/**
 * @stagehand/core — compound choreography and beat IR.
 *
 * Owner of FEAT-004. Requirement range `FR-187..FR-192`; tasks `T-035..T-039`; parity exits
 * `TEST-177..TEST-180`. See `specs/006-compound-choreography/spec.md`.
 *
 * The property a caller may rely on: **an atomic group commits entirely or not at all, and a rejected
 * group never contacts the host.** Within `EffectCommitter`'s contract that means every member is
 * validated before any is committed, and a successful group reaches the adapter in one call.
 *
 * One limitation is declared rather than hidden: the recovered segment model flattens nested
 * compounds into their parent's command list (`ENT-004`), so group boundaries *inside* a group do not
 * survive parsing. See `CompoundNode.commands`.
 *
 * @example
 * ```ts
 * const nodes = compileChoreography(parseScript(script, { lookupSchema: registry.lookup }));
 * for (const node of nodes) {
 *   if (node.kind === 'command') continue;
 *   const result = node.kind === 'beat'
 *     ? executeBeat(registry, node, { committer, observer })
 *     : executeChoreographyGroup(registry, node, { committer });
 *   // result.committed is false and the host untouched when any member was rejected
 * }
 * ```
 */

export {
  compileChoreography,
  flattenCommands,
  nodesOfKind,
  type StagehandCommandLike,
} from './choreography.js';

export { executeBeat, executeChoreographyGroup, type ExecuteGroupOptions } from './execute.js';

export { MARK_CLIP, MARK_CLIP_SCHEMA } from './clip.js';

export {
  BEAT_COMPLETED,
  BEAT_STARTED,
  isAtomic,
  isCompound,
  type ChoreographyNode,
  type ChoreographyObserver,
  type CommandNode,
  type CompoundKind,
  type CompoundNode,
  type GroupCommandOutcome,
  type GroupResult,
} from './types.js';

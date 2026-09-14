/**
 * Compiling parsed segments into the choreography IR (FR-187, FR-188, FR-191).
 *
 * Compilation is a pure function. No clock, no timer, no counter, no randomness — which is what makes
 * `NFR-006`'s determinism structural rather than asserted, and what lets `TEST-179` check it by
 * simply compiling twice.
 */

import type { ScriptSegment } from '@stagehand/parser';
import type { ChoreographyNode, CommandNode, CompoundNode } from './types.js';

/** Build a node's id from its position: `0`, `0.1`, `0.1.2`. */
function childId(parentId: string | undefined, index: number): string {
  return parentId === undefined ? String(index) : `${parentId}.${index}`;
}

function commandNode(segment: Extract<ScriptSegment, { type: 'command' }>, id: string): CommandNode {
  return {
    kind: 'command',
    id,
    raw: segment.raw,
    command: {
      action: segment.action,
      args: [...segment.args],
      kwargs: { ...segment.kwargs },
      raw: segment.raw,
    },
  };
}

function compoundNode(segment: Exclude<ScriptSegment, { type: 'text' | 'command' }>, id: string): CompoundNode {
  const base = {
    kind: segment.type,
    id,
    raw: segment.raw,
    // Copied, not aliased: a caller mutating the parsed segment must not reach into the IR.
    commands: segment.commands.map((command) => ({
      action: command.action,
      args: [...command.args],
      kwargs: { ...command.kwargs },
      raw: command.raw,
    })),
  } as const;

  switch (segment.type) {
    case 'batch':
      return { ...base, kind: 'batch', mode: segment.mode };
    case 'sequence':
      return segment.pauseMs === undefined
        ? { ...base, kind: 'sequence' }
        : { ...base, kind: 'sequence', pauseMs: segment.pauseMs };
    case 'parallel':
      return { ...base, kind: 'parallel' };
    case 'beat':
      return {
        ...base,
        kind: 'beat',
        beatId: segment.beatId,
        visualIntent: segment.visualIntent,
        narration: segment.narration,
      };
  }
}

/**
 * Compile parsed segments into choreography nodes.
 *
 * Text segments carry narration rather than control, so they are not nodes: a caller wanting the
 * narration reads it from the segments it already has.
 *
 * @param segments Parsed segments, ordinarily from `parseScript`.
 * @returns One node per top-level command or group, in source order.
 */
export function compileChoreography(segments: readonly ScriptSegment[]): readonly ChoreographyNode[] {
  const nodes: ChoreographyNode[] = [];
  let index = 0;

  for (const segment of segments) {
    if (segment.type === 'text') continue;
    const id = childId(undefined, index);
    nodes.push(segment.type === 'command' ? commandNode(segment, id) : compoundNode(segment, id));
    index++;
  }

  return nodes;
}

/** Every command reachable from the nodes, in document order, with group boundaries removed. */
export function flattenCommands(nodes: readonly ChoreographyNode[]): readonly StagehandCommandLike[] {
  const commands: StagehandCommandLike[] = [];
  for (const node of nodes) {
    if (node.kind === 'command') commands.push(node.command);
    else commands.push(...node.commands);
  }
  return commands;
}

/** Structural alias, so callers do not have to reach into the parser's types. */
export interface StagehandCommandLike {
  readonly action: string;
  readonly args: readonly string[];
  readonly kwargs: Readonly<Record<string, string>>;
  readonly raw: string;
}

/** Nodes of one kind, in document order. */
export function nodesOfKind(
  nodes: readonly ChoreographyNode[],
  kind: CompoundNode['kind'],
): readonly CompoundNode[] {
  return nodes.filter((node): node is CompoundNode => node.kind === kind);
}

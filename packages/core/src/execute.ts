/**
 * Atomic group execution (FR-190, FR-192).
 *
 * This is a *composition* of the trust kernel, not a parallel implementation of it. Per command it
 * calls `@stagehand/runtime`'s exported stages — `validateCommand` from the registry, then
 * `runCompilerPasses` and `canonicalizeCommandEntityRefs` — and then commits **once**. A second
 * validation path here would be a second place for the trust rules to live, which Constitution II
 * exists to prevent.
 *
 * The one thing this module adds is the *ordering*: every command in an atomic group is validated
 * before any is committed. That ordering is the whole of atomicity within the runtime's contract,
 * because atomicity of the write itself belongs to the adapter — `EffectCommitter`'s documentation
 * states the split, and a group cannot promise what a single command cannot.
 *
 * Two failure kinds therefore stay distinct, and `TEST-178` asserts them separately:
 *
 * - **Rejected** — the committer is never called at all. "Asked the host and it declined" and "never
 *   asked" are different claims, and the mutation-counting fake host reports both.
 * - **Refused at commit** — the committer was called once and threw. Propagated unchanged, no retry.
 */

import type { StagehandCommand } from '@stagehand/parser';
import { validateCommand, type CapabilityRegistry } from '@stagehand/registry';
import {
  canonicalizeCommandEntityRefs,
  runCompilerPasses,
  type CanonicalEffect,
  type TrustedCompilerPass,
  type EffectCommitter,
  type EntityResolutionMode,
  type EntityResolver,
  type ValidationStage,
} from '@stagehand/runtime';
import { isAtomic, type ChoreographyObserver, type CompoundNode, type GroupCommandOutcome, type GroupResult } from './types.js';

export interface ExecuteGroupOptions {
  readonly committer: EffectCommitter;
  readonly resolver?: EntityResolver;
  readonly entityResolution?: EntityResolutionMode;
  readonly compilerPasses?: readonly TrustedCompilerPass[];
  /** Additional validation stages forwarded to FEAT-002. */
  readonly stages?: readonly ValidationStage[];
  readonly correlationId?: string;
  readonly observer?: ChoreographyObserver;
}

interface Failure {
  readonly code: string;
  readonly message: string;
}

/** Read the producer's argument surfaces back out of a payload. */
function argumentsOf(payload: Readonly<Record<string, unknown>>): {
  args: string[];
  kwargs: Record<string, string>;
} {
  const rawArgs = payload['args'];
  const rawKwargs = payload['kwargs'];
  const args = Array.isArray(rawArgs) ? rawArgs.filter((v): v is string => typeof v === 'string') : [];
  const kwargs: Record<string, string> = {};
  if (rawKwargs !== null && typeof rawKwargs === 'object') {
    for (const [key, value] of Object.entries(rawKwargs as Record<string, unknown>)) {
      if (typeof value === 'string') kwargs[key] = value;
    }
  }
  return { args, kwargs };
}

/**
 * Execute a compound group.
 *
 * @param registry Validates and types every command in the group.
 * @param node The group to execute.
 * @param options Seams. `committer` is required, as it is for a single command.
 * @returns The group's outcome, with a per-command verdict in source order.
 * @throws Whatever the committer throws, unchanged. A refused write propagates: no retry, no
 *   re-commit, no swallowing (Constitution XII).
 */
export function executeChoreographyGroup(
  registry: CapabilityRegistry,
  node: CompoundNode,
  options: ExecuteGroupOptions,
): GroupResult {
  const atomic = isAtomic(node);
  const failures = new Map<StagehandCommand, readonly Failure[]>();

  const result = (committed: boolean, effectCount: number, committedCommands: ReadonlySet<StagehandCommand>): GroupResult => {
    const outcomes: GroupCommandOutcome[] = node.commands.map((command) => {
      const failure = failures.get(command);
      if (failure !== undefined) return { command, committed: false, errors: failure };
      if (committedCommands.has(command)) return { command, committed: true, errors: [] };
      return { command, committed: false, errors: [] };
    });
    return { committed, effectCount, outcomes, atomic };
  };

  const bailAtomic = (): GroupResult => {
    // Members that would have passed are reported as not-committed, which is the honest outcome:
    // they were validated, and they did not run.
    for (const command of node.commands) {
      if (!failures.has(command)) {
        failures.set(command, [
          { code: 'E_SCHEMA', message: 'group rejected: an atomic member failed' },
        ]);
      }
    }
    return result(false, 0, new Set());
  };

  // ── Stage 1: validate every command, before committing any ────────────────────────────────────
  // For an atomic group this is the whole guarantee: one bad member and the host is never contacted.
  const accepted = new Set<StagehandCommand>();
  for (const command of node.commands) {
    const validation = validateCommand(registry, command, {
      ...(options.stages === undefined ? {} : { stages: options.stages }),
    });
    if (validation.ok) {
      accepted.add(command);
      continue;
    }
    failures.set(command, validation.errors.map((e) => ({ code: e.code, message: e.message })));
    if (atomic) return bailAtomic();
  }

  // ── Stage 2: compile and resolve every accepted command ───────────────────────────────────────
  const committable: StagehandCommand[] = [];
  const effects: CanonicalEffect[] = [];

  for (const command of node.commands) {
    if (!accepted.has(command)) continue;

    const compilation = runCompilerPasses(
      {
        action: command.action,
        payload: Object.freeze({ args: [...command.args], kwargs: { ...command.kwargs }, refs: [] }),
        resolved: [],
        raw: command.raw,
      },
      options.compilerPasses ?? [],
      {
        action: command.action,
        plugin: options.committer.plugin,
        ...(options.correlationId === undefined ? {} : { correlationId: options.correlationId }),
      },
    );

    if (!compilation.ok) {
      failures.set(command, compilation.errors.map((e) => ({ code: e.code, message: e.message })));
      if (atomic) return bailAtomic();
      continue;
    }

    const commandEffects: CanonicalEffect[] = [];
    const unresolved: Failure[] = [];

    for (const compiled of compilation.commands) {
      const { args, kwargs } = argumentsOf(compiled.payload);
      const resolved = canonicalizeCommandEntityRefs(
        registry,
        { action: compiled.action, args, kwargs, raw: compiled.raw },
        {
          ...(options.resolver === undefined ? {} : { resolver: options.resolver }),
          ...(options.entityResolution === undefined ? {} : { entityResolution: options.entityResolution }),
        },
      );
      if (!resolved.ok || resolved.command === undefined) {
        unresolved.push(...resolved.errors.map((e) => ({ code: e.code, message: e.message })));
        continue;
      }
      commandEffects.push({
        plugin: options.committer.plugin,
        action: resolved.command.action,
        payload: resolved.command.payload,
        ...(options.correlationId === undefined ? {} : { correlationId: options.correlationId }),
      });
    }

    if (unresolved.length > 0) {
      failures.set(command, unresolved);
      if (atomic) return bailAtomic();
      continue;
    }

    committable.push(command);
    effects.push(...commandEffects);
  }

  if (effects.length === 0) {
    // Nothing survived. Not an error — a `best_effort` group where every member was rejected — but
    // there is nothing to commit, so the committer is not called.
    return result(false, 0, new Set());
  }

  // ── Stage 3: one commit for the whole group ───────────────────────────────────────────────────
  // One call, after everything is authorized. A group that committed per command would not be
  // atomic however well its rejections behaved.
  options.committer.commit(effects);

  return result(true, effects.length, new Set(committable));
}

/**
 * Execute a group and report its beat lifecycle (FR-192).
 *
 * `beat.started` is reported only once the group is known to be executing, and `beat.completed` only
 * after the commit returned — so the pair always brackets a group that actually happened, and a
 * rejected beat reports neither.
 *
 * @throws Whatever the committer throws: `beat.completed` is not reported for a write the host
 *   refused, because the beat did not complete.
 */
export function executeBeat(
  registry: CapabilityRegistry,
  node: CompoundNode,
  options: ExecuteGroupOptions,
): GroupResult {
  options.observer?.onBeatStarted?.(node);
  const result = executeChoreographyGroup(registry, node, options);
  options.observer?.onBeatCompleted?.(node, result);
  return result;
}

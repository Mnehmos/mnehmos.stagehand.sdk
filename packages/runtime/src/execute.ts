/**
 * Transactional execution (FR-185, FR-186).
 *
 * Every stage before the commit is a pure function of the command and the injected seams. The
 * commit is the only line that can change the world, and exactly one path reaches it. That is the
 * property `TEST-174` verifies from outside, by counting mutations on a host that keeps score.
 *
 * Stage order is `validate → compile → resolve → commit`, fixed by FR-185. Compilation precedes
 * resolution because a semantic command expands into primitive commands that name their own
 * concrete references; resolving first would resolve slots on a shape about to be discarded.
 *
 * **On trust:** compiler passes are host-supplied code, not model output. A pass may name actions
 * the registry has never heard of, and those effects commit. That is intended — the trust boundary
 * this pipeline defends is *producer → registry*, and a pass is on the host's side of it. A pass is
 * as trusted as the adapter it commits through, and installing one is a deliberate host decision.
 */

import type { StagehandCommand } from '@stagehand/parser';
import { validateCommand, type CapabilityRegistry } from '@stagehand/registry';
import { runCompilerPasses } from './compile.js';
import { canonicalizeCommandEntityRefs } from './resolve.js';
import type {
  CanonicalEffect,
  CanonicalStagehandCommand,
  CompilableCommand,
  ExecutionOutcome,
  ExecuteStagehandCommandOptions,
  RuntimeEvent,
  StubProposal,
} from './types.js';

/** Read the producer's argument surfaces back out of a command payload. */
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
 * Execute one command: validate, compile, resolve, then commit once.
 *
 * @param registry The capability registry that validates and types the command.
 * @param command A parsed command. Parsing is `FEAT-001`'s job and is not repeated here.
 * @param options Seams. `committer` is required; see `ExecuteStagehandCommandOptions`.
 * @returns The events this execution produced, whether the host was mutated, and how many effects
 *   were handed over. A caller inspecting only `events` can mistake a rejection for a success, so
 *   `committed` and `effectCount` are reported separately.
 * @throws Whatever the committer throws. A refused commit propagates unchanged: no retry, no
 *   re-commit, no swallowing (Constitution XII).
 */
export function executeStagehandCommand(
  registry: CapabilityRegistry,
  command: StagehandCommand,
  options: ExecuteStagehandCommandOptions,
): ExecutionOutcome {
  const events: RuntimeEvent[] = [];
  const refuse = (event: RuntimeEvent): ExecutionOutcome => ({
    events: [...events, event],
    committed: false,
    effectCount: 0,
  });

  // ── 1. Validate (FEAT-002) ────────────────────────────────────────────────────────────────────
  // A rejection here means the registry never authorised the command, so the host must not hear
  // about it: no committer call, and the diagnostic goes to the production channel.
  const validation = validateCommand(registry, command, {
    ...(options.stages === undefined ? {} : { stages: options.stages }),
    ...(options.context === undefined ? {} : { context: options.context }),
  });
  if (!validation.ok) {
    return refuse({
      type: 'invalid_command',
      channel: 'production',
      command,
      layer: validation.layer,
      errors: validation.errors,
    });
  }

  // ── 2. Compile ───────────────────────────────────────────────────────────────────────────────
  // The initial payload carries the producer's args and kwargs verbatim, so a pass that declines
  // leaves everything downstream with exactly what the producer sent.
  const initial: CompilableCommand = {
    action: command.action,
    payload: Object.freeze({
      args: [...command.args],
      kwargs: { ...command.kwargs },
      refs: [],
    }),
    resolved: [],
    raw: command.raw,
  };

  const compilation = runCompilerPasses(initial, options.compilerPasses ?? [], {
    action: command.action,
    plugin: options.committer.plugin,
    ...(options.correlationId === undefined ? {} : { correlationId: options.correlationId }),
  });
  if (!compilation.ok) {
    return refuse({
      type: 'compile_failed',
      channel: 'production',
      command,
      pass: compilation.failedPass ?? '(unknown)',
      errors: compilation.errors,
    });
  }

  // ── 3. Resolve ───────────────────────────────────────────────────────────────────────────────
  // INV-008. An expansion may yield several commands, and every one of them must resolve before
  // any of them commits — otherwise a partially resolvable expansion would write half a scene.
  const resolvedCommands: CanonicalStagehandCommand[] = [];
  const unresolved: string[] = [];
  const proposals: StubProposal[] = [];

  for (const compiled of compilation.commands) {
    const { args, kwargs } = argumentsOf(compiled.payload);
    const result = canonicalizeCommandEntityRefs(
      registry,
      { action: compiled.action, args, kwargs, raw: compiled.raw },
      {
        ...(options.resolver === undefined ? {} : { resolver: options.resolver }),
        ...(options.entityResolution === undefined ? {} : { entityResolution: options.entityResolution }),
      },
    );

    if (result.ok && result.command !== undefined) {
      resolvedCommands.push(result.command);
      continue;
    }
    for (const error of result.errors) unresolved.push(error.subject ?? error.message);
    for (const proposal of result.proposals ?? []) proposals.push(proposal);
  }

  if (unresolved.length > 0) {
    return refuse({
      type: 'unresolved_refs',
      channel: 'production',
      command,
      unresolved: [...new Set(unresolved)],
      proposals,
    });
  }

  // ── 4. Commit, once ──────────────────────────────────────────────────────────────────────────
  // Atomicity of the write is the adapter's contract. Calling it once, with the whole batch, and
  // not before this line, is this function's.
  const effects: CanonicalEffect[] = resolvedCommands.map((canonical) => ({
    plugin: options.committer.plugin,
    action: canonical.action,
    payload: canonical.payload,
    ...(options.correlationId === undefined ? {} : { correlationId: options.correlationId }),
  }));

  options.committer.commit(effects);

  const primary = effects[0];
  if (primary !== undefined) {
    events.push({
      type: 'scene_command',
      channel: 'public',
      effect: primary,
      effects,
      plugin: options.committer.plugin,
    });
  }

  return { events, committed: true, effectCount: effects.length };
}

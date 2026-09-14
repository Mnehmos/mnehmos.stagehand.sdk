/**
 * @stagehand/runtime — effect compilation, resolution, and safe execution.
 *
 * Owner of FEAT-003. Requirement range `FR-181..FR-186`; tasks `T-030..T-034`; parity exits
 * `TEST-174..TEST-176`. See `specs/003-effect-runtime/spec.md`.
 *
 * This is the last stage of the trust chain and the only one that touches host state. Everything
 * before it classifies; here a classification becomes a mutation. The property a caller may rely on
 * is therefore narrow and firm: **a command that failed any earlier stage produces zero host
 * mutations**, and the committer is called at most once, only after every stage succeeded.
 *
 * This package defines interfaces and nothing that implements them. The three seams — resolver,
 * committer, compiler pass — are the only way a host participates (DIV-007).
 *
 * @example
 * ```ts
 * const registry = new CapabilityRegistry([mapFocusSchema]);
 *
 * const outcome = executeStagehandCommand(registry, command, {
 *   committer: { plugin: 'geo', commit: (effects) => scene.apply(effects) },
 *   resolver: geoResolver,
 *   entityResolution: 'strict',
 * });
 *
 * if (!outcome.committed) {
 *   // production channel: a diagnostic, never public state
 *   diagnostics.record(outcome.events);
 * }
 * ```
 */

export {
  canonicalizeCommandEntityRefs,
  toCompilable,
} from './resolve.js';

export {
  defineCompilerPass,
  runCompilerPasses,
  type CompilationResult,
} from './compile.js';

export { executeStagehandCommand } from './execute.js';

export {
  ENTITY_RESOLUTION_MODES,
  type CanonicalEffect,
  type CanonicalStagehandCommand,
  type CanonicalizeCommandOptions,
  type CanonicalizeCommandResult,
  type CompilableCommand,
  type CompileContext,
  type CompileFailedEvent,
  type CompileOutcome,
  type CommandCompilerPass,
  type EffectCommitter,
  type EntityResolutionMode,
  type EntityResolver,
  type ExecutionOutcome,
  type ExecuteStagehandCommandOptions,
  type InvalidCommandEvent,
  type PrimitiveCommand,
  type ResolvedRef,
  type ResolvedTarget,
  type RuntimeEvent,
  type RuntimeEventChannel,
  type SceneCommandEvent,
  type StubProposal,
  type UnresolvedRefsEvent,
  type ValidationError,
  type ValidationLayer,
  type ValidationStage,
} from './types.js';

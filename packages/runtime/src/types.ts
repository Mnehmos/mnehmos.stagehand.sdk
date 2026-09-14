/**
 * Runtime IR and the injected seams (FR-181, FR-186).
 *
 * This package defines interfaces and nothing that implements them. The three seams — resolver,
 * committer, compiler pass — are the only way a host participates, which is what keeps core free of
 * renderer, map, provider, and domain dependencies (DIV-007). There is deliberately no `HostState`
 * type here: core never reads host state, it only asks the resolver questions.
 */

import type { StagehandCommand } from '@stagehand/parser';
import type { ValidationContext, ValidationError, ValidationLayer, ValidationStage } from '@stagehand/registry';

/**
 * Re-exported because it appears in this package's public outcome shapes: a caller receiving an
 * `invalid_command` or `compile_failed` event needs the error type without taking a second
 * dependency to name it.
 */
export type { ValidationError, ValidationLayer, ValidationStage, ValidationContext };

// ---------------------------------------------------------------------------------------------
// Canonical IR
// ---------------------------------------------------------------------------------------------

/** A concrete host target a semantic reference resolved to. */
export interface ResolvedTarget {
  /** Concrete identifier in the host's registry. */
  readonly id: string;
  /** Optional centre, when the target is an area. */
  readonly center?: readonly [longitude: number, latitude: number];
  /** Optional bounds as `[west, south, east, north]`. */
  readonly bounds?: readonly [number, number, number, number];
  /** Optional host-side classification, passed through untouched. */
  readonly kind?: string;
}

/** One reference found in a command, with what it resolved to. */
export interface ResolvedRef {
  /** The producer's original reference text, preserved verbatim. */
  readonly raw: string;
  /** The kwarg or positional slot that carried it, e.g. `id` or `args[0]`. */
  readonly slot: string;
  /** True when the reference appeared inside a list value. */
  readonly inList: boolean;
  readonly target: ResolvedTarget;
}

/**
 * What a compiler pass receives, and what it produces.
 *
 * One shape for both directions so passes compose without a second vocabulary, and so a pass cannot
 * tell whether the command it is looking at came from a producer or from an earlier pass — which is
 * what makes pass ordering the only thing that decides the result.
 */
export interface CompilableCommand {
  readonly action: string;
  readonly payload: Readonly<Record<string, unknown>>;
  /** Resolved references in discovery order. Empty when the action carries none. */
  readonly resolved: readonly ResolvedRef[];
  readonly raw: string;
}

/** A command that passed validation and had its references resolved (FR-181). */
export interface CanonicalStagehandCommand extends StagehandCommand, CompilableCommand {}

/**
 * The canonical effect. Shape fixed by the corpus core schema
 * (`docs/corpus/contracts/stagehand-core.schema.json#/$defs/effect`).
 */
export interface CanonicalEffect {
  readonly plugin: string;
  readonly action: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly correlationId?: string;
}

// ---------------------------------------------------------------------------------------------
// Seams
// ---------------------------------------------------------------------------------------------

/** Answers what a semantic reference points at. Plugin-supplied (ENT-009). */
export interface EntityResolver {
  /**
   * @param reference The producer's reference text, e.g. `country:iran`.
   * @returns The concrete target, or `undefined` when it cannot be resolved. Returning `undefined`
   *   is the only way to say "unknown" — an implementation must never guess between candidates.
   */
  resolve(
    reference: string,
    context: { readonly action: string; readonly slot: string },
  ): ResolvedTarget | undefined;
}

/**
 * Receives authorized effects. The host adapter (FR-181, FR-185).
 *
 * Two obligations, split deliberately between the two sides of the seam:
 *
 * - **The runtime** calls `commit` at most once per command, only after every stage succeeded, with
 *   all of that command's effects in one batch.
 * - **The adapter** guarantees its own write is atomic. Core cannot provide that over host state it
 *   cannot see, and must not claim to.
 */
export interface EffectCommitter {
  /** The plugin this adapter serves; stamped onto every effect it receives. */
  readonly plugin: string;
  commit(effects: readonly CanonicalEffect[]): void;
}

export interface CompileContext {
  readonly action: string;
  readonly plugin: string;
  readonly correlationId?: string;
}

/** The outcome of one compiler pass (FR-184). */
export type CompileOutcome =
  | { readonly kind: 'expanded'; readonly commands: readonly PrimitiveCommand[] }
  | { readonly kind: 'unchanged' }
  | { readonly kind: 'failed'; readonly errors: readonly ValidationError[] };

/**
 * A command a compiler pass produced.
 *
 * Structurally the same as its input; the distinction is provenance, not shape. A primitive command
 * is one that no pass claimed, so it is ready to commit.
 */
export type PrimitiveCommand = CompilableCommand;

/**
 * Expands a semantic command into primitive commands (T-032).
 *
 * Passes run in declared order over the accumulating result. A pass that does not recognise the
 * action returns `unchanged`; returning `failed` is terminal for the whole command.
 */
export interface CommandCompilerPass {
  readonly name: string;
  compile(command: CompilableCommand, context: CompileContext): CompileOutcome;
}

// ---------------------------------------------------------------------------------------------
// Modes and options (FR-183)
// ---------------------------------------------------------------------------------------------

/**
 * What to do when a reference does not resolve.
 *
 * `propose-stub` does **not** commit. It hands the plugin a proposal describing the unknown
 * reference so the controlled-registry path (FEAT-010) can decide. Committing against a stub would
 * be silent entity creation, which Constitution IV forbids.
 */
export type EntityResolutionMode = 'strict' | 'propose-stub';

export const ENTITY_RESOLUTION_MODES: readonly EntityResolutionMode[] = ['strict', 'propose-stub'];

/** A stub proposal offered under `propose-stub`. */
export interface StubProposal {
  readonly action: string;
  readonly reference: string;
  readonly slot: string;
  readonly reason: string;
}

export interface CanonicalizeCommandOptions {
  /** Injected resolver. Absent means reference-carrying actions cannot commit. */
  readonly resolver?: EntityResolver;
  /** Defaults to `strict`. */
  readonly entityResolution?: EntityResolutionMode;
  /** Optional correlation id threaded onto the resulting effect. */
  readonly correlationId?: string;
}

export interface CanonicalizeCommandResult {
  readonly ok: boolean;
  readonly command?: CanonicalStagehandCommand;
  readonly errors: readonly ValidationError[];
  /** Present when `entityResolution` is `propose-stub` and something did not resolve. */
  readonly proposals?: readonly StubProposal[];
}

export interface ExecuteStagehandCommandOptions extends CanonicalizeCommandOptions {
  /** Compiler passes, run in order. */
  readonly compilerPasses?: readonly CommandCompilerPass[];
  /**
   * Host adapter. **Required**, and deliberately so: executing without a committer would be a silent
   * no-op, and a caller that only wanted canonicalisation should call
   * `canonicalizeCommandEntityRefs` and get an answer instead of an empty result.
   */
  readonly committer: EffectCommitter;
  /** Additional validation stages forwarded to FEAT-002 (entity/state/spatial layers). */
  readonly stages?: readonly ValidationStage[];
  /** Context for those stages. */
  readonly context?: ValidationContext;
}

// ---------------------------------------------------------------------------------------------
// Outcomes (FR-186)
// ---------------------------------------------------------------------------------------------

export type RuntimeEventChannel = 'public' | 'production';

/** The committed batch. Public: the host is being told to act. */
export interface SceneCommandEvent {
  readonly type: 'scene_command';
  readonly channel: 'public';
  readonly effect: CanonicalEffect;
  readonly effects: readonly CanonicalEffect[];
  readonly plugin: string;
}

/** Validation refused the command. Production: a rejected command is not public state. */
export interface InvalidCommandEvent {
  readonly type: 'invalid_command';
  readonly channel: 'production';
  readonly command: StagehandCommand;
  readonly layer: ValidationLayer;
  readonly errors: readonly ValidationError[];
}

/** A reference did not resolve, so nothing was committed. Production. */
export interface UnresolvedRefsEvent {
  readonly type: 'unresolved_refs';
  readonly channel: 'production';
  readonly command: StagehandCommand;
  readonly unresolved: readonly string[];
  readonly proposals: readonly StubProposal[];
}

/** A compiler pass failed. Production. */
export interface CompileFailedEvent {
  readonly type: 'compile_failed';
  readonly channel: 'production';
  readonly command: StagehandCommand;
  readonly pass: string;
  readonly errors: readonly ValidationError[];
}

/**
 * What execution produced.
 *
 * `committed` is carried as data rather than inferred from the event type, because "which events
 * happened" and "did the host change" are different questions and a caller checking the first for
 * the second is how a rejection gets mistaken for a success.
 */
export type RuntimeEvent =
  | SceneCommandEvent
  | InvalidCommandEvent
  | UnresolvedRefsEvent
  | CompileFailedEvent;

export interface ExecutionOutcome {
  readonly events: readonly RuntimeEvent[];
  /** True only when the committer was invoked and returned without throwing. */
  readonly committed: boolean;
  /** Number of effects handed to the committer. Zero whenever `committed` is false. */
  readonly effectCount: number;
}

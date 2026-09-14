/**
 * Public IR for the mixed-stream parser.
 *
 * Two properties are load-bearing and everything else follows from them:
 *
 * 1. Narration and control are structurally distinguishable. A consumer partitions a parsed script
 *    into what may be spoken and what must not be, without re-reading the source text.
 * 2. A command segment records the action it names, but never judges whether that action is
 *    authorized. Authorization is the registry's boundary (FEAT-002, Constitution Article I);
 *    this module only classifies.
 */

/** Registry-side schema shape, as far as the parser needs to see it. */
export interface CommandSchemaLike {
  readonly minArgs?: number;
  readonly maxArgs?: number;
  readonly requiredKwargs?: readonly string[];
  readonly optionalKwargs?: Readonly<Record<string, string>>;
}

/** Looks up a capability schema by action name. Absent action yields `undefined`. */
export type SchemaLookup = (action: string) => CommandSchemaLike | undefined | null;

/** A single control instruction. `raw` is the source text including bracket framing. */
export interface StagehandCommand {
  readonly action: string;
  readonly args: readonly string[];
  readonly kwargs: Readonly<Record<string, string>>;
  readonly raw: string;
}

/** Narration. The only segment type a host may speak. */
export interface TextSegment {
  readonly type: 'text';
  readonly content: string;
}

/** Control, at top level. */
export interface CommandSegment extends StagehandCommand {
  readonly type: 'command';
}

interface CompoundBase {
  /** Source text from the opener through the closer. */
  readonly raw: string;
  /**
   * Commands collected in source order. Nested compound commands are flattened into this list, so
   * flattening a compound yields `CommandSegment`s of exactly the same shape as top-level commands.
   */
  readonly commands: readonly CommandSegment[];
}

/** `[batch atomic] ... [/batch]` — all inner commands commit together or not at all. */
export interface BatchSegment extends CompoundBase {
  readonly type: 'batch';
  readonly mode: string;
}

/** `[sequence pause=250] ... [end]` — inner commands run in order. */
export interface SequenceSegment extends CompoundBase {
  readonly type: 'sequence';
  readonly pauseMs?: number;
}

/** `[parallel] ... [end]` — inner commands are concurrent. */
export interface ParallelSegment extends CompoundBase {
  readonly type: 'parallel';
}

/** `[beat id=b1 intent=...] ... [end]` — narration paired with visual intent. */
export interface BeatSegment extends CompoundBase {
  readonly type: 'beat';
  readonly beatId: string;
  readonly visualIntent: string;
  /** Narration found inside the beat, joined by newline. Only `beat` retains inner narration. */
  readonly narration: string;
}

export type CompoundSegment = BatchSegment | SequenceSegment | ParallelSegment | BeatSegment;

export type ScriptSegment = TextSegment | CommandSegment | CompoundSegment;

/** Raised for malformed command syntax. Terminal for the command, or its enclosing atomic group. */
export class StagehandSyntaxError extends Error {
  readonly raw: string;

  constructor(message: string, raw: string) {
    super(message);
    this.name = 'StagehandSyntaxError';
    this.raw = raw;
  }
}

/** Compound openers, in the recovered grammar. `end` is universal; each also has a typed closer. */
export const COMPOUND_KEYWORDS = {
  batch: { type: 'batch', close: '/batch' },
  sequence: { type: 'sequence', close: '/sequence' },
  parallel: { type: 'parallel', close: '/parallel' },
  beat: { type: 'beat', close: '/beat' },
} as const;

export type CompoundKeyword = keyof typeof COMPOUND_KEYWORDS;

/** The universal closer: always closes the innermost open compound. */
export const UNIVERSAL_CLOSE = 'end';

export interface ParseScriptOptions {
  /**
   * Registry lookup. Supplying it does two things: it enables schema-aware argument
   * classification, and it enables bare-command quarantine (FR-173), which by definition requires
   * knowing the registered vocabulary. Without it, quarantine is off — the parser cannot guess
   * what a registered action looks like, and guessing is the one thing the trust boundary forbids.
   */
  readonly lookupSchema?: SchemaLookup;

  /** Override bare-command quarantine. Defaults to on exactly when `lookupSchema` is supplied. */
  readonly recoverBareCommands?: boolean;

  /** Override the recognised compound openers. Defaults to `COMPOUND_KEYWORDS`. */
  readonly compoundKeywords?: Readonly<Record<string, { type: CompoundSegment['type']; close: string }>>;

  /** Override the universal closer. Defaults to `end`. */
  readonly universalClose?: string;
}

/**
 * Test doubles for the runtime's seams.
 *
 * The mutation-counting committer exists before the executor does, on purpose. A transactional
 * executor that returns the right events while having already mutated the host is the failure
 * `TEST-174` exists to catch, and that failure is only visible to a host that keeps count. Building
 * the counter first means the safety property is asserted from outside the thing being tested.
 *
 * Note what is counted and when: a mutation is recorded only for a commit that *returned*. A commit
 * that throws records an attempt and no mutation, which is what lets a test distinguish "the runtime
 * called the host once and the host refused" from "the runtime never called the host".
 */

import type {
  CanonicalEffect,
  EffectCommitter,
  EntityResolver,
  ResolvedTarget,
} from '../src/index.js';

export interface RecordedMutation {
  readonly plugin: string;
  readonly action: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly correlationId?: string;
}

/**
 * A committer that keeps count.
 *
 * `commitCalls` counts attempts; `mutations` records only writes that were allowed to land. The two
 * are separate because collapsing them would make a throwing commit indistinguishable from a
 * successful one.
 */
export class MutationCountingCommitter implements EffectCommitter {
  readonly plugin: string;
  readonly #mutations: RecordedMutation[] = [];
  readonly #batches: RecordedMutation[][] = [];
  #commitCalls = 0;
  #failure: Error | undefined;

  constructor(plugin = 'fixture-plugin') {
    this.plugin = plugin;
  }

  /** Make the next and all subsequent commits reject, as a host refusing a write would. */
  failWith(error: Error): this {
    this.#failure = error;
    return this;
  }

  /** Stop failing. */
  recover(): this {
    this.#failure = undefined;
    return this;
  }

  commit(effects: readonly CanonicalEffect[]): void {
    this.#commitCalls++;
    if (this.#failure !== undefined) throw this.#failure;

    const batch: RecordedMutation[] = effects.map((effect) => ({
      plugin: effect.plugin,
      action: effect.action,
      payload: effect.payload,
      ...(effect.correlationId === undefined ? {} : { correlationId: effect.correlationId }),
    }));
    this.#batches.push(batch);
    this.#mutations.push(...batch);
  }

  /** Mutations that landed. */
  get mutationCount(): number {
    return this.#mutations.length;
  }

  get mutations(): readonly RecordedMutation[] {
    return [...this.#mutations];
  }

  /** How many times the runtime invoked `commit`, successful or not. */
  get commitCalls(): number {
    return this.#commitCalls;
  }

  /** Each successful commit's effects, in call order. */
  get batches(): readonly (readonly RecordedMutation[])[] {
    return this.#batches.map((batch) => [...batch]);
  }

  reset(): void {
    this.#mutations.length = 0;
    this.#batches.length = 0;
    this.#commitCalls = 0;
    this.#failure = undefined;
  }
}

export interface ResolverCall {
  readonly reference: string;
  readonly action: string;
  readonly slot: string;
}

/**
 * A resolver backed by an explicit map.
 *
 * `resolve` returns `undefined` for anything unknown and never picks between candidates — the
 * resolver contract's whole point is that "unknown" is expressible, so an ambiguous id must surface
 * as unresolved rather than as a coin flip.
 */
export class MapResolver implements EntityResolver {
  readonly #targets = new Map<string, ResolvedTarget>();
  readonly #ambiguous = new Set<string>();
  readonly calls: ResolverCall[] = [];

  set(reference: string, target: ResolvedTarget): this {
    this.#targets.set(reference, target);
    this.#ambiguous.delete(reference);
    return this;
  }

  /** Mark a reference as having more than one candidate, so a correct resolver must not answer. */
  markAmbiguous(reference: string): this {
    this.#ambiguous.add(reference);
    this.#targets.delete(reference);
    return this;
  }

  resolve(reference: string, context: { action: string; slot: string }): ResolvedTarget | undefined {
    this.calls.push({ reference, action: context.action, slot: context.slot });
    if (this.#ambiguous.has(reference)) return undefined;
    return this.#targets.get(reference);
  }

  /** Resolve only known, unambiguous references; used to check call patterns. */
  get seen(): readonly string[] {
    return this.calls.map((call) => call.reference);
  }

  reset(): void {
    this.calls.length = 0;
  }
}

/** A resolver that resolves nothing, for proving the "no guess" path. */
export const NULL_RESOLVER: EntityResolver = {
  resolve: () => undefined,
};

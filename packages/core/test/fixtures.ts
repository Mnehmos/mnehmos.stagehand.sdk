/**
 * Shared fixtures for FEAT-004's parity exits.
 *
 * The mutation-counting committer is a local double rather than an import from
 * `packages/runtime/test`: test directories are not package exports, and reaching across a package
 * boundary by relative path would make one package's tests depend on another's internals. The shape
 * is deliberately the same as the runtime's, including the distinction that matters — `commitCalls`
 * counts *attempts* and `mutations` records only writes that landed.
 */

import type { CapabilityRegistry } from '@stagehand/registry';
import { CapabilityRegistry as Registry, type CommandSchema } from '@stagehand/registry';
import type { CanonicalEffect, EffectCommitter, EntityResolver, ResolvedTarget } from '@stagehand/runtime';

export const CORE_SCHEMAS: readonly CommandSchema[] = [
  {
    action: 'fixture.mark',
    description: 'A command with no references.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { id: { type: { kind: 'string', minLength: 1 } } },
    optionalKwargs: { value: { type: { kind: 'string' } } },
  },
  {
    action: 'fixture.at',
    description: 'A command carrying a semantic reference.',
    minArgs: 0,
    maxArgs: 0,
    requiredKwargs: { at: { type: { kind: 'entityRef' } } },
  },
  {
    action: 'fixture.semantic',
    description: 'A semantic command a compiler pass expands.',
    minArgs: 0,
    maxArgs: 0,
    optionalKwargs: { id: { type: { kind: 'string' } } },
  },
];

export function makeRegistry(extra: readonly CommandSchema[] = []): CapabilityRegistry {
  return new Registry([...CORE_SCHEMAS, ...extra]);
}

export interface RecordedMutation {
  readonly plugin: string;
  readonly action: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

/**
 * A committer that counts.
 *
 * `commitCalls` vs `mutationCount` is the distinction `TEST-178` turns on: an atomic group rejected
 * for one bad member must show **zero of both**, which is a different claim from "it was asked and
 * nothing landed".
 */
export class CountingCommitter implements EffectCommitter {
  readonly plugin: string;
  readonly #mutations: RecordedMutation[] = [];
  readonly #batches: RecordedMutation[][] = [];
  #commitCalls = 0;
  #failure: Error | undefined;

  constructor(plugin = 'fixture-plugin') {
    this.plugin = plugin;
  }

  failWith(error: Error): this {
    this.#failure = error;
    return this;
  }

  commit(effects: readonly CanonicalEffect[]): void {
    this.#commitCalls++;
    if (this.#failure !== undefined) throw this.#failure;
    const batch = effects.map((effect) => ({
      plugin: effect.plugin,
      action: effect.action,
      payload: effect.payload,
    }));
    this.#batches.push(batch);
    this.#mutations.push(...batch);
  }

  get commitCalls(): number {
    return this.#commitCalls;
  }

  get mutationCount(): number {
    return this.#mutations.length;
  }

  get actions(): readonly string[] {
    return this.#mutations.map((mutation) => mutation.action);
  }

  get batches(): readonly (readonly RecordedMutation[])[] {
    return this.#batches.map((batch) => [...batch]);
  }
}

/** A resolver with an explicit map; anything unknown stays unresolved. */
export class MapResolver implements EntityResolver {
  readonly #targets = new Map<string, ResolvedTarget>();

  set(reference: string, id: string): this {
    this.#targets.set(reference, { id });
    return this;
  }

  resolve(reference: string): ResolvedTarget | undefined {
    return this.#targets.get(reference);
  }
}

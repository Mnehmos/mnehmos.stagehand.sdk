/**
 * @stagehand/plugin-chess
 * Owner: FEAT-016. Chess annotation compatibility (opt-in).
 */
import { CapabilityRegistry } from '@stagehand/registry';
import type { CanonicalEffect, EffectCommitter } from '@stagehand/runtime';

export class ChessPlugin implements EffectCommitter {
  readonly plugin: string;
  readonly registry: CapabilityRegistry;
  #revision = 0;

  constructor(options: { plugin?: string } = {}) {
    this.plugin = options.plugin ?? 'chess';
    this.registry = new CapabilityRegistry([]);
  }

  get revision(): number { return this.#revision; }

  commit(effects: readonly CanonicalEffect[]): void {
    this.#revision += effects.length;
  }
}

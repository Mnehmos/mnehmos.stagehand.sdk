/**
 * @stagehand/plugin-dom-presenter
 * Owner: FEAT-017. Word-anchored DOM presentation.
 */
import { CapabilityRegistry } from '@stagehand/registry';
import type { CanonicalEffect, EffectCommitter } from '@stagehand/runtime';

export class DomPresenterPlugin implements EffectCommitter {
  readonly plugin: string;
  readonly registry: CapabilityRegistry;
  #revision = 0;

  constructor(options: { plugin?: string } = {}) {
    this.plugin = options.plugin ?? 'dom-presenter';
    this.registry = new CapabilityRegistry([]);
  }

  get revision(): number { return this.#revision; }

  commit(effects: readonly CanonicalEffect[]): void {
    this.#revision += effects.length;
  }
}

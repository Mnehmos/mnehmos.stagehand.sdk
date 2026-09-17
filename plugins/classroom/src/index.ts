/**
 * @stagehand/plugin-classroom
 * Owners: FEAT-013, FEAT-014, FEAT-015.
 */
import { CapabilityRegistry } from '@stagehand/registry';
import type { CanonicalEffect, EffectCommitter } from '@stagehand/runtime';

export class ClassroomPlugin implements EffectCommitter {
  readonly plugin: string;
  readonly registry: CapabilityRegistry;
  #revision = 0;

  constructor(options: { plugin?: string } = {}) {
    this.plugin = options.plugin ?? 'classroom';
    this.registry = new CapabilityRegistry([]);
  }

  get revision(): number { return this.#revision; }

  commit(effects: readonly CanonicalEffect[]): void {
    this.#revision += effects.length;
  }
}

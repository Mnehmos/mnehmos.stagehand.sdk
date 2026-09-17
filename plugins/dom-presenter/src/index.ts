import { CapabilityRegistry } from '@stagehand/registry';
import type { CanonicalEffect, EffectCommitter } from '@stagehand/runtime';

export interface DomPresenterDocument {
  readonly revision: number;
  readonly focusedWord: string | null;
  readonly highlightedWord: string | null;
  readonly autoSpeed: string | null;
  readonly diagramId: string | null;
}

export const EMPTY_DOM: DomPresenterDocument = Object.freeze({
  revision: 0,
  focusedWord: null,
  highlightedWord: null,
  autoSpeed: null,
  diagramId: null,
});

export class DomPresenterPlugin implements EffectCommitter {
  readonly plugin: string;
  readonly registry: CapabilityRegistry;
  #doc: DomPresenterDocument = EMPTY_DOM;

  constructor(options: { plugin?: string } = {}) {
    this.plugin = options.plugin ?? 'dom-presenter';
    this.registry = new CapabilityRegistry([]);
  }

  get document(): DomPresenterDocument { return this.#doc; }
  get revision(): number { return this.#doc.revision; }

  commit(effects: readonly CanonicalEffect[]): void {
    for (const effect of effects) {
      const kw = (effect.payload['kwargs'] ?? {}) as Record<string, string>;
      this.#doc = { ...this.#doc, revision: this.#doc.revision + 1 };
      switch (effect.action) {
        case 'stage.focus': this.#doc = { ...this.#doc, focusedWord: kw['word'] ?? null }; break;
        case 'stage.focus.off': this.#doc = { ...this.#doc, focusedWord: null }; break;
        case 'stage.auto': this.#doc = { ...this.#doc, autoSpeed: kw['speed'] ?? null }; break;
        case 'stage.highlight': this.#doc = { ...this.#doc, highlightedWord: kw['word'] ?? null }; break;
        case 'stage.highlight.off': this.#doc = { ...this.#doc, highlightedWord: null }; break;
        case 'stage.clear': this.#doc = { ...EMPTY_DOM }; break;
        case 'stage.diagram': this.#doc = { ...this.#doc, diagramId: kw['id'] ?? null }; break;
        case 'stage.diagram.off': this.#doc = { ...this.#doc, diagramId: null }; break;
      }
    }
  }
}

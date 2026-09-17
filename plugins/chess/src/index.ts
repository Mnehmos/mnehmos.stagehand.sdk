import { CapabilityRegistry } from '@stagehand/registry';
import type { CanonicalEffect, EffectCommitter } from '@stagehand/runtime';

export interface ChessAnnotation {
  readonly id: string;
  readonly kind: string;
  readonly target: string;
}

export interface ChessDocument {
  readonly revision: number;
  readonly annotations: readonly ChessAnnotation[];
}

export const EMPTY_CHESS: ChessDocument = Object.freeze({ revision: 0, annotations: Object.freeze([]) });

export class ChessPlugin implements EffectCommitter {
  readonly plugin: string;
  readonly registry: CapabilityRegistry;
  #doc: ChessDocument = EMPTY_CHESS;
  #seq = 0;

  constructor(options: { plugin?: string } = {}) {
    this.plugin = options.plugin ?? 'chess';
    this.registry = new CapabilityRegistry([]);
  }

  get document(): ChessDocument { return this.#doc; }
  get revision(): number { return this.#doc.revision; }

  commit(effects: readonly CanonicalEffect[]): void {
    for (const effect of effects) {
      const kw = (effect.payload['kwargs'] ?? {}) as Record<string, string>;
      this.#seq++;
      this.#doc = {
        ...this.#doc,
        revision: this.#doc.revision + 1,
        annotations: [...this.#doc.annotations, {
          id: `chess:${this.#seq}`,
          kind: effect.action,
          target: kw['target'] ?? kw['from'] ?? kw['move'] ?? '',
        }],
      };
    }
  }
}

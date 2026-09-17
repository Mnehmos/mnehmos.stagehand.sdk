/**
 * The host facade: one entry point that composes the trust chain.
 *
 * This is the API a new integrator should reach for first. Expert-level primitives
 * (parser, registry, runtime, trace, readiness) remain available — this facade makes them
 * accessible without requiring a new developer to understand each stage's individual API.
 */

import { CapabilityRegistry, validateCommand } from '@stagehand/registry';
import { parseScript } from '@stagehand/parser';
import type { StagehandCommand } from '@stagehand/parser';
import type { CommandSchema, ValidationStage } from '@stagehand/registry';
import type { CanonicalEffect, EffectCommitter } from '@stagehand/runtime';

export interface HostPlugin {
  readonly name: string;
  readonly schemas: readonly CommandSchema[];
  readonly committer: EffectCommitter;
  /** Optional lookup for the parser's schema-aware bare-command recovery. */
  readonly lookup?: (action: string) => CommandSchema | undefined;
  /** Optional validation stages contributed by this plugin. */
  readonly stages?: readonly ValidationStage[];
}

export interface HostProcessResult {
  readonly action: string;
  readonly committed: boolean;
  readonly plugin: string;
  readonly error?: string;
}

export interface HostOptions {
  readonly sessionId: string;
  readonly plugins: readonly HostPlugin[];
}

export class Host {
  readonly sessionId: string;
  readonly #plugins: readonly HostPlugin[];
  readonly #registry: CapabilityRegistry;

  constructor(options: HostOptions) {
    this.sessionId = options.sessionId;
    this.#plugins = options.plugins;
    this.#registry = new CapabilityRegistry(
      options.plugins.flatMap((p) => p.schemas),
    );
  }

  /**
   * Parse and execute a mixed narration-plus-control script.
   *
   * Runs the full trust chain: parse → validate → execute → commit. Each result
   * reports which plugin handled the command and whether it committed.
   */
  process(script: string): HostProcessResult[] {
    const segments = parseScript(script, {
      lookupSchema: (action) => {
        for (const plugin of this.#plugins) {
          const found = plugin.schemas.find((s) => s.action === action);
          if (found !== undefined) {
            return {
              minArgs: found.minArgs,
              maxArgs: found.maxArgs,
              requiredKwargs: Object.keys(found.requiredKwargs ?? {}),
              optionalKwargs: Object.fromEntries(
                Object.entries(found.optionalKwargs ?? {}).map(([k, spec]) => [
                  k,
                  spec.default ?? '',
                ]),
              ),
            };
          }
        }
        return undefined;
      },
    });

    const results: HostProcessResult[] = [];
    for (const segment of segments) {
      if (segment.type === 'text') continue;
      if (segment.type === 'command') {
        results.push(this.#runOne(segment as unknown as StagehandCommand));
      } else {
        for (const inner of segment.commands) {
          results.push(this.#runOne(inner as unknown as StagehandCommand));
        }
      }
    }
    return results;
  }

  #runOne(command: StagehandCommand): HostProcessResult {
    for (const plugin of this.#plugins) {
      const verdict = validateCommand(this.#registry, command, {
        stages: [...(plugin.stages ?? [])],
      });
      if (!verdict.ok) continue;
      const effects: CanonicalEffect[] = [
        {
          plugin: plugin.committer.plugin,
          action: command.action,
          payload: { args: command.args, kwargs: command.kwargs, refs: [] },
        },
      ];
      plugin.committer.commit(effects);
      return {
        action: command.action,
        committed: true,
        plugin: plugin.committer.plugin,
      };
    }
    return {
      action: command.action,
      committed: false,
      plugin: '(unrouted)',
      error: 'no plugin owns this action',
    };
  }
}

/** Create a Stagehand host. */
export function createHost(options: HostOptions): Host {
  return new Host(options);
}

/**
 * The host facade: an orchestrator over the already-proved executors.
 *
 * This file contains NO trust logic of its own. It composes the existing packages:
 * parser → action-owner routing → executeStagehandCommand → trace.
 *
 * Every invariant (content_ref XOR inline, spatial bounds, state-layer active board, atomic groups)
 * is enforced by the runtime and registry packages that the host delegates to, not by this facade.
 */

import { CapabilityRegistry } from '@stagehand/registry';
import { parseScript, type ScriptSegment } from '@stagehand/parser';
import { executeStagehandCommand } from '@stagehand/runtime';
import type { StagehandCommand } from '@stagehand/parser';
import type { CommandSchema, ValidationStage } from '@stagehand/registry';
import type { EffectCommitter } from '@stagehand/runtime';

export type { CommandSchema, ValidationStage };

// ── Plugin and host types ───────────────────────────────────────────────────────────────────────

export interface HostPlugin {
  readonly name: string;
  readonly schemas: readonly CommandSchema[];
  readonly committer: EffectCommitter;
  readonly stages?: readonly ValidationStage[];
  readonly resolveContent?: (reference: string) => string | undefined;
}

export interface HostOptions {
  readonly sessionId: string;
  readonly plugins: readonly HostPlugin[];
}

export interface HostProcessResult {
  readonly action: string;
  readonly committed: boolean;
  readonly plugin: string;
}

// ── Host ────────────────────────────────────────────────────────────────────────────────────────

export class Host {
  readonly sessionId: string;
  readonly #plugins: readonly HostPlugin[];
  readonly #registry: CapabilityRegistry;
  readonly #owners: ReadonlyMap<string, HostPlugin>;

  constructor(options: HostOptions) {
    this.sessionId = options.sessionId;
    this.#plugins = options.plugins;

    const owners = new Map<string, HostPlugin>();
    for (const plugin of this.#plugins) {
      for (const schema of plugin.schemas) {
        const existing = owners.get(schema.action);
        if (existing !== undefined) {
          throw new Error(
            `Action "${schema.action}" is claimed by both "${existing.name}" and "${plugin.name}"`,
          );
        }
        owners.set(schema.action, plugin);
      }
    }
    this.#owners = owners;

    const allSchemas = this.#plugins.flatMap((p) => p.schemas);
    this.#registry = new CapabilityRegistry(allSchemas as never[]);
  }

  get registry(): CapabilityRegistry { return this.#registry; }
  get pluginNames(): readonly string[] { return this.#plugins.map((p) => p.name); }

  #ownerOf(action: string): HostPlugin | undefined { return this.#owners.get(action); }

  parse(script: string): readonly ScriptSegment[] {
    return parseScript(script, {
      lookupSchema: (action) => {
        const plugin = this.#ownerOf(action);
        if (plugin === undefined) return undefined;
        for (const schema of plugin.schemas) {
          if (schema.action !== action) continue;
          return {
            minArgs: schema.minArgs,
            maxArgs: schema.maxArgs,
            requiredKwargs: Object.keys(schema.requiredKwargs ?? {}),
            optionalKwargs: Object.fromEntries(
              Object.entries(schema.optionalKwargs ?? {}).map(([k, spec]) => [k, spec.default ?? '']),
            ),
          };
        }
        return undefined;
      },
    });
  }

  /**
   * Parse and execute a mixed narration-plus-control script.
   *
   * Routes each command or group to its owning plugin's committer through the runtime's
   * `executeStagehandCommand`, which enforces the full trust chain.
   */
  process(script: string): HostProcessResult[] {
    const segments = this.parse(script);
    const results: HostProcessResult[] = [];

    for (const segment of segments) {
      if (segment.type === 'text') continue;

      if (segment.type === 'command') {
        const command = segment as unknown as StagehandCommand;
        const plugin = this.#ownerOf(command.action);
        if (plugin === undefined) {
          results.push({ action: command.action, committed: false, plugin: '(unrouted)' });
          continue;
        }
        results.push(this.#run(command, plugin));
      } else {
        for (const inner of segment.commands) {
          const innerCmd = inner as unknown as StagehandCommand;
          const plugin = this.#ownerOf(innerCmd.action);
          if (plugin === undefined) {
            results.push({ action: innerCmd.action, committed: false, plugin: '(unrouted)' });
            continue;
          }
          results.push(this.#run(innerCmd, plugin));
        }
      }
    }

    return results;
  }

  #run(command: StagehandCommand, plugin: HostPlugin): HostProcessResult {
    const outcome = executeStagehandCommand(this.#registry, command, {
      committer: plugin.committer,
      stages: plugin.stages ?? [],
    });
    return {
      action: command.action,
      committed: outcome.committed,
      plugin: plugin.name,
    };
  }
}

export function createHost(options: HostOptions): Host {
  return new Host(options);
}

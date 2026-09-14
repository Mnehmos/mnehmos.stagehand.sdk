/**
 * Compiler passes (FR-184).
 *
 * A pass rewrites commands; the pipeline decides whether any of the rewriting reaches the host. Two
 * properties make that safe:
 *
 * - **All-or-nothing.** Passes accumulate into a local list. Nothing is returned as committable
 *   until every pass has succeeded, so a pass that fails after an earlier pass produced output
 *   discards all of it rather than committing half an expansion.
 * - **No recursion.** A pass sees the output of previous passes but passes do not re-enter
 *   themselves, so the number of passes bounds the work and a self-expanding pass cannot loop.
 */

import type {
  CommandCompilerPass,
  CompilableCommand,
  CompileContext,
  CompileOutcome,
  ValidationError,
} from './types.js';

export interface CompilationResult {
  readonly ok: boolean;
  /** Committable commands. Empty whenever `ok` is false. */
  readonly commands: readonly CompilableCommand[];
  readonly errors: readonly ValidationError[];
  /** Name of the pass that failed, when one did. */
  readonly failedPass?: string;
}

function failedPassError(pass: string, errors: readonly ValidationError[]): ValidationError {
  return {
    code: 'E_SCHEMA',
    layer: 'registry',
    message: `Compiler pass "${pass}" failed the command: ${errors.map((e) => e.message).join('; ')}`,
  };
}

/**
 * Run compiler passes in order over a command.
 *
 * @param command The canonical command to compile.
 * @param passes Passes in declared order. An empty list leaves the command unchanged.
 * @param context Pass context: action, owning plugin, optional correlation id.
 * @returns The committable commands, or the failure. On failure, `commands` is empty — never a
 *   partial expansion.
 */
export function runCompilerPasses(
  command: CompilableCommand,
  passes: readonly CommandCompilerPass[],
  context: CompileContext,
): CompilationResult {
  let current: readonly CompilableCommand[] = [command];

  for (const pass of passes) {
    const next: CompilableCommand[] = [];

    for (const candidate of current) {
      let outcome: CompileOutcome;
      outcome = pass.compile(candidate, context);

      switch (outcome.kind) {
        case 'unchanged':
          next.push(candidate);
          break;
        case 'expanded':
          // A pass that expands to nothing is a pass that deleted the command. That is a silent
          // drop, so it is refused rather than quietly committing zero effects.
          if (outcome.commands.length === 0) {
            const errors = [
              failedPassError(pass.name, [
                {
                  code: 'E_SCHEMA',
                  layer: 'registry',
                  message: `expanded "${candidate.action}" to zero commands`,
                },
              ]),
            ];
            return { ok: false, commands: [], errors, failedPass: pass.name };
          }
          next.push(...outcome.commands);
          break;
        case 'failed':
          return {
            ok: false,
            commands: [],
            errors: [...outcome.errors, failedPassError(pass.name, outcome.errors)],
            failedPass: pass.name,
          };
      }
    }

    current = next;
  }

  return { ok: true, commands: current, errors: [] };
}

/**
 * Build a pass that expands one action into fixed commands.
 *
 * Provided so a plugin can express a simple mapping declaratively, and so tests can exercise the
 * pass mechanism without hand-writing a class. The real v2→primitive mappings belong to the plugins
 * that own those dialects (`FEAT-007`, `FEAT-008`).
 */
export function defineCompilerPass(
  name: string,
  table: Readonly<Record<string, readonly { action: string; payload?: Readonly<Record<string, unknown>> }[]>>,
): CommandCompilerPass {
  return {
    name,
    compile(command: CompilableCommand): CompileOutcome {
      const expansion = table[command.action];
      if (expansion === undefined) return { kind: 'unchanged' };
      return {
        kind: 'expanded',
        commands: expansion.map((entry) => ({
          action: entry.action,
          payload: entry.payload ?? command.payload,
          resolved: command.resolved,
          raw: command.raw,
        })),
      };
    },
  };
}

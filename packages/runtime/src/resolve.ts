/**
 * Semantic reference resolution (FR-182, FR-183).
 *
 * References are discovered from the registry's declared `entityRef` / `entityRefList` value types
 * rather than from a table of action names. That is the whole design: a capability that starts
 * carrying a reference is picked up by this code with no change here, so reference handling cannot
 * fall behind the vocabulary. A per-action list would be the drift class `DIV-006` removed,
 * reintroduced one package over.
 *
 * UNRESOLVED never becomes a guess. The resolver returns a target or nothing; when it returns
 * nothing the command does not commit (INV-008), in both resolution modes.
 */

import type { StagehandCommand } from '@stagehand/parser';
import type { CapabilityRegistry } from '@stagehand/registry';
import type {
  CanonicalizeCommandOptions,
  CanonicalizeCommandResult,
  CanonicalStagehandCommand,
  CompilableCommand,
  ResolvedRef,
  StubProposal,
  ValidationError,
} from './types.js';

/** A slot that carries a semantic reference, as declared by the schema. */
interface ReferenceSlot {
  readonly slot: string;
  readonly inList: boolean;
  readonly positional: number | undefined;
  readonly value: string;
}

/** True for the value types that denote a semantic reference. */
function isReferenceKind(kind: string): boolean {
  return kind === 'entityRef' || kind === 'entityRefList';
}

/**
 * Find the reference-carrying slots the schema declares and that the command actually supplies.
 *
 * Only slots the schema types as `entityRef` / `entityRefList` count. A plain `string` kwarg is a
 * string: treating it as a reference would make every action unresolvable and every `id=t` a lookup
 * miss, which is how a reference-handling bug hides — it looks like an unresolvable registry rather
 * than like a type confusion.
 *
 * Order is deterministic: kwargs in declaration order (required then optional), then positional
 * arguments by index. Determinism here is what lets a trace replay (`DIV-005`).
 */
function referenceSlots(
  registry: CapabilityRegistry,
  command: StagehandCommand,
): ReferenceSlot[] {
  const schema = registry.get(command.action);
  if (schema === undefined) return [];

  const slots: ReferenceSlot[] = [];

  const consider = (slot: string, value: string | undefined, inList: boolean): void => {
    if (value === undefined) return;
    if (inList) {
      // A list may legitimately be empty; an empty list carries no references rather than one
      // empty reference, which would otherwise resolve as an unknown id.
      if (value.trim() === '') return;
    }
    slots.push({ slot, inList, positional: undefined, value });
  };

  for (const [key, spec] of Object.entries(schema.requiredKwargs ?? {})) {
    if (!isReferenceKind(spec.type.kind)) continue;
    consider(key, command.kwargs[key], spec.type.kind === 'entityRefList');
  }
  for (const [key, spec] of Object.entries(schema.optionalKwargs ?? {})) {
    if (!isReferenceKind(spec.type.kind)) continue;
    consider(key, command.kwargs[key], spec.type.kind === 'entityRefList');
  }
  for (let index = 0; index < command.args.length; index++) {
    const type = schema.argTypes?.[index];
    if (type === undefined || !isReferenceKind(type.kind)) continue;
    const value = command.args[index];
    if (value === undefined) continue;
    slots.push({ slot: `args[${index}]`, inList: false, positional: index, value });
  }

  return slots;
}

/** Split a list value into individual references, dropping empties. */
function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

/**
 * Resolve a validated command's references and produce the canonical form.
 *
 * @returns `ok: true` with the canonical command, or `ok: false` with `E_UNRESOLVED_REF` errors and,
 *   under `propose-stub`, the stub proposals the owning plugin should review. Nothing is committed
 *   either way — that decision belongs to the executor.
 */
export function canonicalizeCommandEntityRefs(
  registry: CapabilityRegistry,
  command: StagehandCommand,
  options: CanonicalizeCommandOptions = {},
): CanonicalizeCommandResult {
  const mode = options.entityResolution ?? 'strict';
  const slots = referenceSlots(registry, command);

  const resolved: ResolvedRef[] = [];
  const errors: ValidationError[] = [];
  const proposals: StubProposal[] = [];

  /** Concrete ids per slot, in discovery order. */
  const concretes = new Map<string, string[]>();

  for (const slot of slots) {
    const references = slot.inList ? splitList(slot.value) : [slot.value];
    const ids: string[] = [];

    for (const reference of references) {
      const target = options.resolver?.resolve(reference, {
        action: command.action,
        slot: slot.slot,
      });

      if (target === undefined) {
        errors.push({
          code: 'E_UNRESOLVED_REF',
          layer: 'entity',
          message: `Unresolved reference "${reference}" for "${slot.slot}" in action "${command.action}"`,
          subject: slot.slot,
        });
        if (mode === 'propose-stub') {
          proposals.push({
            action: command.action,
            reference,
            slot: slot.slot,
            reason: 'not present in the resolver registry',
          });
        }
        continue;
      }

      resolved.push({ raw: reference, slot: slot.slot, inList: slot.inList, target });
      ids.push(target.id);
    }

    if (ids.length > 0) concretes.set(slot.slot, ids);
  }

  if (errors.length > 0) {
    return mode === 'propose-stub'
      ? { ok: false, errors, proposals }
      : { ok: false, errors };
  }

  // The payload carries concrete ids where the producer wrote semantic references, plus the full
  // resolution record. Both, not either: the host needs a target it can act on, and the trace needs
  // to remember what the producer actually said.
  const args = command.args.map((value, index) => {
    const ids = concretes.get(`args[${index}]`);
    return ids?.[0] ?? value;
  });
  const kwargs: Record<string, string> = {};
  for (const [key, value] of Object.entries(command.kwargs)) {
    const ids = concretes.get(key);
    kwargs[key] = ids === undefined ? value : ids.join(',');
  }

  const payload: Record<string, unknown> = {
    args: [...args],
    kwargs,
    refs: resolved.map((ref) => ({
      slot: ref.slot,
      raw: ref.raw,
      id: ref.target.id,
      ...(ref.target.center === undefined ? {} : { center: [...ref.target.center] }),
      ...(ref.target.bounds === undefined ? {} : { bounds: [...ref.target.bounds] }),
      ...(ref.target.kind === undefined ? {} : { kind: ref.target.kind }),
    })),
  };

  const canonical: CanonicalStagehandCommand = {
    action: command.action,
    args: command.args,
    kwargs: command.kwargs,
    raw: command.raw,
    resolved,
    payload: Object.freeze(payload),
  };

  return { ok: true, command: canonical, errors: [] };
}

/**
 * Narrow a canonical command to the shape a compiler pass consumes.
 *
 * Exists so the pass interface does not have to know about `args`/`kwargs` — a pass rewrites the
 * payload, and keeping the producer's raw text out of its input makes it harder to accidentally
 * re-parse instead of rewrite.
 */
export function toCompilable(command: CanonicalStagehandCommand): CompilableCommand {
  return {
    action: command.action,
    payload: command.payload,
    resolved: command.resolved,
    raw: command.raw,
  };
}

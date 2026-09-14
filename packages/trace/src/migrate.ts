/**
 * Migrator registry (FR-197, DIV-005).
 *
 * Compatibility is explicit or refused. Three failure modes this exists to prevent, all of which
 * produce a *loadable but wrong* envelope rather than an error:
 *
 * - **Implicit acceptance.** An older envelope read as though its fields matched, with the missing
 *   ones silently absent. Refused here: an unregistered version is not loadable.
 * - **Field-dropping upgrade.** A migrator that copies across the fields it recognises and loses the
 *   rest. A migrator must return a complete record, and the chain's exit version is checked.
 * - **A migrator run against a version it does not read.** Registered by `from`, so it can only be
 *   applied to that version; a chain whose links do not meet is reported as a broken chain rather
 *   than attempted hopefully.
 *
 * `U-005` — how many historical versions must stay migratable — is a maintainer policy decision.
 * This module supplies the mechanism and no policy: nothing is migratable until someone registers a
 * migrator for it.
 */

import { parseTrace, PROTOCOL_VERSION, type EnvelopeRecord, type TraceEnvelope } from './envelope.js';

/**
 * Upgrades a record from `from` to `to`.
 *
 * Receives and returns the loose record shape, because a migrator's whole job is handling fields the
 * current version does not have.
 */
export interface TraceMigrator {
  /** Protocol version this migrator reads. It must never be applied to another. */
  readonly from: string;
  /** Protocol version it produces. */
  readonly to: string;
  readonly description?: string;
  migrate(record: EnvelopeRecord): EnvelopeRecord;
}

export type UpgradeResult =
  | { readonly ok: true; readonly envelope: TraceEnvelope; readonly path: readonly string[] }
  | { readonly ok: false; readonly reason: string };

export class DuplicateMigratorError extends Error {
  constructor(from: string) {
    super(`A migrator reading protocol version "${from}" is already registered`);
    this.name = 'DuplicateMigratorError';
  }
}

export class MigratorRegistry {
  readonly #byFrom = new Map<string, TraceMigrator>();

  /**
   * Register a migrator.
   *
   * @throws {DuplicateMigratorError} on a second migrator for the same source version. Two migrators
   *   for one version means two possible outcomes for the same input, which is not a decision to
   *   make at read time.
   */
  register(migrator: TraceMigrator): this {
    if (this.#byFrom.has(migrator.from)) throw new DuplicateMigratorError(migrator.from);
    if (migrator.from === migrator.to) {
      throw new Error(`Migrator for "${migrator.from}" does not change the version`);
    }
    this.#byFrom.set(migrator.from, migrator);
    return this;
  }

  get size(): number {
    return this.#byFrom.size;
  }

  /** Source versions this registry can read. */
  get readableVersions(): readonly string[] {
    return [...this.#byFrom.keys()].sort();
  }

  /**
   * Walk a chain from `from` to `to`, or report why it cannot.
   *
   * @returns The ordered list of versions visited, or a reason naming the missing link.
   */
  plan(from: string, to: string): { readonly ok: true; readonly path: readonly string[] } | { readonly ok: false; readonly reason: string } {
    if (from === to) return { ok: true, path: [from] };

    const path: string[] = [from];
    const visited = new Set<string>([from]);
    let current = from;

    for (;;) {
      const migrator = this.#byFrom.get(current);
      if (migrator === undefined) {
        return { ok: false, reason: `no migrator registered for protocol version "${current}"` };
      }
      current = migrator.to;
      path.push(current);
      if (current === to) return { ok: true, path };
      if (visited.has(current)) {
        // A cycle among migrators would otherwise hang; naming it is more useful than a timeout.
        return { ok: false, reason: `migrator chain from "${from}" cycles at "${current}"` };
      }
      visited.add(current);
    }
  }

  /**
   * Upgrade a serialized envelope to `target`.
   *
   * @param text Serialized envelope, at any version.
   * @param target Target protocol version. Defaults to this build's.
   */
  upgrade(text: string, target: string = PROTOCOL_VERSION): UpgradeResult {
    const parsed = parseTrace(text);
    if (!parsed.ok) return { ok: false, reason: parsed.reason };

    const from = parsed.envelope.protocolVersion;
    const plan = this.plan(from, target);
    if (!plan.ok) return { ok: false, reason: plan.reason };

    // `plan` returned at least one migrator unless from === to, so this loop is the only place a
    // migrator runs and it always runs on the version it declared.
    let record: EnvelopeRecord = { ...parsed.envelope };
    for (let i = 0; i < plan.path.length - 1; i++) {
      const step = plan.path[i];
      if (step === undefined) break;
      const migrator = this.#byFrom.get(step);
      if (migrator === undefined) {
        return { ok: false, reason: `migrator chain broke at "${step}" after planning` };
      }
      record = migrator.migrate(record);
      if (record['protocolVersion'] !== migrator.to) {
        return {
          ok: false,
          reason: `migrator "${migrator.from}" -> "${migrator.to}" produced protocolVersion "${String(record['protocolVersion'])}"`,
        };
      }
    }

    // Re-parse through the same validator rather than trusting the chain's output. A migrator that
    // dropped a required field is caught here, which is the field-dropping case above.
    const reparsed = parseTrace(JSON.stringify(record));
    if (!reparsed.ok) return { ok: false, reason: `migrated envelope is invalid: ${reparsed.reason}` };
    if (reparsed.envelope.protocolVersion !== target) {
      return { ok: false, reason: `migrated envelope is at "${reparsed.envelope.protocolVersion}", expected "${target}"` };
    }

    return { ok: true, envelope: reparsed.envelope, path: plan.path };
  }
}

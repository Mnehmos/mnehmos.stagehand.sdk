/**
 * The versioned trace envelope (FR-196, DIV-005).
 *
 * Versioning is introduced here, on the first record this code writes, because a migrator registry
 * retrofitted to unversioned traces is a rewrite rather than an upgrade — and the recovered host
 * shipped traces with no schema version at all (`FIND-005`).
 *
 * Parsing reports failures instead of repairing them. An envelope accepted with fields defaulted
 * looks loadable and is not, which is worse than a refusal, because the failure surfaces later as a
 * wrong replay rather than as a parse error.
 */

import type { ProductionEvent, PublicEvent } from './vocabulary.js';

/** Wire format version of the envelope shape itself. */
export const PROTOCOL_VERSION = '1.0.0';

/** Version of the capability-schema set the events were produced against. */
export const SCHEMA_SET_VERSION = '1.0.0';

export interface TraceEnvelope {
  readonly protocolVersion: string;
  readonly schemaSetVersion: string;
  /** Plugin name to version, for every plugin that participated. */
  readonly pluginVersions: Readonly<Record<string, string>>;
  /** Host adapter version, when the host declares one. */
  readonly adapterVersion?: string;
  /** Hash of the asset manifest, when the session depended on assets. */
  readonly assetManifestHash?: string;
  readonly sessionId: string;
  /** ISO-8601 timestamp of session start. */
  readonly startedAt: string;
  readonly publicEvents: readonly PublicEvent[];
  readonly productionEvents: readonly ProductionEvent[];
}

export interface EnvelopeInput {
  readonly sessionId: string;
  /** Epoch milliseconds, as the bus reports it. */
  readonly startedAt: number;
  readonly publicEvents: readonly PublicEvent[];
  readonly productionEvents: readonly ProductionEvent[];
  readonly pluginVersions?: Readonly<Record<string, string>>;
  readonly adapterVersion?: string;
  readonly assetManifestHash?: string;
  readonly protocolVersion?: string;
  readonly schemaSetVersion?: string;
}

export function createEnvelope(input: EnvelopeInput): TraceEnvelope {
  return {
    protocolVersion: input.protocolVersion ?? PROTOCOL_VERSION,
    schemaSetVersion: input.schemaSetVersion ?? SCHEMA_SET_VERSION,
    pluginVersions: { ...(input.pluginVersions ?? {}) },
    sessionId: input.sessionId,
    startedAt: new Date(input.startedAt).toISOString(),
    publicEvents: [...input.publicEvents],
    productionEvents: [...input.productionEvents],
    ...(input.adapterVersion === undefined ? {} : { adapterVersion: input.adapterVersion }),
    ...(input.assetManifestHash === undefined ? {} : { assetManifestHash: input.assetManifestHash }),
  };
}

export type ParseResult =
  | { readonly ok: true; readonly envelope: TraceEnvelope }
  | { readonly ok: false; readonly reason: string };

const REQUIRED_STRING_FIELDS = [
  'protocolVersion',
  'schemaSetVersion',
  'sessionId',
  'startedAt',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Serialize to JSON. Deterministic: keys are emitted in a fixed order. */
export function serializeTrace(envelope: TraceEnvelope): string {
  const ordered: Record<string, unknown> = {
    protocolVersion: envelope.protocolVersion,
    schemaSetVersion: envelope.schemaSetVersion,
    pluginVersions: Object.fromEntries(
      Object.entries(envelope.pluginVersions).sort(([a], [b]) => a.localeCompare(b)),
    ),
    sessionId: envelope.sessionId,
    startedAt: envelope.startedAt,
    publicEvents: envelope.publicEvents,
    productionEvents: envelope.productionEvents,
  };
  if (envelope.adapterVersion !== undefined) ordered['adapterVersion'] = envelope.adapterVersion;
  if (envelope.assetManifestHash !== undefined) ordered['assetManifestHash'] = envelope.assetManifestHash;
  return JSON.stringify(ordered, null, 2);
}

/**
 * Parse a serialized envelope.
 *
 * @returns `{ ok: true, envelope }` or `{ ok: false, reason }`. Never repairs: a missing required
 *   field, a non-array event list, or a malformed event is a refusal.
 */
export function parseTrace(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    return { ok: false, reason: `not valid JSON: ${(error as Error).message}` };
  }

  if (!isRecord(raw)) return { ok: false, reason: 'envelope must be a JSON object' };

  for (const field of REQUIRED_STRING_FIELDS) {
    const value = raw[field];
    if (typeof value !== 'string' || value === '') {
      return { ok: false, reason: `missing or invalid required field "${field}"` };
    }
  }

  const pluginVersions = raw['pluginVersions'];
  if (!isRecord(pluginVersions)) return { ok: false, reason: 'missing or invalid "pluginVersions"' };
  for (const [name, version] of Object.entries(pluginVersions)) {
    if (typeof version !== 'string') return { ok: false, reason: `pluginVersions["${name}"] is not a string` };
  }

  const publicEvents = raw['publicEvents'];
  const productionEvents = raw['productionEvents'];
  if (!Array.isArray(publicEvents)) return { ok: false, reason: 'missing or invalid "publicEvents" array' };
  if (!Array.isArray(productionEvents)) return { ok: false, reason: 'missing or invalid "productionEvents" array' };

  for (const [name, events, expected] of [
    ['publicEvents', publicEvents, 'public'],
    ['productionEvents', productionEvents, 'production'],
  ] as const) {
    for (let index = 0; index < events.length; index++) {
      const event: unknown = events[index];
      if (!isRecord(event)) return { ok: false, reason: `${name}[${index}] is not an object` };
      if (event['channel'] !== expected) {
        // The single most important structural check in this function: an envelope whose "public"
        // array contains a production event would render a rejected command as user-visible state.
        return { ok: false, reason: `${name}[${index}] declares channel "${String(event['channel'])}", expected "${expected}"` };
      }
      if (typeof event['type'] !== 'string') return { ok: false, reason: `${name}[${index}] has no type` };
      if (typeof event['sequence'] !== 'number') return { ok: false, reason: `${name}[${index}] has no sequence` };
      if (typeof event['at'] !== 'number') return { ok: false, reason: `${name}[${index}] has no timestamp` };
      if (!isRecord(event['payload'])) return { ok: false, reason: `${name}[${index}] has no payload object` };
    }
  }

  const adapterVersion = raw['adapterVersion'];
  if (adapterVersion !== undefined && typeof adapterVersion !== 'string') {
    return { ok: false, reason: '"adapterVersion" is not a string' };
  }
  const assetManifestHash = raw['assetManifestHash'];
  if (assetManifestHash !== undefined && typeof assetManifestHash !== 'string') {
    return { ok: false, reason: '"assetManifestHash" is not a string' };
  }

  return {
    ok: true,
    envelope: {
      protocolVersion: raw['protocolVersion'] as string,
      schemaSetVersion: raw['schemaSetVersion'] as string,
      pluginVersions: pluginVersions as Record<string, string>,
      sessionId: raw['sessionId'] as string,
      startedAt: raw['startedAt'] as string,
      publicEvents: publicEvents as PublicEvent[],
      productionEvents: productionEvents as ProductionEvent[],
      ...(adapterVersion === undefined ? {} : { adapterVersion }),
      ...(assetManifestHash === undefined ? {} : { assetManifestHash }),
    },
  };
}

/** A loose envelope shape used by migrators, which must tolerate fields this version lacks. */
export interface EnvelopeRecord {
  readonly [key: string]: unknown;
}

/** Project a typed envelope into the loose shape migrators operate on. */
export function toRecord(envelope: TraceEnvelope): EnvelopeRecord {
  return { ...envelope };
}

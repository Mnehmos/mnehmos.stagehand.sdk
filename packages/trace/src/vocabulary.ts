/**
 * Event vocabulary and channel taxonomy (FR-193, FR-194).
 *
 * The channel is a property of the event *type*, resolved through one map. It is deliberately not a
 * parameter of the emit call: an emission site that chooses a channel is an emission site that can
 * choose wrong, and putting a rejected command on the public channel is not a formatting error — it
 * is `NFR-001` and Constitution Article VII failing in the one place a host would render it.
 *
 * The map is extendable because twenty-four further event surfaces belong to later features
 * (`gate.waited`, `avatar.anchor.reached`, `projector.state`, the `lesson.*` family, `beat.*`,
 * `media.*`, `entity_*`). Each declares its channels once, here, rather than editing this package.
 */

export type EventChannel = 'public' | 'production';

/** Typed payload for every event in the core vocabulary. */
export interface EventPayloads {
  // ── public: user-visible lifecycle and effects ────────────────────────────────────────────────
  'narration.started': { readonly utteranceId: string };
  'narration.ended': { readonly utteranceId: string };
  /** A superseded turn cannot resume; the reason is recorded for the trace, not for the user. */
  'narration.interrupted': { readonly utteranceId: string; readonly reason: string };
  'caption': { readonly text: string };
  'effect.committed': {
    readonly plugin: string;
    readonly action: string;
    readonly correlationId?: string;
  };
  'board.revision.committed': { readonly revision: number };
  /** Degraded mode, entered deliberately. Public because the user is being shown less. */
  'safe_failure': { readonly code: string; readonly message: string };

  // ── production: diagnostics, internals, provider detail ───────────────────────────────────────
  'stream.chunk': { readonly bytes: number };
  'segment.parsed': { readonly kind: string };
  'command.accepted': { readonly action: string };
  'command.rejected': { readonly action: string; readonly errors: readonly string[] };
  'provider.request': { readonly provider: string; readonly model?: string };
  'provider.response': { readonly provider: string; readonly status?: string };
  'diagnostic': { readonly level: string; readonly message: string };
}

export const PUBLIC_EVENT_TYPES = [
  'narration.started',
  'narration.ended',
  'narration.interrupted',
  'caption',
  'effect.committed',
  'board.revision.committed',
  'safe_failure',
] as const;

export const PRODUCTION_EVENT_TYPES = [
  'stream.chunk',
  'segment.parsed',
  'command.accepted',
  'command.rejected',
  'provider.request',
  'provider.response',
  'diagnostic',
] as const;

export type PublicEventType = (typeof PUBLIC_EVENT_TYPES)[number];
export type ProductionEventType = (typeof PRODUCTION_EVENT_TYPES)[number];
export type CoreEventType = PublicEventType | ProductionEventType;

/** An event as recorded. `sequence` is shared across both channels so ordering is answerable. */
export interface TraceEvent<TType extends string, TPayload> {
  readonly type: TType;
  readonly channel: EventChannel;
  /** Monotonic across the whole session, both channels. */
  readonly sequence: number;
  /** Milliseconds since epoch, from the bus's injected clock. */
  readonly at: number;
  readonly payload: TPayload;
}

export type PublicEvent = {
  [K in PublicEventType]: TraceEvent<K, EventPayloads[K]>;
}[PublicEventType];

export type ProductionEvent = {
  [K in ProductionEventType]: TraceEvent<K, EventPayloads[K]>;
}[ProductionEventType];

/** Any core event, discriminated by `channel`. */
export type CoreEvent = PublicEvent | ProductionEvent;

export class ChannelConflictError extends Error {
  readonly type: string;
  readonly existing: EventChannel;
  readonly attempted: EventChannel;

  constructor(type: string, existing: EventChannel, attempted: EventChannel) {
    super(`Event type "${type}" is already registered on the "${existing}" channel; cannot add it to "${attempted}"`);
    this.name = 'ChannelConflictError';
    this.type = type;
    this.existing = existing;
    this.attempted = attempted;
  }
}

export class UnknownEventTypeError extends Error {
  readonly type: string;
  readonly channel: EventChannel | undefined;

  constructor(type: string, channel?: EventChannel) {
    super(
      channel === undefined
        ? `Event type "${type}" is not registered on any channel`
        : `Event type "${type}" is not registered for the "${channel}" channel`,
    );
    this.name = 'UnknownEventTypeError';
    this.type = type;
    this.channel = channel;
  }
}

/**
 * The single source of routing (FR-194).
 *
 * Immutable per instance: `extend` returns a new map, so a subscription cannot be handed a map that
 * another caller mutates underneath it.
 */
export class ChannelMap {
  readonly #channels: ReadonlyMap<string, EventChannel>;

  constructor(entries: ReadonlyMap<string, EventChannel>) {
    this.#channels = entries;
  }

  /** The core vocabulary: 7 public, 7 production. */
  static core(): ChannelMap {
    const entries = new Map<string, EventChannel>();
    for (const type of PUBLIC_EVENT_TYPES) entries.set(type, 'public');
    for (const type of PRODUCTION_EVENT_TYPES) entries.set(type, 'production');
    return new ChannelMap(entries);
  }

  /**
   * Add event types owned elsewhere.
   *
   * @param entries Type names to channels.
   * @param source Optional label for the declaring feature or plugin, used in errors.
   * @throws {ChannelConflictError} when a type is already registered on a different channel, or on
   *   either channel when re-registered with a different one. Re-registering on the *same* channel
   *   is idempotent and allowed, so a feature can be composed twice without failing.
   */
  extend(entries: Readonly<Record<string, EventChannel>>, source?: string): ChannelMap {
    const next = new Map(this.#channels);
    for (const [type, channel] of Object.entries(entries)) {
      const existing = next.get(type);
      if (existing !== undefined && existing !== channel) {
        throw new ChannelConflictError(type, existing, channel);
      }
      if (existing === undefined) next.set(type, channel);
    }
    void source;
    return new ChannelMap(next);
  }

  /** The channel for a type, or `undefined` when the type is unknown. */
  channelOf(type: string): EventChannel | undefined {
    return this.#channels.get(type);
  }

  /** Types registered on a channel, sorted, for diagnostics and tests. */
  typesOn(channel: EventChannel): readonly string[] {
    return [...this.#channels.entries()]
      .filter(([, registered]) => registered === channel)
      .map(([type]) => type)
      .sort();
  }

  get size(): number {
    return this.#channels.size;
  }

  /** All registered types with their channels, sorted. */
  entries(): readonly (readonly [string, EventChannel])[] {
    return [...this.#channels.entries()].sort(([a], [b]) => a.localeCompare(b));
  }
}

/**
 * The channel a core event type belongs to.
 *
 * Present so a caller with a statically known type does not have to construct a map to ask. It
 * throws for an unknown type rather than guessing, because a guessed channel is the failure this
 * module exists to prevent.
 */
export function channelOfCoreType(type: string): EventChannel {
  if ((PUBLIC_EVENT_TYPES as readonly string[]).includes(type)) return 'public';
  if ((PRODUCTION_EVENT_TYPES as readonly string[]).includes(type)) return 'production';
  throw new UnknownEventTypeError(type);
}

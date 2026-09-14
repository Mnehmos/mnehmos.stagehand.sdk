/**
 * The event bus (FR-195).
 *
 * Three deliberate properties:
 *
 * - **One sequence counter, not two.** Cross-channel ordering is only answerable if both arrays
 *   share a numbering: "did narration interrupt before or after the effect committed" cannot be read
 *   off two independent counters, and that question is exactly `TEST-184`.
 * - **Recording does not require a subscriber.** Observability that only works when someone is
 *   watching is not observability; a session recorded with nobody attached is the case an audit
 *   needs most.
 * - **The clock is injected.** A recording whose timestamps come from an ambient clock cannot be
 *   reproduced, and a reproducible recording is the point of the feature.
 */

import {
  ChannelMap,
  UnknownEventTypeError,
  channelOfCoreType,
  type EventChannel,
  type EventPayloads,
  type ProductionEvent,
  type ProductionEventType,
  type PublicEvent,
  type PublicEventType,
  type TraceEvent,
} from './vocabulary.js';

/** Injectable time source. Defaults to `Date.now`. */
export type Clock = () => number;

export interface EventBusOptions {
  readonly sessionId: string;
  /** Channel map. Defaults to the core vocabulary. */
  readonly channels?: ChannelMap;
  /** Injected clock. Defaults to `Date.now`. */
  readonly clock?: Clock;
}

export type PublicListener = (event: PublicEvent) => void;
export type ProductionListener = (event: ProductionEvent) => void;

/** Remove a listener. Idempotent. */
export type Unsubscribe = () => void;

export interface EventBusSnapshot {
  readonly sessionId: string;
  readonly startedAt: number;
  readonly publicEvents: readonly PublicEvent[];
  readonly productionEvents: readonly ProductionEvent[];
}

export class EventBus {
  readonly sessionId: string;
  readonly #channels: ChannelMap;
  readonly #clock: Clock;
  readonly #startedAt: number;
  readonly #publicEvents: PublicEvent[] = [];
  readonly #productionEvents: ProductionEvent[] = [];
  readonly #publicListeners = new Set<PublicListener>();
  readonly #productionListeners = new Set<ProductionListener>();
  #sequence = 0;

  constructor(options: EventBusOptions) {
    this.sessionId = options.sessionId;
    this.#channels = options.channels ?? ChannelMap.core();
    this.#clock = options.clock ?? Date.now;
    this.#startedAt = this.#clock();
  }

  /** Events recorded so far, in emission order. */
  get publicEvents(): readonly PublicEvent[] {
    return [...this.#publicEvents];
  }

  get productionEvents(): readonly ProductionEvent[] {
    return [...this.#productionEvents];
  }

  /** Highest sequence assigned. Zero means nothing has been emitted. */
  get sequence(): number {
    return this.#sequence;
  }

  get startedAt(): number {
    return this.#startedAt;
  }

  /**
   * Record a public event (FR-193, FR-194).
   *
   * @throws {UnknownEventTypeError} when the type is not registered on the public channel — which
   *   includes every production type. Nothing is recorded and no listener is called, so a refused
   *   emission leaves both channels untouched.
   */
  emitPublic<T extends PublicEventType>(type: T, payload: EventPayloads[T]): PublicEvent {
    this.#assertChannel(type, 'public');
    const event = this.#record(type, 'public', payload) as PublicEvent;
    for (const listener of [...this.#publicListeners]) listener(event);
    return event;
  }

  /**
   * Record a production event.
   *
   * @throws {UnknownEventTypeError} when the type is not registered on the production channel.
   */
  emitProduction<T extends ProductionEventType>(type: T, payload: EventPayloads[T]): ProductionEvent {
    this.#assertChannel(type, 'production');
    const event = this.#record(type, 'production', payload) as ProductionEvent;
    for (const listener of [...this.#productionListeners]) listener(event);
    return event;
  }

  /** Subscribe to the public channel. */
  onPublic(listener: PublicListener): Unsubscribe {
    this.#publicListeners.add(listener);
    return () => {
      this.#publicListeners.delete(listener);
    };
  }

  /** Subscribe to the production channel. */
  onProduction(listener: ProductionListener): Unsubscribe {
    this.#productionListeners.add(listener);
    return () => {
      this.#productionListeners.delete(listener);
    };
  }

  /**
   * Emit by runtime type name, routing through the map (FR-194).
   *
   * The escape hatch for callers whose event type is only known as a string — a plugin forwarding
   * its own vocabulary, for instance. An unknown type is refused rather than assigned a channel.
   */
  emit(type: string, payload: Readonly<Record<string, unknown>>): PublicEvent | ProductionEvent {
    const channel = this.#channels.channelOf(type);
    if (channel === undefined) throw new UnknownEventTypeError(type);
    if (channel === 'public') {
      return this.emitPublic(type as PublicEventType, payload as EventPayloads[PublicEventType]);
    }
    return this.emitProduction(type as ProductionEventType, payload as EventPayloads[ProductionEventType]);
  }

  /** Detach every listener, leaving the recording intact. */
  clearListeners(): void {
    this.#publicListeners.clear();
    this.#productionListeners.clear();
  }

  /** The recorded material, ready to be wrapped in an envelope. */
  snapshot(): EventBusSnapshot {
    return {
      sessionId: this.sessionId,
      startedAt: this.#startedAt,
      publicEvents: this.publicEvents,
      productionEvents: this.productionEvents,
    };
  }

  #assertChannel(type: string, channel: EventChannel): void {
    // The map is the authority. `channelOfCoreType` is not consulted because an extended map is
    // what decides routing for plugin types, and having two authorities is how they disagree.
    const registered = this.#channels.channelOf(type);
    if (registered !== channel) throw new UnknownEventTypeError(type, channel);
  }

  #record(type: string, channel: EventChannel, payload: unknown): TraceEvent<string, unknown> {
    const event: TraceEvent<string, unknown> = {
      type,
      channel,
      sequence: ++this.#sequence,
      at: this.#clock(),
      payload,
    };
    if (channel === 'public') this.#publicEvents.push(event as PublicEvent);
    else this.#productionEvents.push(event as ProductionEvent);
    return event;
  }
}

export { channelOfCoreType };

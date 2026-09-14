/**
 * Board document model (FR-228, FR-231).
 *
 * Plugin-owned state, per `ENT-010`: "Not one shared type… classroom board document + projector +
 * room/lesson state". Core never sees a `BoardDocument` — it sees a committer and a resolver — and
 * `INV-009` is the invariant that keeps it that way.
 *
 * Two properties are structural rather than conventional:
 *
 * - **Layer is part of the element**, not of the view that reads it. A consumer asking for the truth
 *   layer cannot be handed a teacher's rough working, because the element carries where it belongs.
 * - **Visibility is not content.** `hide` sets a flag; `clear` removes elements. They are separate
 *   reducers on purpose — see `reduce`.
 */

/** Which surface a committed element belongs to. */
export type BoardLayer = 'truth' | 'thinking';

export type BoardElementKind =
  | 'text'
  | 'math'
  | 'line'
  | 'box'
  | 'arrow'
  | 'highlight'
  | 'scribble'
  | 'dots'
  | 'shape'
  | 'count';

/** A committed element. `content` is stored as committed and returned byte for byte (FR-232). */
export interface BoardElement {
  readonly id: string;
  readonly kind: BoardElementKind;
  readonly layer: BoardLayer;
  /** Canonical stored content. Never re-serialised on read. */
  readonly content: string;
  /** Free-form attributes the producer supplied, copied verbatim. */
  readonly attributes: Readonly<Record<string, string>>;
  /** Revision at which this element was committed. */
  readonly committedAt: number;
}

export interface BoardDocument {
  /** Monotonic. Advances on every committed change and on nothing else (FR-228). */
  readonly revision: number;
  /**
   * Whether the board is presented.
   *
   * `hide` flips this and touches nothing else. A board that is hidden still holds every element,
   * which is the recovered VC semantic and the thing `TEST-204` protects.
   */
  readonly visible: boolean;
  readonly elements: readonly BoardElement[];
}

export const EMPTY_BOARD: BoardDocument = Object.freeze({
  revision: 0,
  visible: false,
  elements: Object.freeze([]),
});

/** Elements on one layer, in commit order. */
export function elementsOn(document: BoardDocument, layer: BoardLayer): readonly BoardElement[] {
  return document.elements.filter((element) => element.layer === layer);
}

/** One element by id, or `undefined`. Resolution never guesses a near match (FR-233). */
export function elementById(document: BoardDocument, id: string): BoardElement | undefined {
  return document.elements.find((element) => element.id === id);
}

/** Whether the board holds any element on a layer. */
export function isLayerEmpty(document: BoardDocument, layer: BoardLayer): boolean {
  return !document.elements.some((element) => element.layer === layer);
}

/**
 * The next document after committing one change.
 *
 * Every branch advances the revision exactly once, so "the revision advanced" and "something was
 * committed" cannot come apart. A reducer that returned the same document for a no-op would be
 * reported as a change by the caller unless the caller compared, and comparing is the caller's job
 * to forget.
 */
export function reduce(
  document: BoardDocument,
  change: BoardChange,
): BoardDocument {
  const revision = document.revision + 1;
  switch (change.kind) {
    case 'show':
      return { ...document, visible: true, revision };
    case 'hide':
      // Occlude. Elements are untouched, which is the whole difference from `clear`.
      return { ...document, visible: false, revision };
    case 'clear':
      return clearLayer(document, change.layer, revision);
    case 'commit':
      return {
        ...document,
        revision,
        elements: [...document.elements, { ...change.element, committedAt: revision }],
      };
    case 'remove':
      return {
        ...document,
        revision,
        elements: document.elements.filter((element) => element.id !== change.id),
      };
    case 'reveal':
      return {
        ...document,
        revision,
        elements: document.elements.map((element) =>
          element.id === change.id ? { ...element, attributes: { ...element.attributes, concealed: 'false' } } : element,
        ),
      };
  }
}

/** Clear one layer, or the whole board. The other layer is never touched. */
function clearLayer(document: BoardDocument, layer: BoardLayer | 'all', revision: number): BoardDocument {
  if (layer === 'all') return { ...document, elements: [], revision };
  return {
    ...document,
    revision,
    elements: document.elements.filter((element) => element.layer !== layer),
  };
}

export type BoardChange =
  | { readonly kind: 'show' }
  | { readonly kind: 'hide' }
  | { readonly kind: 'clear'; readonly layer: BoardLayer | 'all' }
  | { readonly kind: 'commit'; readonly element: Omit<BoardElement, 'committedAt'> }
  | { readonly kind: 'remove'; readonly id: string }
  | { readonly kind: 'reveal'; readonly id: string };

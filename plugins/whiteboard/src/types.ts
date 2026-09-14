/**
 * Board document model.
 *
 * Recovered from the pinned **reducer**, not from the schema file: `src/board/document.ts` at
 * `cd7253608297efd57921c965b7440f4d4081842f`. Three of its properties are load-bearing and none of
 * them is visible in `types.ts`:
 *
 * - **A board has named pages.** `pages: [{ id, title, elements }]` with an `activePageId`. `show`
 *   creates a page that does not exist, reopens one that does *with its content intact*, and updates
 *   a `title`.
 * - **A no-op does not advance the revision.** Every branch that changes nothing returns the document
 *   unchanged — `if (!target) return doc`, `if (kept.length === page.elements.length) return doc`.
 *   The revision therefore counts *changes*, not commands.
 * - **Marks are linked to their targets** by `targetId`, and erasing a target retires the marks that
 *   referred to it.
 *
 * Layer is a property of the element, not of the view: a truth-layer read cannot be handed a mark
 * from the thinking layer.
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

/** Axis-aligned box in the recovered 0-100 board space. */
export interface BoardBounds {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

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
  /** Where the element sits in board space. */
  readonly bounds: BoardBounds;
  /** Marks only: what this mark is attached to. */
  readonly targetId?: string;
  /**
   * Highlights only: when the mark stops being rendered, or `null` for permanent.
   *
   * `duration=0` means permanent until cleared, which is why this is `number | null` rather than a
   * duration that could not express "forever".
   */
  readonly expiresAt?: number | null;
  /** Reveal progress, 0 until advanced. */
  readonly reveal?: number;
  /** How long a reveal takes, in milliseconds. */
  readonly revealMs?: number;
  /** Dots only: how many were drawn. */
  readonly count?: number;
  /** Count marks only: how many things the annotation numbers. */
  readonly total?: number;
  readonly concealed?: boolean;
}

export interface BoardPage {
  readonly id: string;
  readonly title: string;
  readonly elements: readonly BoardElement[];
}

export interface BoardDocument {
  /** Monotonic over *changes*. A no-op leaves it untouched. */
  readonly revision: number;
  /** Whether the board is presented. `hide` flips this and touches nothing else. */
  readonly visible: boolean;
  readonly pages: readonly BoardPage[];
  readonly activePageId: string;
}

export const DEFAULT_PAGE_ID = 'page-1';

export const EMPTY_BOARD: BoardDocument = Object.freeze({
  revision: 0,
  visible: false,
  pages: Object.freeze([Object.freeze({ id: DEFAULT_PAGE_ID, title: '', elements: Object.freeze([]) })]),
  activePageId: DEFAULT_PAGE_ID,
});

/** The page operations act on. */
export function activePage(document: BoardDocument): BoardPage {
  const found = document.pages.find((page) => page.id === document.activePageId);
  if (found !== undefined) return found;
  const first = document.pages[0];
  if (first !== undefined) return first;
  return { id: DEFAULT_PAGE_ID, title: '', elements: [] };
}

/** Elements on the active page. The convenience most callers want. */
export function activeElements(document: BoardDocument): readonly BoardElement[] {
  return activePage(document).elements;
}

/** Elements on one layer of the active page, in commit order. */
export function elementsOn(document: BoardDocument, layer: BoardLayer): readonly BoardElement[] {
  return activePage(document).elements.filter((element) => element.layer === layer);
}

/** One element by id on the active page, or `undefined`. Resolution never guesses a near match. */
export function elementById(document: BoardDocument, id: string): BoardElement | undefined {
  return activePage(document).elements.find((element) => element.id === id);
}

/** Whether a layer of the active page holds nothing. */
export function isLayerEmpty(document: BoardDocument, layer: BoardLayer): boolean {
  return !activePage(document).elements.some((element) => element.layer === layer);
}

/** Named page lookup, across all pages. */
export function pageById(document: BoardDocument, id: string): BoardPage | undefined {
  return document.pages.find((page) => page.id === id);
}

/** Replace the active page's elements, leaving the revision and the other pages alone. */
export function withActiveElements(document: BoardDocument, elements: readonly BoardElement[]): BoardDocument {
  const page = activePage(document);
  return {
    ...document,
    pages: document.pages.map((candidate) =>
      candidate.id === page.id ? { ...candidate, elements } : candidate,
    ),
  };
}

// ── changes ─────────────────────────────────────────────────────────────────────────────────────

export type BoardChange =
  | { readonly kind: 'show'; readonly page?: string; readonly title?: string }
  | { readonly kind: 'hide' }
  | { readonly kind: 'clear'; readonly layer: BoardLayer | 'all' }
  | { readonly kind: 'commit'; readonly element: Omit<BoardElement, 'committedAt'> }
  | { readonly kind: 'remove'; readonly id: string }
  | { readonly kind: 'reveal'; readonly id: string; readonly revealMs: number }
  | { readonly kind: 'advance'; readonly deltaMs: number };

function expired(element: BoardElement, now: number): boolean {
  return (
    element.kind === 'highlight' &&
    element.expiresAt !== null &&
    element.expiresAt !== undefined &&
    element.expiresAt <= now
  );
}

/**
 * The next document after a change, or the **same** document when the change is a no-op.
 *
 * Returning the same reference is deliberate: it makes "nothing happened" observable at the call site
 * without comparing deep structures, and it is what lets the revision count changes rather than
 * commands.
 */
export function reduce(document: BoardDocument, change: BoardChange, now: number): BoardDocument {
  switch (change.kind) {
    case 'show': {
      const title = change.title ?? '';
      const pageId = change.page ?? '';
      // A named page that does not exist is created empty; one that does is reopened with its content
      // intact. An unnamed show just activates the current page.
      if (pageId !== '' && pageById(document, pageId) === undefined) {
        return {
          ...document,
          revision: document.revision + 1,
          visible: true,
          pages: [...document.pages, { id: pageId, title, elements: [] }],
          activePageId: pageId,
        };
      }
      const targetId = pageId !== '' ? pageId : document.activePageId;
      return {
        ...document,
        revision: document.revision + 1,
        visible: true,
        activePageId: targetId,
        pages:
          title === ''
            ? document.pages
            : document.pages.map((page) => (page.id === targetId ? { ...page, title } : page)),
      };
    }

    case 'hide':
      // Occlusion, not erasure. Content survives.
      return { ...document, revision: document.revision + 1, visible: false };

    case 'clear': {
      const page = activePage(document);
      const kept =
        change.layer === 'all' ? [] : page.elements.filter((element) => element.layer !== change.layer);
      // Wiping nothing is a no-op, so a repeated clear does not inflate the revision.
      if (kept.length === page.elements.length) return document;
      return { ...withActiveElements(document, kept), revision: document.revision + 1 };
    }

    case 'commit': {
      // Upsert by id: committing over an existing id replaces it. Two elements sharing an id are
      // indistinguishable to every later target reference.
      const page = activePage(document);
      const element: BoardElement = { ...change.element, committedAt: document.revision + 1 };
      const existing = page.elements.findIndex((candidate) => candidate.id === element.id);
      const elements =
        existing === -1
          ? [...page.elements, element]
          : page.elements.map((candidate, index) => (index === existing ? element : candidate));
      return { ...withActiveElements(document, elements), revision: document.revision + 1 };
    }

    case 'remove': {
      const page = activePage(document);
      // Removing an element also retires the marks that referred to it, so no highlight floats over an
      // empty board and no count annotates something that is gone.
      const kept = page.elements.filter(
        (element) => element.id !== change.id && element.targetId !== change.id,
      );
      if (kept.length === page.elements.length) return document;
      return { ...withActiveElements(document, kept), revision: document.revision + 1 };
    }

    case 'reveal': {
      const page = activePage(document);
      if (!page.elements.some((element) => element.id === change.id)) return document;
      const elements = page.elements.map((element) =>
        element.id === change.id ? { ...element, reveal: 0, revealMs: change.revealMs } : element,
      );
      return { ...withActiveElements(document, elements), revision: document.revision + 1 };
    }

    case 'advance': {
      // Reveal progress and mark expiry, driven by whatever calls it with elapsed time. Returns the
      // same document when nothing moved, so an idle frame is not a change.
      const page = activePage(document);
      let changed = false;
      const elements: BoardElement[] = [];
      for (const element of page.elements) {
        if (expired(element, now)) {
          changed = true;
          continue;
        }
        if (
          element.reveal !== undefined &&
          element.revealMs !== undefined &&
          element.revealMs > 0 &&
          element.reveal < 1
        ) {
          const next = Math.min(1, element.reveal + change.deltaMs / element.revealMs);
          if (next !== element.reveal) {
            changed = true;
            elements.push({ ...element, reveal: next });
            continue;
          }
        }
        elements.push(element);
      }
      if (!changed) return document;
      // Reveal progress and mark expiry are transient display state. The pinned advanceReveals() and
      // expireMarks() mutate page elements WITHOUT touching doc.revision, because the revision tracks
      // committed board changes rather than renderer-frame progression.
      return withActiveElements(document, elements);
    }
  }
}

/**
 * Retire expired thinking marks.
 *
 * Exposed separately because the pinned source drives it from the render loop each frame rather than
 * from the reducer, so a host that never renders never spends the revision and a host that does gets
 * the same retirement behavior.
 */
export function expireMarks(document: BoardDocument, now: number): BoardDocument {
  const page = activePage(document);
  const kept = page.elements.filter((element) => !expired(element, now));
  if (kept.length === page.elements.length) return document;
  return withActiveElements(document, kept);
}

/**
 * How many things of a given kind an element has to count.
 *
 * Recovered from the pinned reducer: `dots` are countable by `items` only, and a `shape` by `corners`
 * or `sides`. Everything else is uncountable, which the caller turns into a no-op rather than an
 * annotation numbering zero things.
 */
const SHAPE_COUNTABLE: Readonly<Record<string, { readonly corners: number; readonly sides: number }>> = {
  triangle: { corners: 3, sides: 3 },
  square: { corners: 4, sides: 4 },
  rectangle: { corners: 4, sides: 4 },
  rhombus: { corners: 4, sides: 4 },
  trapezoid: { corners: 4, sides: 4 },
  pentagon: { corners: 5, sides: 5 },
  hexagon: { corners: 6, sides: 6 },
  // A circle has no corners and no sides: the pinned geometry returns no vertices for circle/oval,
  // and side midpoints need at least three corners. `what=sides` on a circle therefore counts nothing
  // and the command no-ops rather than numbering one thing.
  circle: { corners: 0, sides: 0 },
  oval: { corners: 0, sides: 0 },
};

export function countableTotal(element: BoardElement, what: string): number {
  if (element.kind === 'dots') return what === 'items' ? (element.count ?? 0) : 0;
  if (element.kind === 'shape') {
    const shape = element.content;
    const entry = SHAPE_COUNTABLE[shape];
    if (entry === undefined) return 0;
    if (what === 'corners') return entry.corners;
    if (what === 'sides') return entry.sides;
    return 0;
  }
  return 0;
}

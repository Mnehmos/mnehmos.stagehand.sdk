/**
 * TEST-204 — hide-vs-clear divergence regression.
 *
 * The corpus describes the same two actions differently in each host. Clio records `hide` as "Hide
 * whiteboard"; VC records it as "Occlude/deactivate presentation **without destroying content**".
 * Only one of those readings survives contact with a lesson: a host that treats `hide` as `clear`
 * destroys the teacher's work the moment they cover the board to talk over it, and does so silently.
 *
 * So the assertion is not "hide works". It is that the two operations are **distinguishable after the
 * same intervening sequence** — which is the only form of the test that a shared reducer with a flag
 * would fail.
 *
 * Covers FR-230. Tasks T-074, T-078.
 */

import { describe, expect, it } from 'vitest';
import { activeElements, elementsOn, WhiteboardPlugin } from '../src/index.js';

/** Drive the plugin through its own committer, the way the runtime would. */
function apply(plugin: WhiteboardPlugin, action: string, kwargs: Record<string, string> = {}): void {
  plugin.commit([{ plugin: 'whiteboard', action, payload: { args: [], kwargs, refs: [] } }]);
}

function seeded(): WhiteboardPlugin {
  const plugin = new WhiteboardPlugin();
  apply(plugin, 'whiteboard.text', { id: 'e1', text: 'Two plus two' });
  apply(plugin, 'whiteboard.math', { id: 'e2', latex: '\\frac{a}{b}' });
  apply(plugin, 'whiteboard.text', { id: 'e3', text: 'is four' });
  return plugin;
}

describe('TEST-204 / hide occludes and keeps everything', () => {
  it('leaves every element in place', () => {
    const plugin = seeded();
    const before = activeElements(plugin.document).length;

    apply(plugin, 'whiteboard.hide');

    expect(plugin.document.visible).toBe(false);
    expect(activeElements(plugin.document)).toHaveLength(before);
    expect(activeElements(plugin.document).map((e) => e.id)).toEqual(['e1', 'e2', 'e3']);
  });

  it('restores the same content on show', () => {
    const plugin = seeded();
    const before = structuredClone(plugin.document);

    apply(plugin, 'whiteboard.hide');
    apply(plugin, 'whiteboard.show');

    expect(plugin.document.visible).toBe(true);
    // Same elements, same content — only the revision moved.
    expect(activeElements(plugin.document)).toEqual(activeElements(before));
  });

  it('advances the revision, because occlusion is a committed change', () => {
    const plugin = seeded();
    const before = plugin.revision;
    apply(plugin, 'whiteboard.hide');
    expect(plugin.revision).toBe(before + 1);
  });

  it('is idempotent in content when hidden twice', () => {
    const plugin = seeded();
    apply(plugin, 'whiteboard.hide');
    apply(plugin, 'whiteboard.hide');
    expect(activeElements(plugin.document)).toHaveLength(3);
    expect(plugin.document.visible).toBe(false);
  });
});

describe('TEST-204 / clear removes and keeps nothing', () => {
  it('removes every element', () => {
    const plugin = seeded();
    apply(plugin, 'whiteboard.clear');
    expect(activeElements(plugin.document)).toEqual([]);
  });

  it('does not alter visibility, because clearing is not hiding', () => {
    const plugin = seeded();
    apply(plugin, 'whiteboard.show');
    apply(plugin, 'whiteboard.clear');
    // Still presented, and empty — the opposite combination from a hide.
    expect(plugin.document.visible).toBe(true);
    expect(activeElements(plugin.document)).toEqual([]);
  });
});

describe('TEST-204 / the two are distinguishable after the same sequence', () => {
  it('hide then clear then show leaves an empty board; hide alone does not', () => {
    // Same three commands in both runs, differing only in whether `clear` appears. A single reducer
    // with a flag has to get both of these right; two reducers get them right by construction.
    const hiddenOnly = seeded();
    apply(hiddenOnly, 'whiteboard.hide');
    apply(hiddenOnly, 'whiteboard.show');

    const hiddenThenCleared = seeded();
    apply(hiddenThenCleared, 'whiteboard.hide');
    apply(hiddenThenCleared, 'whiteboard.clear');
    apply(hiddenThenCleared, 'whiteboard.show');

    expect(activeElements(hiddenOnly.document)).toHaveLength(3);
    expect(activeElements(hiddenThenCleared.document)).toHaveLength(0);
    // And the two are only distinguishable because clear did something hide did not.
    expect(elementsOn(hiddenOnly.document, 'truth')).toHaveLength(3);
    expect(elementsOn(hiddenThenCleared.document, 'truth')).toHaveLength(0);
  });

  it('a hidden board is not an empty board', () => {
    const plugin = seeded();
    apply(plugin, 'whiteboard.hide');
    const hidden = plugin.document;

    expect(hidden.visible).toBe(false);
    expect(activeElements(hidden).length).toBeGreaterThan(0);
    // The exact confusion this test exists to prevent: reading `!visible` as `empty`.
    expect(hidden.visible === false && activeElements(hidden).length === 0).toBe(false);
  });

  it('applies hide and clear in whichever order the producer sent them', () => {
    const clearThenHide = seeded();
    apply(clearThenHide, 'whiteboard.clear');
    apply(clearThenHide, 'whiteboard.hide');
    expect(clearThenHide.document.visible).toBe(false);
    expect(activeElements(clearThenHide.document)).toEqual([]);

    const hideThenClear = seeded();
    apply(hideThenClear, 'whiteboard.hide');
    apply(hideThenClear, 'whiteboard.clear');
    expect(hideThenClear.document.visible).toBe(false);
    expect(activeElements(hideThenClear.document)).toEqual([]);
  });

  it('advances the revision once per operation, so the sequence is reconstructible', () => {
    const plugin = seeded();
    const start = plugin.revision;
    apply(plugin, 'whiteboard.hide');
    apply(plugin, 'whiteboard.show');
    apply(plugin, 'whiteboard.clear');
    expect(plugin.revision).toBe(start + 3);
  });
});

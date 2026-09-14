/**
 * TEST-205 — truth/thinking-layer isolation.
 *
 * The rule is "rough working is not material": a teacher's scribble must not appear in what a learner
 * is shown as fact. The way that rule rots is by becoming a *rendering* concern — a view that has to
 * remember to filter, and one day forgets. So the layer is a property of the element, and the reads
 * are layer-scoped, which makes a truth read unable to contain thinking content.
 *
 * Covers FR-231. Tasks T-074, T-077.
 */

import { describe, expect, it } from 'vitest';
import { elementsOn, isLayerEmpty, WhiteboardPlugin } from '../src/index.js';

function apply(plugin: WhiteboardPlugin, action: string, kwargs: Record<string, string> = {}): void {
  plugin.commit([{ plugin: 'whiteboard', action, payload: { args: [], kwargs, refs: [] } }]);
}

function boardWithBothLayers(): WhiteboardPlugin {
  const plugin = new WhiteboardPlugin();
  apply(plugin, 'whiteboard.text', { id: 'fact', text: 'Water boils at 100C' });
  apply(plugin, 'whiteboard.scribble', { id: 'work', strokes: 'maybe 90?' });
  apply(plugin, 'whiteboard.math', { id: 'formula', latex: 'H_2O' });
  return plugin;
}

describe('TEST-205 / scribble commits to the thinking layer', () => {
  it('puts a scribble on thinking and nothing else there', () => {
    const plugin = boardWithBothLayers();
    const thinking = elementsOn(plugin.document, 'thinking');
    expect(thinking.map((element) => element.id)).toEqual(['work']);
    expect(thinking[0]?.kind).toBe('scribble');
  });

  it('puts the seven truth-surface creating actions on truth', () => {
    const plugin = new WhiteboardPlugin();
    apply(plugin, 'whiteboard.text', { id: 't', text: 'x' });
    apply(plugin, 'whiteboard.math', { id: 'm', latex: 'x' });
    apply(plugin, 'whiteboard.line', { id: 'l' });
    apply(plugin, 'whiteboard.box', { id: 'b' });
    apply(plugin, 'whiteboard.arrow', { id: 'a' });
    apply(plugin, 'whiteboard.dots', { id: 'd', count: '3' });
    apply(plugin, 'whiteboard.shape', { id: 's', shape: 'circle' });
    expect(elementsOn(plugin.document, 'truth').map((element) => element.id).sort())
      .toEqual(['a', 'b', 'd', 'l', 'm', 's', 't']);
    expect(elementsOn(plugin.document, 'thinking')).toEqual([]);
  });

  it('puts marks on thinking: scribble, highlight, and count alike', () => {
    // Three thinking-surface producers, not one. The first implementation treated scribble as the
    // sole exception, which the source review caught: highlight is "a thinking-surface mark over a
    // truth-surface element", and a count is an annotation over the element it numbers.
    const plugin = new WhiteboardPlugin();
    apply(plugin, 'whiteboard.text', { id: 'target', text: 'count me' });
    apply(plugin, 'whiteboard.shape', { id: 'tri', shape: 'triangle' });
    apply(plugin, 'whiteboard.scribble', { id: 'work', points: 'rough' });
    apply(plugin, 'whiteboard.highlight', { target: 'target' });
    apply(plugin, 'whiteboard.count', { target: 'tri', what: 'corners' });

    const thinking = elementsOn(plugin.document, 'thinking');
    expect(thinking.map((element) => element.kind).sort()).toEqual(['count', 'highlight', 'scribble']);
    // And the counted/highlighted elements themselves stay on truth, unaltered.
    expect(elementsOn(plugin.document, 'truth').map((element) => element.id).sort()).toEqual(['target', 'tri']);
  });

  it('records the layer on the element, not on a view', () => {
    const plugin = boardWithBothLayers();
    for (const element of plugin.document.elements) {
      expect(['truth', 'thinking']).toContain(element.layer);
    }
  });
});

describe('TEST-205 / a truth read cannot see thinking content', () => {
  it('excludes the scribble from the truth layer', () => {
    const plugin = boardWithBothLayers();
    const truth = elementsOn(plugin.document, 'truth');
    expect(truth.map((element) => element.id)).toEqual(['fact', 'formula']);
    expect(truth.some((element) => element.id === 'work')).toBe(false);
  });

  it('excludes truth content from the thinking layer', () => {
    const plugin = boardWithBothLayers();
    const thinking = elementsOn(plugin.document, 'thinking');
    expect(thinking.some((element) => element.id === 'fact')).toBe(false);
    expect(thinking.some((element) => element.id === 'formula')).toBe(false);
  });

  it('partitions the document: every element is on exactly one layer', () => {
    const plugin = boardWithBothLayers();
    const truth = elementsOn(plugin.document, 'truth').length;
    const thinking = elementsOn(plugin.document, 'thinking').length;
    expect(truth + thinking).toBe(plugin.document.elements.length);
    expect(truth).toBe(2);
    expect(thinking).toBe(1);
  });
});

describe('TEST-205 / clearing one layer leaves the other', () => {
  it('clearing thinking keeps truth', () => {
    const plugin = boardWithBothLayers();
    apply(plugin, 'whiteboard.clear', { layer: 'thinking' });
    expect(isLayerEmpty(plugin.document, 'thinking')).toBe(true);
    expect(elementsOn(plugin.document, 'truth').map((e) => e.id)).toEqual(['fact', 'formula']);
  });

  it('clearing truth keeps thinking', () => {
    const plugin = boardWithBothLayers();
    apply(plugin, 'whiteboard.clear', { layer: 'truth' });
    expect(isLayerEmpty(plugin.document, 'truth')).toBe(true);
    expect(elementsOn(plugin.document, 'thinking').map((e) => e.id)).toEqual(['work']);
  });

  it('clearing all removes both', () => {
    const plugin = boardWithBothLayers();
    apply(plugin, 'whiteboard.clear', { layer: 'all' });
    expect(plugin.document.elements).toEqual([]);
  });

  it('treats a missing layer as all, so a bare clear still clears', () => {
    const plugin = boardWithBothLayers();
    apply(plugin, 'whiteboard.clear');
    expect(plugin.document.elements).toEqual([]);
  });

  it('does not resurrect a scribble when the thinking layer is cleared then written to again', () => {
    const plugin = boardWithBothLayers();
    apply(plugin, 'whiteboard.clear', { layer: 'thinking' });
    apply(plugin, 'whiteboard.scribble', { id: 'work2', strokes: 'try again' });
    expect(elementsOn(plugin.document, 'thinking').map((e) => e.id)).toEqual(['work2']);
    expect(elementsOn(plugin.document, 'truth')).toHaveLength(2);
  });
});

describe('TEST-205 / the count annotation is a thinking-layer mark over its target', () => {
  function withCountable(): WhiteboardPlugin {
    const plugin = new WhiteboardPlugin();
    apply(plugin, 'whiteboard.shape', { id: 'tri', shape: 'triangle' });
    apply(plugin, 'whiteboard.count', { target: 'tri', what: 'corners', from: '1', pace: '600' });
    return plugin;
  }

  it('creates a thinking-layer annotation linked to the target', () => {
    const plugin = withCountable();
    const annotation = plugin.document.elements.find((element) => element.kind === 'count');
    expect(annotation).toBeDefined();
    expect(annotation?.layer).toBe('thinking');
    expect(annotation?.attributes['target']).toBe('tri');
    // The counted element is untouched on truth.
    expect(elementsOn(plugin.document, 'truth').map((element) => element.id)).toEqual(['tri']);
  });

  it('keeps the counting parameters on the annotation', () => {
    const plugin = withCountable();
    const annotation = plugin.document.elements.find((element) => element.kind === 'count');
    expect(annotation?.attributes['what']).toBe('corners');
    expect(annotation?.attributes['from']).toBe('1');
    expect(annotation?.attributes['pace']).toBe('600');
  });

  it('is removed when the counted element is erased', () => {
    const plugin = withCountable();
    expect(elementsOn(plugin.document, 'thinking')).toHaveLength(1);
    apply(plugin, 'whiteboard.erase', { target: 'tri' });
    expect(plugin.document.elements).toEqual([]);
  });

  it('is visible to a truth read only as its absence', () => {
    const plugin = withCountable();
    expect(elementsOn(plugin.document, 'truth').some((element) => element.kind === 'count')).toBe(false);
  });

  it('does not require the optional id, and names itself from the target when absent', () => {
    const plugin = withCountable();
    const annotation = plugin.document.elements.find((element) => element.kind === 'count');
    expect(annotation?.id).toBe('count:tri');
  });

  it('honours a supplied id for the annotation group', () => {
    const plugin = new WhiteboardPlugin();
    apply(plugin, 'whiteboard.shape', { id: 'sq', shape: 'square' });
    apply(plugin, 'whiteboard.count', { target: 'sq', id: 'group-1', what: 'sides' });
    const annotation = plugin.document.elements.find((element) => element.kind === 'count');
    expect(annotation?.id).toBe('group-1');
    expect(annotation?.attributes['target']).toBe('sq');
  });

  it('counts a dots group by items', () => {
    const plugin = new WhiteboardPlugin();
    apply(plugin, 'whiteboard.dots', { id: 'd', count: '7' });
    apply(plugin, 'whiteboard.count', { target: 'd', what: 'items' });
    const annotation = plugin.document.elements.find((element) => element.kind === 'count');
    expect(annotation?.attributes['what']).toBe('items');
    expect(annotation?.attributes['target']).toBe('d');
  });
});

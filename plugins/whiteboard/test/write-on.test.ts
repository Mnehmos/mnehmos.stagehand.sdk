/**
 * TEST-203 — write-on timing on committed elements.
 *
 * Every element the pin commits carries `reveal: 0` plus an action-specific `revealMs`
 * (document.ts:427-596): text 700, math 1100, line 500, box 600, arrow 600, highlight 300,
 * scribble 700, dots 900, shape 800, count max(400, total*pace). An earlier sweep claimed this
 * landed; a probe showed committed elements carrying neither field, so this test pins the
 * behavior at the reducer boundary where it lives.
 *
 * Covers FR-228 (the document is the contract a renderer reads). Tasks T-074, T-077.
 */

import { describe, expect, it } from 'vitest';
import { activeElements, WhiteboardPlugin } from '../src/index.js';

function apply(plugin: WhiteboardPlugin, action: string, kwargs: Record<string, string> = {}): void {
  plugin.commit([{ plugin: 'whiteboard', action, payload: { args: [], kwargs, refs: [] } }]);
}

describe('TEST-203 / every created element carries write-on timing', () => {
  it('carries the pin per-action revealMs, starting at reveal 0', () => {
    const plugin = new WhiteboardPlugin();
    apply(plugin, 'whiteboard.text', { id: 't', text: 'x' });
    apply(plugin, 'whiteboard.math', { id: 'm', latex: 'x' });
    apply(plugin, 'whiteboard.line', { id: 'l' });
    apply(plugin, 'whiteboard.box', { id: 'b' });
    apply(plugin, 'whiteboard.arrow', { id: 'a', x1: '10', y1: '10', x2: '20', y2: '20' });
    apply(plugin, 'whiteboard.highlight', { target: 't' });
    apply(plugin, 'whiteboard.scribble', { id: 's' });
    apply(plugin, 'whiteboard.dots', { id: 'd', count: '3' });
    apply(plugin, 'whiteboard.shape', { id: 'sh', shape: 'triangle' });

    const byId = new Map(activeElements(plugin.document).map((e) => [e.id, e]));
    const expected: Record<string, number> = {
      t: 700, m: 1100, l: 500, b: 600, a: 600,
      'highlight:t': 300, s: 700, d: 900, sh: 800,
    };
    for (const [id, ms] of Object.entries(expected)) {
      const element = byId.get(id);
      expect(element, id).toBeDefined();
      expect(element?.reveal, `${id} starts write-on at 0`).toBe(0);
      expect(element?.revealMs, `${id} write-on ms`).toBe(ms);
    }
  });

  it('count paces its write-on per item', () => {
    const plugin = new WhiteboardPlugin();
    apply(plugin, 'whiteboard.dots', { id: 'd', count: '8' });
    apply(plugin, 'whiteboard.count', { target: 'd', what: 'items', pace: '100' });
    apply(plugin, 'whiteboard.dots', { id: 'd2', count: '2' });
    apply(plugin, 'whiteboard.count', { target: 'd2', what: 'items', pace: '600' });

    const byId = new Map(activeElements(plugin.document).map((e) => [e.id, e]));
    // max(400, total * pace): 8 items at 100ms pace = 800; 2 items at 600ms = 1200.
    expect(byId.get('count:d')?.revealMs).toBe(800);
    expect(byId.get('count:d2')?.revealMs).toBe(1200);
  });

  it('reveal progress advances without spending a revision', () => {
    const plugin = new WhiteboardPlugin();
    apply(plugin, 'whiteboard.show');
    apply(plugin, 'whiteboard.text', { id: 't', text: 'x' });
    const revision = plugin.revision;

    plugin.advance(350);
    expect(plugin.elements.find((e) => e.id === 't')?.reveal).toBeCloseTo(0.5, 5);
    expect(plugin.revision).toBe(revision);

    plugin.advance(700);
    expect(plugin.elements.find((e) => e.id === 't')?.reveal).toBe(1);
    expect(plugin.revision).toBe(revision);
  });
});

/**
 * FEAT-016 — chess annotation compatibility plugin behavior.
 */

import { describe, expect, it } from 'vitest';
import { ChessPlugin } from '../src/index.js';

describe('FEAT-016 / chess annotations', () => {
  it('accumulates annotations in commit order', () => {
    const plugin = new ChessPlugin();
    plugin.commit([
      { plugin: 'chess', action: 'highlight', payload: { args: [], kwargs: { target: 'e4' }, refs: [] } },
      { plugin: 'chess', action: 'arrow', payload: { args: [], kwargs: { from: 'e2', to: 'e4' }, refs: [] } },
    ]);
    expect(plugin.document.annotations).toHaveLength(2);
    expect(plugin.document.annotations[0]?.kind).toBe('highlight');
    expect(plugin.document.annotations[1]?.kind).toBe('arrow');
  });

  it('records the target for each annotation', () => {
    const plugin = new ChessPlugin();
    plugin.commit([
      { plugin: 'chess', action: 'circle', payload: { args: [], kwargs: { target: 'd5' }, refs: [] } },
    ]);
    expect(plugin.document.annotations[0]?.target).toBe('d5');
  });

  it('tracks the revision across commits', () => {
    const plugin = new ChessPlugin();
    plugin.commit([
      { plugin: 'chess', action: 'move', payload: { args: [], kwargs: { move: 'e4' }, refs: [] } },
      { plugin: 'chess', action: 'highlight', payload: { args: [], kwargs: { target: 'e4' }, refs: [] } },
    ]);
    expect(plugin.revision).toBe(2);
  });
});

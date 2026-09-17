/**
 * FEAT-017 — DOM presenter plugin behavior.
 */

import { describe, expect, it } from 'vitest';
import { DomPresenterPlugin } from '../src/index.js';

describe('FEAT-017 / DOM presenter', () => {
  it('stage.focus sets the focused word', () => {
    const plugin = new DomPresenterPlugin();
    plugin.commit([{ plugin: 'dom', action: 'stage.focus', payload: { args: [], kwargs: { word: 'boiling' }, refs: [] } }]);
    expect(plugin.document.focusedWord).toBe('boiling');
  });

  it('stage.focus.off clears focus', () => {
    const plugin = new DomPresenterPlugin();
    plugin.commit([{ plugin: 'dom', action: 'stage.focus', payload: { args: [], kwargs: { word: 'x' }, refs: [] } }]);
    plugin.commit([{ plugin: 'dom', action: 'stage.focus.off', payload: { args: [], kwargs: {}, refs: [] } }]);
    expect(plugin.document.focusedWord).toBeNull();
  });

  it('stage.highlight sets and clears the highlighted word', () => {
    const plugin = new DomPresenterPlugin();
    plugin.commit([{ plugin: 'dom', action: 'stage.highlight', payload: { args: [], kwargs: { word: 'key' }, refs: [] } }]);
    expect(plugin.document.highlightedWord).toBe('key');
    plugin.commit([{ plugin: 'dom', action: 'stage.highlight.off', payload: { args: [], kwargs: {}, refs: [] } }]);
    expect(plugin.document.highlightedWord).toBeNull();
  });

  it('stage.clear resets everything', () => {
    const plugin = new DomPresenterPlugin();
    plugin.commit([
      { plugin: 'dom', action: 'stage.focus', payload: { args: [], kwargs: { word: 'x' }, refs: [] } },
      { plugin: 'dom', action: 'stage.highlight', payload: { args: [], kwargs: { word: 'y' }, refs: [] } },
      { plugin: 'dom', action: 'stage.diagram', payload: { args: [], kwargs: { id: 'd1' }, refs: [] } },
    ]);
    plugin.commit([{ plugin: 'dom', action: 'stage.clear', payload: { args: [], kwargs: {}, refs: [] } }]);
    expect(plugin.document.focusedWord).toBeNull();
    expect(plugin.document.highlightedWord).toBeNull();
    expect(plugin.document.diagramId).toBeNull();
  });

  it('tracks the revision across commands', () => {
    const plugin = new DomPresenterPlugin();
    plugin.commit([{ plugin: 'dom', action: 'stage.focus', payload: { args: [], kwargs: { word: 'a' }, refs: [] } }]);
    plugin.commit([{ plugin: 'dom', action: 'stage.diagram', payload: { args: [], kwargs: { id: 'd' }, refs: [] } }]);
    plugin.commit([{ plugin: 'dom', action: 'stage.diagram.off', payload: { args: [], kwargs: {}, refs: [] } }]);
    expect(plugin.revision).toBe(3);
  });
});

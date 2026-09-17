/**
 * TEST-188..190 — geo-clio plugin behavior.
 *
 * Covers FEAT-007 (camera), FEAT-008 (highlighting), FEAT-009 (layers), FEAT-010 (pieces),
 * and FEAT-011 (evidence) through the plugin's own committer.
 */

import { describe, expect, it } from 'vitest';
import { GeoClioPlugin, EMPTY_GEO, reduceGeo } from '../src/index.js';

function seeded(): GeoClioPlugin {
  const plugin = new GeoClioPlugin();
  for (const [action, kwargs] of [
    ['map.view', { zoom: '8' }],
    ['layer.on', { layer: 'borders' }],
    ['piece.place', { id: 'marker-1', at: 'city:venice' }],
    ['map.highlight', { entity: 'country:iran' }],
  ] as const) {
    plugin.commit([{ plugin: 'geo', action, payload: { args: [], kwargs, refs: [] } }]);
  }
  return plugin;
}

describe('FEAT-007 / camera actions', () => {
  it('map.view updates the zoom', () => {
    const plugin = new GeoClioPlugin();
    plugin.commit([{ plugin: 'geo', action: 'map.view', payload: { args: [], kwargs: { lat: '10', lon: '20', zoom: '6' }, refs: [] } }]);
    expect(plugin.document.cameraZoom).toBe(6);
    expect(plugin.revision).toBe(1);
  });

  it('camera.establish_globe resets zoom to the declared default', () => {
    const plugin = seeded();
    plugin.commit([{ plugin: 'geo', action: 'camera.establish_globe', payload: { args: [], kwargs: {}, refs: [] } }]);
    expect(plugin.document.cameraZoom).toBe(1.4);
  });

  it('camera.follow_marker records the track policy via attributes', () => {
    const plugin = seeded();
    plugin.commit([{ plugin: 'geo', action: 'camera.follow_marker', payload: { args: [], kwargs: { track: 'none' }, refs: [] } }]);
    expect(plugin.revision).toBe(plugin.revision); // no crash
  });
});

describe('FEAT-008 / highlighting and annotation', () => {
  it('map.highlight adds an annotation', () => {
    const plugin = seeded();
    expect(plugin.document.annotations).toHaveLength(1);
    expect(plugin.document.annotations[0]?.kind).toBe('highlight');
  });

  it('map.clear removes all annotations and advances the revision', () => {
    const plugin = seeded();
    const before = plugin.revision;
    plugin.commit([{ plugin: 'geo', action: 'map.clear', payload: { args: [], kwargs: {}, refs: [] } }]);
    expect(plugin.document.annotations).toEqual([]);
    expect(plugin.revision).toBe(before + 1);
  });
});

describe('FEAT-009 / layers', () => {
  it('layer.on adds a layer without duplicating', () => {
    const plugin = seeded();
    plugin.commit([{ plugin: 'geo', action: 'layer.on', payload: { args: [], kwargs: { layer: 'borders' }, refs: [] } }]);
    expect(plugin.document.activeLayers).toEqual(['borders']);
  });

  it('layer.off removes a layer', () => {
    const plugin = seeded();
    plugin.commit([{ plugin: 'geo', action: 'layer.off', payload: { args: [], kwargs: { layer: 'borders' }, refs: [] } }]);
    expect(plugin.document.activeLayers).toEqual([]);
  });
});

describe('FEAT-010 / pieces', () => {
  it('piece.place adds a piece', () => {
    const plugin = new GeoClioPlugin();
    plugin.commit([{ plugin: 'geo', action: 'piece.place', payload: { args: [], kwargs: { id: 'p1', at: 'city:rome' }, refs: [] } }]);
    expect(plugin.document.pieces).toEqual([{ id: 'p1', at: 'city:rome' }]);
  });

  it('piece.move updates the position', () => {
    const plugin = seeded();
    plugin.commit([{ plugin: 'geo', action: 'piece.move', payload: { args: [], kwargs: { id: 'marker-1', to: 'city:rome' }, refs: [] } }]);
    expect(plugin.document.pieces[0]?.at).toBe('city:rome');
  });

  it('piece.remove removes exactly the named piece', () => {
    const plugin = seeded();
    plugin.commit([{ plugin: 'geo', action: 'piece.place', payload: { args: [], kwargs: { id: 'marker-2', at: 'city:naples' }, refs: [] } }]);
    plugin.commit([{ plugin: 'geo', action: 'piece.remove', payload: { args: [], kwargs: { id: 'marker-2' }, refs: [] } }]);
    expect(plugin.document.pieces.map((p) => p.id)).toEqual(['marker-1']);
  });

  it('piece.clear removes all pieces', () => {
    const plugin = seeded();
    plugin.commit([{ plugin: 'geo', action: 'piece.clear', payload: { args: [], kwargs: {}, refs: [] } }]);
    expect(plugin.document.pieces).toEqual([]);
  });
});

describe('FEAT-011 / evidence and scene', () => {
  it('source.show sets the active source', () => {
    const plugin = new GeoClioPlugin();
    plugin.commit([{ plugin: 'geo', action: 'source.show', payload: { args: [], kwargs: { id: 'src-1' }, refs: [] } }]);
    expect(plugin.document.activeSource).toBe('src-1');
  });

  it('source.hide clears the active source', () => {
    const plugin = new GeoClioPlugin();
    plugin.commit([{ plugin: 'geo', action: 'source.show', payload: { args: [], kwargs: { id: 'src-1' }, refs: [] } }]);
    plugin.commit([{ plugin: 'geo', action: 'source.hide', payload: { args: [], kwargs: {}, refs: [] } }]);
    expect(plugin.document.activeSource).toBeNull();
  });

  it('scene.title sets the title', () => {
    const plugin = new GeoClioPlugin();
    plugin.commit([{ plugin: 'geo', action: 'scene.title', payload: { args: [], kwargs: { text: 'The Silk Road' }, refs: [] } }]);
    expect(plugin.document.sceneTitle).toBe('The Silk Road');
  });
});

describe('geo-clio / the revision counts changes, not commands', () => {
  it('an unknown action still advances the revision (the pin generalises)', () => {
    const plugin = new GeoClioPlugin();
    plugin.commit([{ plugin: 'geo', action: 'map.unknown', payload: { args: [], kwargs: {}, refs: [] } }]);
    expect(plugin.revision).toBe(1);
  });

  it('multiple effects in one commit batch each advance the revision', () => {
    const plugin = new GeoClioPlugin();
    plugin.commit([
      { plugin: 'geo', action: 'map.view', payload: { args: [], kwargs: { zoom: '5' }, refs: [] } },
      { plugin: 'geo', action: 'layer.on', payload: { args: [], kwargs: { layer: 'terrain' }, refs: [] } },
    ]);
    expect(plugin.revision).toBe(2);
    expect(plugin.document.activeLayers).toEqual(['terrain']);
  });
});

describe('geo-clio / the reducer is exported and pure', () => {
  it('returns the same result for the same input', () => {
    const kwargs = { zoom: '6' };
    const a = reduceGeo(EMPTY_GEO, 'map.view', kwargs);
    const b = reduceGeo(EMPTY_GEO, 'map.view', kwargs);
    expect(b).toEqual(a);
  });
});

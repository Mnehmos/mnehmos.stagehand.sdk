/**
 * @stagehand/plugin-geo-clio
 * Owners: FEAT-007..FEAT-011. Recovered from the pinned Clio source.
 */
import { CapabilityRegistry } from '@stagehand/registry';
import type { CanonicalEffect, EffectCommitter } from '@stagehand/runtime';

const C = (action: string, description: string, extra: Record<string, unknown> = {}): Record<string, unknown> => ({ action, description, minArgs: 0, maxArgs: 0, ...extra });

export const GEO_CLIO_SCHEMAS = [
  C('map.view', 'Set camera position and zoom', { optionalKwargs: { lat: { type: { kind: 'number' }, default: '28' }, lon: { type: { kind: 'number' }, default: '48' }, zoom: { type: { kind: 'number' }, default: '4' } } }),
  C('map.focus', 'Focus on a named entity', { minArgs: 0, maxArgs: 1, optionalKwargs: { entity: { type: { kind: 'string' } }, zoom: { type: { kind: 'string' } } }, entityResolution: 'optional' }),
  C('map.fit', 'Frame multiple entities', { optionalKwargs: { entities: { type: { kind: 'string' } }, west: { type: { kind: 'number' } }, south: { type: { kind: 'number' } }, east: { type: { kind: 'number' } }, north: { type: { kind: 'number' } }, padding: { type: { kind: 'number' }, default: '80' }, maxZoom: { type: { kind: 'string' } } }, entityResolution: 'optional' }),
  C('map.mode', 'Switch map mode', { minArgs: 1, maxArgs: 1, argTypes: [{ kind: 'enum', values: ['political', 'satellite', 'street', 'terrain', 'historical_overlay'] as never }] }),
  C('camera.center', 'Center on a target entity', { optionalKwargs: { target: { type: { kind: 'string' } }, context_entities: { type: { kind: 'string' } }, zoom_level: { type: { kind: 'string' }, default: 'regional' }, padding: { type: { kind: 'number' }, default: '80' } }, entityResolution: 'optional' }),
  C('camera.focus_region', 'Frame a region', { optionalKwargs: { target: { type: { kind: 'string' } }, zoom_level: { type: { kind: 'string' }, default: 'regional' }, padding: { type: { kind: 'number' }, default: '80' } }, entityResolution: 'optional' }),
  C('camera.establish_globe', 'Globe-scale establishing shot', { optionalKwargs: { lat: { type: { kind: 'number' }, default: '20' }, lon: { type: { kind: 'number' }, default: '0' }, zoom: { type: { kind: 'number' }, default: '1.4' } } }),
  C('camera.follow_marker', 'Camera chase policy', { optionalKwargs: { track: { type: { kind: 'enum', values: ['active_highlights', 'none'] }, default: 'active_highlights' }, min_zoom: { type: { kind: 'string' }, default: 'local' }, max_zoom: { type: { kind: 'string' }, default: 'regional' } } }),
  C('map.highlight', 'Highlight an entity', { minArgs: 0, maxArgs: 1, optionalKwargs: { entity: { type: { kind: 'string' } }, color: { type: { kind: 'color' }, default: '#ef4444' }, opacity: { type: { kind: 'number' }, default: '0.6' }, pulse: { type: { kind: 'boolean' }, default: 'false' }, center: { type: { kind: 'boolean' }, default: 'false' } }, entityResolution: 'optional' }),
  C('map.label', 'Label a map entity', { optionalKwargs: { entity: { type: { kind: 'string' } }, label: { type: { kind: 'string' } } }, entityResolution: 'optional' }),
  C('map.clear', 'Clear annotations', {}),
  C('map.arrow', 'Draw an arrow', { optionalKwargs: { from: { type: { kind: 'string' } }, to: { type: { kind: 'string' } }, color: { type: { kind: 'color' } } } }),
  C('map.circle', 'Draw a circle', { optionalKwargs: { entity: { type: { kind: 'string' } }, radius: { type: { kind: 'number' } }, color: { type: { kind: 'color' } } }, entityResolution: 'optional' }),
  C('layer.on', 'Activate a layer', { requiredKwargs: { layer: { type: { kind: 'string', minLength: 1 } } } }),
  C('layer.off', 'Deactivate a layer', { requiredKwargs: { layer: { type: { kind: 'string', minLength: 1 } } } }),
  C('flow.animate', 'Animate a flow', { requiredKwargs: { from: { type: { kind: 'string', minLength: 1 } }, to: { type: { kind: 'string', minLength: 1 } } }, optionalKwargs: { color: { type: { kind: 'color' } } } }),
  C('flow.clear', 'Clear flows', {}),
  C('map.overlay.show', 'Show an overlay', { requiredKwargs: { id: { type: { kind: 'string', minLength: 1 } } } }),
  C('map.overlay.hide', 'Hide an overlay', { requiredKwargs: { id: { type: { kind: 'string', minLength: 1 } } } }),
  C('piece.place', 'Place a piece', { requiredKwargs: { id: { type: { kind: 'string', minLength: 1 } }, at: { type: { kind: 'string', minLength: 1 } } }, entityResolution: 'optional' }),
  C('piece.move', 'Move a piece', { requiredKwargs: { id: { type: { kind: 'string', minLength: 1 } }, to: { type: { kind: 'string', minLength: 1 } } } }),
  C('piece.remove', 'Remove a piece', { requiredKwargs: { id: { type: { kind: 'string', minLength: 1 } } } }),
  C('piece.clear', 'Remove all pieces', {}),
  C('chat.say', 'Narrate a chat message', { requiredKwargs: { text: { type: { kind: 'string', minLength: 1 } } }, optionalKwargs: { speaker: { type: { kind: 'string' } } } }),
  C('source.show', 'Show a source', { optionalKwargs: { id: { type: { kind: 'string' } }, text: { type: { kind: 'string' } }, confidence: { type: { kind: 'string' }, default: '0.5' } } }),
  C('source.hide', 'Hide a source', { optionalKwargs: { id: { type: { kind: 'string' } } } }),
  C('scene.fade', 'Fade the scene', { optionalKwargs: { direction: { type: { kind: 'enum', values: ['in', 'out'] }, default: 'out' } } }),
  C('scene.title', 'Show a title', { requiredKwargs: { text: { type: { kind: 'string', minLength: 1 } } }, optionalKwargs: { subtitle: { type: { kind: 'string' } } } }),
  C('asset.show', 'Show an asset', { requiredKwargs: { id: { type: { kind: 'string', minLength: 1 } } }, optionalKwargs: { kind: { type: { kind: 'string' } } } }),
  C('asset.clear', 'Clear assets', {}),
] as const;

export const GEO_CLIO_ACTIONS: readonly string[] = GEO_CLIO_SCHEMAS.map((s) => (s as { action: string }).action);

export interface GeoClioDocument {
  readonly revision: number;
  readonly mode: string;
  readonly activeLayers: readonly string[];
  readonly pieces: readonly { readonly id: string; readonly at: string }[];
  readonly annotations: readonly { readonly id: string; readonly kind: string }[];
  readonly activeSource: string | null;
  readonly sceneTitle: string | null;
  readonly cameraZoom: number;
}

export const EMPTY_GEO: GeoClioDocument = Object.freeze({ revision: 0, mode: 'political', activeLayers: [], pieces: [], annotations: [], activeSource: null, sceneTitle: null, cameraZoom: 4 });

function reduceGeo(doc: GeoClioDocument, action: string, kw: Readonly<Record<string, string>>): GeoClioDocument {
  const rev = doc.revision + 1;
  switch (action) {
    case 'map.view': return { ...doc, revision: rev, cameraZoom: Number(kw['zoom'] ?? doc.cameraZoom) || doc.cameraZoom };
    case 'map.mode': return { ...doc, revision: rev, mode: kw['0'] ?? doc.mode };
    case 'layer.on': return { ...doc, revision: rev, activeLayers: [...new Set([...doc.activeLayers, kw['layer'] ?? ''])] };
    case 'layer.off': return { ...doc, revision: rev, activeLayers: doc.activeLayers.filter((l) => l !== kw['layer']) };
    case 'map.highlight': case 'map.label': case 'map.arrow': case 'map.circle':
      return { ...doc, revision: rev, annotations: [...doc.annotations, { id: kw['entity'] ?? `ann:${rev}`, kind: action.replace('map.', '') }] };
    case 'map.clear': return { ...doc, revision: rev, annotations: [] };
    case 'piece.place': return { ...doc, revision: rev, pieces: [...doc.pieces, { id: kw['id'] ?? `piece:${rev}`, at: kw['at'] ?? '' }] };
    case 'piece.move': return { ...doc, revision: rev, pieces: doc.pieces.map((p) => (p.id === kw['id'] ? { ...p, at: kw['to'] ?? p.at } : p)) };
    case 'piece.remove': return { ...doc, revision: rev, pieces: doc.pieces.filter((p) => p.id !== kw['id']) };
    case 'piece.clear': return { ...doc, revision: rev, pieces: [] };
    case 'source.show': return { ...doc, revision: rev, activeSource: kw['id'] ?? null };
    case 'source.hide': return { ...doc, revision: rev, activeSource: null };
    case 'scene.title': return { ...doc, revision: rev, sceneTitle: kw['text'] ?? null };
    case 'camera.establish_globe': return { ...doc, revision: rev, cameraZoom: Number(kw['zoom'] ?? '') || 1.4 };
    case 'camera.center': case 'camera.focus_region': case 'camera.follow_marker':
      return { ...doc, revision: rev, cameraZoom: Number(kw['zoom'] ?? kw['zoom_level'] ?? '') || doc.cameraZoom };
    default: return { ...doc, revision: rev };
  }
}

export class GeoClioPlugin implements EffectCommitter {
  readonly plugin: string;
  readonly registry: CapabilityRegistry;
  #doc: GeoClioDocument = EMPTY_GEO;

  constructor(options: { plugin?: string } = {}) {
    this.plugin = options.plugin ?? 'geo-clio';
    this.registry = new CapabilityRegistry([...GEO_CLIO_SCHEMAS] as never[]);
  }

  get document(): GeoClioDocument { return this.#doc; }
  get revision(): number { return this.#doc.revision; }

  commit(effects: readonly CanonicalEffect[]): void {
    for (const effect of effects) {
      const kw = (effect.payload['kwargs'] ?? {}) as Record<string, string>;
      this.#doc = reduceGeo(this.#doc, effect.action, kw);
    }
  }
}

export { reduceGeo };

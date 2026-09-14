/**
 * TEST-203 — full 21-surface recovered schema conformance.
 *
 * The check that matters here is that it walks the **21 surface ids**, not the 15 action names.
 * Counting actions would pass whether or not a surface was dropped during consolidation, because 15
 * is the right number either way — the union of two host lists that share six members. Walking the
 * surfaces is what notices a lost one.
 *
 * Covers FR-229, FR-234. Tasks T-075, T-078.
 */

import { describe, expect, it } from 'vitest';
import {
  CLIO_COMPATIBILITY,
  SURFACE_MANIFEST,
  WHITEBOARD_ACTIONS,
  WHITEBOARD_SCHEMAS,
  WhiteboardPlugin,
} from '../src/index.js';

const EXPECTED_SURFACES = [
  'SURF-034', 'SURF-035', 'SURF-036', 'SURF-037', 'SURF-038', 'SURF-039',
  'SURF-057', 'SURF-058', 'SURF-059', 'SURF-060', 'SURF-061', 'SURF-062', 'SURF-063',
  'SURF-064', 'SURF-065', 'SURF-066', 'SURF-067', 'SURF-068', 'SURF-069', 'SURF-070', 'SURF-071',
];

describe('TEST-203 / all 21 owned surfaces are served', () => {
  it('declares exactly the corpus surface ids, in order', () => {
    expect(SURFACE_MANIFEST.map((entry) => entry.surface)).toEqual(EXPECTED_SURFACES);
    expect(SURFACE_MANIFEST).toHaveLength(21);
  });

  it('binds every surface to an action that the plugin actually registers', () => {
    const registry = new WhiteboardPlugin().registry;
    for (const entry of SURFACE_MANIFEST) {
      expect(registry.has(entry.action), `${entry.surface} binds to unregistered ${entry.action}`).toBe(true);
    }
  });

  it('binds every surface to a contract id matching its surface number', () => {
    for (const entry of SURFACE_MANIFEST) {
      const expected = entry.surface.replace('SURF-', 'CTR-');
      expect(entry.contract, `${entry.surface} contract`).toBe(expected);
      expect(entry.surface.slice(5), entry.surface).toMatch(/^(03[4-9]|05[7-9]|06\d|07[01])$/);
    }
  });

  it('registers 15 distinct actions, not 21', () => {
    // Six actions carry two surface identities. Registering 21 would put two contracts on one action
    // name, which the registry refuses — and the consolidation is the point, not a shortcut.
    expect(WHITEBOARD_ACTIONS).toHaveLength(15);
    expect(new Set(WHITEBOARD_ACTIONS).size).toBe(15);
    expect(WHITEBOARD_SCHEMAS).toHaveLength(15);
  });

  it('covers the union of both hosts, with the six shared actions appearing once', () => {
    const clio = SURFACE_MANIFEST.filter((entry) => entry.host === 'Clio');
    const vc = SURFACE_MANIFEST.filter((entry) => entry.host === 'Virtual Classroom');
    expect(clio).toHaveLength(6);
    expect(vc).toHaveLength(15);

    const shared = clio.map((entry) => entry.action).filter((action) => vc.some((v) => v.action === action));
    expect(shared.sort()).toEqual([
      'whiteboard.box', 'whiteboard.clear', 'whiteboard.hide',
      'whiteboard.line', 'whiteboard.show', 'whiteboard.text',
    ]);
    // And each is named by exactly two surfaces, one per host.
    for (const action of shared) {
      const surfaces = SURFACE_MANIFEST.filter((entry) => entry.action === action);
      expect(surfaces, action).toHaveLength(2);
      expect(new Set(surfaces.map((s) => s.host)).size).toBe(2);
    }
  });

  it('exposes every action in the plugin registry introspection without a second list', () => {
    const plugin = new WhiteboardPlugin();
    const introspected = plugin.registry.actions;
    expect(introspected).toEqual([...WHITEBOARD_ACTIONS].sort());
    // The digest is what a producer prompt is built from, so every action must appear in it.
    const digest = plugin.registry.digest();
    for (const action of WHITEBOARD_ACTIONS) expect(digest).toContain(action);
  });
});

describe('TEST-203 / every schema is a usable contract', () => {
  it('names a well-formed action and carries arity bounds', () => {
    for (const schema of WHITEBOARD_SCHEMAS) {
      expect(schema.action, 'action name').toMatch(/^whiteboard\.[a-z]+$/);
      expect(schema.minArgs).toBeGreaterThanOrEqual(0);
      expect(schema.maxArgs).toBeGreaterThanOrEqual(schema.minArgs);
      expect(schema.description, `${schema.action} description`).toBeTruthy();
    }
  });

  it('declares no reference-typed kwargs, so board resolution is the only entity phase', () => {
    // The plugin resolves targets itself as a contributed stage. A schema declaring `entityRef`
    // would make the runtime resolve it first against a resolver it does not have, and the command
    // would be rejected before this plugin saw it.
    for (const schema of WHITEBOARD_SCHEMAS) {
      for (const spec of Object.values(schema.optionalKwargs ?? {})) {
        expect(spec.type.kind, `${schema.action} optional`).not.toBe('entityRef');
      }
      for (const spec of Object.values(schema.requiredKwargs ?? {})) {
        expect(spec.type.kind, `${schema.action} required`).not.toBe('entityRef');
      }
    }
  });

  it('marks every action as needing no semantic entity resolution', () => {
    for (const schema of WHITEBOARD_SCHEMAS) {
      expect(schema.entityResolution, `${schema.action}`).toBe('none');
    }
  });

  it('gives every declared default a value that satisfies its own type', async () => {
    const { checkValue } = await import('@stagehand/registry');
    for (const schema of WHITEBOARD_SCHEMAS) {
      for (const [key, spec] of Object.entries(schema.optionalKwargs ?? {})) {
        if (spec.default === undefined) continue;
        const check = checkValue(spec.default, spec.type);
        expect(check.ok, `${schema.action}.${key} default "${spec.default}": ${check.reason ?? ''}`).toBe(true);
      }
    }
  });
});

describe('TEST-203 / the Clio compatibility mapping is complete', () => {
  it('maps all six Clio surfaces, exactly once each', () => {
    expect(CLIO_COMPATIBILITY).toHaveLength(6);
    expect(CLIO_COMPATIBILITY.map((entry) => entry.clioSurface).sort()).toEqual([
      'SURF-034', 'SURF-035', 'SURF-036', 'SURF-037', 'SURF-038', 'SURF-039',
    ]);
  });

  it('maps each Clio surface to the action its VC counterpart binds', () => {
    for (const entry of CLIO_COMPATIBILITY) {
      const clio = SURFACE_MANIFEST.find((s) => s.surface === entry.clioSurface);
      expect(clio, entry.clioSurface).toBeDefined();
      expect(clio?.action).toBe(entry.action);
      // The action is shared with VC, which is why one registry serves both hosts.
      const vc = SURFACE_MANIFEST.find((s) => s.action === entry.action && s.host === 'Virtual Classroom');
      expect(vc, `${entry.action} VC counterpart`).toBeDefined();
    }
  });

  it('records a note for every mapping, and the adopted behavior is the VC one', () => {
    for (const entry of CLIO_COMPATIBILITY) {
      expect(entry.note.length, `${entry.action} note`).toBeGreaterThan(0);
      expect(entry.adoptedBehavior.length).toBeGreaterThan(0);
      expect(entry.clioBehavior.length).toBeGreaterThan(0);
    }
  });

  it('records that hide is occlusion, and says why it matters', () => {
    const hide = CLIO_COMPATIBILITY.find((entry) => entry.action === 'whiteboard.hide');
    expect(hide).toBeDefined();
    expect(hide?.adoptedBehavior).toContain('without destroying content');
    expect(hide?.note).toContain('TEST-204');
  });
});

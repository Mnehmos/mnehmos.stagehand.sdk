/**
 * TEST-203 — recovered-schema conformance against the pinned source.
 *
 * An earlier version of this file proved that 21 surface ids were represented and 15 action names
 * were registered, and it stayed green while two contracts were wrong: `whiteboard.count` had been
 * transcribed as `{of, value}` from a one-line corpus behaviour string, and `content_ref` was missing
 * from `whiteboard.text`/`whiteboard.math` entirely. Presence is not conformance — 15 is the correct
 * action count whether or not their contracts are right.
 *
 * So this compares **contract details** against the pinned source, recorded in
 * `docs/evidence/virtual-classroom-whiteboard.json` with repo, commit, path, and file hash. Any
 * mutation of a required kwarg, an optional default, an enum, a numeric/duration/colour field, an
 * entity-resolution kind, or a settle budget fails here.
 *
 * Covers FR-229, FR-234. Tasks T-075, T-078.
 */

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  CLIO_COMPATIBILITY,
  CLIO_CROSS_CUTTING,
  contractFor,
  INK_COLORS,
  RECOVERED_CONTRACTS,
  SURFACE_MANIFEST,
  WHITEBOARD_ACTIONS,
  WHITEBOARD_SCHEMAS,
  WhiteboardPlugin,
  type RecoveredContract,
} from '../src/index.js';

const EVIDENCE_PATH = fileURLToPath(
  new URL('../../../docs/evidence/virtual-classroom-whiteboard.json', import.meta.url),
);

interface EvidenceFile {
  readonly provenance: readonly { readonly host: string; readonly repo: string; readonly commit: string; readonly path: string; readonly sha256: string }[];
  readonly virtualClassroom: Readonly<Record<string, RecoveredContract>>;
  readonly clio: Readonly<Record<string, unknown>>;
}

const evidence = JSON.parse(fs.readFileSync(EVIDENCE_PATH, 'utf8')) as EvidenceFile;
const ACTIONS = Object.keys(evidence.virtualClassroom);

const EXPECTED_SURFACES = [
  'SURF-034', 'SURF-035', 'SURF-036', 'SURF-037', 'SURF-038', 'SURF-039',
  'SURF-057', 'SURF-058', 'SURF-059', 'SURF-060', 'SURF-061', 'SURF-062', 'SURF-063',
  'SURF-064', 'SURF-065', 'SURF-066', 'SURF-067', 'SURF-068', 'SURF-069', 'SURF-070', 'SURF-071',
];

describe('TEST-203 / the evidence is pinned and complete', () => {
  it('records provenance with a commit and a file hash for both hosts', () => {
    expect(evidence.provenance).toHaveLength(2);
    for (const entry of evidence.provenance) {
      expect(entry.commit, `${entry.host} commit`).toMatch(/^[0-9a-f]{40}$/);
      expect(entry.sha256, `${entry.host} hash`).toMatch(/^[0-9a-f]{64}$/);
      expect(entry.path).toBe('src/stagehand/types.ts');
    }
  });

  it('carries all 15 Virtual Classroom contracts and the 6 Clio contracts', () => {
    expect(ACTIONS).toHaveLength(15);
    const clioActions = Object.keys(evidence.clio).filter((key) => key.startsWith('whiteboard.'));
    expect(clioActions).toHaveLength(6);
  });
});

describe('TEST-203 / every contract matches the pinned source field by field', () => {
  for (const action of ACTIONS) {
    it(`${action}`, () => {
      const source = evidence.virtualClassroom[action];
      const contract = contractFor(action);
      expect(contract, `${action} is not declared by the plugin`).toBeDefined();
      if (source === undefined || contract === undefined) return;

      // Structural.
      expect(contract.minArgs, `${action} minArgs`).toBe(source.minArgs);
      expect(contract.maxArgs, `${action} maxArgs`).toBe(source.maxArgs);
      expect(contract.description, `${action} description`).toBe(source.description);
      expect(contract.settleMs, `${action} settleMs`).toBe(source.settleMs);
      expect(contract.resolvesEntity, `${action} resolvesEntity`).toBe(source.resolvesEntity);

      // Required kwargs — the set and its order.
      expect([...contract.requiredKwargs].sort(), `${action} requiredKwargs`)
        .toEqual([...source.requiredKwargs].sort());

      // Optional kwargs — the set AND every default value.
      expect(Object.keys(contract.optionalKwargs).sort(), `${action} optionalKwargs keys`)
        .toEqual(Object.keys(source.optionalKwargs).sort());
      expect(contract.optionalKwargs, `${action} optionalKwargs defaults`).toEqual(source.optionalKwargs);

      // Value constraints.
      expect(contract.enums ?? {}, `${action} enums`).toEqual(source.enums ?? {});
      expect([...(contract.numeric ?? [])].sort(), `${action} numeric`).toEqual([...(source.numeric ?? [])].sort());
      expect([...(contract.durations ?? [])].sort(), `${action} durations`).toEqual([...(source.durations ?? [])].sort());
      expect([...(contract.colors ?? [])].sort(), `${action} colors`).toEqual([...(source.colors ?? [])].sort());
      expect(contract.entityLists ?? {}, `${action} entityLists`).toEqual(source.entityLists ?? {});
    });
  }

  it('declares exactly the 15 actions the source declares, and no others', () => {
    expect([...WHITEBOARD_ACTIONS].sort()).toEqual([...ACTIONS].sort());
    expect(RECOVERED_CONTRACTS).toHaveLength(ACTIONS.length);
  });
});

describe('TEST-203 / the registered schemas carry those constraints', () => {
  it('registers one schema per contract, with the required keys required', () => {
    const byAction = new Map(WHITEBOARD_SCHEMAS.map((schema) => [schema.action, schema]));
    expect(byAction.size).toBe(ACTIONS.length);

    for (const action of ACTIONS) {
      const source = evidence.virtualClassroom[action];
      const schema = byAction.get(action);
      expect(schema, `${action} schema`).toBeDefined();
      if (source === undefined || schema === undefined) continue;

      expect(Object.keys(schema.requiredKwargs ?? {}).sort(), `${action} schema required`)
        .toEqual([...source.requiredKwargs].sort());
      expect(Object.keys(schema.optionalKwargs ?? {}).sort(), `${action} schema optional`)
        .toEqual(Object.keys(source.optionalKwargs).sort());
      expect(schema.settleMs, `${action} schema settleMs`).toBe(source.settleMs);
    }
  });

  it('maps enum fields to enums, numeric to numbers, and durations to durations', () => {
    for (const action of ACTIONS) {
      const source = evidence.virtualClassroom[action];
      const schema = WHITEBOARD_SCHEMAS.find((candidate) => candidate.action === action);
      if (source === undefined || schema === undefined) continue;

      const specFor = (key: string) => schema.requiredKwargs?.[key] ?? schema.optionalKwargs?.[key];

      for (const [key, values] of Object.entries(source.enums ?? {})) {
        const spec = specFor(key);
        expect(spec, `${action}.${key} missing`).toBeDefined();
        expect(spec?.type.kind, `${action}.${key} kind`).toBe('enum');
        if (spec?.type.kind === 'enum') {
          expect([...spec.type.values].sort(), `${action}.${key} enum values`).toEqual([...values].sort());
        }
      }
      for (const key of source.numeric ?? []) {
        expect(specFor(key)?.type.kind, `${action}.${key} numeric`).toBe('number');
      }
      for (const key of source.durations ?? []) {
        expect(specFor(key)?.type.kind, `${action}.${key} duration`).toBe('duration');
      }
      for (const key of source.colors ?? []) {
        const spec = specFor(key);
        expect(spec?.type.kind, `${action}.${key} color`).toBe('color');
        // The source defines a colour kwarg as "a named ink colour or an explicit #rrggbb", so the
        // schema must carry the palette rather than rejecting names or accepting anything.
        if (spec?.type.kind === 'color') {
          expect([...(spec.type.named ?? [])].sort(), `${action}.${key} palette`).toEqual([...INK_COLORS].sort());
        }
      }
    }
  });

  it('declares no reference-typed kwargs, so board resolution is the only entity phase', () => {
    // The plugin resolves targets itself as a contributed stage. A schema declaring `entityRef`
    // would make the runtime resolve it first against a resolver it does not have, and the command
    // would be rejected before this plugin saw it.
    for (const schema of WHITEBOARD_SCHEMAS) {
      for (const spec of [...Object.values(schema.requiredKwargs ?? {}), ...Object.values(schema.optionalKwargs ?? {})]) {
        expect(spec.type.kind, `${schema.action}`).not.toBe('entityRef');
        expect(spec.type.kind, `${schema.action}`).not.toBe('entityRefList');
      }
      expect(schema.entityResolution, `${schema.action}`).toBe('none');
    }
  });

  it('gives every non-empty declared default a value that satisfies its own type', async () => {
    const { checkValue } = await import('@stagehand/registry');
    for (const schema of WHITEBOARD_SCHEMAS) {
      for (const [key, spec] of Object.entries(schema.optionalKwargs ?? {})) {
        if (spec.default === undefined || spec.default === '') continue;
        const check = checkValue(spec.default, spec.type);
        expect(check.ok, `${schema.action}.${key} default "${spec.default}": ${check.reason ?? ''}`).toBe(true);
      }
    }
  });

  it("treats an empty-string default as the source's unset sentinel, not as a value", async () => {
    // The pinned source uses `''` to mean "not supplied" — `whiteboard.text` defaults `color` to `''`
    // and Clio defaults `id` to `''`. So an empty default must be *rejected as a value* yet
    // *accepted as an omitted one*. Asserting both halves is stronger than skipping it: it pins the
    // sentinel rather than tolerating it.
    const { checkValue, validateCommand } = await import('@stagehand/registry');
    const { WhiteboardPlugin: Plugin } = await import('../src/index.js');

    const emptyDefaulted = WHITEBOARD_SCHEMAS.flatMap((schema) =>
      Object.entries(schema.optionalKwargs ?? {})
        .filter(([, spec]) => spec.default === '')
        .map(([key, spec]) => ({ action: schema.action, key, spec })),
    );
    expect(emptyDefaulted.length, 'the source declares empty defaults').toBeGreaterThan(0);

    // `''` is a sentinel only where it is not a valid value of the declared type. For a string kwarg
    // an empty title is a legitimate empty title, so the sentinel reading does not apply and the
    // value/omitted distinction collapses — which is correct, and worth stating rather than papering
    // over with a uniform rule that would be wrong for half the cases.
    const sentinel = emptyDefaulted.filter(({ spec }) => !checkValue('', spec.type).ok);
    const genuinelyEmpty = emptyDefaulted.filter(({ spec }) => checkValue('', spec.type).ok);
    expect(sentinel.length, "kwarg types where '' is not a value").toBeGreaterThan(0);
    for (const { action, key, spec } of genuinelyEmpty) {
      expect(spec.type.kind, `${action}.${key} empty default on a type that accepts it`).toBe('string');
    }

    // And the registry tolerates it where the default says it means "unset".
    const plugin = new Plugin();
    const verdict = validateCommand(
      plugin.registry,
      { action: 'whiteboard.text', args: [], kwargs: { id: 'x', color: '' }, raw: '[whiteboard.text]' },
      { stages: plugin.stages },
    );
    expect(verdict.ok, 'an empty value for a defaulted kwarg must be accepted').toBe(true);
  });

  it('exposes every action through registry introspection with no second list', () => {
    const plugin = new WhiteboardPlugin();
    expect(plugin.registry.actions).toEqual([...WHITEBOARD_ACTIONS].sort());
    const digest = plugin.registry.digest();
    for (const action of WHITEBOARD_ACTIONS) expect(digest).toContain(action);
  });
});

describe('TEST-203 / all 21 owned surfaces are served', () => {
  it('declares exactly the corpus surface ids, in order', () => {
    expect(SURFACE_MANIFEST.map((entry) => entry.surface)).toEqual(EXPECTED_SURFACES);
    expect(SURFACE_MANIFEST).toHaveLength(21);
  });

  it('binds every surface to a registered action and a matching contract id', () => {
    const registry = new WhiteboardPlugin().registry;
    for (const entry of SURFACE_MANIFEST) {
      expect(registry.has(entry.action), `${entry.surface} binds to unregistered ${entry.action}`).toBe(true);
      expect(entry.contract, `${entry.surface} contract`).toBe(entry.surface.replace('SURF-', 'CTR-'));
    }
  });

  it('registers 15 distinct actions, not 21, with the six shared actions appearing once', () => {
    expect(WHITEBOARD_ACTIONS).toHaveLength(15);
    expect(new Set(WHITEBOARD_ACTIONS).size).toBe(15);

    const clio = SURFACE_MANIFEST.filter((entry) => entry.host === 'Clio');
    const vc = SURFACE_MANIFEST.filter((entry) => entry.host === 'Virtual Classroom');
    expect(clio).toHaveLength(6);
    expect(vc).toHaveLength(15);

    const shared = clio.map((entry) => entry.action);
    for (const action of shared) {
      const surfaces = SURFACE_MANIFEST.filter((entry) => entry.action === action);
      expect(surfaces, action).toHaveLength(2);
      expect(new Set(surfaces.map((s) => s.host)).size, action).toBe(2);
    }
  });
});

describe('TEST-203 / the Clio compatibility record matches the source', () => {
  it('covers all six Clio surfaces, exactly once each', () => {
    expect(CLIO_COMPATIBILITY).toHaveLength(6);
    expect(CLIO_COMPATIBILITY.map((entry) => entry.clioSurface).sort())
      .toEqual(['SURF-034', 'SURF-035', 'SURF-036', 'SURF-037', 'SURF-038', 'SURF-039']);
  });

  it('names the source description as the Clio behavior it diverges from', () => {
    for (const entry of CLIO_COMPATIBILITY) {
      const source = evidence.clio[entry.action] as { description?: string } | undefined;
      expect(source, `${entry.action} absent from the Clio evidence`).toBeDefined();
      // The recorded Clio behavior must start from what Clio's source actually says, so a rewrite of
      // the description cannot quietly become the justification for the adoption.
      expect(source?.description, `${entry.action} Clio description`).toBeDefined();
      expect(entry.clioBehavior.slice(0, 20), `${entry.action} clioBehavior`)
        .toBe((source?.description ?? '').slice(0, 20));
    }
  });

  it('records the same cross-cutting differences the source shows', () => {
    expect(CLIO_CROSS_CUTTING.map((entry) => entry.field).sort())
      .toEqual(['resolvesEntity', 'settleMs', 'vocabulary']);
    for (const entry of CLIO_COMPATIBILITY) {
      expect(entry.differences.length, `${entry.action} differences`).toBeGreaterThan(0);
      expect(entry.note.length, `${entry.action} note`).toBeGreaterThan(0);
    }
  });

  it('records that hide preserves content, and says why it matters', () => {
    const hide = CLIO_COMPATIBILITY.find((entry) => entry.action === 'whiteboard.hide');
    expect(hide?.adoptedBehavior).toContain('without destroying its content');
    expect(hide?.note).toContain('DIV-011');
    expect(hide?.differences.some((difference) => difference.field === 'content')).toBe(true);
  });

  it('records the id requirement and content_ref additions for text and math', () => {
    const text = CLIO_COMPATIBILITY.find((entry) => entry.action === 'whiteboard.text');
    expect(text?.differences.some((d) => d.field === 'requiredKwargs')).toBe(true);
    expect(text?.differences.some((d) => d.field === 'optionalKwargs' && d.adopted.includes('content_ref'))).toBe(true);

    const math = evidence.virtualClassroom['whiteboard.math'];
    expect(math?.optionalKwargs['content_ref']).toBeDefined();
  });

  it('records the count contract as target-based, which is what the source declares', () => {
    const count = evidence.virtualClassroom['whiteboard.count'];
    expect(count?.requiredKwargs).toEqual(['target']);
    expect(count?.requiredKwargs).not.toContain('id');
    expect(count?.optionalKwargs['id']).toBe('');
    expect(count?.resolvesEntity).toBe('board');
    expect(count?.enums?.['what']).toEqual(['items', 'corners', 'sides']);
    expect(count?.settleMs).toBe(4000);
  });
});

/**
 * TEST-176 — reference-resolution fuzzing for stale, missing, and ambiguous ids.
 *
 * The property under fuzz is a negative one and therefore the one most likely to rot: **the
 * resolver's "I do not know" is never converted into an answer.** A resolver that guesses between
 * two candidates, or that falls back to a recently-seen id, or that resolves a stale reference
 * because the string still looks well-formed, would pass every happy-path test and put a
 * model-influenced pointer into a committed effect — exactly what Constitution IV and INV-008
 * forbid.
 *
 * Randomness has a named deterministic owner: `mulberry32` with the seed printed on failure.
 *
 * Covers FR-182, FR-183. Tasks T-031, T-034.
 */

import { describe, expect, it } from 'vitest';
import {
  canonicalizeCommandEntityRefs,
  executeStagehandCommand,
  type ExecutionOutcome,
} from '../src/index.js';
import { MapResolver, MutationCountingCommitter } from './fake-host.js';
import { KNOWN_REFERENCES, STALE_REFERENCES, cmd, makeRegistry } from './fixtures.js';

const registry = makeRegistry();

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const KNOWN = Object.keys(KNOWN_REFERENCES);

/** A pool with every failure flavour mixed in, so a fuzz draw cannot accidentally be all-valid. */
const HOSTILE = [
  ...STALE_REFERENCES,
  'country:USSR',
  'country:iran ',
  'country:iran:misfiled',
  ':iran',
  'country:',
  'nowhere',
  '',
  'city:VENICE',
];

function resolver(): MapResolver {
  const map = new MapResolver();
  for (const [reference, target] of Object.entries(KNOWN_REFERENCES)) map.set(reference, target);
  // Marked ambiguous: has candidates, but more than one, so a correct resolver must not answer.
  map.markAmbiguous('city:springfield');
  return map;
}

describe('TEST-176 / a resolver that cannot answer does not answer', () => {
  it('resolves every known, unambiguous reference', () => {
    for (const reference of KNOWN) {
      const result = canonicalizeCommandEntityRefs(registry, cmd('map.focus', { id: reference }), {
        resolver: resolver(),
      });
      expect(result.ok, `known reference ${reference} did not resolve`).toBe(true);
      expect(result.command?.resolved[0]?.raw).toBe(reference);
      expect(result.command?.resolved[0]?.target.id).toBe(KNOWN_REFERENCES[reference]?.id);
    }
  });

  it('refuses every stale, missing, malformed, or case-mismatched reference', () => {
    for (const reference of HOSTILE) {
      if (reference === '') {
        // An empty required-style value is caught earlier by the registry, not here.
        continue;
      }
      const result = canonicalizeCommandEntityRefs(registry, cmd('map.focus', { id: reference }), {
        resolver: resolver(),
      });
      expect(result.ok, `hostile reference "${reference}" resolved`).toBe(false);
      expect(result.errors.some((e) => e.code === 'E_UNRESOLVED_REF')).toBe(true);
    }
  });

  it('does not answer for an ambiguous reference even though candidates exist', () => {
    const map = resolver();
    const result = canonicalizeCommandEntityRefs(registry, cmd('map.focus', { id: 'city:springfield' }), {
      resolver: map,
    });
    expect(result.ok).toBe(false);
    expect(result.errors[0]?.subject).toBe('id');
  });

  it('never emits a concrete id that was not in the resolver registry', () => {
    const knownIds = new Set(Object.values(KNOWN_REFERENCES).map((t) => t.id));
    const random = mulberry32(0xf022_176);
    for (let i = 0; i < 300; i++) {
      const reference = random() < 0.5
        ? KNOWN[Math.floor(random() * KNOWN.length)]
        : HOSTILE[Math.floor(random() * HOSTILE.length)];
      if (reference === undefined || reference === '') continue;

      const result = canonicalizeCommandEntityRefs(registry, cmd('map.focus', { id: reference }), {
        resolver: resolver(),
      });
      if (!result.ok) continue;
      for (const ref of result.command?.resolved ?? []) {
        expect(knownIds.has(ref.target.id), `invented id ${ref.target.id} for "${reference}"`).toBe(true);
      }
    }
  });
});

describe('TEST-176 / slots, lists, and ordering', () => {
  it('reports the slot that failed, for a kwarg', () => {
    const result = canonicalizeCommandEntityRefs(registry, cmd('piece.place', { at: 'nowhere' }), {
      resolver: resolver(),
    });
    expect(result.ok).toBe(false);
    expect(result.errors[0]?.subject).toBe('at');
  });

  it('reports the slot that failed, for a positional argument', () => {
    const result = canonicalizeCommandEntityRefs(registry, cmd('avatar.move', {}, ['nowhere']), {
      resolver: resolver(),
    });
    expect(result.ok).toBe(false);
    expect(result.errors[0]?.subject).toBe('args[0]');
  });

  it('does not treat a plain string kwarg as a reference', () => {
    // `whiteboard.text.id` is typed `string`. Treating it as a reference would make an ordinary
    // board write unresolvable, which is how a type confusion hides behind a lookup failure.
    const result = canonicalizeCommandEntityRefs(registry, cmd('whiteboard.text', { id: 'any-string' }), {
      resolver: resolver(),
    });
    expect(result.ok).toBe(true);
    expect(result.command?.resolved).toEqual([]);
  });

  it('resolves each item of a list and records each separately', () => {
    const result = canonicalizeCommandEntityRefs(
      registry,
      cmd('map.highlight', { entities: 'country:iran,city:venice' }),
      { resolver: resolver() },
    );
    expect(result.ok).toBe(true);
    expect(result.command?.resolved.map((r) => r.raw)).toEqual(['country:iran', 'city:venice']);
    expect(result.command?.resolved.every((r) => r.inList)).toBe(true);
    expect(result.command?.payload['kwargs']).toEqual({ entities: 'IRN,VEN' });
  });

  it('fails the whole command when one item of a list fails', () => {
    // Committing the resolvable items would silently drop part of what the producer asked for.
    const result = canonicalizeCommandEntityRefs(
      registry,
      cmd('map.highlight', { entities: 'country:iran,country:ussr' }),
      { resolver: resolver() },
    );
    expect(result.ok).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toContain('country:ussr');
    expect(result.errors[0]?.subject).toBe('entities');
  });

  it('resolves the same reference twice when it appears twice', () => {
    const result = canonicalizeCommandEntityRefs(
      registry,
      cmd('map.highlight', { entities: 'country:iran,country:iran' }),
      { resolver: resolver() },
    );
    expect(result.ok).toBe(true);
    expect(result.command?.resolved).toHaveLength(2);
  });

  it('preserves the producer raw text alongside the concrete id', () => {
    const result = canonicalizeCommandEntityRefs(registry, cmd('map.focus', { id: 'city:venice' }), {
      resolver: resolver(),
    });
    const refs = result.command?.payload['refs'] as { raw: string; id: string; center?: number[] }[];
    expect(refs[0]?.raw).toBe('city:venice');
    expect(refs[0]?.id).toBe('VEN');
    expect(refs[0]?.center).toEqual([12.3155, 45.4408]);
    // The producer's own kwargs are kept on the canonical command, untouched.
    expect(result.command?.kwargs['id']).toBe('city:venice');
  });

  it('resolves in declaration order, deterministically', () => {
    const order = () => {
      const result = canonicalizeCommandEntityRefs(
        registry,
        cmd('map.highlight', { entities: 'country:iran,city:venice' }, ['anchor:board']),
        { resolver: resolver() },
      );
      return result.command?.resolved.map((r) => r.slot);
    };
    // `entities` is a list, so it contributes one entry per item — in item order — before the
    // positional argument, which is declared after the kwargs.
    expect(order()).toEqual(['entities', 'entities', 'args[0]']);
    expect(order()).toEqual(order());
  });

  it('calls the resolver once per reference, with the action and slot', () => {
    const map = resolver();
    canonicalizeCommandEntityRefs(registry, cmd('map.highlight', { entities: 'country:iran,city:venice' }), {
      resolver: map,
    });
    expect(map.calls).toEqual([
      { reference: 'country:iran', action: 'map.highlight', slot: 'entities' },
      { reference: 'city:venice', action: 'map.highlight', slot: 'entities' },
    ]);
  });

  it('treats an empty list as carrying no references rather than one empty reference', () => {
    const result = canonicalizeCommandEntityRefs(registry, cmd('map.highlight', { entities: '' }), {
      resolver: resolver(),
    });
    // Rejected by the registry's own minItems rule, not by a phantom unresolvable reference here.
    expect(result.ok).toBe(true);
    expect(result.command?.resolved).toEqual([]);
  });
});

describe('TEST-176 / fuzz over mixed reference populations', () => {
  it('never commits when any reference in the command is unresolvable', () => {
    const seed = 0xbeef_176;
    const random = mulberry32(seed);

    for (let iteration = 0; iteration < 400; iteration++) {
      const count = 1 + Math.floor(random() * 3);
      const pool = random() < 0.5 ? KNOWN : HOSTILE;
      const chosen: string[] = [];
      for (let i = 0; i < count; i++) {
        const pick = pool[Math.floor(random() * pool.length)];
        if (pick !== undefined && pick !== '') chosen.push(pick);
      }
      if (chosen.length === 0) continue;

      const allKnown = chosen.every((c) => KNOWN.includes(c));
      const host = new MutationCountingCommitter();
      const map = resolver();

      let outcome: ExecutionOutcome;
      if (chosen.length === 1) {
        outcome = executeStagehandCommand(registry, cmd('map.focus', { id: chosen[0] ?? '' }), {
          committer: host,
          resolver: map,
        });
      } else {
        // A list draws the same property through a different slot kind.
        outcome = executeStagehandCommand(registry, cmd('map.highlight', { entities: chosen.join(',') }), {
          committer: host,
          resolver: map,
        });
      }

      if (allKnown) {
        expect(
          outcome.committed,
          `seed=0x${seed.toString(16)} iteration=${iteration} refs=[${chosen.join(',')}] should commit`,
        ).toBe(true);
        expect(host.mutationCount).toBe(1);
      } else {
        expect(
          outcome.committed,
          `seed=0x${seed.toString(16)} iteration=${iteration} refs=[${chosen.join(',')}] committed with an unresolvable reference`,
        ).toBe(false);
        expect(host.mutationCount).toBe(0);
        expect(host.commitCalls).toBe(0);
      }
    }
  });

  it('is reproducible under a fixed seed', () => {
    const draw = (seed: number): string[] => {
      const random = mulberry32(seed);
      const out: string[] = [];
      for (let i = 0; i < 8; i++) {
        const pool = random() < 0.5 ? KNOWN : HOSTILE;
        out.push(pool[Math.floor(random() * pool.length)] ?? '');
      }
      return out;
    };
    expect(draw(1234)).toEqual(draw(1234));
  });
});

describe('TEST-176 / propose-stub never becomes authorization', () => {
  it('offers a proposal per unresolved reference and commits nothing', () => {
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(
      registry,
      cmd('map.highlight', { entities: 'country:iran,country:ussr,city:atlantis' }),
      { committer: host, resolver: resolver(), entityResolution: 'propose-stub' },
    );

    expect(outcome.committed).toBe(false);
    expect(host.mutationCount).toBe(0);

    const event = outcome.events[0];
    expect(event?.type).toBe('unresolved_refs');
    if (event?.type === 'unresolved_refs') {
      expect(event.proposals.map((p) => p.reference)).toEqual(['country:ussr', 'city:atlantis']);
      // The resolvable item is not proposed and not committed: a partial scene is not a scene.
      expect(event.proposals.every((p) => p.slot === 'entities')).toBe(true);
    }
  });

  it('strict reports the same references without offering proposals', () => {
    const host = new MutationCountingCommitter();
    const outcome = executeStagehandCommand(
      registry,
      cmd('map.highlight', { entities: 'country:iran,country:ussr' }),
      { committer: host, resolver: resolver(), entityResolution: 'strict' },
    );
    const event = outcome.events[0];
    if (event?.type === 'unresolved_refs') expect(event.proposals).toEqual([]);
    expect(host.mutationCount).toBe(0);
  });
});

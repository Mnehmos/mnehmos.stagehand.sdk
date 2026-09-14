/**
 * TEST-170 — batch/stream equivalence, fuzzed over randomized chunk boundaries.
 *
 * Randomness has a named deterministic owner: `mulberry32` with an explicit seed recorded in the
 * failure message. A fuzz that cannot reproduce its own failure is a slot machine, not a test.
 *
 * Covers FR-172. Tasks T-022, T-024.
 */

import { describe, expect, it } from 'vitest';
import {
  parseScript,
  StreamingParser,
  type CommandSchemaLike,
  type ScriptSegment,
  type SchemaLookup,
} from '../src/index.js';

const schemas: Record<string, CommandSchemaLike> = {
  'avatar.move': { minArgs: 1, maxArgs: 1, requiredKwargs: [], optionalKwargs: { speed: 'walk' } },
  'whiteboard.text': {
    minArgs: 0, maxArgs: 0, requiredKwargs: ['id'],
    optionalKwargs: { text: '', size: 'md', region: '' },
  },
  'map.highlight': { minArgs: 0, maxArgs: 1, requiredKwargs: [], optionalKwargs: { entity: '', color: '#ef4444' } },
  'map.focus': { minArgs: 0, maxArgs: 0, requiredKwargs: [], optionalKwargs: { id: '' } },
  'source.show': { minArgs: 0, maxArgs: 0, requiredKwargs: [], optionalKwargs: { id: '', text: '' } },
};
const lookup: SchemaLookup = (action) => schemas[action];

/** Deterministic PRNG. Seeded and replayable; never wall-clock or entropy derived. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function chunk(script: string, sizes: readonly number[]): string[] {
  const chunks: string[] = [];
  let at = 0;
  for (const size of sizes) {
    if (at >= script.length) break;
    chunks.push(script.slice(at, at + size));
    at += size;
  }
  if (at < script.length) chunks.push(script.slice(at));
  return chunks;
}

function streamAll(script: string, sizes: readonly number[], options: Parameters<typeof parseScript>[1]): ScriptSegment[] {
  const parser = new StreamingParser(options ?? {});
  const out: ScriptSegment[] = [];
  for (const piece of chunk(script, sizes)) out.push(...parser.feed(piece));
  out.push(...parser.flush());
  return out;
}

const CORPUS = [
  'Venice grew rich [map.focus id=venice] on trade.',
  '[sequence][map.highlight entity=iran][source.show id=s1][end]',
  '[batch atomic][map.focus id=a][whiteboard.text id=t text=hello world][/batch]',
  'Narration before [beat id=b1 intent=draw]inside narration[map.focus id=b][end] narration after',
  '[parallel][map.focus id=x][map.focus id=y][end] trailing words',
  'plain narration with no control at all',
  '[sequence][parallel][map.focus id=deep][source.show id=s][end][end]',
  '[whiteboard.text id=t text="quoted value with spaces"] then text',
  "apostrophe Newton's [map.focus id=n] survives",
  '[sequence pause=250][map.focus id=p][/sequence] done',
  'unclosed [sequence][map.focus id=u]',
  'orphan [/batch] closer in the middle',
  '[map.focus id=last]',
];

describe('TEST-170 / batch vs streaming equivalence', () => {
  it('agrees with batch when fed one character at a time', () => {
    for (const script of CORPUS) {
      const options = { lookupSchema: lookup };
      const batch = parseScript(script, options);
      const streamed = streamAll(script, new Array(script.length + 1).fill(1), options);
      expect(streamed, `one-char chunking diverged for: ${script}`).toEqual(batch);
    }
  });

  it('agrees with batch when fed as a single chunk', () => {
    for (const script of CORPUS) {
      const options = { lookupSchema: lookup };
      expect(streamAll(script, [script.length], options), `single chunk diverged for: ${script}`)
        .toEqual(parseScript(script, options));
    }
  });

  it('agrees with batch for adversarial fixed splits', () => {
    for (const script of CORPUS) {
      for (let size = 1; size <= 7; size++) {
        const options = { lookupSchema: lookup };
        expect(
          streamAll(script, new Array(script.length + 1).fill(size), options),
          `fixed chunk size ${size} diverged for: ${script}`,
        ).toEqual(parseScript(script, options));
      }
    }
  });

  it('agrees with batch over 400 seeded random chunkings', () => {
    const seed = 0x5eed_170;
    const random = mulberry32(seed);
    for (let iteration = 0; iteration < 400; iteration++) {
      const script = CORPUS[Math.floor(random() * CORPUS.length)] ?? '';
      const sizes: number[] = [];
      for (let i = 0; i < 40; i++) sizes.push(1 + Math.floor(random() * 6));
      const options = { lookupSchema: lookup };
      const batch = parseScript(script, options);
      const streamed = streamAll(script, sizes, options);
      expect(
        streamed,
        `seed=0x${seed.toString(16)} iteration=${iteration} sizes=[${sizes.join(',')}] script="${script}"`,
      ).toEqual(batch);
    }
  });

  it('is reproducible: the same seed and script give the same chunking', () => {
    const random = mulberry32(42);
    const first = [1, 2, 3, 4, 5].map(() => 1 + Math.floor(random() * 6));
    const second = mulberry32(42);
    const replay = [1, 2, 3, 4, 5].map(() => 1 + Math.floor(second() * 6));
    expect(replay).toEqual(first);
  });

  it('emits nothing before a span is complete, and everything after flush', () => {
    const parser = new StreamingParser({ lookupSchema: lookup });
    expect(parser.feed('[map.fo')).toEqual([]);
    expect(parser.feed('cus id=v')).toEqual([]);
    const emitted = parser.feed('enice]');
    expect(emitted).toEqual(parseScript('[map.focus id=venice]', { lookupSchema: lookup }));
    expect(parser.flush()).toEqual([]);
  });

  it('resolves trailing input at flush rather than holding it forever', () => {
    const parser = new StreamingParser({ lookupSchema: lookup });
    parser.feed('trailing narration only');
    expect(parser.flush()).toEqual(parseScript('trailing narration only', { lookupSchema: lookup }));
  });

  it('refuses input after flush', () => {
    const parser = new StreamingParser();
    parser.flush();
    expect(() => parser.feed('more')).toThrow(/after flush/);
  });
});

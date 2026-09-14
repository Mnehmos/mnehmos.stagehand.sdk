/**
 * TEST-168 — golden corpus for quoting, apostrophes, LaTeX, whitespace, nesting, and boundaries.
 *
 * Vectors G-001..G-010 are ported from the corpus conformance harness
 * (`docs/corpus/harness/stagehand-conformance.mjs`), so the recovered behaviour stays pinned
 * against the artifact it was recovered into. Cases where the harness also asserted registry
 * rejection are narrowed to parser-owned behaviour: authorization is FEAT-002's boundary and the
 * parser must not perform it.
 *
 * Covers FR-168..FR-171. Tasks T-019..T-022, T-024.
 */

import { describe, expect, it } from 'vitest';
import {
  parseCommandString,
  parseScript,
  StagehandSyntaxError,
  type CommandSchemaLike,
  type SchemaLookup,
  type ScriptSegment,
} from '../src/index.js';

/** Fixture registry, mirroring the harness vocabulary. */
const schemas: Record<string, CommandSchemaLike> = {
  'avatar.move': { minArgs: 1, maxArgs: 1, requiredKwargs: [], optionalKwargs: { speed: 'walk' } },
  'avatar.gesture': { minArgs: 1, maxArgs: 1, requiredKwargs: [], optionalKwargs: {} },
  'whiteboard.text': {
    minArgs: 0, maxArgs: 0, requiredKwargs: ['id'],
    optionalKwargs: { text: '', latex: '', size: 'md', region: '' },
  },
  'whiteboard.math': { minArgs: 0, maxArgs: 0, requiredKwargs: ['id'], optionalKwargs: { latex: '', region: '' } },
  'map.highlight': { minArgs: 0, maxArgs: 1, requiredKwargs: [], optionalKwargs: { entity: '', color: '#ef4444' } },
  'map.focus': { minArgs: 0, maxArgs: 0, requiredKwargs: [], optionalKwargs: { id: '' } },
  'map.timecursor': { minArgs: 0, maxArgs: 0, requiredKwargs: ['at'], optionalKwargs: {} },
  'source.show': { minArgs: 0, maxArgs: 0, requiredKwargs: [], optionalKwargs: { id: '', text: '', confidence: '0.5' } },
};
const lookup: SchemaLookup = (action) => schemas[action];

const commandsOf = (segments: readonly ScriptSegment[]) =>
  segments.flatMap((s) => (s.type === 'command' ? [s] : s.type === 'text' ? [] : s.commands));
const textOf = (segments: readonly ScriptSegment[]) =>
  segments.flatMap((s) => (s.type === 'text' ? [s.content] : []));

describe('TEST-168 / command bodies (FR-169)', () => {
  it('G-001 compiles a bracketed command with kwargs', () => {
    const found = commandsOf(parseScript('[map.highlight entity="country:iran" color="#ff0000"]'));
    expect(found).toHaveLength(1);
    expect(found[0]?.action).toBe('map.highlight');
    expect(found[0]?.kwargs).toEqual({ entity: 'country:iran', color: '#ff0000' });
  });

  it('G-002 preserves whitespace inside quoted values', () => {
    const command = parseCommandString('whiteboard.text id=t text="heat boils water"', schemas['whiteboard.text']);
    expect(command?.kwargs['text']).toBe('heat boils water');
  });

  it('G-003 keeps an apostrophe literal inside an unquoted value', () => {
    const command = parseCommandString("whiteboard.text id=t text=Newton's", schemas['whiteboard.text']);
    expect(command?.kwargs['text']).toBe("Newton's");
  });

  it('G-004 preserves LaTeX backslashes byte for byte', () => {
    const source = String.raw`whiteboard.math id=k latex="\\frac{a}{b}"`;
    const command = parseCommandString(source, schemas['whiteboard.math']);
    expect(command?.kwargs['latex']).toBe(String.raw`\\frac{a}{b}`);
  });

  it('G-005 normalizes whitespace around the equals sign', () => {
    const command = parseCommandString('whiteboard.text id = t text = hello', schemas['whiteboard.text']);
    expect(command?.kwargs['id']).toBe('t');
    expect(command?.kwargs['text']).toBe('hello');
  });

  it('G-006 recovers an unquoted multi-word value using the schema', () => {
    const command = parseCommandString(
      'whiteboard.text id=t text=If exactly one split size=md',
      schemas['whiteboard.text'],
    );
    expect(command?.kwargs['text']).toBe('If exactly one split');
    expect(command?.kwargs['size']).toBe('md');
  });

  it('returns null for empty and whitespace-only input', () => {
    expect(parseCommandString('')).toBeNull();
    expect(parseCommandString('   \n\t ')).toBeNull();
  });

  it('classifies positional args and kwargs without a schema', () => {
    const command = parseCommandString('avatar.move teacher.home speed=stroll');
    expect(command?.action).toBe('avatar.move');
    expect(command?.args).toEqual(['teacher.home']);
    expect(command?.kwargs).toEqual({ speed: 'stroll' });
  });

  it('records the source text of a command, framing included', () => {
    const found = commandsOf(parseScript('[map.focus id=venice]'));
    expect(found[0]?.raw).toBe('[map.focus id=venice]');
  });

  it('does not authorize: an unknown action still parses to a command', () => {
    const found = commandsOf(parseScript('[root.shell rm=-rf]'));
    expect(found[0]?.action).toBe('root.shell');
    expect(textOf(parseScript('[root.shell rm=-rf]'))).toEqual([]);
  });
});

describe('TEST-168 / script structure (FR-170, FR-171)', () => {
  it('G-007 folds nested compounds and flattens inner commands', () => {
    const segments = parseScript(
      '[sequence][parallel][map.highlight entity=x][source.show id=s][end][end]',
    );
    expect(segments).toHaveLength(1);
    expect(segments[0]?.type).toBe('sequence');
    const sequence = segments[0];
    if (sequence?.type !== 'sequence') throw new Error('expected sequence');
    expect(sequence.commands).toHaveLength(2);
    expect(sequence.commands.map((c) => c.action)).toEqual(['map.highlight', 'source.show']);
  });

  it('G-008 lets the universal closer close the innermost compound', () => {
    const segments = parseScript('[sequence][map.highlight entity=x][end]');
    expect(segments[0]?.type).toBe('sequence');
  });

  it('G-009 degrades an unmatched opener to a visible command', () => {
    const segments = parseScript('[sequence][map.highlight entity=x]');
    expect(segments[0]?.type).toBe('command');
    if (segments[0]?.type !== 'command') throw new Error('expected command');
    expect(segments[0].action).toBe('sequence');
  });

  it('G-010 does not execute an orphan closer', () => {
    const segments = parseScript('hello [/sequence] world');
    expect(commandsOf(segments)).toHaveLength(0);
    expect(textOf(segments)).toEqual(['hello', 'world']);
  });

  it('interleaves narration and control in source order', () => {
    const segments = parseScript('Venice grew rich [map.focus id=venice] on trade.');
    expect(segments.map((s) => s.type)).toEqual(['text', 'command', 'text']);
    expect(textOf(segments)).toEqual(['Venice grew rich', 'on trade.']);
  });

  it('carries batch mode from a positional arg or a kwarg', () => {
    const positional = parseScript('[batch atomic][map.focus id=a][/batch]');
    expect(positional[0]?.type).toBe('batch');
    if (positional[0]?.type !== 'batch') throw new Error('expected batch');
    expect(positional[0].mode).toBe('atomic');

    const keyworded = parseScript('[batch mode=best_effort][map.focus id=a][/batch]');
    if (keyworded[0]?.type !== 'batch') throw new Error('expected batch');
    expect(keyworded[0].mode).toBe('best_effort');
  });

  it('defaults batch mode to atomic', () => {
    const segments = parseScript('[batch][map.focus id=a][end]');
    if (segments[0]?.type !== 'batch') throw new Error('expected batch');
    expect(segments[0].mode).toBe('atomic');
  });

  it('carries sequence pause metadata when present and omits it otherwise', () => {
    const paused = parseScript('[sequence pause=250][map.focus id=a][end]');
    if (paused[0]?.type !== 'sequence') throw new Error('expected sequence');
    expect(paused[0].pauseMs).toBe(250);

    const unpaused = parseScript('[sequence][map.focus id=a][end]');
    if (unpaused[0]?.type !== 'sequence') throw new Error('expected sequence');
    expect('pauseMs' in unpaused[0]).toBe(false);
  });

  it('gives a beat its id, intent, and inner narration', () => {
    const segments = parseScript('[beat id=b1 intent=draw]Narration here[whiteboard.text id=t text=hi][end]');
    if (segments[0]?.type !== 'beat') throw new Error('expected beat');
    expect(segments[0].beatId).toBe('b1');
    expect(segments[0].visualIntent).toBe('draw');
    expect(segments[0].narration).toBe('Narration here');
    expect(segments[0].commands.map((c) => c.action)).toEqual(['whiteboard.text']);
  });

  it('returns nothing for input with no content', () => {
    expect(parseScript('')).toEqual([]);
    expect(parseScript('   \n  ')).toEqual([]);
    expect(parseScript('[]')).toEqual([]);
  });

  it('surfaces a typed syntax error carrying the offending input', () => {
    expect(() => parseCommandString('whiteboard.text id=t text="oops', schemas['whiteboard.text']))
      .toThrow(StagehandSyntaxError);
    try {
      parseScript('[whiteboard.text id=t text="oops]');
    } catch (error) {
      expect(error).toBeInstanceOf(StagehandSyntaxError);
      expect((error as StagehandSyntaxError).raw).toContain('oops');
      return;
    }
    throw new Error('expected a StagehandSyntaxError');
  });
});

describe('TEST-168 / schema-aware fold used by the host', () => {
  it('produces the same segments when given a lookup', () => {
    const script = 'A [sequence][whiteboard.text id=t text=hello world][end] B';
    const withLookup = parseScript(script, { lookupSchema: lookup });
    const without = parseScript(script);
    expect(withLookup.map((s) => s.type)).toEqual(without.map((s) => s.type));
  });
});

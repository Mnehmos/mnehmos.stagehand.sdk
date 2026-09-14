/**
 * TEST-169 — control leakage. Replays the Virtual Classroom missing-bracket incident and asserts
 * that zero control tokens reach the narration channel.
 *
 * The assertion is deliberately made on the *spoken channel only*. Asserting that the parser
 * "intended" to classify something as control would be a test of intentions; asserting that no
 * action name appears in any emitted narration is a test of the property that matters.
 *
 * Covers FR-173 and FR-174. Tasks T-023, T-024.
 */

import { describe, expect, it } from 'vitest';
import {
  parseScript,
  quarantineBareCommands,
  splitChannels,
  type CommandSchemaLike,
  type SchemaLookup,
} from '../src/index.js';

const schemas: Record<string, CommandSchemaLike> = {
  'avatar.move': { minArgs: 1, maxArgs: 1, requiredKwargs: [], optionalKwargs: { speed: 'walk' } },
  'avatar.look': { minArgs: 1, maxArgs: 1, requiredKwargs: [], optionalKwargs: {} },
  'whiteboard.text': { minArgs: 0, maxArgs: 0, requiredKwargs: ['id'], optionalKwargs: { text: '', size: 'md' } },
  'map.highlight': { minArgs: 0, maxArgs: 1, requiredKwargs: [], optionalKwargs: { entity: '', color: '#ef4444' } },
  'map.focus': { minArgs: 0, maxArgs: 0, requiredKwargs: [], optionalKwargs: { id: '' } },
};
const lookup: SchemaLookup = (action) => schemas[action];

/** Action names that must never appear in narration, whatever else happens. */
const CONTROL_TOKENS = Object.keys(schemas);

function assertNoControlInNarration(script: string, options?: { lookupSchema?: SchemaLookup }): string[] {
  const segments = parseScript(script, options ?? {});
  const { narration } = splitChannels(segments);
  const spoken = narration.join('\n');
  for (const token of CONTROL_TOKENS) {
    expect(spoken, `control token "${token}" leaked into narration for input: ${script}`).not.toContain(token);
  }
  return narration;
}

describe('TEST-169 / lost brackets (the VC incident)', () => {
  it('quarantines a bare command and keeps the trailing narration', () => {
    const narration = assertNoControlInNarration(
      'avatar.move teacher.home speed=stroll Hello students, welcome back.',
      { lookupSchema: lookup },
    );
    expect(narration.join(' ')).toBe('Hello students, welcome back.');
  });

  it('extracts the bare command rather than dropping it', () => {
    const segments = parseScript('avatar.move teacher.home speed=stroll Hello students', {
      lookupSchema: lookup,
    });
    const { commands, narration } = splitChannels(segments);
    expect(commands).toHaveLength(1);
    expect(commands[0]?.action).toBe('avatar.move');
    expect(commands[0]?.args).toEqual(['teacher.home']);
    expect(commands[0]?.kwargs).toEqual({ speed: 'stroll' });
    expect(narration).toEqual(['Hello students']);
  });

  it('marks a recovered command as recovered, not as source-framed text', () => {
    const { commands } = splitChannels(
      parseScript('avatar.look left Now then.', { lookupSchema: lookup }),
    );
    expect(commands[0]?.raw).toBe('<recovered:avatar.look>');
  });

  it('leaves ordinary prose byte-identical', () => {
    const prose = 'The  map.focus  is not a command here because  spacing  matters.';
    // No registered action word: the pass must not even normalize whitespace.
    const segments = parseScript('The trade routes doubled in value between 1400 and 1500.');
    expect(splitChannels(segments).narration).toEqual([segments[0] && (segments[0] as { content: string }).content]);
    expect(quarantineBareCommands(prose, lookup).every((s) => s.type === 'text')).toBe(false);
    expect(parseScript('plain narration only').map((s) => s.type)).toEqual(['text']);
  });

  it('keeps narration when no registry is supplied, because it cannot recognise control', () => {
    const segments = parseScript('avatar.move teacher.home Hello students');
    expect(segments.map((s) => s.type)).toEqual(['text']);
  });
});

describe('TEST-169 / malformed framing', () => {
  it('treats an unterminated bracket span as control, never narration', () => {
    const narration = assertNoControlInNarration('[map.focus id=venice');
    expect(narration).toEqual([]);
  });

  it('keeps the narration before an unterminated span', () => {
    const narration = assertNoControlInNarration('Venice grew rich [map.focus id=venice');
    expect(narration).toEqual(['Venice grew rich']);
  });

  it('never narrates an unmatched compound opener or its children', () => {
    assertNoControlInNarration('[sequence][map.highlight entity=iran][source.show id=s');
    const segments = parseScript('[sequence][map.highlight entity=iran]');
    expect(segments[0]?.type).toBe('command');
  });

  it('does not narrate an orphan closer', () => {
    const narration = assertNoControlInNarration('A [/batch] B');
    expect(narration).toEqual(['A', 'B']);
  });

  it('preserves commands from an unclosed compound rather than dropping them', () => {
    // Fail closed means "do not speak it", not "throw it away": the producer sent control, and
    // silently discarding it would hide the producer's behaviour from the trace.
    const segments = parseScript('[batch atomic][map.focus id=a][map.focus id=b]');
    const { commands, narration } = splitChannels(segments);
    expect(narration).toEqual([]);
    expect(commands.map((c) => c.action)).toEqual(['batch', 'map.focus', 'map.focus']);
  });
});

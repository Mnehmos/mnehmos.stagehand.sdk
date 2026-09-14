/**
 * Cross-package seam: the registry drives FEAT-001's parser directly.
 *
 * This is the integration the plan promised and the reason `packages/registry` depends on
 * `packages/parser`. It matters beyond tidiness: before this feature, bare-command quarantine in
 * the parser could only run under test with a hand-written fixture lookup. With the registry
 * supplying `lookup`, that recovery path is reachable on the production path — which is exactly the
 * path the recorded Virtual Classroom missing-bracket incident travelled.
 *
 * Covers FR-176 and FR-177 at the boundary. Tasks T-025, T-026.
 */

import { describe, expect, it } from 'vitest';
import { parseScript, splitChannels } from '@stagehand/parser';
import { CapabilityRegistry, validateCommand, type CommandSchema, type ValidationStage } from '../src/index.js';
import { FIXTURE_SCHEMAS } from './fixtures.js';

const registry = new CapabilityRegistry(FIXTURE_SCHEMAS);

describe('the registry drives parser recovery', () => {
  it('quarantines a bare command using the registered vocabulary', () => {
    const { narration, commands } = splitChannels(
      parseScript('avatar.move anchor:desk speed=stroll Hello students, welcome back.', {
        lookupSchema: registry.lookup,
      }),
    );

    expect(commands).toHaveLength(1);
    expect(commands[0]?.action).toBe('avatar.move');
    expect(commands[0]?.kwargs).toEqual({ speed: 'stroll' });
    expect(narration).toEqual(['Hello students, welcome back.']);

    // And the recovered command is immediately validatable against the same registry.
    expect(validateCommand(registry, commands[0]!).ok).toBe(true);
  });

  it('does not quarantine an unregistered action, because it is not in the vocabulary', () => {
    const { narration, commands } = splitChannels(
      parseScript('root.shell rm=-rf carry on', { lookupSchema: registry.lookup }),
    );
    // `root.shell` is not registered, so the parser has no basis to call it control. It stays
    // narration — and that is correct: recognising control requires knowing the vocabulary.
    expect(commands).toHaveLength(0);
    expect(narration.join(' ')).toBe('root.shell rm=-rf carry on');
  });

  it('recovers the multi-word value using the schema key set', () => {
    const { commands } = splitChannels(
      parseScript('whiteboard.text id=t text=If exactly one split size=lg', {
        lookupSchema: registry.lookup,
      }),
    );
    expect(commands).toHaveLength(1);
    expect(commands[0]?.kwargs['size']).toBe('lg');
  });

  it('carries registry-declared defaults into the parser schema adapter', () => {
    const adapter = registry.lookup('avatar.move');
    expect(adapter?.minArgs).toBe(1);
    expect(adapter?.maxArgs).toBe(1);
    expect(adapter?.optionalKwargs?.['speed']).toBe('walk');
  });

  it('returns nothing for an unregistered action, so the parser falls back to no schema', () => {
    expect(registry.lookup('nope.nothing')).toBeUndefined();
  });
});

describe('parser output and registry validation compose end to end', () => {
  it('compiles, paraphrases, and validates a mixed script', () => {
    const script = [
      'Venice grew rich on trade.',
      '[map.focus id=venice zoom=9]',
      'Its wealth came from the east.',
    ].join(' ');

    const segments = parseScript(script, { lookupSchema: registry.lookup });
    const { narration, commands } = splitChannels(segments);

    expect(narration).toEqual(['Venice grew rich on trade.', 'Its wealth came from the east.']);
    expect(commands).toHaveLength(1);
    expect(validateCommand(registry, commands[0]!).ok).toBe(true);
  });

  it('rejects a parsed command whose value the registry disallows', () => {
    const segments = parseScript('[map.focus zoom=99]', { lookupSchema: registry.lookup });
    const { commands } = splitChannels(segments);
    expect(commands).toHaveLength(1);

    const result = validateCommand(registry, commands[0]!);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.some((e) => e.subject === 'zoom')).toBe(true);
  });

  it('keeps control out of narration even when the registry rejects the command', () => {
    const segments = parseScript('Before [nope.nothing x=1] after', { lookupSchema: registry.lookup });
    const { narration, commands } = splitChannels(segments);
    // The parser does not judge registry validity; it classifies. Rejection is the registry's call.
    expect(commands).toHaveLength(1);
    expect(narration.join(' ')).toBe('Before after');
    expect(validateCommand(registry, commands[0]!).ok).toBe(false);
  });
});

describe('registration extends the whole pipeline at once', () => {
  it('a newly registered capability is instantly parseable, validatable, and introspectable', () => {
    const extended = new CapabilityRegistry(FIXTURE_SCHEMAS);
    const schema: CommandSchema = {
      action: 'board.pointer',
      description: 'Point at a board element.',
      minArgs: 0,
      maxArgs: 0,
      requiredKwargs: { target: { type: { kind: 'string', minLength: 1 } } },
    };
    extended.register(schema);

    // Parser side.
    const { commands } = splitChannels(
      parseScript('[board.pointer target=t1]', { lookupSchema: extended.lookup }),
    );
    expect(commands[0]?.action).toBe('board.pointer');
    // Validator side.
    expect(validateCommand(extended, commands[0]!).ok).toBe(true);
    // Introspection side.
    expect(extended.introspection().digest).toContain('board.pointer');
  });

  it('a contributed stage sees parser-produced commands unchanged', () => {
    const seen: string[] = [];
    const stage: ValidationStage = {
      layer: 'entity',
      validate: (command) => {
        seen.push(command.action);
        return [];
      },
    };
    const { commands } = splitChannels(parseScript('[map.focus id=venice]', { lookupSchema: registry.lookup }));
    validateCommand(registry, commands[0]!, { stages: [stage] });
    expect(seen).toEqual(['map.focus']);
  });
});

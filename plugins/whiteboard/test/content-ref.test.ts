/**
 * TEST-206 — `content_ref` resolves through the host's lesson-content pack.
 *
 * `content_ref` does **not** name another board element. The pinned runtime injects `opts.resolveContent`,
 * documented as resolving payloads from the lesson content pack, and its own test resolves
 * `content_ref: 'equation.k'` through an external lookup. An earlier version of this file asserted
 * board-element-to-board-element copying and proved the point by copying bytes between two committed
 * elements — a different protocol wearing the same kwarg.
 *
 * Two behaviors are checked here, both of which need the public path rather than a helper:
 *
 * - a `content_ref` command passes registry validation, reaches the entity layer, and commits content
 *   taken from the injected pack;
 * - `content_ref` and inline `text`/`latex` are mutually exclusive, refused at the **registry** layer.
 *
 * The reference resolving to nothing is *not* an error: the pin yields empty content and still commits,
 * because the content pack belongs to the host and a miss is the host's to surface.
 *
 * Covers FR-232. Task T-076.
 */

import { describe, expect, it } from 'vitest';
import { validateCommand } from '@stagehand/registry';
import { WhiteboardPlugin } from '../src/index.js';

const PACK: Readonly<Record<string, string>> = {
  'equation.k': String.raw`\frac{a}{b} \cdot \left( x^{2} \right)`,
  'prose.long': 'A paragraph the producer did not want to re-type inline.',
};

function pluginWithPack(): WhiteboardPlugin {
  return new WhiteboardPlugin({ resolveContent: (reference) => PACK[reference] });
}

/** Run a command the way the runtime does: registry validation with the stages, then commit. */
function run(plugin: WhiteboardPlugin, action: string, kwargs: Record<string, string>): boolean {
  const command = { action, args: [], kwargs, raw: `[${action}]` };
  const verdict = validateCommand(plugin.registry, command, { stages: plugin.stages });
  if (!verdict.ok) return false;
  plugin.commit([{ plugin: 'whiteboard', action, payload: { args: [], kwargs, refs: [] } }]);
  return true;
}

describe('TEST-206 / a reference resolves from the injected pack', () => {
  it('commits the pack payload for a referenced equation', () => {
    const plugin = pluginWithPack();
    expect(run(plugin, 'whiteboard.math', { id: 'eq', content_ref: 'equation.k' })).toBe(true);

    const element = plugin.elements.find((candidate) => candidate.id === 'eq');
    expect(element?.content).toBe(PACK['equation.k']);
    // Byte for byte against the pack, not against a literal this test invented.
    expect([...(element?.content ?? '')]).toEqual([...PACK['equation.k']!]);
  });

  it('commits the pack payload for referenced prose', () => {
    const plugin = pluginWithPack();
    expect(run(plugin, 'whiteboard.text', { id: 'para', content_ref: 'prose.long' })).toBe(true);
    expect(plugin.contentFor('para')).toBe(PACK['prose.long']);
  });

  it('resolves through math and text, the two actions the source declares it on', async () => {
    const { WHITEBOARD_SCHEMAS } = await import('../src/index.js');
    const withRef = WHITEBOARD_SCHEMAS.filter(
      (schema) => schema.optionalKwargs?.['content_ref'] !== undefined,
    ).map((schema) => schema.action);
    expect(withRef.sort()).toEqual(['whiteboard.math', 'whiteboard.text']);
  });

  it('does not resolve a reference from another board element', () => {
    // The old protocol, asserted absent: a committed element's id is not a content reference.
    const plugin = pluginWithPack();
    expect(run(plugin, 'whiteboard.math', { id: 'source', latex: 'inline' })).toBe(true);
    expect(run(plugin, 'whiteboard.math', { id: 'copy', content_ref: 'source' })).toBe(true);

    // `source` is not in the pack, so the reference yields empty content — it does not copy.
    expect(plugin.contentFor('copy')).toBe('');
    expect(plugin.contentFor('copy')).not.toBe(plugin.contentFor('source'));
  });

  it('yields empty content for a reference the pack does not hold, and still commits', () => {
    // The pin: `opts.resolveContent?.(ref) ?? ''`. A miss is not a refusal.
    const plugin = pluginWithPack();
    expect(run(plugin, 'whiteboard.math', { id: 'missing', content_ref: 'not.in.pack' })).toBe(true);
    expect(plugin.contentFor('missing')).toBe('');
  });

  it('reports empty content when no resolver was injected at all', () => {
    const plugin = new WhiteboardPlugin();
    expect(run(plugin, 'whiteboard.math', { id: 'eq', content_ref: 'equation.k' })).toBe(true);
    expect(plugin.contentFor('eq')).toBe('');
  });
});

describe('TEST-206 / inline and referenced content are mutually exclusive', () => {
  it('refuses text plus content_ref at the registry layer', () => {
    const plugin = pluginWithPack();
    const verdict = validateCommand(
      plugin.registry,
      { action: 'whiteboard.text', args: [], kwargs: { id: 't', text: 'inline', content_ref: 'prose.long' }, raw: '[whiteboard.text]' },
      { stages: plugin.stages },
    );
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.layer).toBe('registry');
      expect(verdict.errors.some((error) => error.message.includes('not both'))).toBe(true);
    }
  });

  it('refuses latex plus content_ref', () => {
    const plugin = pluginWithPack();
    const verdict = validateCommand(
      plugin.registry,
      { action: 'whiteboard.math', args: [], kwargs: { id: 'm', latex: 'x', content_ref: 'equation.k' }, raw: '[whiteboard.math]' },
      { stages: plugin.stages },
    );
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.errors.some((error) => error.message.includes('not both'))).toBe(true);
  });

  it('accepts either one alone', () => {
    const plugin = pluginWithPack();
    expect(run(plugin, 'whiteboard.text', { id: 'a', text: 'inline' })).toBe(true);
    expect(run(plugin, 'whiteboard.text', { id: 'b', content_ref: 'prose.long' })).toBe(true);
  });

  it('does not treat an empty inline kwarg as supplying inline content', () => {
    // The pin's test is `kwargs.text || kwargs.latex`, so an empty string does not conflict.
    const plugin = pluginWithPack();
    expect(run(plugin, 'whiteboard.text', { id: 't', text: '', content_ref: 'prose.long' })).toBe(true);
    expect(plugin.contentFor('t')).toBe(PACK['prose.long']);
  });
});

/**
 * TEST-206 — `content_ref` resolves to canonical content, byte for byte.
 *
 * The failure this guards is subtle: a resolver that re-serialises produces content that is
 * *equivalent* and not *identical*. It reads correctly in a snapshot test written against a literal,
 * because the literal was written from the resolver's output in the first place.
 *
 * So every assertion here compares against **what was committed**, captured before the reference is
 * resolved. A change in how this plugin stores or re-reads content cannot make the test agree with
 * the bug, because the expected value is not produced by the code under test.
 *
 * Covers FR-232. Task T-076.
 */

import { describe, expect, it } from 'vitest';
import { boardResolutionStage, resolveContentRef, WhiteboardPlugin } from '../src/index.js';

const LATEX = String.raw`\frac{a}{b} \cdot \left( x^{2} \right)`;

function pluginWithContent(): { plugin: WhiteboardPlugin; committed: string } {
  const plugin = new WhiteboardPlugin();
  // LaTeX with backslashes and braces: the kind of content a re-serialiser mangles.
  plugin.commit([
    {
      plugin: 'whiteboard',
      action: 'whiteboard.math',
      payload: { args: [], kwargs: { id: 'eq1', latex: LATEX }, refs: [] },
    },
  ]);
  return { plugin, committed: LATEX };
}

describe('TEST-206 / resolution returns the committed bytes', () => {
  it('returns content identical to what was committed', () => {
    const { plugin, committed } = pluginWithContent();
    expect(plugin.contentFor('eq1')).toBe(committed);
  });

  it('preserves backslashes, braces, and spacing exactly', () => {
    const plugin = new WhiteboardPlugin();
    const awkward = String.raw`  \begin{align} a &= b \\ c &= d \end{align}  `;
    plugin.commit([
      {
        plugin: 'whiteboard',
        action: 'whiteboard.math',
        payload: { args: [], kwargs: { id: 'eq', latex: awkward }, refs: [] },
      },
    ]);
    expect(plugin.contentFor('eq')).toBe(awkward);
    // Character-level, not just string-equal: a normalising layer would show up here first.
    expect([...(plugin.contentFor('eq') ?? '')]).toEqual([...awkward]);
  });

  it('preserves a text element containing quotes and unicode', () => {
    const plugin = new WhiteboardPlugin();
    const text = 'He said "it\u2019s \u00e9\u00e0\u00fc" \u2014 then left.';
    plugin.commit([
      {
        plugin: 'whiteboard',
        action: 'whiteboard.text',
        payload: { args: [], kwargs: { id: 't1', text }, refs: [] },
      },
    ]);
    expect(plugin.contentFor('t1')).toBe(text);
  });

  it('returns different content for different ids, without cross-contamination', () => {
    const { plugin, committed } = pluginWithContent();
    plugin.commit([
      {
        plugin: 'whiteboard',
        action: 'whiteboard.text',
        payload: { args: [], kwargs: { id: 'x', text: 'plain' }, refs: [] },
      },
    ]);
    expect(plugin.contentFor('eq1')).toBe(committed);
    expect(plugin.contentFor('x')).toBe('plain');
  });

  it('resolves through the standalone helper as well as the plugin', () => {
    const { plugin, committed } = pluginWithContent();
    expect(resolveContentRef(plugin.document, 'eq1')).toBe(committed);
  });
});

describe('TEST-206 / an unresolvable reference is rejected, not substituted', () => {
  it('returns undefined for an unknown reference', () => {
    const { plugin } = pluginWithContent();
    expect(plugin.contentFor('nope')).toBeUndefined();
    expect(resolveContentRef(plugin.document, 'nope')).toBeUndefined();
  });

  it('does not fall back to a similar id', () => {
    const { plugin } = pluginWithContent();
    // `eq` is a prefix of `eq1`. A fuzzy resolver would find something; this must find nothing.
    expect(plugin.contentFor('eq')).toBeUndefined();
    expect(plugin.contentFor('eq1 ')).toBeUndefined();
    expect(plugin.contentFor('EQ1')).toBeUndefined();
  });

  it('reports E_UNRESOLVED_REF through the contributed stage', () => {
    const { plugin } = pluginWithContent();
    const stage = boardResolutionStage(() => plugin.document);
    const errors = stage.validate(
      {
        action: 'whiteboard.text',
        args: [],
        kwargs: { id: 'new', text: 'x', content_ref: 'missing' },
        raw: '[whiteboard.text]',
      },
      {},
    ) ?? [];
    expect(errors).toHaveLength(1);
    expect(errors[0]?.code).toBe('E_UNRESOLVED_REF');
    expect(errors[0]?.subject).toBe('content_ref');
  });

  it('accepts a content_ref that does resolve', () => {
    const { plugin } = pluginWithContent();
    const stage = boardResolutionStage(() => plugin.document);
    const errors = stage.validate(
      {
        action: 'whiteboard.text',
        args: [],
        kwargs: { id: 'new', text: 'x', content_ref: 'eq1' },
        raw: '[whiteboard.text]',
      },
      {},
    ) ?? [];
    expect(errors.filter((error) => error.subject === 'content_ref')).toEqual([]);
  });
});

describe('TEST-206 / content tracks the document', () => {
  it('stops resolving once the element is erased', () => {
    const { plugin, committed } = pluginWithContent();
    expect(plugin.contentFor('eq1')).toBe(committed);
    plugin.commit([
      {
        plugin: 'whiteboard',
        action: 'whiteboard.erase',
        payload: { args: [], kwargs: { target: 'eq1' }, refs: [] },
      },
    ]);
    // Read from the element, so erasing the element erases the content. A parallel copy would still
    // be answering here, which is exactly the drift a second store introduces.
    expect(plugin.contentFor('eq1')).toBeUndefined();
  });

  it('stops resolving once the layer holding it is cleared', () => {
    const { plugin } = pluginWithContent();
    plugin.commit([
      {
        plugin: 'whiteboard',
        action: 'whiteboard.clear',
        payload: { args: [], kwargs: { layer: 'truth' }, refs: [] },
      },
    ]);
    expect(plugin.contentFor('eq1')).toBeUndefined();
  });
});

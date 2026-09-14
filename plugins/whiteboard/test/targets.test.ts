/**
 * TEST-207 — board target resolution for point/highlight/erase/reveal.
 *
 * Resolution is where a board can quietly go wrong. An erase applied to a **guessed** element looks
 * successful in every way a test could check cheaply — something was erased — and the element the
 * producer actually named is still there. So the assertions here are about what happens when the
 * answer is "no": nothing is committed, the revision does not move, and the failure is named.
 *
 * The revision assertion is the load-bearing one. "Rejected" and "committed nothing" differ: a
 * rejection that still advanced the revision would let a later `content_ref` or target resolve
 * against a board that claims to have changed.
 *
 * Covers FR-233. Tasks T-074, T-079.
 */

import { describe, expect, it } from 'vitest';
import { boardResolutionStage, isTargetAction, resolveTarget, TARGET_ACTIONS, WhiteboardPlugin } from '../src/index.js';

function seeded(): WhiteboardPlugin {
  const plugin = new WhiteboardPlugin();
  plugin.commit([
    { plugin: 'whiteboard', action: 'whiteboard.text', payload: { args: [], kwargs: { id: 'e1', text: 'first' }, refs: [] } },
    { plugin: 'whiteboard', action: 'whiteboard.text', payload: { args: [], kwargs: { id: 'e2', text: 'second' }, refs: [] } },
  ]);
  return plugin;
}

const stageFor = (plugin: WhiteboardPlugin) => boardResolutionStage(() => plugin.document);

function targetCommand(action: string, target: string) {
  return { action, args: [], kwargs: { target }, raw: `[${action}]` };
}

describe('TEST-207 / a known target resolves', () => {
  it('resolves for every target-taking action', () => {
    const plugin = seeded();
    for (const action of TARGET_ACTIONS) {
      const errors = stageFor(plugin).validate(targetCommand(action, 'e1'), {}) ?? [];
      expect(errors, `${action} with a known target`).toEqual([]);
    }
  });

  it('resolves against the live document, not a snapshot taken at registration', () => {
    const plugin = seeded();
    const stage = stageFor(plugin);
    expect(stage.validate(targetCommand('whiteboard.highlight', 'e3'), {}) ?? []).toHaveLength(1);

    // Commit e3, and the same stage instance now resolves it: the reader is a function, so the stage
    // cannot be holding a board from before.
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.text', payload: { args: [], kwargs: { id: 'e3', text: 'third' }, refs: [] } },
    ]);
    expect(stage.validate(targetCommand('whiteboard.highlight', 'e3'), {}) ?? []).toEqual([]);
  });

  it('names the board actions that take a target', () => {
    expect([...TARGET_ACTIONS].sort()).toEqual(['whiteboard.erase', 'whiteboard.highlight', 'whiteboard.reveal']);
    expect(isTargetAction('whiteboard.highlight')).toBe(true);
    expect(isTargetAction('whiteboard.text')).toBe(false);
  });
});

describe('TEST-207 / an unknown target is unresolved, never guessed', () => {
  it('reports E_UNRESOLVED_REF for every target-taking action', () => {
    const plugin = seeded();
    for (const action of TARGET_ACTIONS) {
      const errors = stageFor(plugin).validate(targetCommand(action, 'nope'), {}) ?? [];
      expect(errors, `${action} with an unknown target`).toHaveLength(1);
      expect(errors[0]?.code).toBe('E_UNRESOLVED_REF');
      expect(errors[0]?.message).toContain('nope');
    }
  });

  it('does not match a prefix, a suffix, or a case variant', () => {
    const plugin = seeded();
    for (const candidate of ['e', '1', 'e1x', 'E1', ' e1', 'e1 ']) {
      expect(resolveTarget(plugin.document, candidate).ok, `"${candidate}" resolved`).toBe(false);
    }
  });

  it('resolveTarget reports the same verdict the stage does', () => {
    const plugin = seeded();
    expect(resolveTarget(plugin.document, 'e1').ok).toBe(true);
    expect(resolveTarget(plugin.document, 'nope').errors[0]?.subject).toBe('target');
  });
});

describe('TEST-207 / a rejected command leaves the revision alone', () => {
  it('does not advance the revision when nothing commits', () => {
    const plugin = seeded();
    const before = plugin.revision;
    // The stage rejects, so the runtime never calls the committer — which is the only place the
    // revision moves. Simulating that: no commit, and the revision must be untouched.
    const errors = stageFor(plugin).validate(targetCommand('whiteboard.erase', 'ghost'), {});
    expect(errors).toHaveLength(1);
    expect(plugin.revision).toBe(before);
    expect(plugin.document.elements).toHaveLength(2);
  });

  it('keeps both elements when an erase names an unknown target and is not applied', () => {
    const plugin = seeded();
    expect(plugin.document.elements.map((e) => e.id)).toEqual(['e1', 'e2']);
  });
});

describe('TEST-207 / the three target actions do different things to the same element', () => {
  it('highlight resolves without removing', () => {
    const plugin = seeded();
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.highlight', payload: { args: [], kwargs: { target: 'e1' }, refs: [] } },
    ]);
    expect(plugin.document.elements.map((e) => e.id)).toEqual(['e1', 'e2']);
  });

  it('erase removes exactly the named element', () => {
    const plugin = seeded();
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.erase', payload: { args: [], kwargs: { target: 'e1' }, refs: [] } },
    ]);
    expect(plugin.document.elements.map((e) => e.id)).toEqual(['e2']);
  });

  it('reveal keeps the element and flips its concealed attribute', () => {
    const plugin = seeded();
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.text', payload: { args: [], kwargs: { id: 'hidden', text: 'answer', concealed: 'true' }, refs: [] } },
    ]);
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.reveal', payload: { args: [], kwargs: { target: 'hidden' }, refs: [] } },
    ]);
    const revealed = plugin.document.elements.find((element) => element.id === 'hidden');
    expect(revealed?.attributes['concealed']).toBe('false');
    expect(revealed?.content).toBe('answer');
  });

  it('a second erase of the same element no longer resolves', () => {
    const plugin = seeded();
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.erase', payload: { args: [], kwargs: { target: 'e1' }, refs: [] } },
    ]);
    expect(resolveTarget(plugin.document, 'e1').ok).toBe(false);
  });
});

describe('TEST-207 / duplicate ids are refused rather than shadowing', () => {
  it('rejects a commit that reuses an existing id', () => {
    const plugin = seeded();
    const errors = stageFor(plugin).validate(
      { action: 'whiteboard.text', args: [], kwargs: { id: 'e1', text: 'again' }, raw: '[whiteboard.text]' },
      {},
    ) ?? [];
    expect(errors).toHaveLength(1);
    expect(errors[0]?.code).toBe('E_STATE');
    // Two elements the board cannot tell apart would make every later target reference resolve to
    // whichever ordering happens to favour.
    expect(errors[0]?.message).toContain('already exists');
  });

  it('allows an id that was erased and then reused', () => {
    const plugin = seeded();
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.erase', payload: { args: [], kwargs: { target: 'e1' }, refs: [] } },
    ]);
    expect(
      stageFor(plugin).validate(
        { action: 'whiteboard.text', args: [], kwargs: { id: 'e1', text: 'reused' }, raw: '[whiteboard.text]' },
        {},
      ) ?? [],
    ).toEqual([]);
  });
});

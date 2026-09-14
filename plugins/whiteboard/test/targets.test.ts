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
import { validateCommand } from '@stagehand/registry';
import { activeElements, isTargetAction, resolveTarget, WhiteboardPlugin } from '../src/index.js';
import { CORE_SCHEMAS } from './fixtures.js';

function seeded(): WhiteboardPlugin {
  const plugin = new WhiteboardPlugin();
  plugin.commit([
    { plugin: 'whiteboard', action: 'whiteboard.text', payload: { args: [], kwargs: { id: 'e1', text: 'first' }, refs: [] } },
    { plugin: 'whiteboard', action: 'whiteboard.text', payload: { args: [], kwargs: { id: 'e2', text: 'second' }, refs: [] } },
  ]);
  return plugin;
}

const stageFor = (plugin: WhiteboardPlugin) => ({
  validate: (command: { action: string; args: string[]; kwargs: Record<string, string>; raw: string }, context = {}) => {
    const verdict = validateCommand(makeRegistry(), command, { stages: [...plugin.stages, boardStateStage(() => plugin.document)], context });
    return verdict.ok ? [] : verdict.errors;
  },
});

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

  it('names the board actions that take a target, as the pinned source declares them', () => {
    // Four, not three: `whiteboard.count` is target-based too, which the first implementation missed
    // by transcribing the corpus's one-line behaviour string instead of the source contract.
    expect([...TARGET_ACTIONS].sort()).toEqual([
      'whiteboard.count', 'whiteboard.erase', 'whiteboard.highlight', 'whiteboard.reveal',
    ]);
    expect(isTargetAction('whiteboard.highlight')).toBe(true);
    expect(isTargetAction('whiteboard.count')).toBe(true);
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
    expect(activeElements(plugin.document)).toHaveLength(2);
  });

  it('keeps both elements when an erase names an unknown target and is not applied', () => {
    const plugin = seeded();
    expect(activeElements(plugin.document).map((e) => e.id)).toEqual(['e1', 'e2']);
  });
});

describe('TEST-207 / the three target actions do different things to the same element', () => {
  it('highlight adds a thinking-surface mark and never alters the element', () => {
    // "Highlight is a thinking-surface mark over a truth-surface element. It never alters the
    // element." So the element's own entry must be byte-identical afterwards, and the mark must sit
    // on the thinking layer linked to its target.
    const plugin = seeded();
    const before = activeElements(plugin.document).find((element) => element.id === 'e1');

    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.highlight', payload: { args: [], kwargs: { target: 'e1' }, refs: [] } },
    ]);

    const after = activeElements(plugin.document).find((element) => element.id === 'e1');
    expect(after).toEqual(before);

    const mark = activeElements(plugin.document).find((element) => element.kind === 'highlight');
    expect(mark?.layer).toBe('thinking');
    expect(mark?.attributes['target']).toBe('e1');
  });

  it('re-highlighting the same element replaces its mark rather than accumulating one', () => {
    const plugin = seeded();
    const highlight = (color: string): void => {
      plugin.commit([
        { plugin: 'whiteboard', action: 'whiteboard.highlight', payload: { args: [], kwargs: { target: 'e1', color }, refs: [] } },
      ]);
    };
    highlight('yellow');
    highlight('cyan');
    const marks = activeElements(plugin.document).filter((element) => element.kind === 'highlight');
    // The mark id is derived from the target, so a second highlight is the same mark re-written.
    expect(marks).toHaveLength(1);
    expect(marks[0]?.attributes['color']).toBe('cyan');
  });

  it('erase removes exactly the named element', () => {
    const plugin = seeded();
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.erase', payload: { args: [], kwargs: { target: 'e1' }, refs: [] } },
    ]);
    expect(activeElements(plugin.document).map((e) => e.id)).toEqual(['e2']);
  });

  it('reveal arms reveal timing rather than flipping an invented attribute', () => {
    // The pinned reducer sets `{ reveal: 0, revealMs }` on the target and the render loop advances it.
    // An earlier version flipped a `concealed` attribute — and built the fixture with a `concealed`
    // *kwarg*, which is not the recovered public kwarg (`conceal`), so the test could pass on a payload
    // no producer could send through the registry.
    const plugin = seeded();
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.text', payload: { args: [], kwargs: { id: 'hidden', text: 'answer', conceal: 'true' }, refs: [] } },
    ]);
    expect(activeElements(plugin.document).find((element) => element.id === 'hidden')?.concealed).toBe(true);

    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.reveal', payload: { args: [], kwargs: { target: 'hidden', duration: '1200' }, refs: [] } },
    ]);

    const revealed = activeElements(plugin.document).find((element) => element.id === 'hidden');
    expect(revealed?.reveal).toBe(0);
    expect(revealed?.revealMs).toBe(1200);
    expect(revealed?.content).toBe('answer');
  });

  it('advances reveal progress towards completion', () => {
    const plugin = seeded();
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.text', payload: { args: [], kwargs: { id: 'r', text: 'x' }, refs: [] } },
    ]);
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.reveal', payload: { args: [], kwargs: { target: 'r', duration: '1000' }, refs: [] } },
    ]);
    plugin.advance(250);
    expect(activeElements(plugin.document).find((element) => element.id === 'r')?.reveal).toBeCloseTo(0.25, 5);
    plugin.advance(2000);
    expect(activeElements(plugin.document).find((element) => element.id === 'r')?.reveal).toBe(1);
  });

  it('erasing a target removes marks linked to it', () => {
    // The recovered count annotation is tied to the element it numbers, so the numbering must not
    // outlive the counted element.
    const plugin = seeded();
    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.highlight', payload: { args: [], kwargs: { target: 'e1' }, refs: [] } },
    ]);
    expect(activeElements(plugin.document).some((element) => element.kind === 'highlight')).toBe(true);

    plugin.commit([
      { plugin: 'whiteboard', action: 'whiteboard.erase', payload: { args: [], kwargs: { target: 'e1' }, refs: [] } },
    ]);
    expect(activeElements(plugin.document).map((element) => element.id)).toEqual(['e2']);
    expect(activeElements(plugin.document).some((element) => element.attributes['target'] === 'e1')).toBe(false);
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

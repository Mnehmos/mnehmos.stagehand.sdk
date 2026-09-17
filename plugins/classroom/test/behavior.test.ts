/**
 * FEAT-013..015 — classroom plugin behavior.
 *
 * Covers avatar staging (FEAT-013), projector/media (FEAT-014), and lesson state (FEAT-015)
 * through the plugin's own committer.
 */

import { describe, expect, it } from 'vitest';
import { ClassroomPlugin, EMPTY_CLASSROOM, reduceClassroom } from '../src/index.js';

function apply(plugin: ClassroomPlugin, action: string, kwargs: Record<string, string> = {}): void {
  plugin.commit([{ plugin: 'classroom', action, payload: { args: [], kwargs, refs: [] } }]);
}

describe('FEAT-013 / avatar staging', () => {
  it('avatar.move updates the position', () => {
    const plugin = new ClassroomPlugin();
    apply(plugin, 'avatar.move', { target: 'desk' });
    expect(plugin.document.avatarPosition).toBe('desk');
  });

  it('avatar.look updates the gaze', () => {
    const plugin = new ClassroomPlugin();
    apply(plugin, 'avatar.look', { direction: 'board' });
    expect(plugin.document.gaze).toBe('board');
  });

  it('avatar.face updates the expression', () => {
    const plugin = new ClassroomPlugin();
    apply(plugin, 'avatar.face', { '0': 'warm' });
    expect(plugin.document.facialExpression).toBe('warm');
  });
});

describe('FEAT-014 / projector state machine', () => {
  it('projector.prepare adds to prepared sources', () => {
    const plugin = new ClassroomPlugin();
    apply(plugin, 'projector.prepare', { id: 'video-1' });
    expect(plugin.document.preparedSources).toContain('video-1');
  });

  it('projector.source attaches a prepared source', () => {
    const plugin = new ClassroomPlugin();
    apply(plugin, 'projector.prepare', { id: 'video-1' });
    apply(plugin, 'projector.source', { id: 'video-1' });
    expect(plugin.document.attachedSourceId).toBe('video-1');
  });

  it('projector.lower and raise toggle the screen', () => {
    const plugin = new ClassroomPlugin();
    apply(plugin, 'projector.lower');
    expect(plugin.document.projectorScreenDown).toBe(true);
    apply(plugin, 'projector.raise');
    expect(plugin.document.projectorScreenDown).toBe(false);
  });
});

describe('FEAT-015 / lesson state', () => {
  it('lesson.ask sets questionPending', () => {
    const plugin = new ClassroomPlugin();
    apply(plugin, 'lesson.ask', { text: 'What is 2+2?' });
    expect(plugin.document.questionPending).toBe(true);
  });

  it('lesson.assess clears questionPending', () => {
    const plugin = new ClassroomPlugin();
    apply(plugin, 'lesson.ask', { text: 'What is 2+2?' });
    apply(plugin, 'lesson.assess', { correct: 'true' });
    expect(plugin.document.questionPending).toBe(false);
  });

  it('lesson.phase sets the phase', () => {
    const plugin = new ClassroomPlugin();
    apply(plugin, 'lesson.phase', { kind: 'model' });
    expect(plugin.document.lessonPhase).toBe('model');
  });

  it('lesson.complete resets the phase and question', () => {
    const plugin = new ClassroomPlugin();
    apply(plugin, 'lesson.phase', { kind: 'model' });
    apply(plugin, 'lesson.ask', { text: 'q' });
    apply(plugin, 'lesson.complete');
    expect(plugin.document.lessonPhase).toBeNull();
    expect(plugin.document.questionPending).toBe(false);
  });
});

describe('classroom / the revision counts commands', () => {
  it('each command advances the revision by one', () => {
    const plugin = new ClassroomPlugin();
    apply(plugin, 'avatar.look', { direction: 'board' });
    apply(plugin, 'room.lights', { zones: 'board' });
    apply(plugin, 'camera.focus', { target: 'projector' });
    expect(plugin.revision).toBe(3);
  });

  it('the reducer is pure', () => {
    const kwargs = { target: 'board' };
    const a = reduceClassroom(EMPTY_CLASSROOM, 'camera.focus', kwargs);
    const b = reduceClassroom(EMPTY_CLASSROOM, 'camera.focus', kwargs);
    expect(b).toEqual(a);
  });
});

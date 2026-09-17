import { CapabilityRegistry } from '@stagehand/registry';
import type { CanonicalEffect, EffectCommitter } from '@stagehand/runtime';

export interface ClassroomDocument {
  readonly revision: number;
  readonly avatarPosition: string | null;
  readonly gaze: string;
  readonly facialExpression: string;
  readonly lightZone: string;
  readonly roomMode: string | null;
  readonly cameraTarget: string;
  readonly projectorScreenDown: boolean;
  readonly attachedSourceId: string | null;
  readonly preparedSources: readonly string[];
  readonly lessonPhase: string | null;
  readonly questionPending: boolean;
}

export const EMPTY_CLASSROOM: ClassroomDocument = Object.freeze({
  revision: 0,
  avatarPosition: null,
  gaze: 'student',
  facialExpression: 'neutral',
  lightZone: 'all',
  roomMode: null,
  cameraTarget: 'teacher',
  projectorScreenDown: false,
  attachedSourceId: null,
  preparedSources: Object.freeze([]),
  lessonPhase: null,
  questionPending: false,
});

export function reduceClassroom(doc: ClassroomDocument, action: string, kw: Readonly<Record<string, string>>): ClassroomDocument {
  const rev = doc.revision + 1;
  switch (action) {
    case 'avatar.move': return { ...doc, revision: rev, avatarPosition: kw['target'] ?? kw['0'] ?? null };
    case 'avatar.look': return { ...doc, revision: rev, gaze: kw['0'] ?? kw['direction'] ?? doc.gaze };
    case 'avatar.face': return { ...doc, revision: rev, facialExpression: kw['0'] ?? doc.facialExpression };
    case 'room.lights': return { ...doc, revision: rev, lightZone: kw['zones'] ?? doc.lightZone };
    case 'room.mode': return { ...doc, revision: rev, roomMode: kw['mode'] ?? null };
    case 'camera.focus': return { ...doc, revision: rev, cameraTarget: kw['target'] ?? doc.cameraTarget };
    case 'projector.prepare': { const id = kw['id'] ?? ''; return { ...doc, revision: rev, preparedSources: id ? [...doc.preparedSources, id] : doc.preparedSources }; }
    case 'projector.source': return { ...doc, revision: rev, attachedSourceId: kw['id'] ?? null };
    case 'projector.lower': return { ...doc, revision: rev, projectorScreenDown: true };
    case 'projector.raise': return { ...doc, revision: rev, projectorScreenDown: false };
    case 'lesson.phase': return { ...doc, revision: rev, lessonPhase: kw['kind'] ?? null };
    case 'lesson.ask': return { ...doc, revision: rev, questionPending: true };
    case 'lesson.assess': return { ...doc, revision: rev, questionPending: false };
    case 'lesson.complete': return { ...doc, revision: rev, lessonPhase: null, questionPending: false };
    default: return { ...doc, revision: rev };
  }
}

export class ClassroomPlugin implements EffectCommitter {
  readonly plugin: string;
  readonly registry: CapabilityRegistry;
  #doc: ClassroomDocument = EMPTY_CLASSROOM;

  constructor(options: { plugin?: string } = {}) {
    this.plugin = options.plugin ?? 'classroom';
    this.registry = new CapabilityRegistry([]);
  }

  get document(): ClassroomDocument { return this.#doc; }
  get revision(): number { return this.#doc.revision; }

  commit(effects: readonly CanonicalEffect[]): void {
    for (const effect of effects) {
      const kw = (effect.payload['kwargs'] ?? {}) as Record<string, string>;
      this.#doc = reduceClassroom(this.#doc, effect.action, kw);
    }
  }
}

export { reduceClassroom as _reduceClassroom };

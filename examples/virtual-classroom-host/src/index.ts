/**
 * @stagehand/example-virtual-classroom-host
 * Owner: FEAT-018. Host model and narration configuration.
 *
 * Provider keys, TTS settings, media endpoints, and deadlines stay in the host.
 * The SDK receives injected interfaces and never reads environment variables.
 */
import type { EffectCommitter } from '@stagehand/runtime';

export interface HostConfig {
  readonly directorModel: string;
  readonly ttsVoice: string;
  readonly ttsModel: string;
  readonly ttsSpeed: string;
  readonly mediaProvider: string;
  readonly mediaDeadlineMs: number;
  readonly openrouterApiKey: string | null;
}

export function loadHostConfig(env: Readonly<Record<string, string | undefined>>): HostConfig {
  return {
    directorModel: env['VC_DIRECTOR_MODEL'] ?? '',
    ttsVoice: env['VC_TTS_VOICE'] ?? '',
    ttsModel: env['VC_TTS_MODEL'] ?? '',
    ttsSpeed: env['VC_TTS_SPEED'] ?? '1.0',
    mediaProvider: env['VC_MEDIA_PROVIDER'] ?? '',
    mediaDeadlineMs: Number(env['VC_MEDIA_DEADLINE_MS'] ?? '5000'),
    openrouterApiKey: env['OPENROUTER_API_KEY'] ?? null,
  };
}

/** A no-op committer for hosts that want to inspect effects without applying them. */
export class RecordingHost implements EffectCommitter {
  readonly plugin = 'vc-host';
  readonly effects: { action: string; payload: Readonly<Record<string, unknown>> }[] = [];

  commit(effects: readonly import('@stagehand/runtime').CanonicalEffect[]): void {
    for (const effect of effects) {
      this.effects.push({ action: effect.action, payload: effect.payload });
    }
  }
}

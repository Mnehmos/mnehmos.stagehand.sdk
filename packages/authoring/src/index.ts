/**
 * @stagehand/authoring — author- and agent-facing helpers.
 *
 * Owner of FEAT-004 (beat objects) and FEAT-011 (presentation and receipt linting). Requirement
 * ranges `FR-187..FR-192` and `FR-224..FR-227`; parity exits `TEST-177..TEST-180` and
 * `TEST-200..TEST-202`. See `specs/006-compound-choreography/spec.md`.
 *
 * These are the shapes a producer or an agent reads and writes, kept separate from the SDK's internal
 * IR: the beat object keeps its recovered `snake_case` field names because it is a wire shape, not an
 * internal one, and normalising it would break producers that already emit it.
 */

export {
  describeBeat,
  fromBeatObject,
  NotABeatError,
  toBeatObject,
  type BeatObject,
  type BeatStep,
} from './beat-object.js';

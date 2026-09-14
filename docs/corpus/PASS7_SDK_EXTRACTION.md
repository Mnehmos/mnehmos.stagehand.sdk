# Pass 7 — Final SDK Extraction Boundary

## Canonical architecture

```text
Model / authored script / deterministic producer
                    |
                    v
             mixed text stream
                    |
          @stagehand/parser
                    |
       narration + proposed IR
                    |
      @stagehand/registry + policy
                    |
     layered validation / canonicalize
                    |
       semantic compile / adapters
                    |
          @stagehand/runtime
          /       |       \
         v        v        v
      effects   trace   readiness
         |                 |
         +------ host -----+
```

## Packages

### `@stagehand/core`
Owns protocol types only: command, script segment, compound/beat IR, validation result, canonical effect envelope, version identifiers.

### `@stagehand/parser`
Owns batch + streaming mixed-stream parsing, robust lexical handling, compound folding, safe lexical recovery, and command/narration separation. Default semantics should include the fixes proven necessary by Virtual Classroom: nesting, `[end]`, safe apostrophes/LaTeX, bracket-loss suppression.

### `@stagehand/registry`
Owns command/plugin schemas, introspection, generated authoring descriptions, schema-set version/hash, and capability negotiation. A command cannot exist only in a TypeScript union; registry membership is authoritative.

### `@stagehand/runtime`
Owns the execution pipeline and transactional boundaries:

```text
parse -> validate -> compile -> resolve -> authorize -> commit -> trace
```

The model never directly mutates host state.

### `@stagehand/trace`
Owns public/private channels, replay envelopes, accepted/rejected command records, resolution data, protocol/schema/plugin versions, adapter version, and optional asset-manifest hashes.

### `@stagehand/readiness`
Owns independently keyed settling channels, deadlines, cancellation generations, and stale-wait prevention.

### `@stagehand/authoring`
Owns generated prompt/digest material, authoring lint, placement metadata, and static composition checks. It consumes the same registry used by validation.

## Host plugins

```text
@stagehand/plugin-chess
@stagehand/plugin-clio-geo
@stagehand/plugin-classroom
@stagehand/plugin-dom-presenter
```

Plugins own domain command schemas, resolvers, validators, compiler passes, state adapters, and renderer readiness signaling. They do not own the mixed-stream parser or generic trace/event machinery.

## Canonical protocol invariants

1. Narration and control may coexist in one stream, but are separate after parsing.
2. Raw model output is never public state.
3. Unknown commands fail closed.
4. No effect is committed before validation/resolution/authorization.
5. Schema/registry is the source of truth for both model affordances and runtime acceptance.
6. Compound semantics are explicit, not inferred from timing accidents.
7. Readiness is keyed, bounded, and interruptible.
8. Rejection is observable privately but produces no partial public effect.
9. Every committed effect is replayable from a versioned trace.
10. Host state remains outside generic core.
11. Semantic repair is opt-in; safe lexical recovery may be default.
12. Producer dialects compile into a canonical effect IR instead of teaching every renderer every dialect.

## Final recommendation

Do not package Clio's current `src/stagehand` directory verbatim. Build the SDK from the recovered invariant set and use Clio/Virtual Classroom as conformance fixtures. Virtual Classroom is not merely another consumer; it contains protocol-level repairs that belong upstream in the shared core.

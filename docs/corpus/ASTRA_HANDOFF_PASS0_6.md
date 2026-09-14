# Astra Handoff — Stagehand SDK Reconstruction after Pass 6

## What Astra should assume

Do **not** rebuild Clio's `src/stagehand` as a package verbatim. The evidence shows Stagehand evolved materially across LLM-Chess, Clio, Virtual Classroom, and the VCB presenter. The new SDK should preserve the architecture and invariants while choosing the strongest behavior from later applications.

## Working definition

**Stagehand is a headless, model-agnostic mixed-stream compiler/runtime that turns untrusted narration-plus-control into validated, traceable, synchronized host effects.**

## Recommended package shape for Spec Kit planning

```text
packages/
  core/            Command, Segment, Schema, Result, version types
  parser/          batch + streaming compiler; VC-safe lexer baseline
  registry/        capability registration + introspection
  runtime/         ordered validation/resolution/commit pipeline
  trace/           public/private events, versioned replay envelope
  readiness/       keyed settle channels, deadlines, cancellation epochs
  authoring/       schema-derived prompt digest, lint, beat reports
  compatibility/
    llm-chess/      forgiving legacy annotation parser (opt-in)
plugins/
  chess/
  geo-clio/
  classroom/
  dom-presenter/
examples/
  minimal-console/
  narrated-dom/
  chess-board/
  clio-map/
  virtual-classroom/
```

## Non-negotiable core invariants

1. Raw producer output is never a public effect.
2. Narration/control are parsed before release.
3. Only registered capabilities can commit.
4. Schema is the source of truth for validation and producer introspection.
5. Domain refs resolve through host registries, never model-invented coordinates/pointers by default.
6. Rejection is terminal for that command/atomic group.
7. Repair is explicit, conservative, traced, and never semantic by default.
8. Readiness waits are deadline bounded and cancellation-generation safe.
9. Public events and production diagnostics are separate typed channels.
10. Trace envelopes are protocol/plugin/version stamped and replayable without another model call.
11. Compounds support nesting; syntax must handle apostrophes and LaTeX/backslashes safely.
12. Core has zero model-provider, renderer, map, Three.js, chess, DOM, or classroom dependencies.

## Strong divergences to encode in the future Spec Kit

- Prefer VC parser semantics over Clio parser for nesting/quotes/control leakage.
- Generalize VC five-layer validator into pluggable validator stages.
- Generalize VC readiness/event trace into core packages.
- Preserve Clio introspection/authoring/visual-QA ideas as optional authoring package.
- Keep Clio v2→v1 adapter concept but rename/formalize it as effect compilation.
- Keep LLM-Chess inference only as explicit compatibility mode.
- Do not carry Clio `claim.show` or ambiguous `map.timecursor` contract until U-007/U-008 resolve.

## Next command

Run Pass 7 adversarial sweep against this corpus, with executable checkouts if possible. Then Pass 8 should collapse the 168 surfaces into features **by integrator/user capability, not by original repository/module**.

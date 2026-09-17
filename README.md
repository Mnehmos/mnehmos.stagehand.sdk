# Mnehmos Stagehand SDK

**Stagehand is a headless, model-agnostic mixed-stream compiler/runtime that turns untrusted
narration-plus-control into validated, traceable, synchronized host effects.**

Language models produce prose with inline control syntax mixed into it. Stagehand is the layer that
separates the two, validates the control against a single capability registry, compiles it into a
canonical effect IR, commits only what is authorized, and records a replayable trace — without
knowing anything about your renderer, your map, your model provider, or your domain.

```text
untrusted stream → parse → registry validation → plugin/state validation
                 → reference resolution → canonical effect compilation
                 → authorized commit → trace
```

Raw producer output is never a public effect. Rejection is terminal for the command or the atomic
group.

## What it is for

- **Host authors** who receive model output and need to execute its control portion without
  trusting it.
- **Plugin authors** who own a domain surface — a map, a classroom, a whiteboard, a chess board, a
  DOM article — and want a stable contract for how narration drives it.
- **Integrators** who must audit and replay what a model made the system do, with no model call
  during replay.

## Status

All 18 features are represented in `specs/` with identity declarations passing `check:ids`. Eight features (FEAT-001..006, FEAT-012) are implemented with behavioral tests through the public validation/execution path. The remaining ten features (FEAT-007..011, FEAT-013..018) have schemas, committers, and basic behavioral tests in their owning plugins; their spec-to-source depth is thinner than the converged features and should be deepened before their milestone reviews.

## Known limitations

- **`U-002`/`U-003` licensing** — the LLM-Chess and Virtual Classroom source projects have no root LICENSE. Constitution Article XI gates distribution of source-derived compatibility material on resolution.
- **Build pipeline** — `pnpm build` emits `dist/` for all packages via project references, but the artifacts have not been tested for end-user consumption from a package manager.
- **Source-evidence depth** — FEAT-008..018 specs have identity declarations and basic behavioral coverage but their requirement text is thinner than FEAT-001..006's.
- **Naming** — see the branding note above.

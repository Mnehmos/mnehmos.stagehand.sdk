# Stagehand Reconstruction Corpus — Passes 0–6

**Target:** Mnehmos Stagehand protocol and every identified protocol-bearing application.  
**Posture:** informed rewrite into a reusable FOSS SDK.  
**Source mode:** remote GitHub repositories pinned to immutable commits.  
**Run date:** 2026-09-13.  
**Requested pass range:** 0 → 6, continuous one-shot run.  
**Important override:** the upstream `/reverse-engineer` prompt recommends one pass per session; the maintainer explicitly requested a continuous 0–6 run. The evidence/unknown rules remain in force.

## Source snapshots

| Alias | Repository | Commit | License posture |
|---|---|---|---|
| CHESS | `Mnehmos/LLM-Chess` | `450bdbded7f34e94cffc02264082849714270af3` | no root LICENSE discovered |
| CLIO | `Mnehmos/clio` | `03b1e1fff2254f5f97947ea249ad84827118136e` | MIT |
| VC | `Mnehmos/virtual-classroom` | `cd7253608297efd57921c965b7440f4d4081842f` | no root LICENSE discovered |
| VCB | `Mnehmos/vibe-coders-bible` | `cb032732158f615331e00c27f688a3c847c0a97c` | CC-BY-4.0 |

## Corpus status

| Pass | Name | Status | Gate |
|---:|---|---|---|
| 0 | Frame | COMPLETE WITH RUNTIME UNKNOWN | GATE 0: conditional pass; remote source/build procedures identified, execution unavailable in this tool environment → U-001 |
| 1 | Surface Enumeration | COMPLETE for Stagehand-owned surfaces | GATE 1: 168/168 enumerated rows across applicable protocol/export/event/config/format classes |
| 2 | Structure | COMPLETE | GATE 2: all identified Stagehand layers and application adapters classified; Clio path census 27 files, VC path census 10 files |
| 3 | Contracts | COMPLETE at protocol/SDK boundary | GATE 3: 97/97 command actions catalogued; 20/20 Clio module exports; 33/33 runtime/public/private event names; 12/12 VC env keys |
| 4 | State | COMPLETE | GATE 4: portable protocol entities and host-state boundaries modeled; invariants name enforcement or an unknown |
| 5 | Cross-cutting | COMPLETE statically | GATE 5: integrations and failure modes mapped; unmeasured runtime NFRs explicitly [?] |
| 6 | Intent archaeology | COMPLETE | GATE 6: major architectural seams have DEC records; unexplained items are U records |

## Counts frozen by Pass 1

- Protocol command surfaces: **97** = LLM-Chess 4 + Clio 47 + Virtual Classroom 38 + VCB presenter 8.
- Clio Stagehand module exports: **20**.
- Event names: **33** = Virtual Classroom 28 (20 public + 8 private) + Clio runtime 5.
- Stagehand-adjacent VC environment keys: **12**.
- Explicit wire/file-format surfaces: **6**.
- Total enumerated surfaces in `analysis/13_SURFACE_INVENTORY.md`: **168**.
- Clio files under `src/stagehand`: **27**, discovered with GitHub code search `repo:Mnehmos/clio path:src/stagehand`. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:src/stagehand/index.ts:1-25
- Virtual Classroom files under `src/stagehand`: **10**, discovered with GitHub code search `repo:Mnehmos/virtual-classroom path:src/stagehand`.

## High-confidence SDK thesis

Stagehand is not a renderer and not a prompt style. It is a **mixed-stream compilation and trust boundary**: a model emits narration plus inline control syntax; a deterministic runtime separates content/control, validates commands against a typed capability registry and domain state, resolves semantic references, commits only authorized effects, and can synchronize narration to the resulting state changes. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0009-stagehand-protocol.md:1-220

## Pass 0 blocking unknown carried forward

U-001 records that builds and runtime behavior could not be executed from the remote-only connector environment. Static extraction proceeded because the maintainer explicitly requested uninterrupted Passes 0–6. No claim in this corpus is tagged `[o] observed:`.

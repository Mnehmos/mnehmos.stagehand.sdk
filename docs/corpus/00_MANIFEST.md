# Stagehand Reconstruction Corpus — Passes 0–12

**Target:** Mnehmos Stagehand protocol family → standalone FOSS SDK specification/rebuild corpus.
**Run date:** 2026-09-13.
**Surface denominator:** 168 total; 167 live/rebuild-relevant; 1 dead (`SURF-027`).
**Features:** 18.

| Pass | Name | Status | Gate |
|---:|---|---|---|
| 0 | Frame | complete | prior corpus |
| 1 | Surface Enumeration | complete | 168/168 |
| 2 | Structure | complete | prior corpus |
| 3 | Contracts | complete | prior corpus |
| 4 | State | complete | prior corpus |
| 5 | Cross-cutting | complete | prior corpus |
| 6 | Intent archaeology | complete | prior corpus |
| 7 | Adversarial sweep | PASS | 1 dead; 167 live; 0 explicit `[i]`; T0/T1 dispositions present |
| 8 | Feature synthesis | PASS | 167/167 exactly one FEAT owner |
| 9 | Spec emission | PASS | 18/18 specs, 167 FRs, CTR-101..125 owned once |
| 10 | Constitution/rebuild/parity/traceability | PASS | locally validated |
| 11 | Spec Kit handoff | READY | seed + local analyze complete; external implement/converge not claimed |
| 12 | Final acceptance/package | PASS | deterministic corpus acceptance; implementation parity remains Pass 11 external work |

Pass 12 is a maintainer-requested extension: the source `/reverse-engineer` prompt ends at Pass 11. It is defined here as final deterministic corpus acceptance and packaging.

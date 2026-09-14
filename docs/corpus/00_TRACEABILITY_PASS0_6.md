# 00 · Traceability Seed (Passes 0–6)

Full SURF→FEAT→FR→CTR→T→TEST closure is a Pass 8–10 deliverable. This seed prevents identity loss before synthesis.

| ID range | Meaning | Current owner/evidence |
|---|---|---|
| SURF-001..004 | LLM-Chess commands | chess annotation adapter |
| SURF-005..051 | Clio declared commands | geo/showrunner plugin candidate |
| SURF-052..089 | Virtual Classroom commands | classroom plugin candidate |
| SURF-090..097 | VCB presenter commands | DOM presenter plugin candidate |
| SURF-098..117 | Clio Stagehand module exports | core/API evidence |
| SURF-118..137 | VC public events | core trace/event candidate |
| SURF-138..145 | VC private events | core diagnostics candidate |
| SURF-146..150 | Clio runtime events | runtime evidence |
| SURF-151..162 | VC environment keys | host-only controls |
| SURF-163..168 | wire/file formats | core/compat contracts |

## Decision links

- DEC-001/002 → mixed-stream parser + trust boundary.
- DEC-003 → schema registry/introspection.
- DEC-005/007 → compound/beat IR.
- DEC-009/010/011/012 → readiness, hardened parser, event/trace core.

No FEAT/FR/T/TEST IDs are issued yet; doing so before Pass 8 would prematurely freeze feature boundaries.

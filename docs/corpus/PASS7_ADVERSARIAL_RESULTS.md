# Pass 7 — Adversarial Results

Local result: **11 / 11 adversarial cases passed**.

| ID | Attack/failure mode | Expected invariant |
|---|---|---|
| A-001 | Unknown action | Reject at registry boundary |
| A-002 | Model drops all brackets | Control syntax never becomes user narration |
| A-003 | Invalid command inside atomic batch | Whole atomic group fails |
| A-004 | Unterminated quote | Hard syntax error, not silent token swallowing |
| A-005 | Declared-but-unspecified `claim.show` | Reject until schema-backed |
| A-006 | `map.timecursor` without `at` under pinned Clio schema | Detect contract mismatch |
| A-007 | Renderer never settles | Deadline resolves wait; no permanent deadlock |
| A-008 | Interruption during wait | Generation change marks waiter stale |
| A-009 | Private rejection event | Never leaks into public show-event channel |
| A-010 | Schema change | Generated authoring/introspection digest changes from same source of truth |
| A-011 | Generic core | Contains no host-specific lesson/projector/piece/room state |

The adversarial suite is a seed, not a security proof. It should become a permanent compatibility suite in the extracted package.

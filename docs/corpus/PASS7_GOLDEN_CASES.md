# Pass 7 — Golden Cases

These are the minimum portable behavior vectors the extracted SDK must preserve. They are executable in `harness/stagehand-conformance.mjs` and recorded in `golden_cases.json`.

| ID | Golden behavior | Required result |
|---|---|---|
| G-001 | Valid bracketed command | Parses and validates |
| G-002 | Quoted multi-word value | Spaces preserved |
| G-003 | Apostrophe in unquoted value | Apostrophe remains literal |
| G-004 | LaTeX/backslash payload | Backslashes survive parsing |
| G-005 | Spaces around `=` | Lexically normalized |
| G-006 | Unquoted multi-word kwarg | Schema-aware recovery without swallowing next known kwarg |
| G-007 | Nested compounds | Nested control groups flatten/compose deterministically |
| G-008 | `[end]` | Closes innermost compound |
| G-009 | Unmatched opener | Does not swallow remaining stream; surfaces visibly for validation |
| G-010 | Orphan closer | Does not execute as a host effect |

The golden corpus deliberately adopts the stronger Virtual Classroom parser semantics where Clio and Classroom diverge, because those changes are documented repairs to failures in the reusable protocol boundary rather than classroom-specific business rules.

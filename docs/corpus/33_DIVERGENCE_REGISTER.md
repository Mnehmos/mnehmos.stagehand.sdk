# Divergence Register

| ID | Change | Feature | Surfaces | Rationale |
|---|---|---|---|---|
| DIV-001 | Remove orphan `claim.show` from canonical registry | FEAT-011 | SURF-027 | A declared-but-unexecutable action is not a contract; plugins may reintroduce it only with a complete schema. |
| DIV-002 | Make `map.timecursor` unambiguous | FEAT-009 | SURF-051 | Use an explicit live-vs-at representation; omitted/empty timestamp ambiguity is forbidden. |
| DIV-003 | Use hardened VC parser semantics as the baseline | FEAT-001 | SURF-098, SURF-099, SURF-100, SURF-163, SURF-164 | Nesting, quote handling, bare-command quarantine, and batch/stream convergence supersede weaker Clio behavior. |
| DIV-004 | Disable semantic repair by default | FEAT-001 | SURF-163 | Lexical repair may recover framing; meaning-changing guesses require explicit plugin policy. |
| DIV-005 | Version the trace envelope | FEAT-005 | SURF-166 | Add protocol, schema-set, plugin, adapter, and optional asset-manifest versions plus migrator registry. |
| DIV-006 | Generate validation and introspection from one registry | FEAT-002 | SURF-106, SURF-110 | Eliminate parallel command catalogs that previously drifted. |
| DIV-007 | Keep core host- and provider-independent | FEAT-003 | SURF-151, SURF-152, SURF-153 | Map, Three.js, chess, DOM, classroom, and model provider dependencies remain outside core packages. |
| DIV-008 | Quarantine LLM-Chess natural-language visual inference | FEAT-016 | SURF-167 | Natural-language cue inference is opt-in compatibility producer behavior, never trusted core execution. |
| DIV-009 | Host configuration is not SDK core configuration | FEAT-018 | SURF-151, SURF-152, SURF-153, SURF-154, SURF-155, SURF-156, SURF-157, SURF-158, SURF-159, SURF-160, SURF-161, SURF-162 | Provider keys, TTS settings, media endpoints, and deadlines stay in hosts/plugins. |

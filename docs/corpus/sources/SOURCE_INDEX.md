# Remote source index

This corpus was extracted from GitHub remote repository contents, not a local checkout. All behavior claims in the analysis tier are tied to one of these immutable commit snapshots.

| Alias | Repository | Commit | Branch at discovery | Visibility | License posture |
|---|---|---|---|---|---|
| CHESS | `Mnehmos/LLM-Chess` | `450bdbded7f34e94cffc02264082849714270af3` | `main` | public | no root LICENSE discovered |
| CLIO | `Mnehmos/clio` | `03b1e1fff2254f5f97947ea249ad84827118136e` | `develop` | private | MIT |
| VC | `Mnehmos/virtual-classroom` | `cd7253608297efd57921c965b7440f4d4081842f` | `main` | public | no root LICENSE discovered |
| VCB | `Mnehmos/vibe-coders-bible` | `cb032732158f615331e00c27f688a3c847c0a97c` | `main` | public | CC-BY-4.0 |
| EXHIBIT | `Mnehmos/exhibit-of-shadows` | `ebf08d6decd1d41c23136a51ee27995e53cb2e2d` | `main` | public | excluded naming collision |

## Scope decision

Included protocol lineage: LLM-Chess → Clio → Virtual Classroom, plus the Vibe Coders Bible presenter/reference implementation. [v] Mnehmos/clio@03b1e1fff2254f5f97947ea249ad84827118136e:docs/doctrine/adrs/0009-stagehand-protocol.md:1-220

`Mnehmos/exhibit-of-shadows` is excluded from protocol reconstruction: its “stagehand console” is a diegetic tuning/control panel rather than the mixed narration/control protocol. [i] inferred from repository search hits and console/decision documentation; falsifier: find a parser/schema/validated mixed-stream implementation in that repository.

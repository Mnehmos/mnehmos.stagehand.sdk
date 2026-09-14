#!/usr/bin/env node
// Build and verify the canonical v2 identity ledger.
//
// Two jobs, one source:
//   --write  merges docs/governance/v2-allocation.json (hand-authored, from the issue graph)
//            with the v1 evidence derived mechanically from the frozen corpus, and emits
//            docs/governance/v2-ids.json plus docs/governance/V2_ID_LEDGER.md.
//   (default) re-derives everything and asserts the v2 ranges are a clean partition, that the
//            corpus evidence still covers all 167 live surfaces exactly once, and that no live
//            spec reuses a superseded Pass-9 identity.
//
// Deriving the v1 side mechanically is deliberate: hand-copying 167 surface rows into a ledger
// is exactly the kind of transcription nobody catches being wrong.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CORPUS = path.join(ROOT, 'docs/corpus');
const ALLOCATION = path.join(ROOT, 'docs/governance/v2-allocation.json');
const OUT_JSON = path.join(ROOT, 'docs/governance/v2-ids.json');
const OUT_MD = path.join(ROOT, 'docs/governance/V2_ID_LEDGER.md');

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');
const read = (p) => fs.readFileSync(p, 'utf8');
const DASH = '\u2014';

function parseForwardMatrix() {
  const text = read(path.join(CORPUS, '00_TRACEABILITY.md'));
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith('| SURF-')) continue;
    const c = line.split('|').map((x) => x.trim());
    // c: ['', SURF, surface, dead, FEAT, FR, CTR, Task, TEST, DIV, '']
    const val = (i) => (c[i] === DASH || c[i] === '' ? null : c[i]);
    rows.push({
      surf: val(1),
      surface: (val(2) ?? '').replace(/`/g, ''),
      dead: val(3) === 'yes',
      feature: val(4),
      fr: val(5),
      ctr: val(6),
      task: val(7),
      test: val(8),
      div: val(9),
    });
  }
  return rows;
}

function parseParitySuite() {
  const text = read(path.join(CORPUS, '32_PARITY_SUITE.md'));
  const byId = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith('| TEST-')) continue;
    const c = line.split('|').map((x) => x.trim());
    byId.set(c[1], { surface: (c[2] ?? '').replace(/`/g, ''), feature: c[3], method: c[4], expected: c[5], div: c[6] === DASH ? null : c[6] });
  }
  return byId;
}

function groupEvidence(rows) {
  const byFeature = new Map();
  for (const r of rows) {
    if (!r.feature) continue;
    if (!byFeature.has(r.feature)) {
      byFeature.set(r.feature, { surfaces: [], frs: [], ctrs: [], tests: [], tasks: new Set(), divs: new Set() });
    }
    const e = byFeature.get(r.feature);
    e.surfaces.push({ id: r.surf, surface: r.surface });
    if (r.fr) e.frs.push(r.fr);
    if (r.ctr) e.ctrs.push(r.ctr);
    if (r.test) e.tests.push(r.test);
    if (r.task) e.tasks.add(r.task);
    if (r.div) e.divs.add(r.div);
  }
  return byFeature;
}

function build(alloc, rows, parity) {
  const evidence = groupEvidence(rows);
  return alloc.features.map((f) => {
    const e = evidence.get(f.feature) ?? { surfaces: [], frs: [], ctrs: [], tests: [], tasks: new Set(), divs: new Set() };
    const frRange = `${f.v2.fr.from}..${f.v2.fr.to}`;
    const testRange = `${f.v2.test.from}..${f.v2.test.to}`;
    return {
      feature: f.feature,
      name: f.name,
      issue: f.issue,
      milestone: f.milestone,
      milestone_issue: f.milestone_issue,
      rebuild_plan_milestone: f.rebuild_plan_milestone,
      tier: f.tier,
      packages: f.packages,
      deps_issue_graph: f.deps_issue_graph,
      deps_corpus: f.deps_corpus,
      v2: {
        fr: { ...f.v2.fr, count: f.v2.fr.to - f.v2.fr.from + 1 },
        test: { ...f.v2.test, count: f.v2.test.to - f.v2.test.from + 1, range: testRange },
        fr_range: frRange,
        task_ids: f.v2.tasks.map((t) => t.id),
        tasks: f.v2.tasks,
      },
      v1_evidence: {
        corpus_surfaces: e.surfaces.map((s) => s.id),
        corpus_surface_count: e.surfaces.length,
        corpus_frs: e.frs.sort(),
        corpus_fr_count: e.frs.length,
        corpus_contracts: [...e.ctrs].sort(),
        corpus_tasks: [...e.tasks].sort(),
        corpus_tests: e.tests.sort(),
        corpus_test_count: e.tests.length,
        corpus_divergences: [...e.divs].sort(),
      },
      parity_exits: f.parity_exits,
    };
  });
}

function verify(alloc, ledger, rows, parity, { enforceLiveSpecs }) {
  const errors = [];
  const bounds = alloc.bounds;

  // --- v2 range partition -------------------------------------------------
  const checkPartition = (key, min, max, count) => {
    const seen = [];
    for (const f of alloc.features) {
      const r = f.v2[key];
      if (!r) { errors.push(`${f.feature} missing v2.${key}`); continue; }
      if (r.from > r.to) errors.push(`${f.feature} v2.${key} inverted: ${r.from}..${r.to}`);
      seen.push({ feature: f.feature, from: r.from, to: r.to });
    }
    seen.sort((a, b) => a.from - b.from);
    let cursor = min;
    for (const s of seen) {
      if (s.from !== cursor) errors.push(`${s.feature} v2.${key} starts at ${s.from}, expected ${cursor}`);
      cursor = s.to + 1;
    }
    if (cursor !== max + 1) errors.push(`v2.${key} partition ends at ${cursor - 1}, expected ${max}`);
    const total = seen.reduce((n, s) => n + (s.to - s.from + 1), 0);
    if (total !== count) errors.push(`v2.${key} total ${total}, expected ${count}`);
  };
  checkPartition('fr', bounds.fr.from, bounds.fr.to, bounds.fr.count);
  checkPartition('test', bounds.test.from, bounds.test.to, bounds.test.count);

  // --- tasks: contiguous across features, in declared feature order -------
  const taskIds = [];
  for (const f of alloc.features) for (const t of f.v2.tasks) taskIds.push(t.id);
  const taskNums = taskIds.map((t) => Number(t.replace('T-', '')));
  for (let i = 0; i < taskNums.length; i++) {
    if (taskNums[i] !== bounds.task.from + i) {
      errors.push(`task ${taskIds[i]} out of sequence at position ${i}, expected T-${String(bounds.task.from + i).padStart(3, '0')}`);
    }
  }
  const dupTasks = taskIds.filter((t, i) => taskIds.indexOf(t) !== i);
  if (dupTasks.length) errors.push(`duplicate task ids: ${[...new Set(dupTasks)].join(', ')}`);
  if (taskIds.length !== bounds.task.count) errors.push(`task count ${taskIds.length}, expected ${bounds.task.count}`);

  // --- feature coverage ---------------------------------------------------
  const wantFeatures = Array.from({ length: 18 }, (_, i) => `FEAT-${String(i + 1).padStart(3, '0')}`);
  const gotFeatures = alloc.features.map((f) => f.feature);
  for (const w of wantFeatures) if (!gotFeatures.includes(w)) errors.push(`missing feature ${w}`);
  for (const g of gotFeatures) if (!wantFeatures.includes(g)) errors.push(`unknown feature ${g}`);
  if (new Set(gotFeatures).size !== gotFeatures.length) errors.push('duplicate feature entries');

  // --- issue graph consistency -------------------------------------------
  for (const f of alloc.features) {
    if (!Number.isInteger(f.issue)) errors.push(`${f.feature} missing issue number`);
    if (!f.packages?.length) errors.push(`${f.feature} declares no package`);
  }

  // --- parity exits match declared test range ----------------------------
  for (const f of alloc.features) {
    const want = [];
    for (let n = f.v2.test.from; n <= f.v2.test.to; n++) want.push(`TEST-${String(n).padStart(3, '0')}`);
    const got = f.parity_exits.map((p) => p.id);
    if (want.join(',') !== got.join(',')) errors.push(`${f.feature} parity exits [${got}] != declared range [${want}]`);
  }

  // --- corpus evidence completeness --------------------------------------
  const liveRows = rows.filter((r) => !r.dead);
  const deadRows = rows.filter((r) => r.dead);
  if (deadRows.length !== 1 || deadRows[0].surf !== 'SURF-027') {
    errors.push(`dead surface set changed: ${deadRows.map((r) => r.surf).join(',') || 'none'}`);
  }
  const evSurfaces = ledger.flatMap((f) => f.v1_evidence.corpus_surfaces);
  const dupSurf = evSurfaces.filter((s, i) => evSurfaces.indexOf(s) !== i);
  if (dupSurf.length) errors.push(`surface claimed by more than one feature: ${[...new Set(dupSurf)].join(', ')}`);
  if (evSurfaces.length !== liveRows.length) {
    errors.push(`live surfaces covered ${evSurfaces.length}, corpus has ${liveRows.length}`);
  }
  const missing = liveRows.filter((r) => !evSurfaces.includes(r.surf)).map((r) => r.surf);
  if (missing.length) errors.push(`live surfaces with no v2 feature owner: ${missing.join(', ')}`);

  const evFrs = new Set(ledger.flatMap((f) => f.v1_evidence.corpus_frs));
  const corpusFrs = new Set(liveRows.map((r) => r.fr).filter(Boolean));
  const evTests = new Set(ledger.flatMap((f) => f.v1_evidence.corpus_tests));
  const corpusTests = new Set(liveRows.map((r) => r.test).filter(Boolean));
  if (evFrs.size !== 167) errors.push(`v1 FRs mapped ${evFrs.size}, expected 167`);
  if (evTests.size !== 167) errors.push(`v1 TESTs mapped ${evTests.size}, expected 167`);
  for (const id of corpusFrs) if (!evFrs.has(id)) errors.push(`v1 FR ${id} has no v2 feature`);
  for (const id of corpusTests) if (!evTests.has(id)) errors.push(`v1 TEST ${id} has no v2 feature`);
  if (parity.size !== 167) errors.push(`corpus parity suite has ${parity.size} TEST rows, expected 167`);

  // --- supersession: v2 must not collide with or reuse v1 ----------------
  if (bounds.fr.from <= alloc.superseded.fr.to) errors.push('v2 FR range overlaps superseded v1 FR range');
  if (bounds.test.from <= alloc.superseded.test.to) errors.push('v2 TEST range overlaps superseded v1 TEST range');
  if (bounds.task.from <= alloc.superseded.task.to) errors.push('v2 task range overlaps superseded v1 task range');

  // --- live specs must not mint superseded identities --------------------
  // Scans the contents of every live spec directory. Files sitting directly in specs/ are
  // documentation about the scheme and are allowed to name the superseded ranges; anything inside
  // a spec directory is spec content and is not.
  if (enforceLiveSpecs) {
    const specsDir = path.join(ROOT, 'specs');
    const offenders = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) { walk(p); continue; }
        if (!/\.(md|json|ya?ml)$/.test(entry.name)) continue;
        const text = read(p);
        for (const m of text.matchAll(/\b(FR|TEST|T)-(\d{3})\b/g)) {
          const kind = m[1] === 'T' ? 'task' : m[1] === 'FR' ? 'fr' : 'test';
          const n = Number(m[2]);
          const sup = alloc.superseded[kind];
          if (sup && n >= sup.from && n <= sup.to) offenders.push(`${rel(p)}: ${m[0]} is a superseded Pass-9 identity`);
        }
      }
    };
    if (fs.existsSync(specsDir)) {
      for (const entry of fs.readdirSync(specsDir, { withFileTypes: true })) {
        if (entry.isDirectory()) walk(path.join(specsDir, entry.name));
      }
    }
    for (const o of [...new Set(offenders)]) errors.push(o);
  }

  return errors;
}

function renderMarkdown(alloc, ledger) {
  const b = alloc.bounds;
  const L = [];
  L.push('# Canonical v2 ID Ledger');
  L.push('');
  L.push('> Generated by `node tools/v2-ids.mjs --write`. Do not hand-edit.');
  L.push('> Source of truth for the allocation is `docs/governance/v2-allocation.json`; the v1 evidence');
  L.push('> columns are re-derived from `docs/corpus/00_TRACEABILITY.md` and `docs/corpus/32_PARITY_SUITE.md`');
  L.push('> on every build, so the ledger cannot drift from the corpus by transcription error.');
  L.push('');
  L.push('## Why this ledger exists');
  L.push('');
  L.push('The reconstruction corpus in `docs/corpus/` numbers its requirements per owned surface:');
  L.push('`FR-001..FR-167`, `TEST-001..TEST-167`, `T-001..T-018`. The implementation graph');
  L.push('([issue #1](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/1) and feature issues');
  L.push('`#10..#27`) declares a consolidated identity scheme that supersedes them: **FR-168..FR-266**,');
  L.push('**TEST-168..TEST-229**, **T-019..T-111**.');
  L.push('');
  L.push('Both schemes are internally consistent and they describe the same 18 features, but they');
  L.push('decompose differently — the corpus is surface-bound (167 requirements, one per surface),');
  L.push('while v2 is capability-bound (99 requirements) with a finer task decomposition (93 atomic');
  L.push('tasks) and consolidated parity exits (62). **The v2 requirement statements do not exist as');
  L.push('artifacts yet.** This ledger reserves the identities and records, per feature, exactly which');
  L.push('corpus evidence a v2 requirement must be authored from. Writing the v2 statements is the job of');
  L.push('each feature\'s `/speckit-specify` run, grounded in the seed it is pointed at below.');
  L.push('');
  L.push('## Allocation');
  L.push('');
  L.push(`| # | Feature | Name | Tier | Package | v2 FRs | v2 tests | v2 tasks | M |`);
  L.push('|---|---|---|---|---|---|---|---|---|');
  for (const f of ledger) {
    L.push(`| ${f.issue - 9} | ${f.feature} | ${f.name} | ${f.tier} | \`${f.packages.join('`, `')}\` | FR-${f.v2.fr_range.replace('..', '..FR-')} (${f.v2.fr.count}) | TEST-${f.v2.test.range.replace('..', '..TEST-')} (${f.v2.test.count}) | ${f.v2.task_ids[0]}..${f.v2.task_ids[f.v2.task_ids.length - 1]} (${f.v2.task_ids.length}) | ${f.milestone} |`);
  }
  L.push('');
  L.push(`Totals: **${b.fr.count}** requirements, **${b.test.count}** parity exits, **${b.task.count}** tasks across ${alloc.features.length} features.`);
  L.push('');
  L.push('## Per-feature detail');
  L.push('');
  for (const f of ledger) {
    L.push(`### ${f.feature} · ${f.name}`);
    L.push('');
    L.push(`- Issue: [#${f.issue}](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/${f.issue}) · milestone [#${f.milestone_issue}](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/${f.milestone_issue}) (${f.milestone}) · rebuild-plan milestone ${f.rebuild_plan_milestone}`);
    L.push(`- Package owner: \`${f.packages.join('`, `')}\``);
    L.push(`- Depends on (issue graph): ${f.deps_issue_graph.length ? f.deps_issue_graph.join(', ') : 'none'}`);
    if (JSON.stringify(f.deps_issue_graph) !== JSON.stringify(f.deps_corpus)) {
      L.push(`- Depends on (corpus ledger): ${f.deps_corpus.length ? f.deps_corpus.join(', ') : 'none'} — _differs from the issue graph; see Open reconciliation items_`);
    }
    L.push(`- v2 requirements: **FR-${f.v2.fr_range.replace('..', '..FR-')}** (${f.v2.fr.count}) — statements pending \`/speckit-specify\``);
    L.push(`- v2 tasks: ${f.v2.tasks.map((t) => `**${t.id}** ${t.title}`).join(' · ')}`);
    L.push(`- v2 parity exits: ${f.parity_exits.map((p) => `**${p.id}** ${p.criterion}`).join(' · ')}`);
    L.push(`- Corpus seed: \`docs/corpus/specs/${specDir(f)}\``);
    L.push(`- Corpus evidence to author from: ${f.v1_evidence.corpus_surface_count} surfaces (${f.v1_evidence.corpus_surfaces.slice(0, 4).join(', ')}${f.v1_evidence.corpus_surface_count > 4 ? ', …' : ''}), ${f.v1_evidence.corpus_fr_count} v1 FRs, ${f.v1_evidence.corpus_test_count} v1 tests, corpus task ${f.v1_evidence.corpus_tasks.join('/')}`);
    if (f.v1_evidence.corpus_divergences.length) L.push(`- Governing divergences: ${f.v1_evidence.corpus_divergences.join(', ')}`);
    L.push(`- Live spec target: \`${liveDir(f)}\` — Spec Kit assigns \`<n>\` at creation; the slug is fixed`);
    L.push('');
  }
  L.push('## Superseded identities');
  L.push('');
  L.push('Frozen aliases. They stay resolvable through `docs/corpus/` and must never be minted for new work:');
  L.push('');
  L.push('| Scheme | Range | Count | Status |');
  L.push('|---|---|---|---|');
  L.push(`| Requirements | FR-001..FR-167 | ${alloc.superseded.fr.count} | superseded |`);
  L.push(`| Parity tests | TEST-001..TEST-167 | ${alloc.superseded.test.count} | superseded |`);
  L.push(`| Tasks | T-001..T-018 | ${alloc.superseded.task.count} | superseded |`);
  L.push('');
  L.push(alloc.superseded.policy);
  L.push('');
  L.push('## Open reconciliation items');
  L.push('');
  L.push('Recorded so they are not silently absorbed. Each needs a maintainer decision before the');
  L.push('affected feature converges.');
  L.push('');
  L.push('1. **v2 requirement statements have no artifact of record.** The issue graph fixes the v2');
  L.push('   ranges but not their text. M1+ authors them from the corpus seed named per feature above.');
  L.push('   Until a feature\'s `/speckit-specify` run lands, its v2 requirements are reserved, not defined.');
  L.push('2. **Dependency drift between the corpus ledger and the issue graph.** `FEAT-012`, `FEAT-013`,');
  L.push('   `FEAT-014`, and `FEAT-015` declare `FEAT-005`/`FEAT-006` dependencies in the issue graph that');
  L.push('   `docs/corpus/30_FEATURE_LEDGER.md` does not list. The issue graph is treated as newer; the');
  L.push('   difference is preserved per feature above.');
  L.push('3. **Milestone names collide across schemes.** The roadmap\'s `M0..M7` and the rebuild plan\'s');
  L.push('   `M1..M9` are different partitions of the same work. This ledger records both.');
  L.push('4. **Release-blocking provenance.** `U-002` (LLM-Chess root license) and `U-003` (Virtual');
  L.push('   Classroom root license) remain unresolved in `docs/corpus/analysis/24_UNKNOWNS.md`.');
  L.push('   Constitution Article XI gates public distribution of `FEAT-016`-derived code on them.');
  L.push('');
  return L.join('\n');
}

const specDirMap = {
  'FEAT-001': '001-mixed-stream-parser',
  'FEAT-002': '002-capability-registry-validation',
  'FEAT-003': '003-effect-runtime',
  'FEAT-004': '006-compound-choreography',
  'FEAT-005': '004-trace-replay',
  'FEAT-006': '005-readiness-sync',
  'FEAT-007': '008-geo-camera',
  'FEAT-008': '009-geo-annotation',
  'FEAT-009': '010-geo-layers-overlays',
  'FEAT-010': '011-geo-pieces-registry',
  'FEAT-011': '012-evidence-presentation',
  'FEAT-012': '007-whiteboard',
  'FEAT-013': '013-classroom-staging',
  'FEAT-014': '014-classroom-media',
  'FEAT-015': '015-lesson-interaction',
  'FEAT-016': '016-chess-compatibility',
  'FEAT-017': '017-dom-presenter',
  'FEAT-018': '018-host-model-narration-config',
};
const specDir = (f) => specDirMap[f.feature] ?? '(unmapped)';
// The live directory's numeric prefix is assigned by Spec Kit's create-new-feature script at
// creation time, so only the slug is fixed here. Claiming a number we do not control would be
// a fabricated path.
const slug = (f) => specDir(f).replace(/^\d{3}-/, '');
const liveDir = (f) => `specs/<n>-${slug(f)}/`;

function main() {
  const write = process.argv.includes('--write');
  const alloc = JSON.parse(read(ALLOCATION));
  const rows = parseForwardMatrix();
  const parity = parseParitySuite();
  const ledger = build(alloc, rows, parity);

  const errors = verify(alloc, ledger, rows, parity, { enforceLiveSpecs: true });

  // unmapped spec dirs are a real gap, not a nicety
  for (const f of alloc.features) {
    if (specDir(f) === '(unmapped)') errors.push(`${f.feature} has no corpus spec directory mapping`);
    if (!fs.existsSync(path.join(CORPUS, 'specs', specDir(f)))) errors.push(`${f.feature} corpus seed docs/corpus/specs/${specDir(f)} does not exist`);
  }

  if (write && errors.length === 0) {
    const doc = {
      $comment: 'Generated by tools/v2-ids.mjs --write from docs/governance/v2-allocation.json plus the frozen corpus. Do not hand-edit.',
      scheme: alloc.scheme,
      declared_by: alloc.declared_by,
      bounds: alloc.bounds,
      superseded: alloc.superseded,
      counts: {
        features: ledger.length,
        v2_requirements: ledger.reduce((n, f) => n + f.v2.fr.count, 0),
        v2_parity_exits: ledger.reduce((n, f) => n + f.parity_exits.length, 0),
        v2_tasks: ledger.reduce((n, f) => n + f.v2.task_ids.length, 0),
        v1_surfaces_mapped: ledger.reduce((n, f) => n + f.v1_evidence.corpus_surfaces.length, 0),
      },
      features: ledger,
    };
    fs.writeFileSync(OUT_JSON, JSON.stringify(doc, null, 2) + '\n');
    fs.writeFileSync(OUT_MD, renderMarkdown(alloc, ledger));
    console.log(JSON.stringify({ status: 'WROTE', json: rel(OUT_JSON), markdown: rel(OUT_MD), counts: doc.counts }, null, 2));
    return;
  }

  const result = {
    status: errors.length ? 'FAIL' : 'PASS',
    errors,
    counts: {
      features: ledger.length,
      v2_requirements: ledger.reduce((n, f) => n + f.v2.fr.count, 0),
      v2_parity_exits: ledger.reduce((n, f) => n + f.parity_exits.length, 0),
      v2_tasks: ledger.reduce((n, f) => n + f.v2.task_ids.length, 0),
      v1_surfaces_mapped: ledger.reduce((n, f) => n + f.v1_evidence.corpus_surfaces.length, 0),
      v1_requirements_mapped: new Set(ledger.flatMap((f) => f.v1_evidence.corpus_frs)).size,
      v1_tests_mapped: new Set(ledger.flatMap((f) => f.v1_evidence.corpus_tests)).size,
    },
  };
  if (write && errors.length) {
    result.status = 'REFUSED-WRITE';
    result.note = 'Refusing to write the ledger while verification fails.';
  }
  console.log(JSON.stringify(result, null, 2));
  process.exit(errors.length ? 1 : 0);
}

main();

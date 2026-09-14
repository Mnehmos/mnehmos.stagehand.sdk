#!/usr/bin/env node
// Materialise and verify the pnpm workspace skeleton.
//
//   --write  creates/refreshes package.json, tsconfig.json, src/index.ts and README.md for every
//            workspace in docs/governance/workspaces.json, plus the root tsconfig.json paths map.
//   (default) re-renders every file in memory and fails if the tree differs by a single byte.
//
// Internal dependency edges are DERIVED from docs/governance/v2-ids.json (owner feature ->
// feature deps -> owning workspaces), not listed by hand, so the graph cannot silently disagree
// with the ledger. External dependencies, if any, are declared in workspaces.json.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DECL = path.join(ROOT, 'docs/governance/workspaces.json');
const LEDGER = path.join(ROOT, 'docs/governance/v2-ids.json');
const ROOT_TSCONFIG = path.join(ROOT, 'tsconfig.json');

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');
const read = (p) => fs.readFileSync(p, 'utf8');
const norm = (s) => s.replace(/\r\n/g, '\n');

function ownersByFeature(workspaces) {
  const map = new Map();
  for (const w of workspaces) {
    for (const f of w.owner_features) map.set(f, [...(map.get(f) ?? []), w.name]);
  }
  return map;
}

function internalDepsFor(ws, ledger, owners) {
  const deps = new Set();
  for (const feature of ws.owner_features) {
    const entry = ledger.features.find((f) => f.feature === feature);
    if (!entry) continue;
    for (const dep of entry.deps_issue_graph) {
      for (const owner of owners.get(dep) ?? []) {
        if (owner !== ws.name) deps.add(owner);
      }
    }
  }
  return [...deps].sort();
}

function renderPackageJson(ws, internalDeps) {
  const dependencies = {};
  for (const d of internalDeps) dependencies[d] = 'workspace:*';
  for (const [k, v] of Object.entries(ws.external_dependencies ?? {}).sort(([a], [b]) => a.localeCompare(b))) {
    dependencies[k] = v;
  }
  const pkg = {
    name: ws.name,
    version: '0.0.0',
    private: true,
    type: 'module',
    description: ws.description,
    license: 'MIT',
    exports: {
      '.': {
        types: './dist/index.d.ts',
        default: './dist/index.js',
      },
    },
    files: ['dist'],
    scripts: {
      typecheck: 'tsc -p tsconfig.json',
    },
  };
  if (Object.keys(dependencies).length) pkg.dependencies = dependencies;
  return JSON.stringify(pkg, null, 2) + '\n';
}

function renderTsconfig(ws) {
  const depth = ws.dir.split('/').length;
  const up = '../'.repeat(depth);
  return JSON.stringify({
    extends: `${up}tsconfig.base.json`,
    compilerOptions: { rootDir: 'src', outDir: 'dist' },
    include: ['src'],
  }, null, 2) + '\n';
}

function renderIndex(ws, ledger, internalDeps) {
  const lines = [];
  lines.push(`// ${ws.name}`);
  lines.push('//');
  for (const feature of ws.owner_features) {
    const entry = ledger.features.find((f) => f.feature === feature);
    if (!entry) {
      lines.push(`// Owner of ${feature} (not present in the v2 ledger).`);
      continue;
    }
    lines.push(`// Owner of ${entry.feature} ${entry.name} [${entry.tier}]`);
    lines.push(`//   requirements FR-${entry.v2.fr_range.replace('..', '..FR-')} (${entry.v2.fr.count})`);
    lines.push(`//   tasks        ${entry.v2.task_ids.join(', ')}`);
    lines.push(`//   parity       ${entry.parity_exits.map((p) => p.id).join(', ')}`);
  }
  lines.push('//');
  if (internalDeps.length) lines.push(`// Depends on: ${internalDeps.join(', ')}`);
  else lines.push('// Depends on: nothing (leaf)');
  lines.push('//');
  lines.push('// Scaffolded by M0. No feature behavior is implemented yet: this module exports nothing');
  lines.push('// until its feature lands through the Spec Kit flow in docs/governance/SPEC_KIT_RUNBOOK.md.');
  lines.push('');
  lines.push('export {};');
  lines.push('');
  return lines.join('\n');
}

function renderReadme(ws, ledger, internalDeps) {
  const l = [];
  l.push(`# ${ws.name}`);
  l.push('');
  l.push(ws.description);
  l.push('');
  l.push('| | |');
  l.push('|---|---|');
  l.push(`| Layer | \`${ws.layer}\` |`);
  l.push(`| Kind | \`${ws.kind}\` |`);
  l.push(`| Directory | \`${ws.dir}\` |`);
  l.push(`| Owner features | ${ws.owner_features.join(', ')} |`);
  l.push(`| Internal dependencies | ${internalDeps.length ? internalDeps.map((d) => `\`${d}\``).join(', ') : 'none'} |`);
  l.push(`| Status | scaffolded (M0) — no behavior implemented |`);
  l.push('');
  l.push('## Requirements owned');
  l.push('');
  l.push('| Feature | v2 requirements | v2 tasks | Parity exits |');
  l.push('|---|---|---|---|');
  for (const feature of ws.owner_features) {
    const entry = ledger.features.find((f) => f.feature === feature);
    if (!entry) { l.push(`| ${feature} | — | — | — |`); continue; }
    l.push(`| ${entry.feature} ${entry.name} | FR-${entry.v2.fr_range.replace('..', '..FR-')} | ${entry.v2.task_ids.join(', ')} | ${entry.parity_exits.map((p) => p.id).join(', ')} |`);
  }
  l.push('');
  l.push('## Corpus seed');
  l.push('');
  for (const feature of ws.owner_features) {
    const entry = ledger.features.find((f) => f.feature === feature);
    if (!entry) continue;
    l.push(`- ${entry.feature}: \`${entry.v1_evidence.corpus_surfaces.length}\` surfaces, \`${entry.v1_evidence.corpus_fr_count}\` v1 requirements, \`${entry.v1_evidence.corpus_test_count}\` v1 tests — seed spec \`docs/corpus/specs/\`, issue [#${entry.issue}](https://github.com/Mnehmos/mnehmos.stagehand.sdk/issues/${entry.issue})`);
  }
  l.push('');
  l.push('See [V2_ID_LEDGER.md](../../docs/governance/V2_ID_LEDGER.md) for the canonical identity allocation and');
  l.push('[SPEC_KIT_RUNBOOK.md](../../docs/governance/SPEC_KIT_RUNBOOK.md) for the per-feature workflow.');
  l.push('');
  return l.join('\n');
}

function renderRootTsconfig(workspaces) {
  const paths = {};
  for (const ws of workspaces) {
    paths[ws.name] = [`${ws.dir}/src`];
    paths[`${ws.name}/*`] = [`${ws.dir}/src/*`];
  }
  const doc = {
    $comment: 'Generated by tools/workspaces.mjs --write from docs/governance/workspaces.json. Do not hand-edit.',
    extends: './tsconfig.base.json',
    compilerOptions: {
      noEmit: true,
      baseUrl: '.',
      paths,
    },
    include: [
      'packages/*/src', 'packages/compatibility/*/src', 'plugins/*/src', 'examples/*/src',
      'packages/*/test', 'packages/compatibility/*/test', 'plugins/*/test', 'examples/*/test',
    ],
  };
  return JSON.stringify(doc, null, 2) + '\n';
}

function expectedFiles(workspaces, ledger) {
  const owners = ownersByFeature(workspaces);
  const structural = new Map();
  const seeds = new Map();
  for (const ws of workspaces) {
    const internalDeps = internalDepsFor(ws, ledger, owners);
    // Structural: the generator owns these outright and they must stay byte-identical.
    structural.set(`${ws.dir}/package.json`, renderPackageJson(ws, internalDeps));
    structural.set(`${ws.dir}/tsconfig.json`, renderTsconfig(ws));
    // Seeds: created once, then owned by the feature that implements them. index.ts acquires real
    // exports and README.md acquires real documentation; neither may be held byte-identical to a
    // scaffold placeholder once the module is alive.
    seeds.set(`${ws.dir}/src/index.ts`, renderIndex(ws, ledger, internalDeps));
    seeds.set(`${ws.dir}/README.md`, renderReadme(ws, ledger, internalDeps));
  }
  structural.set('tsconfig.json', renderRootTsconfig(workspaces));
  return { structural, seeds };
}

function graphOf(workspaces, ledger) {
  const owners = ownersByFeature(workspaces);
  return workspaces.map((ws) => {
    const pkgPath = path.join(ROOT, ws.dir, 'package.json');
    const declared = fs.existsSync(pkgPath) ? JSON.parse(read(pkgPath)) : {};
    const deps = Object.keys(declared.dependencies ?? {});
    return {
      dir: ws.dir,
      name: ws.name,
      layer: ws.layer,
      internalDeps: deps.filter((d) => d.startsWith('@stagehand/')),
      externalDeps: deps.filter((d) => !d.startsWith('@stagehand/')),
      derivedInternalDeps: internalDepsFor(ws, ledger, owners),
    };
  });
}

function main() {
  const write = process.argv.includes('--write');
  const decl = JSON.parse(read(DECL));
  const ledger = JSON.parse(read(LEDGER));
  const workspaces = decl.workspaces;

  const errors = [];

  // Declaration must agree with the ledger's package ownership.
  const ledgerPackages = new Set(ledger.features.flatMap((f) => f.packages));
  const declaredDirs = new Set(workspaces.map((w) => w.dir));
  for (const p of ledgerPackages) if (!declaredDirs.has(p)) errors.push(`ledger declares package "${p}" but no workspace scaffolds it`);
  for (const d of declaredDirs) if (!ledgerPackages.has(d)) errors.push(`workspace "${d}" is not named as a package owner in the v2 ledger`);

  // owner_features must cover every feature exactly across workspaces.
  const owned = new Map();
  for (const w of workspaces) for (const f of w.owner_features) owned.set(f, (owned.get(f) ?? 0) + 1);
  for (const f of ledger.features) {
    if (!owned.has(f.feature)) errors.push(`${f.feature} has no owning workspace`);
  }
  for (const [f, n] of owned) {
    if (n === 0) errors.push(`${f} unowned`);
    if (!ledger.features.some((x) => x.feature === f)) errors.push(`workspace declares unknown owner feature ${f}`);
  }

  const { structural, seeds } = expectedFiles(workspaces, ledger);

  if (write) {
    if (errors.length) {
      console.log(JSON.stringify({ status: 'REFUSED-WRITE', errors }, null, 2));
      process.exit(1);
    }
    let written = 0;
    let seeded = 0;
    for (const [relPath, content] of structural) {
      const abs = path.join(ROOT, relPath);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content);
      written++;
    }
    for (const [relPath, content] of seeds) {
      const abs = path.join(ROOT, relPath);
      if (fs.existsSync(abs)) continue; // seed once; the owning feature takes it from there
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, content);
      seeded++;
    }
    console.log(JSON.stringify({ status: 'WROTE', workspaces: workspaces.length, structural_files: written, seeds_created: seeded }, null, 2));
    return;
  }

  // Structural files are compared byte-exactly; seeds only have to exist.
  let checked = 0;
  for (const [relPath, content] of structural) {
    const abs = path.join(ROOT, relPath);
    if (!fs.existsSync(abs)) { errors.push(`${relPath} is missing; run tools/workspaces.mjs --write`); continue; }
    checked++;
    if (norm(read(abs)) !== norm(content)) errors.push(`${relPath} differs from the generated skeleton; run tools/workspaces.mjs --write`);
  }
  for (const relPath of seeds.keys()) {
    const abs = path.join(ROOT, relPath);
    if (!fs.existsSync(abs)) errors.push(`${relPath} is missing; run tools/workspaces.mjs --write to seed it`);
  }

  // Declared package names must be unique and consistently scoped.
  const names = workspaces.map((w) => w.name);
  for (const n of names) {
    if (names.filter((x) => x === n).length > 1) errors.push(`duplicate workspace name ${n}`);
    if (!n.startsWith('@stagehand/')) errors.push(`workspace name ${n} is not in the @stagehand scope`);
  }

  const graph = graphOf(workspaces, ledger);
  for (const g of graph) {
    const a = [...(g.derivedInternalDeps ?? [])].sort().join(',');
    const b = [...g.internalDeps].sort().join(',');
    if (a !== b) errors.push(`${g.dir} package.json internal deps [${b}] do not match the ledger-derived [${a}]`);
  }

  const result = {
    status: errors.length ? 'FAIL' : 'PASS',
    errors,
    workspaces: workspaces.length,
    files_verified: checked,
    layers: graph.reduce((acc, g) => { acc[g.layer] = (acc[g.layer] ?? 0) + 1; return acc; }, {}),
  };
  console.log(JSON.stringify(result, null, 2));
  process.exit(errors.length ? 1 : 0);
}

main();

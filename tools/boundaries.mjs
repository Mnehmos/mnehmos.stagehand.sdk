#!/usr/bin/env node
// Boundary gate for Constitution Articles III and IX.
//
// Reads the policy from docs/governance/boundaries.json, derives the internal dependency graph
// from the scaffolded package.json files, and evaluates it with the shared pure core in
// tools/lib/boundaries-core.mjs. The core is unit-tested against a deliberately violating graph
// in tests/boundaries-core.test.mjs, so this gate has been observed to fail, not just to pass.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateBoundaries } from './lib/boundaries-core.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POLICY = path.join(ROOT, 'docs/governance/boundaries.json');
const DECL = path.join(ROOT, 'docs/governance/workspaces.json');
const LEDGER = path.join(ROOT, 'docs/governance/v2-ids.json');

const read = (p) => fs.readFileSync(p, 'utf8');

function main() {
  const errors = [];
  const policy = JSON.parse(read(POLICY));
  const decl = JSON.parse(read(DECL));
  const ledger = JSON.parse(read(LEDGER));

  const owners = new Map();
  for (const w of decl.workspaces) {
    for (const f of w.owner_features) owners.set(f, [...(owners.get(f) ?? []), w.name]);
  }

  const workspaces = decl.workspaces.map((ws) => {
    const pkgPath = path.join(ROOT, ws.dir, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      errors.push(`${ws.dir}/package.json is missing; run tools/workspaces.mjs --write`);
      return { dir: ws.dir, name: ws.name, layer: ws.layer, internalDeps: [], externalDeps: [] };
    }
    const pkg = JSON.parse(read(pkgPath));
    const deps = Object.keys(pkg.dependencies ?? {});

    // Independently re-derive the expected internal edges from the ledger and compare, so a
    // hand-added edge cannot slip past the layer check by simply not being declared in the ledger.
    const expected = new Set();
    for (const feature of ws.owner_features) {
      const entry = ledger.features.find((f) => f.feature === feature);
      for (const dep of entry?.deps_issue_graph ?? []) {
        for (const owner of owners.get(dep) ?? []) if (owner !== ws.name) expected.add(owner);
      }
    }
    const actualInternal = deps.filter((d) => d.startsWith('@stagehand/'));
    for (const dep of actualInternal) {
      if (!expected.has(dep)) {
        errors.push(`${ws.dir} declares internal dependency ${dep} that is not implied by the feature dependency graph`);
      }
    }
    for (const dep of expected) {
      if (!actualInternal.includes(dep)) {
        errors.push(`${ws.dir} is missing derived internal dependency ${dep}`);
      }
    }

    return {
      dir: ws.dir,
      name: ws.name,
      layer: ws.layer,
      internalDeps: actualInternal,
      externalDeps: deps.filter((d) => !d.startsWith('@stagehand/')),
    };
  });

  const verdict = evaluateBoundaries({ workspaces, policy });
  errors.push(...verdict.errors);

  const result = {
    status: errors.length ? 'FAIL' : 'PASS',
    errors,
    warnings: verdict.warnings,
    workspaces: workspaces.length,
    core_workspaces: workspaces.filter((w) => w.layer === 'core').length,
    edges: workspaces.reduce((n, w) => n + w.internalDeps.length, 0),
  };
  console.log(JSON.stringify(result, null, 2));
  process.exit(errors.length ? 1 : 0);
}

main();

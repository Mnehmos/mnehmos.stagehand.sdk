#!/usr/bin/env node
// Gate: every package is actually consumable.
//
// `pnpm build` emitting without error is not the same claim as "a consumer can import this package".
// The gap between them is the failure this gate exists for:
//
//   * `exports` in package.json pointing at a file the build never produced — the package resolves
//     to nothing, and the first to find out is whoever installs it.
//   * a declaration file missing, which is invisible at runtime and loud for every TypeScript
//     consumer. Checked explicitly because a JavaScript-only smoke test would pass.
//   * a package that built nothing at all because it has no source, which reads as success.
//
// So each workspace's declared entry points are resolved against the filesystem after a build, and
// the built entry module is imported to prove it loads.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DECL = path.join(ROOT, 'docs/governance/workspaces.json');

const read = (p) => fs.readFileSync(p, 'utf8');
const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');

/** Resolve an `exports` target, following the same shape Node does for a plain `.` entry. */
function targetsOf(exportsField) {
  const root = exportsField?.['.'] ?? exportsField;
  if (root === undefined) return [];
  if (typeof root === 'string') return [root];
  return Object.values(root).filter((value) => typeof value === 'string');
}

async function main() {
  const errors = [];
  const warnings = [];
  const decl = JSON.parse(read(DECL));

  let checked = 0;
  let imported = 0;

  for (const ws of decl.workspaces) {
    const pkgPath = path.join(ROOT, ws.dir, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      errors.push(`${ws.dir}: package.json is missing`);
      continue;
    }
    const pkg = JSON.parse(read(pkgPath));
    const targets = targetsOf(pkg.exports);
    if (targets.length === 0) {
      errors.push(`${ws.dir}: package.json declares no exports`);
      continue;
    }

    for (const target of targets) {
      const resolved = path.join(ROOT, ws.dir, target);
      checked++;
      if (!fs.existsSync(resolved)) {
        errors.push(
          `${ws.dir}: exports target "${target}" was not produced by the build. ` +
          'Run `pnpm build`, then `pnpm check:exports`.',
        );
      }
    }

    // A package with no source produces no build output and would otherwise look like a pass, since
    // every declared target check above would already have failed — this makes the cause explicit.
    const srcDir = path.join(ROOT, ws.dir, 'src');
    const sourceFiles = fs.existsSync(srcDir)
      ? fs.readdirSync(srcDir, { recursive: true, withFileTypes: true }).filter((e) => e.isFile() && e.name.endsWith('.ts'))
      : [];
    if (sourceFiles.length === 0) {
      errors.push(`${ws.dir}: no TypeScript sources, so the build cannot produce its exports`);
    }

    // Import the built entry module. Catches a build that emitted files which do not load — a bare
    // specifier left unresolved, an ESM/CJS mismatch, a top-level throw.
    const defaultValue = targets.find((target) => target.endsWith('.js'));
    if (defaultValue !== undefined && fs.existsSync(path.join(ROOT, ws.dir, defaultValue))) {
      const entry = path.join(ROOT, ws.dir, defaultValue);
      try {
        await import(pathToFileURL(entry).href);
        imported++;
      } catch (error) {
        errors.push(`${ws.dir}: built entry ${defaultValue} does not load: ${error && error.message ? error.message : String(error)}`);
      }
    }
  }

  // Declared-but-unbuilt is invisible at runtime, so a declarations check is worth its own pass.
  for (const ws of decl.workspaces) {
    const dts = path.join(ROOT, ws.dir, 'dist/index.d.ts');
    if (!fs.existsSync(dts)) errors.push(`${ws.dir}: dist/index.d.ts is missing; consumers get no types`);
  }

  const result = {
    status: errors.length ? 'FAIL' : 'PASS',
    errors,
    warnings,
    workspaces: decl.workspaces.length,
    export_targets_checked: checked,
    built_entries_imported: imported,
  };
  console.log(JSON.stringify(result, null, 2));
  process.exit(errors.length ? 1 : 0);
}

main().catch((error) => {
  console.error(JSON.stringify({ status: 'FAIL', errors: [String(error)] }, null, 2));
  process.exit(1);
});

#!/usr/bin/env node
// Remove build output. Exists so `dist/` can be deleted without a shell that behaves differently on
// each platform, and so a stale build cannot be mistaken for a fresh one.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const decl = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/governance/workspaces.json'), 'utf8'));

let removed = 0;
for (const ws of decl.workspaces) {
  const dist = path.join(ROOT, ws.dir, 'dist');
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true, force: true });
    removed++;
  }
  const info = path.join(ROOT, ws.dir, 'tsconfig.tsbuildinfo');
  if (fs.existsSync(info)) fs.rmSync(info, { force: true });
}
const rootInfo = path.join(ROOT, 'tsconfig.build.tsbuildinfo');
if (fs.existsSync(rootInfo)) fs.rmSync(rootInfo, { force: true });

console.log(JSON.stringify({ status: 'CLEANED', packages: removed }, null, 2));

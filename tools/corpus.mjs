#!/usr/bin/env node
// Gate 1 of `pnpm check`: the frozen corpus is both intact and internally consistent.
//
//   1. Verify every file in docs/corpus/SHA256SUMS.txt against its recorded hash. This proves the
//      imported corpus is byte-identical to the Pass 12 artifact set, not a transcription of it.
//   2. Run the corpus's own validator in place (surface ownership, FR/TEST counts, API contract
//      ownership, trace membership, parity coverage).
//
// Both must pass. The manifest is verified in Node rather than with sha256sum(1) so the gate
// behaves identically on Windows and Linux CI.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CORPUS = path.join(ROOT, 'docs/corpus');
const MANIFEST = path.join(CORPUS, 'SHA256SUMS.txt');
const VALIDATOR = path.join(CORPUS, 'tools/validate_corpus.py');

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

function verifyManifest() {
  const errors = [];
  if (!fs.existsSync(MANIFEST)) return { errors: [`missing ${path.relative(ROOT, MANIFEST)}`], verified: 0 };
  const lines = fs.readFileSync(MANIFEST, 'utf8').split(/\r?\n/).filter((l) => l.trim());
  let verified = 0;
  for (const line of lines) {
    const m = /^([0-9a-f]{64})\s+(.+)$/.exec(line.trim());
    if (!m) { errors.push(`unparseable manifest line: ${line.slice(0, 60)}`); continue; }
    const [, hash, recorded] = m;
    const relPath = recorded.replace(/^\.\//, '');
    const abs = path.join(CORPUS, relPath);
    if (!fs.existsSync(abs)) { errors.push(`manifest lists a missing file: ${relPath}`); continue; }
    const actual = sha256(abs);
    if (actual !== hash) errors.push(`hash mismatch: ${relPath}`);
    verified++;
  }
  return { errors, verified };
}

function pythonCandidates() {
  return process.platform === 'win32'
    ? ['python', 'python3', 'py']
    : ['python3', 'python'];
}

function runValidator() {
  const errors = [];
  if (!fs.existsSync(VALIDATOR)) return { errors: [`missing ${path.relative(ROOT, VALIDATOR)}`], output: null };
  for (const bin of pythonCandidates()) {
    const proc = spawnSync(bin, [path.join('tools', 'validate_corpus.py')], {
      cwd: CORPUS,
      encoding: 'utf8',
      env: { ...process.env, PYTHONUTF8: '1' },
    });
    if (proc.error && proc.error.code === 'ENOENT') continue;
    const stdout = (proc.stdout ?? '').trim();
    let parsed = null;
    try { parsed = JSON.parse(stdout); } catch { /* validator prints only JSON on success */ }
    if (proc.status !== 0) {
      if (parsed?.errors?.length) errors.push(...parsed.errors);
      else errors.push(`corpus validator exited ${proc.status}: ${stdout || (proc.stderr ?? '').trim()}`);
    }
    return { errors, output: parsed, interpreter: bin };
  }
  return { errors: ['no python interpreter found (tried: ' + pythonCandidates().join(', ') + ')'], output: null };
}

function main() {
  const manifest = verifyManifest();
  const validator = runValidator();
  const errors = [...manifest.errors, ...validator.errors];

  const result = {
    status: errors.length ? 'FAIL' : 'PASS',
    errors,
    corpus_files_hash_verified: manifest.verified,
    corpus_validator: validator.output ?? { status: 'not-run' },
    interpreter: validator.interpreter ?? null,
  };
  console.log(JSON.stringify(result, null, 2));
  process.exit(errors.length ? 1 : 0);
}

main();

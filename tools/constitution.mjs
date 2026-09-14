#!/usr/bin/env node
// Seed or verify the Spec Kit constitution against the frozen corpus constitution.
//
// The governing articles are NOT re-typed: the corpus file's bytes are embedded inside a
// marked VERBATIM region, and --check re-hashes that region against the corpus file. That
// makes "seeded verbatim" a checkable fact instead of a claim.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_REL = 'docs/corpus/00_CONSTITUTION.md';
const SOURCE = path.join(ROOT, SOURCE_REL);
const TARGET = path.join(ROOT, '.specify/memory/constitution.md');

const BEGIN = `<!-- BEGIN VERBATIM: ${SOURCE_REL} -->`;
const END = `<!-- END VERBATIM: ${SOURCE_REL} -->`;

const VERSION = '1.0.0';
const RATIFIED = '2026-09-13';
const AMENDED = '2026-09-13';

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

const GOVERNANCE = `## Governance

This constitution is the Spec Kit constitution record for the Stagehand SDK rebuild. Its
articles are the frozen reconstruction corpus constitution, installed verbatim above.

**Authority.** The twelve articles supersede ad-hoc practice. Where this document and any
other repository artifact disagree, this document wins. The stable-ID obligations in
Article X and the dependency obligations in Article III are enforced by repository
validators rather than by review attention alone:

- \`pnpm check\` runs every repository gate in one command.
- \`pnpm check:constitution\` re-verifies that the verbatim region above still matches
  \`${SOURCE_REL}\` byte for byte.
- \`pnpm check:ids\` enforces the canonical ID ledger and the ban on reusing superseded IDs.
- \`pnpm check:boundaries\` enforces Article III's headless-core dependency closure.

**Amendment.** Editing the verbatim region in place is forbidden; \`pnpm check:constitution\`
will fail. An amendment is a corpus change: the corpus record is revised (a new pass or an
accepted entry in \`docs/corpus/33_DIVERGENCE_REGISTER.md\`), then this file is re-seeded with
\`node tools/constitution.mjs --write\`, and the version below is bumped. Amendments that
change recovered behavior must carry an explicit \`DIV-###\` with rationale and a parity note,
per Article X.

**Versioning.** MAJOR for a removed or redefined article, MINOR for a new article or a
materially widened obligation, PATCH for clarifications that do not change obligations.

**Version**: ${VERSION} | **Ratified**: ${RATIFIED} | **Last Amended**: ${AMENDED}
`;

function build() {
  const corpus = fs.readFileSync(SOURCE, 'utf8');
  const digest = sha256(Buffer.from(corpus, 'utf8'));
  const header = `<!--
  Stagehand SDK Constitution - Spec Kit constitution record.

  The verbatim region below is the frozen Pass 0-12 reconstruction constitution. It is
  generated, not authored: run \`node tools/constitution.mjs --write\` to re-seed it.
  Do not hand-edit inside the VERBATIM markers.

  Source: ${SOURCE_REL}
  Source SHA-256: ${digest}
-->
`;
  return { text: `${header}${BEGIN}\n${corpus}${END}\n\n${GOVERNANCE}`, digest };
}

function extractInstalled() {
  if (!fs.existsSync(TARGET)) return { error: `${path.relative(ROOT, TARGET)} does not exist; run --write` };
  const text = fs.readFileSync(TARGET, 'utf8');
  const beginAt = text.indexOf(BEGIN);
  const endAt = text.indexOf(END);
  if (beginAt === -1 || endAt === -1 || endAt < beginAt) {
    return { error: `verbatim markers missing from ${path.relative(ROOT, TARGET)}` };
  }
  const region = text.slice(beginAt + BEGIN.length + 1, endAt);
  return { region, text };
}

function main() {
  const write = process.argv.includes('--write');
  const corpus = fs.readFileSync(SOURCE, 'utf8');
  const expected = sha256(Buffer.from(corpus, 'utf8'));

  if (write) {
    const { text, digest } = build();
    fs.mkdirSync(path.dirname(TARGET), { recursive: true });
    fs.writeFileSync(TARGET, text);
    console.log(JSON.stringify({
      status: 'WROTE',
      target: path.relative(ROOT, TARGET).replace(/\\/g, '/'),
      source: SOURCE_REL,
      source_sha256: digest,
      bytes: Buffer.byteLength(text, 'utf8'),
    }, null, 2));
    return;
  }

  const errors = [];
  const installed = extractInstalled();
  if (installed.error) {
    errors.push(installed.error);
  } else {
    const actual = sha256(Buffer.from(installed.region, 'utf8'));
    if (actual !== expected) {
      errors.push(`verbatim region hash ${actual} != corpus hash ${expected}`);
    }
    if (!/^## Governance$/m.test(installed.text)) errors.push('missing "## Governance" section');
    if (!/\*\*Version\*\*: \d+\.\d+\.\d+/.test(installed.text)) errors.push('missing **Version** footer');
    if (!installed.text.includes(expected)) errors.push('header does not record the corpus SHA-256');
  }

  const result = {
    status: errors.length ? 'FAIL' : 'PASS',
    errors,
    source: SOURCE_REL,
    source_sha256: expected,
    target: path.relative(ROOT, TARGET).replace(/\\/g, '/'),
    verbatim: errors.length === 0,
  };
  console.log(JSON.stringify(result, null, 2));
  process.exit(errors.length ? 1 : 0);
}

main();

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Cross-package imports resolve to workspace SOURCE, derived from the same declaration the
// skeleton is generated from. Two reasons this is not hand-listed aliases:
//
//   * a hand-written alias map is a second copy of the workspace graph, which is exactly the drift
//     class the registry feature exists to remove;
//   * tests then exercise the code as written rather than a stale `dist/` that a build may not have
//     refreshed. There is no build pipeline yet (deferred deliberately), so `dist/` does not exist
//     and a package-resolution-based setup cannot work at all.

const root = path.dirname(fileURLToPath(import.meta.url));
const declaration = JSON.parse(fs.readFileSync(path.join(root, 'docs/governance/workspaces.json'), 'utf8'));
const alias = Object.fromEntries(
  declaration.workspaces.map((workspace) => [workspace.name, path.join(root, workspace.dir, 'src/index.ts')]),
);

export default defineConfig({
  resolve: { alias },
  test: {
    include: [
      'tests/**/*.test.mjs',
      'tests/**/*.test.ts',
      'packages/*/test/**/*.test.ts',
      'packages/compatibility/*/test/**/*.test.ts',
      'plugins/*/test/**/*.test.ts',
      'examples/*/test/**/*.test.ts',
    ],
    environment: 'node',
    reporters: ['default'],
  },
});

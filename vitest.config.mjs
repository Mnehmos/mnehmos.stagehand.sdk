import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'tests/**/*.test.mjs',
      'packages/*/test/**/*.test.ts',
      'packages/compatibility/*/test/**/*.test.ts',
      'plugins/*/test/**/*.test.ts',
      'examples/*/test/**/*.test.ts',
    ],
    environment: 'node',
    reporters: ['default'],
  },
});

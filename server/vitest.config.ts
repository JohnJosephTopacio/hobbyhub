import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => ({
  test: {
    include: ['./tests/**/*.{test,spec}.ts'],
    // ensures vitest looks for .env.test first in the current working directory, and disables the requirement for env variables to start with VITE_
    env: loadEnv(mode, process.cwd(), ''),
    setupFiles: ['./tests/setup/beforeEach.ts'],
  },
}));

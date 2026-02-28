/**
 * @project AncestorTree
 * @file vitest.config.ts
 * @description Vitest configuration for desktop SQLite shim integration tests.
 * @version 1.0.0
 * @updated 2026-02-26
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['src/app/api/desktop-db/**/*.ts'],
      exclude: ['src/app/api/desktop-db/__tests__/**'],
    },
    // Sequential to avoid multiple sql.js WASM initializations competing
    testTimeout: 15000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

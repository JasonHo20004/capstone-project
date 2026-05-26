// =============================================================================
// Vitest configuration — capstone monorepo
// =============================================================================
// Run:
//   pnpm test               — one-off run for CI
//   pnpm test:watch         — interactive watch mode
//   pnpm test:coverage      — generate coverage report
//
// Test files must match: apps/*/src/**/*.{test,spec}.ts
// =============================================================================

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["apps/*/src/**/*.{test,spec}.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/generated/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["apps/*/src/**/*.ts"],
      exclude: [
        "**/*.d.ts",
        "**/index.ts",
        "**/server.ts",
        "**/generated/**",
        "**/*.test.ts",
        "**/*.spec.ts",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
      },
    },
  },
});

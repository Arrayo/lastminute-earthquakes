import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    globals: true,
    alias: {
      "@tools/": resolve(__dirname, "tools/snapshot-generator/src/"),
    },
  },
});

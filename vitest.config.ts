import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
    exclude: ["src/**/*.browser.spec.ts", "src/**/*.browser.spec.tsx"], // browser用テストを除外
    environment: "happy-dom",
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
});

import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // Deliberately separate from the dev DATABASE_URL in .env.local — the
    // service tests delete all rows from projects/site_settings in their
    // beforeEach/afterAll hooks, which previously wiped real dev content
    // because tests ran against the same database as `bun dev`.
    env: {
      DATABASE_URL:
        "postgresql://postgres:postgres@localhost:5433/houssaineamzil_test",
    },
    setupFiles: ["./vitest.setup.ts"],
  },
});

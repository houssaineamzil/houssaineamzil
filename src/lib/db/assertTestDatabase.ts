/**
 * Tests delete every row from the projects/site_settings tables in their
 * beforeEach/afterAll hooks. A prior incident wiped the real dev database
 * because the test suite ran against the same DATABASE_URL as `bun dev` —
 * this guard makes that fail loudly instead of silently deleting content.
 */
export function assertTestDatabase(url: string | undefined): void {
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — tests require a dedicated *_test database.",
    );
  }

  let databaseName: string;
  try {
    databaseName = new URL(url).pathname.replace(/^\//, "");
  } catch {
    throw new Error(`DATABASE_URL is not a valid URL: ${url}`);
  }

  if (!databaseName.endsWith("_test")) {
    throw new Error(
      `Refusing to run tests against database "${databaseName}" — it does not ` +
        `end in "_test". Tests delete all rows from projects/site_settings; ` +
        `running them against a non-test database destroys real content.`,
    );
  }
}

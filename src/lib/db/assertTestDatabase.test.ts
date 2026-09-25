import { describe, expect, it } from "vitest";
import { assertTestDatabase } from "./assertTestDatabase";

describe("assertTestDatabase", () => {
  it("throws for a URL whose database name is not a _test database", () => {
    expect(() =>
      assertTestDatabase(
        "postgresql://postgres:postgres@localhost:5433/houssaineamzil",
      ),
    ).toThrow(/_test/);
  });

  it("does not throw for a URL whose database name ends in _test", () => {
    expect(() =>
      assertTestDatabase(
        "postgresql://postgres:postgres@localhost:5433/houssaineamzil_test",
      ),
    ).not.toThrow();
  });

  it("throws for an unset URL", () => {
    expect(() => assertTestDatabase(undefined)).toThrow(/DATABASE_URL/);
  });
});

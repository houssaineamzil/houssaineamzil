import { describe, expect, it, vi } from "vitest";

vi.stubEnv("ADMIN_PASSWORD", "correct-horse");
vi.stubEnv("SESSION_SECRET", "0123456789abcdef0123456789abcdef");

import {
  assertValidSession,
  checkPassword,
  createSessionCookie,
  verifySession,
} from "./auth";

describe("auth", () => {
  it("accepts the configured password and rejects others", () => {
    expect(checkPassword("correct-horse")).toBe(true);
    expect(checkPassword("wrong")).toBe(false);
  });

  it("round-trips a session token it created", async () => {
    const token = await createSessionCookie();
    expect(await verifySession(token)).toBe(true);
  });

  it("rejects a garbage token", async () => {
    expect(await verifySession("not-a-real-token")).toBe(false);
  });
});

describe("assertValidSession", () => {
  it("resolves for a valid session token", async () => {
    const token = await createSessionCookie();
    await expect(assertValidSession(token)).resolves.toBeUndefined();
  });

  it("throws for a missing token", async () => {
    await expect(assertValidSession(undefined)).rejects.toThrow(
      /unauthorized/i,
    );
  });

  it("throws for an invalid token", async () => {
    await expect(assertValidSession("not-a-real-token")).rejects.toThrow(
      /unauthorized/i,
    );
  });
});

import { describe, expect, it, vi } from "vitest";

vi.stubEnv("ADMIN_PASSWORD", "correct-horse");
vi.stubEnv("SESSION_SECRET", "0123456789abcdef0123456789abcdef");

import { checkPassword, createSessionCookie, verifySession } from "./auth";

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

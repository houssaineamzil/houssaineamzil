import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

vi.stubEnv("SESSION_SECRET", "0123456789abcdef0123456789abcdef");

import { createSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth";
import { proxy } from "./proxy";

function requestFor(path: string, cookie?: string): NextRequest {
  const headers = new Headers();
  if (cookie) headers.set("cookie", `${SESSION_COOKIE_NAME}=${cookie}`);
  return new NextRequest(new URL(`http://localhost${path}`), { headers });
}

describe("admin middleware", () => {
  it("redirects /admin to /admin/login when there is no session cookie", async () => {
    const response = await proxy(requestFor("/admin"));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("location") ?? "").pathname).toBe(
      "/admin/login",
    );
  });

  it("redirects a nested admin route (/admin/projects/new) with no session", async () => {
    const response = await proxy(requestFor("/admin/projects/new"));
    expect(new URL(response.headers.get("location") ?? "").pathname).toBe(
      "/admin/login",
    );
  });

  it("redirects when the cookie is present but invalid", async () => {
    const response = await proxy(requestFor("/admin", "not-a-real-token"));
    expect(new URL(response.headers.get("location") ?? "").pathname).toBe(
      "/admin/login",
    );
  });

  it("passes through /admin with a valid session cookie", async () => {
    const token = await createSessionCookie();
    const response = await proxy(requestFor("/admin", token));
    expect(response.status).toBe(200);
  });

  it("never redirects /admin/login itself, even without a cookie", async () => {
    const response = await proxy(requestFor("/admin/login"));
    expect(response.status).toBe(200);
  });
});

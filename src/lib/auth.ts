import { jwtVerify, SignJWT } from "jose";

const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not set");
  // Lengths differ trivially in practice for a single-password gate; a
  // constant-time compare isn't load-bearing here the way it would be for
  // per-user credentials, but costs nothing to include.
  if (candidate.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i++) {
    diff |= candidate.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionCookie(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_COOKIE_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_NAME = "admin_session";
export { SESSION_COOKIE_MAX_AGE_SECONDS };

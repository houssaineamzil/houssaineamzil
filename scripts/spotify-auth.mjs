#!/usr/bin/env node

/**
 * One-time helper to obtain a personal Spotify refresh token.
 *
 * Runs entirely on your machine — nothing is deployed, and your client
 * secret never leaves this process (unlike third-party "refresh token
 * generator" sites, which ask you to paste it into their server).
 *
 * Setup (once):
 *   1. In your Spotify app (developer.spotify.com/dashboard), add this
 *      exact redirect URI under "Redirect URIs":
 *        http://127.0.0.1:8888/callback
 *   2. Export your app credentials in this shell:
 *        export SPOTIFY_CLIENT_ID=...
 *        export SPOTIFY_CLIENT_SECRET=...
 *
 * Usage:
 *   node scripts/spotify-auth.mjs
 *
 * It prints an authorization URL — open it, log in as yourself, approve
 * access. The script catches the redirect, exchanges the code for tokens,
 * and prints the refresh token to paste into Vercel. Nothing is written
 * to disk.
 */

import { randomBytes } from "node:crypto";
import { createServer } from "node:http";

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
// Least-privilege: only the scope the "currently playing" widget actually calls.
const SCOPE = "user-read-currently-playing";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "Missing SPOTIFY_CLIENT_ID and/or SPOTIFY_CLIENT_SECRET in the environment.\n" +
      "Export them first, e.g.:\n" +
      "  export SPOTIFY_CLIENT_ID=...\n" +
      "  export SPOTIFY_CLIENT_SECRET=...",
  );
  process.exit(1);
}

const state = randomBytes(16).toString("hex");

const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("scope", SCOPE);
authUrl.searchParams.set("state", state);

const exchangeCodeForTokens = async (code) => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  }
  return data;
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const error = url.searchParams.get("error");
  const returnedState = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  if (error || returnedState !== state || !code) {
    res
      .writeHead(400, { "Content-Type": "text/html" })
      .end(
        "<p>Authorization failed or state mismatch. Check the terminal and try again.</p>",
      );
    console.error(
      "Authorization failed:",
      error ?? "state mismatch / missing code",
    );
    server.close();
    process.exitCode = 1;
    return;
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    res
      .writeHead(200, { "Content-Type": "text/html" })
      .end("<p>Done — you can close this tab and go back to the terminal.</p>");

    console.log(
      "\nSuccess. Refresh token (paste this into Vercel as SPOTIFY_REFRESH_TOKEN):\n",
    );
    console.log(tokens.refresh_token);
    console.log(
      "\n(An access token was also issued but isn't needed — the app derives it from the refresh token at request time.)",
    );
  } catch (err) {
    res
      .writeHead(500, { "Content-Type": "text/html" })
      .end("<p>Token exchange failed. Check the terminal.</p>");
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log("Open this URL, log in as yourself, and approve access:\n");
  console.log(authUrl.toString());
  console.log(`\nWaiting for the redirect on ${REDIRECT_URI} ...`);
});

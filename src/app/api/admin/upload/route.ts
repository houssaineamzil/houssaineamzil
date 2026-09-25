import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split("=")[1];

  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // Explicit token, not the SDK's default BLOB_READ_WRITE_TOKEN lookup:
    // the original "houssaineamzil-media" Blob store's BLOB_READ_WRITE_TOKEN
    // consistently failed with "No read-write token found" in every Vercel
    // environment even immediately after a fresh `vercel storage update
    // --add-rw-token` write and a clean redeploy — the variable existed but
    // never actually worked. A brand-new store's token (connected with
    // --prefix BLOB2 to avoid colliding with the still-present broken one)
    // worked immediately. Root cause on the old store was never identified.
    const jsonResponse = await handleUpload({
      token: process.env.BLOB2_READ_WRITE_TOKEN,
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/*", "video/*"],
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload token generation failed:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}

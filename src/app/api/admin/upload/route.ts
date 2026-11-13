import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
  // Checked before the body is read, so anonymous callers cost nothing.
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    // The token is passed explicitly: the store behind the default
    // BLOB_READ_WRITE_TOKEN never accepted writes, so this project uses a
    // second store, connected under the BLOB2 prefix.
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

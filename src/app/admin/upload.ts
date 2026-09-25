"use client";

import { upload } from "@vercel/blob/client";

export async function uploadMedia(file: File): Promise<{ url: string }> {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
  });
  return { url: blob.url };
}

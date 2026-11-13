"use client";

import { useState } from "react";
import { uploadMedia } from "@/app/admin/upload";

/**
 * Upload with an instant preview. `apply(url)` is called with a local blob:
 * URL straight away, then with the real URL once the upload finishes (or with
 * "" if it fails, so a dead preview isn't left in the draft). With
 * `preview: false` it is only called on success. `pending` counts uploads in
 * flight, so Save can wait for them.
 */
export function useUploads(onError: (message: string) => void) {
  const [pending, setPending] = useState(0);

  const upload = async (
    file: File,
    label: string,
    apply: (url: string) => void,
    { preview = true } = {},
  ) => {
    const localUrl = preview ? URL.createObjectURL(file) : null;
    if (localUrl) apply(localUrl);
    setPending((n) => n + 1);
    try {
      apply((await uploadMedia(file)).url);
    } catch (err) {
      if (preview) apply("");
      onError(`${label} upload failed: ${(err as Error).message}`);
    } finally {
      if (localUrl) URL.revokeObjectURL(localUrl);
      setPending((n) => n - 1);
    }
  };

  return { pending, upload };
}

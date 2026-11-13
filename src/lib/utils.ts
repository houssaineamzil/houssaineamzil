import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/** 1 -> "001": the list numbers shown beside projects. */
export const pad = (n: number, width = 3) => String(n).padStart(width, "0");

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v", ".ogv"];

export const isVideoSrc = (src: string) => {
  const path = src.split(/[?#]/)[0]?.toLowerCase() ?? "";
  return VIDEO_EXTENSIONS.some((extension) => path.endsWith(extension));
};

export const isLocalPreviewUrl = (url: string) => /^(blob|data):/i.test(url);

/**
 * The admin editors show an instant local blob: preview before an upload
 * finishes (see Image component's `unoptimized` handling). That URL is only
 * valid in the browser tab that created it — it must never be written to
 * the DB, where every future visitor would see a broken image.
 */
export function assertPersistableUrl(url: string, label: string): void {
  if (isLocalPreviewUrl(url)) {
    throw new Error(
      `${label} is still a local blob: preview URL — wait for the upload to finish before saving`,
    );
  }
}

"use client";

import { useState } from "react";

// Shared pieces of the admin's form-on-the-left, live-preview-on-the-right
// editors (projects, about, settings).

/** Runs `action`, tracking whether it is running and what error it threw. */
export function useSave() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (action: () => Promise<void>) => {
    setError(null);
    setSaving(true);
    try {
      await action();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return { save, saving, error, setError };
}

/**
 * The bar pinned to the bottom of the in-place editors: whatever has no place
 * on the page (children, on the left), then any error, then Save.
 */
export const EditorBar: React.FC<{
  children?: React.ReactNode;
  error: string | null;
  saving: boolean;
  /** Uploads still in flight; Save waits for them. */
  uploading?: boolean;
  onSave: () => void;
  /** Extra buttons before Save (e.g. Delete). */
  actions?: React.ReactNode;
  /** Leave room below the page for the bar (off when the page already fits above it). */
  spacer?: boolean;
}> = ({
  children,
  error,
  saving,
  uploading,
  onSave,
  actions,
  spacer = true,
}) => (
  <>
    {spacer && <div className="h-16" />}
    <div className="fixed inset-x-0 bottom-0 z-300 flex items-center gap-6 border-t border-black/10 bg-white p-2 text-xs uppercase">
      {children}
      {error && (
        <p className="text-red-600 normal-case" role="alert">
          {error}
        </p>
      )}
      <div className="ml-auto flex gap-2">
        {actions}
        <button
          type="button"
          onClick={onSave}
          disabled={saving || uploading}
          className="border border-black px-3 py-1 uppercase disabled:opacity-50"
        >
          {saving ? "Saving…" : uploading ? "Uploading…" : "Save"}
        </button>
      </div>
    </div>
  </>
);

"use client";

import { useState } from "react";
import { saveSiteLinks } from "@/app/admin/actions";
import { NavigationView } from "@/components/navigationView";
import type { SiteLinks } from "@/lib/db/schema";

export const SettingsEditor: React.FC<{ initial: SiteLinks }> = ({
  initial,
}) => {
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteLinks(draft);
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof SiteLinks, label: string) => (
    <label className="flex flex-col gap-1 text-xs uppercase" key={key}>
      {label}
      <input
        value={draft[key]}
        onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
        className="border border-white/30 bg-transparent p-2"
      />
    </label>
  );

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col gap-4 border-r border-white/10 bg-black p-6 text-white">
        {field("linkedin", "LinkedIn URL")}
        {field("instagram", "Instagram URL")}
        {field("behance", "Behance URL")}
        {field("email", "Email")}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="border border-white/30 p-2 uppercase disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* NavigationView uses `fixed inset-x-0 top-0` internally (correct for
          the real site header). Same as ProjectDetail's `md:fixed` in the
          project editor, that escapes a plain column, so this wrapper needs
          `contain: layout` to keep the preview confined to its column. */}
      <div className="relative min-h-screen bg-white [contain:layout]">
        <NavigationView links={draft} />
      </div>
    </div>
  );
};

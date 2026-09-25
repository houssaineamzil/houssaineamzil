"use client";

import { useState } from "react";
import { saveAbout } from "@/app/admin/actions";
import { uploadMedia } from "@/app/admin/upload";
import { AboutContent } from "@/components/aboutContent";
import type { AboutContent as AboutContentType } from "@/lib/db/schema";

export const AboutEditor: React.FC<{ initial: AboutContentType }> = ({
  initial,
}) => {
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);

  const updateParagraph = (index: number, value: string) => {
    const paragraphs = [...draft.paragraphs];
    paragraphs[index] = value;
    setDraft({ ...draft, paragraphs });
  };

  const handlePortraitUpload = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setDraft((prev) => ({
      ...prev,
      portrait: { ...prev.portrait, url: localUrl },
    }));
    const { url } = await uploadMedia(file);
    setDraft((prev) => ({ ...prev, portrait: { ...prev.portrait, url } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAbout(draft);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col gap-4 border-r border-white/10 bg-black p-6 text-white">
        {draft.paragraphs.map((paragraph, index) => (
          <textarea
            key={String(index)}
            value={paragraph}
            onChange={(e) => updateParagraph(index, e.target.value)}
            rows={4}
            className="border border-white/30 bg-transparent p-2 text-sm"
          />
        ))}
        <div className="flex flex-col gap-1 text-xs uppercase">
          Portrait
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handlePortraitUpload(file);
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="border border-white/30 p-2 uppercase disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="overflow-y-auto bg-white">
        <AboutContent about={draft} />
      </div>
    </div>
  );
};

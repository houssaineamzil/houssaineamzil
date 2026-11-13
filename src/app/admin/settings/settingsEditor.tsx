"use client";

import { useState } from "react";
import { saveSiteLinks } from "@/app/admin/actions";
import { EditorBar, useSave } from "@/app/admin/editorKit";
import { InlineText } from "@/components/inlineEdit";
import type { SiteLinks } from "@/lib/db/schema";

const FIELDS: [keyof SiteLinks, string, string][] = [
  ["linkedin", "LinkedIn", "https://linkedin.com/in/…"],
  ["instagram", "Instagram", "https://instagram.com/…"],
  ["behance", "Behance", "https://behance.net/…"],
  ["email", "Email", "you@example.com"],
];

/** The links in the site header, edited in place in the style of a project's facts. */
export const SettingsEditor: React.FC<{ initial: SiteLinks }> = ({
  initial,
}) => {
  const [draft, setDraft] = useState(initial);
  const { save, saving, error } = useSave();

  return (
    <>
      <div className="p-4 pt-24">
        <dl className="grid max-w-xl grid-cols-[auto_1fr] gap-x-10 gap-y-1 text-xs font-medium uppercase text-neutral-950">
          {FIELDS.map(([key, label, placeholder]) => (
            <div key={key} className="contents">
              <dt className="text-muted">{label}</dt>
              <dd>
                <InlineText
                  value={draft[key]}
                  onChange={(value) => setDraft({ ...draft, [key]: value })}
                  placeholder={placeholder}
                  className="normal-case"
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <EditorBar
        spacer={false}
        error={error}
        saving={saving}
        onSave={() => save(() => saveSiteLinks(draft))}
      />
    </>
  );
};

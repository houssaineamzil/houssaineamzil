"use client";

import { useState } from "react";
import { saveAbout } from "@/app/admin/actions";
import { EditorBar, useSave } from "@/app/admin/editorKit";
import { useUploads } from "@/app/admin/useUploads";
import { AboutContent } from "@/components/aboutContent";
import type { AboutContent as AboutContentType } from "@/lib/db/schema";

/** The About page itself, with its text and portrait editable in place. */
export const AboutEditor: React.FC<{ initial: AboutContentType }> = ({
  initial,
}) => {
  const [draft, setDraft] = useState(initial);
  const { save, saving, error, setError } = useSave();
  const { pending, upload } = useUploads(setError);

  return (
    <>
      <AboutContent
        // Exactly the space between the admin header and the bar, so the
        // page fits the window with no scrolling.
        className="h-[calc(100dvh-5rem)] min-h-0"
        about={draft}
        edit={{
          updateParagraph: (index, value) =>
            setDraft((prev) => ({
              ...prev,
              paragraphs: prev.paragraphs.map((p, i) =>
                i === index ? value : p,
              ),
            })),
          uploadPortrait: (file) =>
            void upload(file, "Portrait", (url) =>
              setDraft((prev) => ({
                ...prev,
                portrait: { ...prev.portrait, url },
              })),
            ),
        }}
      />
      <EditorBar
        spacer={false}
        error={error}
        saving={saving}
        uploading={pending > 0}
        onSave={() => save(() => saveAbout(draft))}
      />
    </>
  );
};

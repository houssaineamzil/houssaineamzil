"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { removeProject, saveProject } from "@/app/admin/actions";
import { EditorBar, useSave } from "@/app/admin/editorKit";
import { useUploads } from "@/app/admin/useUploads";
import { InlineText } from "@/components/inlineEdit";
import { ProjectDetail, type ProjectEditApi } from "@/components/projectDetail";
import { type CollectionKind, collections } from "@/lib/collections";
import type { MediaType, ProjectType } from "@/types";

interface Props {
  kind: CollectionKind;
  initialProject: ProjectType;
  email: string;
}

/**
 * The project page itself, with every field editable in place: what you edit
 * is what visitors see. Only what has no place on the page (the URL slug, the
 * wide-card option) lives in the bar at the bottom.
 */
export const ProjectEditor: React.FC<Props> = ({
  kind,
  initialProject,
  email,
}) => {
  const { adminPath, adminListPath } = collections[kind];
  const router = useRouter();
  const [draft, setDraft] = useState(initialProject);
  const { save, saving, error, setError } = useSave();
  const { pending, upload } = useUploads(setError);

  const update: ProjectEditApi["update"] = (key, value) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const patchGallery = (index: number, patch: Partial<MediaType>) =>
    setDraft((prev) => ({
      ...prev,
      gallery: prev.gallery.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));

  const edit: ProjectEditApi = {
    update,
    uploadHero: (file) =>
      void upload(file, "Hero image", (url) =>
        setDraft((prev) => ({ ...prev, image: { url, alt: prev.image.alt } })),
      ),
    removeHero: () =>
      setDraft((prev) => ({
        ...prev,
        image: { url: "", alt: prev.image.alt },
      })),
    removeGallery: (index) =>
      setDraft((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index),
      })),
    uploadGallery: (index, file) =>
      void upload(file, `Gallery item ${index + 1}`, (url) =>
        patchGallery(index, { url }),
      ),
    uploadPoster: (index, file) =>
      void upload(
        file,
        `Poster for gallery item ${index + 1}`,
        (poster) => patchGallery(index, { poster }),
        { preview: false },
      ),
  };

  const handleSave = () =>
    save(async () => {
      // Empty slots (added but never filled) aren't saved.
      await saveProject(kind, {
        ...draft,
        gallery: draft.gallery.filter((item) => item.url),
      });
      // Admin edit routes are keyed by slug, not the DB id.
      router.push(`${adminPath}/${draft.slug}`);
      router.refresh();
    });

  const handleDelete = async () => {
    if (!draft.id) return;
    if (
      !window.confirm(
        `Delete "${draft.name || draft.slug}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      await removeProject(kind, draft.id);
      router.push(adminListPath);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <>
      <ProjectDetail kind={kind} project={draft} email={email} edit={edit} />

      <EditorBar
        error={error}
        saving={saving}
        uploading={pending > 0}
        onSave={handleSave}
        actions={
          draft.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="border border-red-400 px-3 py-1 text-red-600 uppercase"
            >
              Delete
            </button>
          )
        }
      >
        <span className="flex gap-2">
          <span className="text-muted">Slug</span>
          <InlineText
            value={draft.slug}
            onChange={(value) => update("slug", value)}
            placeholder="my-project"
            className="normal-case"
          />
        </span>
        {kind === "works" && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.horizontal}
              onChange={(e) => update("horizontal", e.target.checked)}
            />
            Wide card
          </label>
        )}
      </EditorBar>
    </>
  );
};

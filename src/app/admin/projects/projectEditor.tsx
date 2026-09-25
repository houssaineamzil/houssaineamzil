"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { removeProject, saveProject } from "@/app/admin/actions";
import { uploadMedia } from "@/app/admin/upload";
import { ProjectDetail } from "@/components/projectDetail";
import type { MediaType, ProjectType } from "@/types";

interface Props {
  initialProject: ProjectType & { id?: string };
  email: string;
}

export const ProjectEditor: React.FC<Props> = ({ initialProject, email }) => {
  const router = useRouter();
  const [draft, setDraft] = useState(initialProject);
  const [saving, setSaving] = useState(false);

  const updateField = <K extends keyof ProjectType>(
    key: K,
    value: ProjectType[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleHeroUpload = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    updateField("image", { url: localUrl, alt: draft.image.alt });
    const { url } = await uploadMedia(file);
    updateField("image", { url, alt: draft.image.alt });
  };

  const handleGalleryUpload = async (file: File, index: number) => {
    const gallery = [...(draft.gallery ?? [])];
    const localUrl = URL.createObjectURL(file);
    gallery[index] = {
      url: localUrl,
      alt: gallery[index]?.alt ?? "",
      poster: gallery[index]?.poster,
    };
    updateField("gallery", gallery);

    const { url } = await uploadMedia(file);
    const next = [...gallery];
    next[index] = { ...(next[index] ?? { url: "", alt: "" }), url };
    updateField("gallery", next);
  };

  const handlePosterUpload = async (file: File, index: number) => {
    const { url } = await uploadMedia(file);
    const gallery = [...(draft.gallery ?? [])];
    gallery[index] = {
      ...(gallery[index] ?? { url: "", alt: "" }),
      poster: url,
    };
    updateField("gallery", gallery);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProject({
        id: draft.id,
        slug: draft.slug,
        name: draft.name,
        type: draft.type,
        description: draft.description,
        labels: draft.labels,
        year: draft.year,
        role: draft.role,
        image: draft.image,
        gallery: draft.gallery ?? [],
        horizontal: draft.works.horizontal ?? false,
      });
      // The [id] route looks projects up by slug (see
      // src/app/admin/projects/[id]/page.tsx), not the DB id.
      router.push(`/admin/projects/${draft.slug}`);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!draft.id) return;
    await removeProject(draft.id);
    router.push("/admin");
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col gap-4 border-r border-white/10 bg-black p-6 text-white">
        <label className="flex flex-col gap-1 text-xs uppercase">
          Name
          <input
            value={draft.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="border border-white/30 bg-transparent p-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase">
          Slug
          <input
            value={draft.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            className="border border-white/30 bg-transparent p-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase">
          Year
          <input
            value={draft.year}
            onChange={(e) => updateField("year", e.target.value)}
            className="border border-white/30 bg-transparent p-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase">
          Role
          <input
            value={draft.role}
            onChange={(e) => updateField("role", e.target.value)}
            className="border border-white/30 bg-transparent p-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase">
          Description
          <textarea
            value={draft.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={6}
            className="border border-white/30 bg-transparent p-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase">
          Labels (comma separated)
          <input
            value={draft.labels.join(", ")}
            onChange={(e) =>
              updateField(
                "labels",
                e.target.value
                  .split(",")
                  .map((l) => l.trim())
                  .filter(Boolean),
              )
            }
            className="border border-white/30 bg-transparent p-2"
          />
        </label>
        <label className="flex items-center gap-2 text-xs uppercase">
          <input
            type="checkbox"
            checked={draft.works.horizontal ?? false}
            onChange={(e) =>
              updateField("works", { horizontal: e.target.checked })
            }
          />
          Horizontal layout
        </label>

        <div className="flex flex-col gap-1 text-xs uppercase">
          Hero image
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleHeroUpload(file);
            }}
          />
        </div>

        <div className="flex flex-col gap-2 text-xs uppercase">
          Gallery
          {(draft.gallery ?? []).map((item, index) => (
            <div key={String(index)} className="border border-white/20 p-2">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleGalleryUpload(file, index);
                }}
              />
              {item.url.match(/\.(mp4|webm|mov)$/i) && (
                <div className="mt-2">
                  Poster image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handlePosterUpload(file, index);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              updateField("gallery", [
                ...(draft.gallery ?? []),
                { url: "", alt: "" } as MediaType,
              ])
            }
            className="border border-white/30 p-2"
          >
            Add gallery item
          </button>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 border border-white/30 p-2 uppercase disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {draft.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="border border-red-400 p-2 text-red-400 uppercase"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* ProjectDetail uses `md:fixed` internally (correct for the real
          full-page /works/[slug] route). Reused here inside a grid column,
          that would otherwise escape to the viewport edge and sit on top of
          the form, silently eating every click. `contain: layout` makes
          this div a containing block for fixed descendants, so the preview
          stays confined to its column. */}
      <div className="relative overflow-y-auto bg-white [contain:layout]">
        <ProjectDetail project={draft} nextSlug={draft.slug} email={email} />
      </div>
    </div>
  );
};

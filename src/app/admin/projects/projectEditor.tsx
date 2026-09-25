"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { removeProject, saveProject } from "@/app/admin/actions";
import { uploadMedia } from "@/app/admin/upload";
import { ProjectDetail } from "@/components/projectDetail";
import { isVideoSrc } from "@/lib/utils";
import type { MediaType, ProjectType } from "@/types";

interface Props {
  initialProject: ProjectType & { id?: string };
  email: string;
}

export const ProjectEditor: React.FC<Props> = ({ initialProject, email }) => {
  const router = useRouter();
  const [draft, setDraft] = useState(initialProject);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingUploads, setPendingUploads] = useState(0);
  // The url alone can't say "video" once it's a blob: preview (no
  // extension), so track it explicitly from the upload's file.type instead
  // of re-deriving it from the (possibly local) url on every render.
  const [galleryIsVideo, setGalleryIsVideo] = useState<boolean[]>(() =>
    (initialProject.gallery ?? []).map((item) => isVideoSrc(item.url)),
  );

  const updateField = <K extends keyof ProjectType>(
    key: K,
    value: ProjectType[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleHeroUpload = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setDraft((prev) => ({
      ...prev,
      image: { url: localUrl, alt: prev.image.alt },
    }));
    setPendingUploads((n) => n + 1);
    try {
      const { url } = await uploadMedia(file);
      setDraft((prev) => ({ ...prev, image: { url, alt: prev.image.alt } }));
    } catch (err) {
      setDraft((prev) => ({
        ...prev,
        image: { url: "", alt: prev.image.alt },
      }));
      setError(`Hero image upload failed: ${(err as Error).message}`);
    } finally {
      setPendingUploads((n) => n - 1);
    }
  };

  const handleGalleryUpload = async (file: File, index: number) => {
    const localUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video/");

    setDraft((prev) => {
      const gallery = [...(prev.gallery ?? [])];
      const existing = gallery[index];
      gallery[index] = {
        url: localUrl,
        alt: existing?.alt ?? "",
        poster: existing?.poster,
      };
      return { ...prev, gallery };
    });
    setGalleryIsVideo((prev) => {
      const next = [...prev];
      next[index] = isVideo;
      return next;
    });
    setPendingUploads((n) => n + 1);

    try {
      const { url } = await uploadMedia(file);
      setDraft((prev) => {
        const gallery = [...(prev.gallery ?? [])];
        const current = gallery[index];
        if (!current) return prev;
        gallery[index] = { ...current, url };
        return { ...prev, gallery };
      });
    } catch (err) {
      setDraft((prev) => {
        const gallery = [...(prev.gallery ?? [])];
        const current = gallery[index];
        if (current) gallery[index] = { ...current, url: "" };
        return { ...prev, gallery };
      });
      setError(
        `Gallery item ${index + 1} upload failed: ${(err as Error).message}`,
      );
    } finally {
      setPendingUploads((n) => n - 1);
    }
  };

  const handlePosterUpload = async (file: File, index: number) => {
    setPendingUploads((n) => n + 1);
    try {
      const { url } = await uploadMedia(file);
      setDraft((prev) => {
        const gallery = [...(prev.gallery ?? [])];
        const current = gallery[index];
        if (!current) return prev;
        gallery[index] = { ...current, poster: url };
        return { ...prev, gallery };
      });
    } catch (err) {
      setError(
        `Poster upload for gallery item ${index + 1} failed: ${(err as Error).message}`,
      );
    } finally {
      setPendingUploads((n) => n - 1);
    }
  };

  const handleSave = async () => {
    setError(null);
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
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!draft.id) return;
    if (
      !window.confirm(
        `Delete "${draft.name || draft.slug}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    setError(null);
    try {
      await removeProject(draft.id);
      router.push("/admin");
    } catch (err) {
      setError((err as Error).message);
    }
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
          Type
          <input
            value={draft.type}
            onChange={(e) => updateField("type", e.target.value)}
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
          {(draft.gallery ?? []).map((_item, index) => (
            <div key={String(index)} className="border border-white/20 p-2">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleGalleryUpload(file, index);
                }}
              />
              {galleryIsVideo[index] && (
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
            onClick={() => {
              updateField("gallery", [
                ...(draft.gallery ?? []),
                { url: "", alt: "" } as MediaType,
              ]);
              setGalleryIsVideo((prev) => [...prev, false]);
            }}
            className="border border-white/30 p-2"
          >
            Add gallery item
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-xs" role="alert">
            {error}
          </p>
        )}

        <div className="mt-auto flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || pendingUploads > 0}
            className="flex-1 border border-white/30 p-2 uppercase disabled:opacity-50"
          >
            {saving ? "Saving…" : pendingUploads > 0 ? "Uploading…" : "Save"}
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

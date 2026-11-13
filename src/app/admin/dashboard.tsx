"use client";

import { useState } from "react";
import { saveProjectOrder } from "@/app/admin/actions";
import { Image } from "@/components/image";
import { type CollectionKind, collections } from "@/lib/collections";
import { pad } from "@/lib/utils";
import type { StoredProject } from "@/types";

/**
 * The admin list: every project as a card in a six-column grid, with a
 * "new" tile at the end. Drag a card onto another to reorder.
 */
export const Dashboard: React.FC<{
  kind: CollectionKind;
  initialProjects: StoredProject[];
}> = ({ kind, initialProjects }) => {
  const { adminPath, singular } = collections[kind];
  const [projects, setProjects] = useState(initialProjects);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commitOrder = async (
    previous: StoredProject[],
    next: StoredProject[],
  ) => {
    setError(null);
    setProjects(next);
    try {
      await saveProjectOrder(
        kind,
        next.map((p) => p.id),
      );
    } catch (err) {
      setProjects(previous);
      setError((err as Error).message);
    }
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...projects];
    const [moved] = next.splice(dragIndex, 1);
    if (!moved) return;
    next.splice(targetIndex, 0, moved);
    setDragIndex(null);
    void commitOrder(projects, next);
  };

  return (
    <div className="p-4">
      {error && (
        <p className="mb-4 text-red-600 text-xs" role="alert">
          {error}
        </p>
      )}
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {projects.map((project, index) => (
          <li
            key={project.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragEnd={() => setDragIndex(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            className={dragIndex === index ? "opacity-40" : undefined}
          >
            <a
              href={`${adminPath}/${project.slug}`}
              draggable={false}
              className="relative block aspect-square overflow-hidden bg-neutral-200"
            >
              {project.image.url && (
                <Image
                  fill
                  src={project.image.url}
                  alt={project.image.alt}
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 17vw"
                />
              )}
            </a>
            <div className="mt-3 flex gap-6 text-[11px]">
              <span className="text-muted">{pad(index + 1)}</span>
              <div>
                <h2 className="mb-1 font-semibold uppercase">
                  {project.name || "(untitled)"}
                </h2>
                <p className="text-muted">{project.projectType}</p>
              </div>
            </div>
          </li>
        ))}

        <li>
          <a
            href={`${adminPath}/new`}
            className="flex aspect-square items-center justify-center border border-neutral-400 border-dashed text-[11px] text-neutral-500 uppercase hover:bg-neutral-100"
          >
            + New {singular}
          </a>
        </li>
      </ul>
    </div>
  );
};

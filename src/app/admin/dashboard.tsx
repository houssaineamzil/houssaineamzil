"use client";

import { useState } from "react";
import { saveProjectOrder } from "@/app/admin/actions";
import { type CollectionKind, collections } from "@/lib/collections";
import type { ProjectType } from "@/types";

export const Dashboard: React.FC<{
  kind: CollectionKind;
  initialProjects: (ProjectType & { id: string })[];
}> = ({ kind, initialProjects }) => {
  const { adminPath, title } = collections[kind];
  const [projects, setProjects] = useState(initialProjects);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commitOrder = async (
    previous: (ProjectType & { id: string })[],
    next: (ProjectType & { id: string })[],
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
    const previous = projects;
    const next = [...projects];
    const moved = next[dragIndex];
    if (!moved) return;
    next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setDragIndex(null);
    void commitOrder(previous, next);
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between">
        <h1 className="text-sm uppercase">{title}</h1>
        <a href={`${adminPath}/new`} className="text-sm uppercase underline">
          Add {kind === "works" ? "project" : "experiment"}
        </a>
      </div>
      {error && (
        <p className="mb-4 text-red-600 text-xs" role="alert">
          {error}
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {projects.map((project, index) => (
          <li
            key={project.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            className="flex items-center gap-4 border border-black/10 p-2"
          >
            <span className="w-6 text-xs text-neutral-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-sm">
              {project.name || "(untitled)"}
            </span>
            <a
              href={`${adminPath}/${project.slug}`}
              className="text-xs uppercase underline"
            >
              Edit
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

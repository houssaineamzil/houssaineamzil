import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ProjectDetail,
  type ProjectNeighbour,
} from "@/components/projectDetail";
import type { CollectionKind } from "@/lib/collections";
import { getCollection } from "@/services/projects";
import { getSiteLinks } from "@/services/settings";
import type { ProjectType } from "@/types";

export const projectMetadata = async (
  kind: CollectionKind,
  slug: string,
): Promise<Metadata> => {
  const project = await getCollection(kind).getBySlug(slug);
  return { title: project?.name ?? "Not found" };
};

/** Full project page shared by /works/[slug] and /playground/[slug]. */
export const ProjectPage = async ({
  kind,
  slug,
}: {
  kind: CollectionKind;
  slug: string;
}) => {
  const collection = getCollection(kind);
  const [project, all, links] = await Promise.all([
    collection.getBySlug(slug),
    collection.getAll(),
    getSiteLinks(),
  ]);

  if (!project) notFound();

  const index = all.findIndex((p) => p.slug === slug);
  const count = all.length;
  const toNeighbour = (p: ProjectType): ProjectNeighbour => ({
    slug: p.slug,
    name: p.name,
    imageUrl: p.image.url,
  });
  const prev = all[(index - 1 + count) % count] ?? project;
  const next = all[(index + 1) % count] ?? project;

  return (
    <ProjectDetail
      kind={kind}
      project={project}
      prev={toNeighbour(prev)}
      next={toNeighbour(next)}
      email={links.email}
    />
  );
};

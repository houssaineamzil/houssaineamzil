import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projectDetail";
import type { CollectionKind } from "@/lib/collections";
import { getCollection } from "@/services/projects";
import { getSiteLinks } from "@/services/settings";

export const projectMetadata = async (
  kind: CollectionKind,
  slug: string,
): Promise<Metadata> => {
  const project = await getCollection(kind).getBySlug(slug);
  if (!project) return { title: "Not found" };
  // The first words of the story make the best search snippet.
  const summary = (project.strategy || project.description).slice(0, 160);
  return {
    title: project.name,
    ...(summary && { description: summary }),
  };
};

/** Full project page shared by /works/[slug] and /playground/[slug]. */
export const ProjectPage = async ({
  kind,
  slug,
}: {
  kind: CollectionKind;
  slug: string;
}) => {
  const [all, links] = await Promise.all([
    getCollection(kind).getAll(),
    getSiteLinks(),
  ]);
  const index = all.findIndex((p) => p.slug === slug);
  const project = all[index];
  if (!project) notFound();

  // Prev/next wrap around the list.
  const prev = all[(index - 1 + all.length) % all.length] ?? project;
  const next = all[(index + 1) % all.length] ?? project;

  return (
    <ProjectDetail
      kind={kind}
      project={project}
      prev={prev}
      next={next}
      email={links.email}
    />
  );
};

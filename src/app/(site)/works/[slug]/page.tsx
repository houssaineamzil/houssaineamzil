import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ProjectDetail,
  type ProjectNeighbour,
} from "@/components/projectDetail";
import { getProjectBySlug, getProjects } from "@/services/projects";
import { getSiteLinks } from "@/services/settings";
import type { ProjectType } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  return { title: project?.name ?? "Not found" };
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const [project, allProjects, links] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getSiteLinks(),
  ]);

  if (!project) notFound();

  const index = allProjects.findIndex((p) => p.slug === slug);
  const count = allProjects.length;
  const toNeighbour = (p: ProjectType): ProjectNeighbour => ({
    slug: p.slug,
    name: p.name,
    imageUrl: p.image.url,
  });
  const prev = allProjects[(index - 1 + count) % count] ?? project;
  const next = allProjects[(index + 1) % count] ?? project;

  return (
    <ProjectDetail
      project={project}
      prev={toNeighbour(prev)}
      next={toNeighbour(next)}
      email={links.email}
    />
  );
};

export default Page;

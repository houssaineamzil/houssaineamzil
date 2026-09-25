import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projectDetail";
import { getProjectBySlug, getProjects } from "@/services/projects";
import { getSiteLinks } from "@/services/settings";

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
  const next = allProjects[(index + 1) % allProjects.length] ?? project;

  return (
    <ProjectDetail project={project} nextSlug={next.slug} email={links.email} />
  );
};

export default Page;

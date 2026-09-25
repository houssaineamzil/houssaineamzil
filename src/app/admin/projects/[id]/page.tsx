import { notFound } from "next/navigation";
import { ProjectEditor } from "@/app/admin/projects/projectEditor";
import { getProjectBySlug } from "@/services/projects";
import { getSiteLinks } from "@/services/settings";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: slug } = await params;
  const [project, links] = await Promise.all([
    getProjectBySlug(slug),
    getSiteLinks(),
  ]);
  if (!project) notFound();

  return <ProjectEditor initialProject={project} email={links.email} />;
};

export default Page;

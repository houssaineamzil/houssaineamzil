import { notFound } from "next/navigation";
import { ProjectEditor } from "@/app/admin/projects/projectEditor";
import { experimentsCollection } from "@/services/projects";
import { getSiteLinks } from "@/services/settings";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: slug } = await params;
  const [experiment, links] = await Promise.all([
    experimentsCollection.getBySlug(slug),
    getSiteLinks(),
  ]);
  if (!experiment) notFound();

  return (
    <ProjectEditor
      kind="experiments"
      initialProject={experiment}
      email={links.email}
    />
  );
};

export default Page;

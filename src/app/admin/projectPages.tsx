import { notFound } from "next/navigation";
import { Dashboard } from "@/app/admin/dashboard";
import { ProjectEditor } from "@/app/admin/projects/projectEditor";
import type { CollectionKind } from "@/lib/collections";
import { getCollection } from "@/services/projects";
import { getSiteLinks } from "@/services/settings";
import type { ProjectType } from "@/types";

// The works and experiments admin sections are identical apart from `kind`;
// their route files are one-liners around these.

const blankProject: ProjectType = {
  slug: "",
  name: "",
  description: "",
  strategy: "",
  result: "",
  impact: "",
  year: "",
  role: "",
  projectType: "",
  url: "",
  designer: "",
  developer: "",
  image: { url: "", alt: "" },
  gallery: [],
  horizontal: false,
};

export const ProjectListPage = async ({ kind }: { kind: CollectionKind }) => (
  <Dashboard kind={kind} initialProjects={await getCollection(kind).getAll()} />
);

export const NewProjectPage = async ({ kind }: { kind: CollectionKind }) => {
  const { email } = await getSiteLinks();
  return (
    <ProjectEditor kind={kind} initialProject={blankProject} email={email} />
  );
};

export const EditProjectPage = async ({
  kind,
  slug,
}: {
  kind: CollectionKind;
  slug: string;
}) => {
  const [project, { email }] = await Promise.all([
    getCollection(kind).getBySlug(slug),
    getSiteLinks(),
  ]);
  if (!project) notFound();
  return <ProjectEditor kind={kind} initialProject={project} email={email} />;
};

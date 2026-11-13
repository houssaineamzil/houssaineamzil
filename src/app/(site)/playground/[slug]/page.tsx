import type { Metadata } from "next";
import { ProjectPage, projectMetadata } from "@/components/projectPage";
import { getCollection } from "@/services/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

// Built ahead of time and refreshed by the admin's saves (revalidatePath), so
// a visit is a cached file, not a database round trip. A slug added later is
// built on its first visit.
export const generateStaticParams = async () =>
  (await getCollection("experiments").getAll()).map(({ slug }) => ({ slug }));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
  projectMetadata("experiments", (await params).slug);

const Page = async ({ params }: Props) => (
  <ProjectPage kind="experiments" slug={(await params).slug} />
);

export default Page;

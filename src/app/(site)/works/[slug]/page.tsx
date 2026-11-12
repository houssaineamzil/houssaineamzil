import type { Metadata } from "next";
import { ProjectPage, projectMetadata } from "@/components/projectPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
  projectMetadata("works", (await params).slug);

const Page = async ({ params }: Props) => (
  <ProjectPage kind="works" slug={(await params).slug} />
);

export default Page;

import type { NextPage } from "next";
import { WorksGrid } from "@/components/worksGrid";
import { getProjects } from "@/services/projects";

const Page: NextPage = async () => {
  const projects = await getProjects();
  return <WorksGrid projects={projects} />;
};

export default Page;

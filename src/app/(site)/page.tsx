import type { NextPage } from "next";
import { Slider } from "@/components/slider";
import { getProjects } from "@/services/projects";

const Page: NextPage = async () => {
  const projects = await getProjects();
  return <Slider projects={projects} />;
};

export default Page;

import type { Metadata } from "next";
import { ArchiveList } from "@/components/archiveList";
import { getProjects } from "@/services/projects";

export const metadata: Metadata = {
  title: "Archive",
};

const Page = async () => {
  const projects = await getProjects();
  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-[15%]">
      <ArchiveList projects={projects} />
    </div>
  );
};

export default Page;

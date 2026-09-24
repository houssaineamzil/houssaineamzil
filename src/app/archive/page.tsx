import type { Metadata } from "next";
import { ArchiveList } from "@/components/archiveList";
import { projects } from "@/constants";

export const metadata: Metadata = {
  title: "Archive",
};

const Page = () => {
  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-[15%]">
      <ArchiveList projects={projects} />
    </div>
  );
};

export default Page;

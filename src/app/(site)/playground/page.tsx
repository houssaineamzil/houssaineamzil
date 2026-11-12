import type { Metadata } from "next";
import { ArchiveList } from "@/components/archiveList";
import { experimentsCollection } from "@/services/projects";

export const metadata: Metadata = {
  title: "Playground",
};

const Page = async () => {
  const experiments = await experimentsCollection.getAll();
  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-[15%]">
      <ArchiveList projects={experiments} basePath="/playground" />
    </div>
  );
};

export default Page;

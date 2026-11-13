import type { Metadata } from "next";
import { ArchiveList } from "@/components/archiveList";
import { collections } from "@/lib/collections";
import { getCollection } from "@/services/projects";

export const metadata: Metadata = {
  title: "Playground",
};

const Page = async () => (
  <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-[15%]">
    <ArchiveList
      projects={await getCollection("experiments").getAll()}
      basePath={collections.experiments.publicPath}
    />
  </div>
);

export default Page;

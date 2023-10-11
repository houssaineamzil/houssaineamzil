import { ArchiveHero } from "_components/ArchiveHero";
import { ArchiveProjects } from "_components/ArchiveProjects";
import type { Metadata } from "next";

// metadata
export const metadata: Metadata = {
  title: "Archive",
};

const Page = () => {
  return (
    <>
      <ArchiveHero />
      <ArchiveProjects />
    </>
  );
};

export default Page;

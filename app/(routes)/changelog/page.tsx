import { ChangelogVersions } from "_components/ChangelogVersions";
import { ChangelogHero } from "_components/ChangelogHero";
import type { Metadata } from "next";

// metadata
export const metadata: Metadata = {
  title: "Changelog",
};

const Page = () => {
  return (
    <>
      <ChangelogHero />
      <ChangelogVersions />
    </>
  );
};

export default Page;

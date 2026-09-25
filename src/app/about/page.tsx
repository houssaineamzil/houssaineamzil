import type { Metadata } from "next";
import { AboutContent } from "@/components/aboutContent";
import { getAboutContent } from "@/services/settings";

export const metadata: Metadata = {
  title: "About",
};

const Page = async () => {
  const about = await getAboutContent();
  return <AboutContent about={about} />;
};

export default Page;

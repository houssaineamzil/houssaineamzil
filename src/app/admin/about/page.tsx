import { AboutEditor } from "@/app/admin/about/aboutEditor";
import { getAboutContent } from "@/services/settings";

const Page = async () => {
  const about = await getAboutContent();
  return <AboutEditor initial={about} />;
};

export default Page;

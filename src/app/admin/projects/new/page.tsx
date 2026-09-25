import { ProjectEditor } from "@/app/admin/projects/projectEditor";
import { getSiteLinks } from "@/services/settings";
import type { ProjectType } from "@/types";

const blankProject: ProjectType = {
  slug: "",
  name: "",
  type: "",
  description: "",
  labels: [],
  year: "",
  role: "",
  image: { url: "", alt: "" },
  gallery: [],
  works: {},
};

const Page = async () => {
  const links = await getSiteLinks();
  return <ProjectEditor initialProject={blankProject} email={links.email} />;
};

export default Page;

import { ProjectEditor } from "@/app/admin/projects/projectEditor";
import { getSiteLinks } from "@/services/settings";
import type { ProjectType } from "@/types";

const blankExperiment: ProjectType = {
  slug: "",
  name: "",
  description: "",
  strategy: "",
  result: "",
  impact: "",
  year: "",
  role: "",
  projectType: "",
  url: "",
  designer: "",
  developer: "",
  image: { url: "", alt: "" },
  gallery: [],
  works: {},
};

export const dynamic = "force-dynamic";

const Page = async () => {
  const links = await getSiteLinks();
  return (
    <ProjectEditor
      kind="experiments"
      initialProject={blankExperiment}
      email={links.email}
    />
  );
};

export default Page;

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

// The prefilled email comes straight from the DB (getSiteLinks) — without
// this, a settings change wouldn't show up here until the next deploy.
export const dynamic = "force-dynamic";

const Page = async () => {
  const links = await getSiteLinks();
  return <ProjectEditor initialProject={blankProject} email={links.email} />;
};

export default Page;

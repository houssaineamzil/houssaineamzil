import type { NextPage } from "next";
import { Slider } from "@/components/slider";
import { WorksGrid } from "@/components/worksGrid";
import { getCollection } from "@/services/projects";

// Desktop keeps the horizontal slider; mobile and small tablets get a normal
// vertical list (no drag, no tick sound). Both render server-side and CSS
// picks one at the lg breakpoint; the slider additionally refuses to mount
// below it, so it never runs its listeners or audio on small screens.
const Page: NextPage = async () => {
  const projects = await getCollection("works").getAll();
  // The slider is a client component: send it only what its cards show, not
  // every project's gallery and case-study text.
  const summaries = projects.map(({ slug, name, projectType, image }) => ({
    slug,
    name,
    projectType,
    image,
  }));
  return (
    <>
      <div className="hidden lg:block">
        <Slider projects={summaries} />
      </div>
      <div className="lg:hidden">
        <WorksGrid projects={projects} />
      </div>
    </>
  );
};

export default Page;

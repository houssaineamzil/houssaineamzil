import type { NextPage } from "next";
import { Slider } from "@/components/slider";
import { WorksGrid } from "@/components/worksGrid";
import { getProjects } from "@/services/projects";

// Desktop keeps the horizontal slider; mobile and small tablets get a normal
// vertical list (no drag, no tick sound). Both render server-side and CSS
// picks one at the lg breakpoint; the slider additionally refuses to mount
// below it, so it never runs its listeners or audio on small screens.
const Page: NextPage = async () => {
  const projects = await getProjects();
  return (
    <>
      <div className="hidden lg:block">
        <Slider projects={projects} />
      </div>
      <div className="lg:hidden">
        <WorksGrid projects={projects} />
      </div>
    </>
  );
};

export default Page;

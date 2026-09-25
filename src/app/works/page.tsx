import type { NextPage } from "next";
import { WorkCard } from "@/components/worksCard";
import { cn } from "@/lib";
import { assignWorksLayout } from "@/lib/worksLayout";
import { getProjects } from "@/services/projects";

const Page: NextPage = async () => {
  const projects = await getProjects();
  const projectBySlug = new Map(projects.map((p) => [p.slug, p]));
  const rows = assignWorksLayout(
    projects.map((p) => ({ slug: p.slug, horizontal: p.works.horizontal })),
  );

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-[15%]">
      <div className="works-grid flex flex-col gap-24 mt-36">
        {rows.map((row, rowIndex) => (
          <div
            key={String(rowIndex)}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 lg:gap-x-24"
          >
            {row.map(({ slug, column }) => {
              const project = projectBySlug.get(slug);
              if (!project) return null;
              const index = projects.findIndex((p) => p.slug === slug);

              return (
                <div
                  key={slug}
                  className={cn(column === 2 && "md:col-start-2")}
                >
                  <WorkCard
                    index={index}
                    {...project}
                    horizontal={project.works.horizontal}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;

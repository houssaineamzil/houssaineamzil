import { cn } from "@/lib";
import { assignWorksLayout, type WorksColumn } from "@/lib/worksLayout";
import type { ProjectType } from "@/types";
import { WorkCard } from "./worksCard";

// Tailwind needs the full class names to exist in source.
const COLUMN_START: Record<WorksColumn, string> = {
  1: "lg:col-start-1",
  2: "lg:col-start-2",
  3: "lg:col-start-3",
  4: "lg:col-start-4",
};

/**
 * Projects as a staggered four-column grid on desktop and a plain
 * single-column list on mobile / small tablets. Shared by `/` and `/works`.
 */
export const WorksGrid: React.FC<{ projects: ProjectType[] }> = ({
  projects,
}) => {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const rows = assignWorksLayout(
    projects.map((p) => ({ slug: p.slug, horizontal: p.works.horizontal })),
  );

  return (
    <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-4 pt-24 pb-[15%] lg:gap-16 lg:px-4 lg:pt-28">
      {rows.map((row) => (
        <div
          key={row.map((e) => e.slug).join("|")}
          className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-4"
        >
          {row.map(({ slug, column, span }) => {
            const project = bySlug.get(slug);
            if (!project) return null;
            const index = projects.findIndex((p) => p.slug === slug);
            return (
              <div
                key={slug}
                className={cn(
                  COLUMN_START[column],
                  span === 2 && "lg:col-span-2",
                )}
              >
                <WorkCard index={index} {...project} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

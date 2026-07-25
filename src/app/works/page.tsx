import type { NextPage } from "next";
import { WorkCard } from "@/components/worksCard";
import { projects } from "@/constants";
import { cn } from "@/lib";

// ============================================================================
// Layout
// ============================================================================

/**
 * Which column each project sits in. Rows with a single entry leave the
 * other column empty, echoing the reference's asymmetric rhythm.
 */
const rows: { index: number; column: 1 | 2 }[][] = [
  [
    { index: 0, column: 1 },
    { index: 1, column: 2 },
  ],
  [
    { index: 2, column: 1 },
    { index: 3, column: 2 },
  ],
  [{ index: 4, column: 2 }],
  [{ index: 5, column: 1 }],
  [
    { index: 6, column: 1 },
    { index: 7, column: 2 },
  ],
];

// ============================================================================
// Component
// ============================================================================

const Page: NextPage = () => {
  // Rows for projects that no longer exist would still take up a gap in the
  // flex layout even with no children, so drop them instead of rendering
  // empty space.
  const visibleRows = rows.filter((row) =>
    row.some(({ index }) => projects[index]),
  );

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-[15%]">
      <div className="works-grid flex flex-col gap-24 mt-36">
        {visibleRows.map((row, rowIndex) => (
          <div
            key={String(rowIndex)}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 lg:gap-x-24"
          >
            {row.map(({ index, column }) => {
              const project = projects[index];

              if (!project) return null;

              return (
                <div
                  key={project.slug}
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

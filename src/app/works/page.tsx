import type { NextPage } from "next";
import { WorkCard } from "@/components/worksCard";
import { projects } from "@/constants";

// ============================================================================
// Helper Utilities
// ============================================================================

/**
 * Splits an array into smaller array chunks of a specified size.
 */
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size),
  );
};

// ============================================================================
// Component
// ============================================================================

const Page: NextPage = () => {
  // Chunk your projects cleanly into pairs of 2 before entering the JSX stream
  const projectPairs = chunkArray(projects, 2);

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-[15%]">
      <div className="flex flex-col gap-36 mt-36">
        {projectPairs.map((pair, pairIndex) => {
          const pairId = String(pairIndex).padStart(2, "0");

          return (
            <section
              key={pairId}
              aria-label={`Project row ${pairId}`}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start"
            >
              {pair.map((project) => (
                <WorkCard
                  key={project.slug || project.name}
                  {...project}
                  horizontal={project.works.horizontal}
                  variant={project.works.variant}
                />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Page;

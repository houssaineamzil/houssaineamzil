import Link from "next/link";
import { collections } from "@/lib/collections";
import { pad } from "@/lib/utils";
import type { ProjectSummary } from "@/types";
import { Image } from "./image";
import { Reveal } from "./reveal";

/** A card in the home slider (desktop only: below lg the page shows the grid). */
export const ProjectCard: React.FC<{
  project: ProjectSummary;
  /** 1-based number of the project in the list. The slider repeats projects to fill the track, so this isn't the card's position. */
  number: number;
  ref?: React.Ref<HTMLAnchorElement>;
}> = ({ project: { name, slug, projectType, image }, number, ref }) => (
  <Link
    ref={ref}
    href={`${collections.works.publicPath}/${slug}`}
    className="drag-none block h-full w-(--card-size) cursor-grab active:cursor-grabbing select-none"
  >
    <article className="flex h-full w-full flex-col">
      <Reveal className="flex w-full items-start gap-6 pb-3 pl-5 text-[11px]">
        <span data-reveal-item className="text-muted">
          {pad(number)}
        </span>
        <div>
          <h2 data-reveal-item className="mb-1 font-semibold uppercase">
            {name}
          </h2>
          <p data-reveal-item className="text-muted">
            {projectType}
          </p>
        </div>
      </Reveal>

      <div className="relative h-(--card-size) w-full overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            fill
            parallax
            horizontal
            src={image.url}
            alt={image.alt}
            loading={number <= 4 ? "eager" : undefined}
            fetchPriority={number === 1 ? "high" : undefined}
            sizes="25vw"
            className="object-cover"
          />
        </div>
      </div>
    </article>
  </Link>
);

import Link from "next/link";
import { collections } from "@/lib/collections";
import { pad } from "@/lib/utils";
import type { ProjectType } from "@/types";
import { Image } from "./image";

export const WorkCard: React.FC<{
  project: ProjectType;
  /** 1-based position in the list. */
  number: number;
}> = ({ project: { name, slug, image, projectType }, number }) => {
  return (
    <div className="works-card group flex w-full flex-col">
      <Link
        href={`${collections.works.publicPath}/${slug}`}
        className="relative aspect-3/4 w-full overflow-hidden bg-neutral-200 sm:aspect-square"
      >
        {/* Fine zoom on hover, only on devices that can actually hover. */}
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-focus-within:scale-[1.04] [@media(hover:hover)]:group-hover:scale-[1.04]">
          <Image
            fill
            parallax
            src={image.url}
            alt={image.alt}
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
        </div>
      </Link>
      <div className="mt-3 flex gap-6 text-[11px]">
        <span className="text-muted">{pad(number)}</span>
        <div>
          <h2 className="mb-1 font-semibold uppercase">{name}</h2>
          <p className="text-muted">{projectType}</p>
        </div>
      </div>
    </div>
  );
};

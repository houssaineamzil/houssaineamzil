import Link from "next/link";
import type { ProjectType } from "@/types";
import { Image } from "./image";

interface Props extends ProjectType {
  index: number;
}

export const WorkCard: React.FC<Props> = ({
  index,
  name,
  slug,
  image,
  projectType,
}) => {
  return (
    <div className="works-card group flex w-full flex-col">
      <Link
        href={`/works/${slug}`}
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
        <span className="text-muted">{String(index + 1).padStart(3, "0")}</span>
        <div>
          <h2 className="mb-1 font-medium">{name}</h2>
          <p className="text-muted">{projectType}</p>
        </div>
      </div>
    </div>
  );
};

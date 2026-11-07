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
  labels,
  result,
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
        {result && (
          <span className="absolute bottom-3 left-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-neutral-900 backdrop-blur transition-opacity duration-300 group-focus-within:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
            {result}
          </span>
        )}
      </Link>
      <div className="mt-3 flex gap-6 text-[11px]">
        <span className="text-muted">{String(index + 1).padStart(3, "0")}</span>
        <div>
          <h2 className="mb-1 font-medium">{name}</h2>
          <p className="text-muted">{labels.slice(0, 2).join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

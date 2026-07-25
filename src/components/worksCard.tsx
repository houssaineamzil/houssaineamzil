import NextImage from "next/image";
import Link from "next/link";
import { cn } from "@/lib";
import type { ProjectType } from "@/types";
import { Image } from "./image";

interface Props extends ProjectType {
  index: number;
  horizontal?: boolean;
}

export const WorkCard: React.FC<Props> = ({
  index,
  name,
  slug,
  image,
  labels,
  horizontal = false,
}) => {
  return (
    <div
      className={cn(
        "works-card flex flex-col w-full",
        horizontal ? "md:w-2xl" : "md:w-md",
      )}
    >
      <Link
        href={`/works/${slug}`}
        className="relative w-full aspect-3/4 md:aspect-square overflow-hidden"
      >
        <Image
          fill
          parallax
          src={image.url}
          alt={image.alt}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <NextImage
          fill
          aria-hidden
          alt=""
          src={image.url}
          sizes="32px"
          className="works-card-pixelate absolute inset-0 object-cover"
        />
      </Link>
      <div className="mt-4 flex gap-6 text-[11px] uppercase">
        <span className="text-muted">{String(index + 1).padStart(3, "0")}</span>
        <div>
          <h1 className="mb-1">{name}</h1>
          <p className="text-muted">{labels.slice(0, 2).join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

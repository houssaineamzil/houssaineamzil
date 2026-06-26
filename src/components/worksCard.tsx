import Link from "next/link";
import { cn } from "@/lib";
import type { ProjectType } from "@/types";
import { Image } from "./image";

interface Props extends ProjectType {
  variant?: keyof typeof variants;
  horizontal?: boolean;
}

const variants = {
  1: "ml-[25%]",
  2: "mt-[16%] mr-2",
  3: "ml-2",
  4: "mt-[8%] mr-[20%]",
  5: "ml-[8%]",
  6: "mt-[12%] mr-[12%]",
  7: "-mt-[8%] ml-[25%]",
  8: "mt-[10%] mr-2",
};

export const WorkCard: React.FC<Props> = ({
  name,
  slug,
  image,
  description,
  variant = 1,
  horizontal = false,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col",
        horizontal ? "w-2xl" : "w-md",
        variants[variant],
      )}
    >
      <Link
        href={`/works/${slug}`}
        className={cn(
          "relative w-full",
          horizontal ? "aspect-3/2" : "aspect-2/3",
        )}
      >
        <Image
          fill
          parallax
          src={image.url}
          alt={image.alt}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="mt-4 max-w-md">
        <h1 className="mb-2.5 text-[15px] uppercase">{name}</h1>
        <p className="text-muted">{description}</p>
      </div>
    </div>
  );
};

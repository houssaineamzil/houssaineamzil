import Link from "next/link";
import React from "react";
import type { ProjectType } from "@/types";
import { Image } from "./image";
import { Reveal } from "./reveal";

interface Props
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "type" | "role">,
    ProjectType {
  index: number;
  /** 1-based number of the project in the list, shown in the header. The slider repeats projects to fill the track, so this isn't `index`. */
  number: number;
}

export const ProjectCard = React.forwardRef<HTMLAnchorElement, Props>(
  ({ index, number, name, slug, projectType, image, ...props }, ref) => {
    return (
      <Link
        {...props}
        ref={ref}
        data-cindex={index}
        href={`/works/${slug}`}
        className="drag-none block h-full w-dvw md:w-(--card-size) cursor-grab active:cursor-grabbing select-none"
      >
        <article className="flex h-full w-full flex-col">
          {/* Desktop Metadata Layout */}
          <header className="hidden h-32 w-full lg:block">
            <Reveal className="flex h-full w-full items-start gap-6 pt-4 pl-5 text-[11px]">
              <span data-reveal-item className="text-muted">
                {String(number).padStart(3, "0")}
              </span>
              <div>
                <h1 data-reveal-item className="mb-1 font-medium">
                  {name}
                </h1>
                <p data-reveal-item className="text-muted">
                  {projectType}
                </p>
              </div>
            </Reveal>
          </header>

          {/* Visual Container Asset Block */}
          <div className="relative h-128 w-full overflow-hidden md:h-(--card-size) bg-neutral-900">
            <div className="absolute inset-0 pointer-events-none z-0">
              <Image
                fill
                parallax
                horizontal
                src={image.url}
                alt={image.alt}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            {/* Mobile-Only Overlays */}
            <Reveal className="absolute inset-0 z-10 flex flex-col justify-between p-6 bg-linear-to-t from-black/40 via-transparent to-transparent lg:hidden pointer-events-none text-neutral-100">
              <div className="flex justify-between items-start w-full">
                <h1
                  data-reveal-item
                  className="text-sm font-semibold uppercase tracking-wider"
                >
                  {name}
                </h1>
              </div>

              <div className="flex justify-between items-end w-full mt-auto">
                <p
                  data-reveal-item
                  className="text-xs font-normal leading-relaxed"
                >
                  {projectType}
                </p>
                <p
                  data-reveal-item
                  className="text-xs font-medium underline underline-offset-4 tracking-wide"
                >
                  Discover
                </p>
              </div>
            </Reveal>
          </div>
        </article>
      </Link>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

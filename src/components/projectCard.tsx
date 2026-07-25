import Link from "next/link";
import React from "react";
import type { ProjectType } from "@/types";
import { Image } from "./image";

interface Props
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "type" | "role">,
    ProjectType {
  index: number;
}

export const ProjectCard = React.forwardRef<HTMLAnchorElement, Props>(
  ({ index, name, slug, type, labels, image, ...props }, ref) => {
    return (
      <Link
        {...props}
        ref={ref}
        data-cindex={index}
        href={`/works/${slug}`}
        className="drag-none block h-full w-dvw md:w-96 cursor-grab active:cursor-grabbing select-none"
      >
        <article className="flex h-full w-full flex-col">
          {/* Desktop Metadata Layout */}
          <header className="hidden h-52 w-full lg:flex justify-between items-start pt-5">
            <div className="ml-5">
              <h1 className="mb-4 font-semibold text-xs uppercase tracking-wider">
                {name}
              </h1>
              <div className="font-normal text-muted text-xs leading-relaxed">
                {labels.map((label) => (
                  <p key={label}>{label}</p>
                ))}
              </div>
            </div>
            <p className="mt-0 mr-16 ml-5 text-muted text-xs font-medium uppercase tracking-wider">
              {type}
            </p>
          </header>

          {/* Visual Container Asset Block */}
          <div className="relative h-128 w-full overflow-hidden bg-neutral-900">
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
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 bg-linear-to-t from-black/40 via-transparent to-transparent lg:hidden pointer-events-none text-neutral-100">
              <div className="flex justify-between items-start w-full">
                <h1 className="text-sm font-semibold uppercase tracking-wider">
                  {name}
                </h1>
                <h2 className="text-xs uppercase tracking-widest opacity-80">
                  {type}
                </h2>
              </div>

              <div className="flex justify-between items-end w-full mt-auto">
                <div className="text-xs font-normal leading-relaxed">
                  {labels.map((label, idx) => (
                    <div key={label} className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-mono opacity-60">
                        {String(idx).padStart(2, "0")}
                      </span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-medium underline underline-offset-4 tracking-wide">
                  Discover
                </p>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

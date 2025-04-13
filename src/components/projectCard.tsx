import Link from "next/link";
import React from "react";
import { Image } from "./image";

interface Props
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "type">,
    ProjectType {
  index: number;
}

export const ProjectCard = React.forwardRef<HTMLAnchorElement, Props>(
  ({ index, name, slug, type, labels, image }, ref) => {
    return (
      <Link ref={ref} data-cindex={index} href={`/works/${slug}`}>
        <div className="flex h-full w-96 cursor-pointer flex-col">
          <div className="hidden h-52 w-full lg:flex">
            <div className="ml-5">
              <h1 className="mb-13 font-semibold text-xs uppercase">{name}</h1>
              <p className="font-normal text-muted text-xs leading-tight">
                {labels.map((label, index) => (
                  <React.Fragment key={label}>
                    {label}
                    {index < labels.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>
            <p className="mt-7 mr-16 ml-5 text-muted text-xs">{type}</p>
          </div>
          <div className="relative h-128 w-full">
            <Image
              fill
              parallax
              horizontal
              src={image.url}
              alt={image.alt}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <h1 className="absolute top-[22.4rem] left-[10.2rem] z-100 block text-neutral-100 text-text-sm lg:hidden">
              {name}
            </h1>
            <h2 className="absolute top-[48%] left-[38%] text-neutral-100 text-text-sm uppercase lg:hidden">
              {type}
            </h2>
            <p className="absolute top-[37.9rem] left-[2.5rem] z-100 block font-normal text-neutral-100 text-xs lg:hidden">
              {labels.map((label, index) => (
                <React.Fragment key={label}>
                  <span>
                    <span className="mb-[0.3rem] inline-block translate-y-[-0.35rem] scale-50">
                      {String(index).padStart(2, "0")}{" "}
                    </span>
                    {label}
                  </span>
                  <br />
                </React.Fragment>
              ))}
            </p>
            <p className="absolute top-[37.9rem] right-[4.2rem] block text-neutral-100 text-text-sm underline lg:hidden">
              Discover
            </p>
          </div>
        </div>
      </Link>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

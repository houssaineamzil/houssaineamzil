"use client";

import { gsap } from "gsap";
import NextLink from "next/link";
import type React from "react";
import { useEffect, useRef } from "react";
import { Image } from "@/components/image";
import type { ProjectType } from "@/types";

interface Props {
  projects: ProjectType[];
}

export const ArchiveList: React.FC<Props> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rows = Array.from(
      container.querySelectorAll<HTMLElement>("[data-row]"),
    );
    if (rows.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const dividers =
        container.querySelectorAll<HTMLElement>("[data-divider]");
      const textItems =
        container.querySelectorAll<HTMLElement>("[data-reveal-item]");
      gsap.set(dividers, { width: "100%" });
      gsap.set(textItems, { opacity: 1 });
      gsap.set(rows, { pointerEvents: "auto" });
      return;
    }

    // Each row's own divider draws in, then its own text follows — with
    // the next row's divider already starting before this one's text
    // finishes (ROW_STAGGER is shorter than a row's own duration), so the
    // reveal reads as one continuous wave moving down the page rather than
    // two big all-dividers-then-all-text phases.
    const ROW_STAGGER = 0.08;

    const tl = gsap.timeline();
    for (const [index, row] of rows.entries()) {
      const divider = row.previousElementSibling;
      const textItems = row.querySelectorAll<HTMLElement>("[data-reveal-item]");
      if (!divider) continue;

      // A row stays un-hoverable (see the static `pointer-events-none`
      // below) until its own divider and text finish — otherwise the hover
      // preview image can appear over a row that still looks like nothing.
      const rowTl = gsap.timeline({
        onComplete: () => gsap.set(row, { pointerEvents: "auto" }),
      });
      rowTl
        .fromTo(
          divider,
          { width: 0 },
          { width: "100%", duration: 0.6, ease: "power3.out" },
          "0",
        )
        .fromTo(
          textItems,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.04,
          },
          "<0.2",
        );

      tl.add(rowTl, index * ROW_STAGGER);
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="mt-36 **:data-reveal-item:opacity-0">
      {projects.map((project, index) => (
        <div key={project.slug}>
          <div
            data-divider
            className="h-px bg-neutral-200"
            style={{ width: 0 }}
          />

          <NextLink
            data-row
            href={`/works/${project.slug}`}
            className="group pointer-events-none flex items-center gap-6 py-6 text-[11px] uppercase"
          >
            <span data-reveal-item className="text-muted">
              {String(index + 1).padStart(3, "0")}
            </span>
            <h1
              data-reveal-item
              className="flex-1 font-semibold transition-opacity group-hover:opacity-60"
            >
              {project.name}
            </h1>
            <p data-reveal-item className="text-muted hidden sm:block">
              {project.role}
            </p>
            <p data-reveal-item className="text-muted">
              {project.year}
            </p>

            {/* Hover preview — fixed at the same spot for every row, so only
            the actively hovered row's image is ever visible. */}
            <div className="pointer-events-none fixed top-1/2 right-8 z-10 hidden w-80 aspect-3/4 -translate-y-1/2 bg-neutral-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block xl:right-16">
              <Image
                fill
                src={project.image.url}
                alt={project.image.alt}
                sizes="320px"
                className="object-cover"
              />
            </div>
          </NextLink>
        </div>
      ))}
    </div>
  );
};

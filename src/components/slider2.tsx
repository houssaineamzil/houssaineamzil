"use client";

import { projects } from "@/constants";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap-trial/InertiaPlugin";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type React from "react";
import { useEffect, useRef } from "react";
import { ProjectCard } from "./projectCard";

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

export const Slider: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const items = itemRefs.current;

    if (!container || !items) return;

    let maxWidth = 0;

    const getMaxWidth = () => {
      maxWidth = 0;
      for (const section of items) {
        maxWidth += section.offsetWidth;
      }
    };

    getMaxWidth();
    ScrollTrigger.addEventListener("refreshInit", getMaxWidth);

    const scroll = gsap.to(items, {
      x: () => -(maxWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: true,
        end: "+=5000",
        invalidateOnRefresh: true,
      },
    });

    ScrollTrigger.create({
      start: 0.1,
      markers: true,
      end: () => ScrollTrigger.maxScroll(window) - 1,
      refreshPriority: -100, // always update last
      onLeave: (self) => {
        self.scroll(self.start + 1);
        ScrollTrigger.update();
      },
      onLeaveBack: (self) => {
        self.scroll(self.end - 1);
        ScrollTrigger.update();
      },
    });

    Draggable.create(container, {
      type: "x",
      inertia: true,
      onDragEnd: function () {
        console.log(
          `x velocity is: ${InertiaPlugin.getVelocity(
            this.target,
            "x",
          )} and the duration is ${this.tween.duration()} seconds.`,
        );
      },
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed bottom-0 flex">
      {projects.map((project, index) => (
        <ProjectCard
          index={index}
          key={index.toString().padStart(2, "0")}
          ref={(el: HTMLAnchorElement) => {
            itemRefs.current[index] = el;
          }}
          {...project}
        />
      ))}
    </div>
  );
};

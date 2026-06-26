"use client";

import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Observer } from "gsap/Observer";
import type React from "react";
import { useEffect, useRef } from "react";
import { projects } from "@/constants";
import { ProjectCard } from "./projectCard";

gsap.registerPlugin(Draggable, Observer);

export const Slider: React.FC = () => {
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;

    // Safely collect currently mounted items
    const items = itemRefs.current.filter(
      (el): el is HTMLAnchorElement => el !== null,
    );
    if (items.length === 0) return;

    // UNIFIED POSITION TRACKER
    // proxy.x holds our continuous, unbounded scroll position
    const proxy = { x: 0 };
    let targetX = 0;

    // Calculates and updates the loop coordinates dynamically
    const updatePositions = () => {
      // Read total track width directly from the DOM container
      const totalWidth = container.scrollWidth;

      items.forEach((item) => {
        const itemWidth = item.offsetWidth;
        const rawX = item.offsetLeft + proxy.x;

        // Infinite wrapping window tailored to each item's boundary box.
        // It wraps to the right track edge only when completely hidden off-screen left.
        const minX = -itemWidth;
        const maxX = totalWidth - itemWidth;
        const wrappedX = gsap.utils.wrap(minX, maxX, rawX);

        // Apply translation delta relative to its natural CSS position
        gsap.set(item, { x: wrappedX - item.offsetLeft });
      });

      // --- BROADCAST MOVE EVENT ---
      // Notifies child components that the slider coordinates updated
      window.dispatchEvent(new CustomEvent("slider-move"));
    };

    // Smooth interpolation controller
    const catchUp = gsap.to(proxy, {
      x: () => targetX,
      duration: 0.6,
      ease: "power2.out",
      paused: true,
      onUpdate: updatePositions,
    });

    // Initialize layout positions on mount
    updatePositions();

    let draggableInstance: Draggable[] | null = null;
    let observerInstance: Observer | null = null;

    if (typeof window !== "undefined") {
      const virtualTarget = document.createElement("div");

      // 1. Drag & Touch Swiping Interaction
      draggableInstance = Draggable.create(virtualTarget, {
        trigger: container,
        type: "x",
        onDragStart() {
          targetX = proxy.x;
          catchUp.pause();
        },
        onDrag() {
          targetX += this.deltaX; // Directly maps physical dragging pixels
          catchUp.invalidate().restart();
        },
        onDragEnd() {
          const velocity = this.getVelocity("x");
          targetX += velocity * 0.25; // Kinetic glide/inertia throw
          catchUp.invalidate().restart();
        },
      });

      // 2. Mouse Wheel & Trackpad Interaction
      observerInstance = Observer.create({
        target: container,
        type: "pointer,touch,wheel",
        onChange: (self) => {
          if (!self.isDragging) {
            const delta =
              Math.abs(self.deltaX) > Math.abs(self.deltaY)
                ? self.deltaX
                : self.deltaY;
            targetX -= delta * 0.8; // Normalized wheel sensitivity multiplier
            catchUp.invalidate().restart();
          }
        },
      });
    }

    // Cleanup tracks cleanly to prevent SPA memory leaks
    return () => {
      catchUp.kill();
      draggableInstance?.[0]?.kill();
      observerInstance?.kill();
    };
  }, []);

  return (
    <div
      ref={cardsRef}
      className="fixed bottom-0 flex select-none touch-none will-change-transform"
    >
      {projects.map((project, index) => (
        <ProjectCard
          index={index}
          key={project.slug || index}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          {...project}
        />
      ))}
    </div>
  );
};

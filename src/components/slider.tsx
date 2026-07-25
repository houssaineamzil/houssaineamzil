"use client";

import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Observer } from "gsap/Observer";
import type React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects } from "@/constants";
import { ProjectCard } from "./projectCard";

gsap.registerPlugin(Draggable, Observer, InertiaPlugin);

// The per-item wrap trick only looks seamless when the physical track is at
// least as wide as the viewport — otherwise there aren't enough real cards to
// tile across the screen and a gap shows through. Repeating the project list
// keeps this true no matter how few projects exist, with a comfortable margin.
const MIN_VIEWPORT_MULTIPLE = 2;

export const Slider: React.FC = () => {
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [repeatCount, setRepeatCount] = useState(1);

  // Grow the repeat count until the track comfortably out-spans the viewport.
  useLayoutEffect(() => {
    const container = cardsRef.current;
    if (!container || projects.length === 0) return;

    const measure = () => {
      const singleSetWidth = container.scrollWidth / repeatCount;
      const needed = Math.max(
        1,
        Math.ceil((window.innerWidth * MIN_VIEWPORT_MULTIPLE) / singleSetWidth),
      );

      if (needed !== repeatCount) setRepeatCount(needed);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [repeatCount]);

  const items = Array.from({ length: repeatCount }, () => projects).flat();

  // biome-ignore lint/correctness/useExhaustiveDependencies: repeatCount isn't read directly, but the DOM nodes it renders change, so Draggable/Observer need to rebind to the new set
  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;

    // Safely collect currently mounted items
    const trackItems = itemRefs.current.filter(
      (el): el is HTMLAnchorElement => el !== null,
    );
    if (trackItems.length === 0) return;

    // UNIFIED POSITION TRACKER
    // proxy.x holds our continuous, unbounded scroll position
    const proxy = { x: 0 };
    let targetX = 0;

    // Calculates and updates the loop coordinates dynamically
    const updatePositions = () => {
      // Read total track width directly from the DOM container
      const totalWidth = container.scrollWidth;

      trackItems.forEach((item) => {
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
          const velocity = InertiaPlugin.getVelocity(virtualTarget, "x");
          targetX += velocity * 0.25; // Kinetic glide/inertia throw
          catchUp.invalidate().restart();
        },
      });

      // 2. Mouse Wheel & Trackpad Interaction
      // Bound to the window (not just the cards container) so scrolling works
      // regardless of cursor position, since the track can be narrower than
      // the viewport once there are only a few projects. Only "wheel" here —
      // GSAP's Observer attaches touch listeners (and preventDefault()s them)
      // for BOTH "touch" and "pointer" types on touch-capable devices, which,
      // bound window-wide, would block native touch scrolling everywhere on
      // the page. The dedicated Draggable above already handles touch
      // swiping on the cards themselves, scoped just to them.
      observerInstance = Observer.create({
        target: window,
        type: "wheel",
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
  }, [repeatCount]);

  return (
    <div
      ref={cardsRef}
      // Lenis listens for touch globally to drive smooth scroll; without this
      // it competes with the Draggable below for the same touch gesture and
      // the horizontal swipe stops working.
      data-lenis-prevent-touch
      className="fixed bottom-0 flex select-none touch-none will-change-transform"
    >
      {items.map((project, index) => (
        <ProjectCard
          index={index}
          // biome-ignore lint/suspicious/noArrayIndexKey: the project list repeats to fill the track, so slug alone collides across copies — index disambiguates them
          key={`${project.slug || index}-${index}`}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          {...project}
        />
      ))}
    </div>
  );
};

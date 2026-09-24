"use client";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import type React from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib";

gsap.registerPlugin(SplitText);

interface Props {
  children: React.ReactNode;
  className?: string;
}

const MARKER_SELECTOR = "[data-reveal-item], [data-reveal-lines]";

/**
 * Fades and rises each marked descendant in, staggered, once this block
 * scrolls into view — e.g. each line of a text block, rather than the block
 * as a whole. Mark an element `data-reveal-item` to reveal it as one unit,
 * or `data-reveal-lines` to split its text into lines (via SplitText) and
 * reveal each line individually. Used to give server-rendered content a
 * client-driven intro without restructuring markup beyond adding these
 * markers. Fires immediately for anything already in the viewport at
 * mount, so this covers both above-the-fold content and content further
 * down the page with the same code path.
 */
export const Reveal: React.FC<Props> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const markers = Array.from(
      container.querySelectorAll<HTMLElement>(MARKER_SELECTOR),
    );
    if (markers.length === 0) return;

    // Lines don't exist until SplitText creates them client-side, so a
    // split marker's own element is what the static hidden class (below)
    // targets — it's swapped back to visible here, once its freshly split
    // lines are ready to take over showing/hiding themselves individually.
    const splits: SplitText[] = [];
    const targets: Element[] = [];
    for (const marker of markers) {
      if (marker.hasAttribute("data-reveal-lines")) {
        const split = new SplitText(marker, {
          type: "lines",
          linesClass: "reveal-line",
        });
        splits.push(split);
        gsap.set(marker, { opacity: 1 });
        targets.push(...split.lines);
      } else {
        targets.push(marker);
      }
    }

    const revert = () => {
      for (const split of splits) split.revert();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { opacity: 1 });
      return revert;
    }

    // The static hidden class below only covers opacity (see its own
    // comment for why), so the y offset — needed for both plain items and
    // freshly split lines, neither of which has one yet — is set here,
    // immediately, rather than left for the intersection-triggered tween's
    // own immediateRender to apply a frame late.
    gsap.set(targets, { opacity: 0, y: 16 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.05,
        });
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      revert();
    };
  }, []);

  return (
    // Both marker kinds start hidden via a static class rather than only
    // through the effect above — the effect only runs after hydration, by
    // which point the server-rendered HTML has already had its first
    // (visible) paint. Without this, content flashes visible, then
    // invisible, then visible again as gsap's immediateRender snaps it
    // hidden a frame late. A `data-reveal-lines` marker itself is what gets
    // targeted here (its not-yet-existing split lines can't be); the effect
    // swaps it back to visible right after splitting, handing visibility
    // control to those lines instead.
    <div
      ref={containerRef}
      className={cn(
        "**:data-reveal-item:opacity-0 **:data-reveal-lines:opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
};

"use client";

import gsap from "gsap";
import NextImage from "next/image";
import { useEffect, useRef } from "react";
import { cn, isVideoSrc } from "@/lib";
import type { MediaType } from "@/types";

interface Props {
  images: MediaType[];
}

/** How far the highlight frame extends beyond a thumbnail's own edges, in px. */
const OUTSET = 8;

export const GalleryMinimap: React.FC<Props> = ({ images }) => {
  const railRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: images isn't read directly, it's a re-run trigger so the rail re-measures fresh DOM nodes after client-side navigation to a different project
  useEffect(() => {
    const indicator = indicatorRef.current;
    const buttons =
      railRef.current?.querySelectorAll<HTMLButtonElement>("button");
    if (!indicator || !buttons?.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Kept hidden (and collapsed to height 0) until the thumbnails finish
    // their own intro below, so the indicator doesn't flash into view as a
    // lone line before there's anything for it to be highlighting.
    let revealed = reducedMotion;

    const handleScroll = () => {
      const rail = railRef.current;
      const sections = document.querySelectorAll<HTMLElement>(
        "[data-gallery-image]",
      );

      if (!rail || !buttons?.length) return;
      if (buttons.length !== sections.length) return;

      const first = sections[0];
      const last = sections[sections.length - 1];

      if (!first || !last) return;

      // Each real image can be a different height, so the fraction of total
      // scroll it "owns" varies too — weight the breakpoints by actual height
      // rather than assuming every image takes an equal share.
      const sectionHeights = Array.from(
        sections,
        (section) => section.getBoundingClientRect().height,
      );
      const totalHeight = sectionHeights.reduce((sum, h) => sum + h, 0);

      const breakpoints = [0];
      let cumulative = 0;
      for (const height of sectionHeights) {
        cumulative += height;
        breakpoints.push(cumulative / totalHeight);
      }

      const scrollStart = first.getBoundingClientRect().top + window.scrollY;
      const scrollEnd =
        last.getBoundingClientRect().bottom +
        window.scrollY -
        window.innerHeight;

      const progress = gsap.utils.clamp(
        0,
        1,
        (window.scrollY - scrollStart) / (scrollEnd - scrollStart),
      );

      let segment = 0;
      while (
        segment < breakpoints.length - 2 &&
        progress > (breakpoints[segment + 1] ?? 1)
      ) {
        segment++;
      }

      const segmentStart = breakpoints[segment] ?? 0;
      const segmentEnd = breakpoints[segment + 1] ?? 1;
      const localProgress =
        segmentEnd > segmentStart
          ? (progress - segmentStart) / (segmentEnd - segmentStart)
          : 0;

      const currentButton = buttons[segment];
      const nextButton = buttons[Math.min(segment + 1, buttons.length - 1)];

      if (!currentButton || !nextButton) return;

      const top = gsap.utils.interpolate(
        currentButton.offsetTop,
        nextButton.offsetTop,
        localProgress,
      );
      const height = gsap.utils.interpolate(
        currentButton.offsetHeight,
        nextButton.offsetHeight,
        localProgress,
      );

      if (!revealed) {
        gsap.set(indicator, { y: top - OUTSET, height: 0 });
        return;
      }

      // Reduced motion still needs the indicator to track scroll position —
      // that's information, not decoration — just without the eased glide.
      if (reducedMotion) {
        gsap.set(indicator, { y: top - OUTSET, height: height + OUTSET * 2 });
        return;
      }

      gsap.to(indicator, {
        y: top - OUTSET,
        height: height + OUTSET * 2,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // Reveals the indicator once the thumbnails have finished animating in:
    // fades it in and, since `revealed` flips from false to true right
    // before, the immediately-following handleScroll() call grows it from
    // height 0 up to its real target instead of snapping straight there.
    const revealIndicator = () => {
      revealed = true;
      gsap.to(indicator, { opacity: 1, duration: 0.5, ease: "power3.out" });
      handleScroll();
    };

    let buttonsTween: gsap.core.Tween | null = null;

    if (reducedMotion) {
      // `revealed` was already true for the initial handleScroll() call
      // above, so the indicator is already correctly positioned — it just
      // needs to be shown, with no transition. Buttons need the same
      // override, since the static `opacity-0` class they start with
      // otherwise leaves them hidden forever with no tween to clear it.
      gsap.set(indicator, { opacity: 1 });
      gsap.set(buttons, { opacity: 1 });
    } else {
      // fromTo (not from) — see Reveal component for why an inferred end
      // state breaks under React Strict Mode's dev double-invoke.
      buttonsTween = gsap.fromTo(
        buttons,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.05,
          delay: 0.2,
          onComplete: revealIndicator,
        },
      );
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      buttonsTween?.kill();
    };
  }, [images]);

  if (images.length < 2) return null;

  return (
    <div className="fixed top-60 z-20 hidden md:left-[calc(42%-4.5rem)] md:block">
      <div ref={railRef} className="relative flex w-16 flex-col gap-2">
        {images.map((image, imageIndex) => {
          // Videos can't render through next/image directly — a poster must
          // be supplied for the minimap thumbnail instead of playing/decoding
          // the video just to show a still frame.
          const thumbnailSrc = isVideoSrc(image.url) ? image.poster : image.url;

          return (
            <button
              key={image.url}
              type="button"
              onClick={() =>
                document
                  .querySelector(`[data-gallery-image="${imageIndex}"]`)
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className={cn(
                "relative block cursor-pointer overflow-hidden bg-neutral-200 opacity-0",
                imageIndex === 0 ? "aspect-square" : "aspect-video p-[6%]",
              )}
            >
              <div className="group relative size-full">
                {thumbnailSrc && (
                  <NextImage
                    fill
                    src={thumbnailSrc}
                    alt={image.alt}
                    sizes="64px"
                    className="object-cover transition-all duration-500 ease-in-out grayscale-100 group-hover:grayscale-0"
                  />
                )}
              </div>
            </button>
          );
        })}

        <div
          ref={indicatorRef}
          className="pointer-events-none absolute top-0 -left-2 w-20 border border-neutral-400 opacity-0"
        />
      </div>
    </div>
  );
};

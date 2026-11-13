"use client";

import gsap from "gsap";
import NextImage, { type ImageProps } from "next/image";
import type React from "react";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn, isLocalPreviewUrl, isVideoSrc } from "@/lib/utils";

interface Props extends ImageProps {
  parallax?: boolean;
  horizontal?: boolean;
  revealOnScroll?: boolean;
}

export const Image: React.FC<Props> = ({
  className,
  fill = false,
  parallax = false,
  horizontal = false,
  revealOnScroll = false,
  src,
  alt,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const video = typeof src === "string" && isVideoSrc(src);

  // Fires immediately for anything already in the viewport at mount, so the
  // same observer covers both the hero image (visible on load) and gallery
  // images further down the page (revealed as they're scrolled into view).
  useEffect(() => {
    const container = containerRef.current;
    if (!revealOnScroll || !container) return;

    if (prefersReducedMotion()) {
      gsap.set(container, { opacity: 1 });
      return;
    }

    // The y offset is owned entirely by GSAP (the `transform` property)
    // rather than a Tailwind `translate-y-*` class — Tailwind v4 applies
    // translate via the standalone CSS `translate` property, which GSAP's
    // `y` tween doesn't know about and can't animate away.
    gsap.set(container, { y: 24 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        gsap.to(container, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        });
        observer.disconnect();
      },
      { threshold: 0.2 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [revealOnScroll]);

  useEffect(() => {
    const container = containerRef.current;
    const media = imageRef.current ?? videoRef.current;

    if (!parallax || !container || !media) return;
    if (prefersReducedMotion()) return;
    // Parallax is desktop-only: on touch/small screens it reads as too much
    // movement and costs a scroll listener per image.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    // Where this image sits in the viewport along the parallax axis
    // (0 = just entering, 1 = just left) maps to a +/-4.5% shift.
    const update = () => {
      const rect = container.getBoundingClientRect();
      const [start, size, view] = horizontal
        ? [rect.left, rect.width, window.innerWidth]
        : [rect.top, rect.height, window.innerHeight];
      const shift = gsap.utils.mapRange(
        0,
        1,
        -4.5,
        4.5,
        (start + size) / (view + size),
      );
      gsap.set(media, horizontal ? { xPercent: shift } : { yPercent: shift });
    };

    // The slider announces every move itself; vertical pages scroll natively.
    const event = horizontal ? "slider-move" : "scroll";
    window.addEventListener(event, update);
    update();

    return () => window.removeEventListener(event, update);
  }, [parallax, horizontal]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        className,
        fill && "absolute inset-0 h-full w-full",
        revealOnScroll && "opacity-0",
      )}
    >
      <div
        className={cn(
          "backface-hidden absolute inset-0 overflow-hidden",
          parallax &&
            (horizontal
              ? "lg:left-[-5%] lg:w-[110%] lg:h-full"
              : "lg:top-[-5%] lg:h-[110%] lg:w-full"),
        )}
      >
        {video ? (
          <video
            ref={videoRef}
            src={src as string}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <NextImage
            ref={imageRef}
            {...props}
            src={src}
            alt={alt}
            fill
            unoptimized={typeof src === "string" && isLocalPreviewUrl(src)}
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
};

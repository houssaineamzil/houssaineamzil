"use client";

import gsap from "gsap";
import NextImage, { type ImageProps } from "next/image";
import type React from "react";
import { useEffect, useRef } from "react";
import { cn, isVideoSrc } from "@/lib";

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleSliderMove = () => {
      // Calculate where this specific image sits relative to the viewport window bounds
      const rect = container.getBoundingClientRect();
      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;

      if (horizontal) {
        // Horizontal track calculation
        const progress = (rect.left + rect.width) / (viewWidth + rect.width);
        const shiftX = gsap.utils.mapRange(0, 1, -15, 15, progress);
        gsap.set(media, { xPercent: shiftX });
      } else {
        // Fallback standard vertical page scroll track calculation
        const progress = (rect.top + rect.height) / (viewHeight + rect.height);
        const shiftY = gsap.utils.mapRange(0, 1, -15, 15, progress);
        gsap.set(media, { yPercent: shiftY });
      }
    };

    // Listen to both custom slider moves and native vertical window scrolling
    window.addEventListener("slider-move", handleSliderMove);
    window.addEventListener("scroll", handleSliderMove);

    // Run initial frame setup placement calculation
    handleSliderMove();

    return () => {
      window.removeEventListener("slider-move", handleSliderMove);
      window.removeEventListener("scroll", handleSliderMove);
    };
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
              ? "left-[-15%] w-[130%] h-full"
              : "top-[-15%] h-[130%] w-full"),
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
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              parallax && "scale-110",
            )}
          />
        ) : (
          <NextImage
            ref={imageRef}
            {...props}
            src={src}
            alt={alt}
            fill
            className="object-cover scale-110"
          />
        )}
      </div>
    </div>
  );
};

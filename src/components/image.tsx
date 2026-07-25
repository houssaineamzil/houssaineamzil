"use client";

import gsap from "gsap";
import NextImage, { type ImageProps } from "next/image";
import type React from "react";
import { useEffect, useRef } from "react";
import { cn, isVideoSrc } from "@/lib";

interface Props extends ImageProps {
  parallax?: boolean;
  horizontal?: boolean;
}

export const Image: React.FC<Props> = ({
  className,
  fill = false,
  parallax = false,
  horizontal = false,
  src,
  alt,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const video = typeof src === "string" && isVideoSrc(src);

  useEffect(() => {
    const container = containerRef.current;
    const media = imageRef.current ?? videoRef.current;

    if (!parallax || !container || !media) return;

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

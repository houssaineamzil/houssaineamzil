"use client";

import gsap from "gsap";
import NextLink from "next/link";
import type React from "react";
import { useRef } from "react";
import { cn } from "@/lib";

type Props = React.ComponentProps<typeof NextLink>;

export const Link: React.FC<Props> = ({
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const underlineRef = useRef<HTMLSpanElement | null>(null);

  const handleMouseEnter: React.MouseEventHandler<HTMLAnchorElement> = (
    event,
  ) => {
    // Force reset position to off-screen left (-100%) before animating across
    gsap.set(underlineRef.current, { xPercent: 0 });

    gsap.to(underlineRef.current, {
      xPercent: 100,
      duration: 0.7,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    onMouseEnter?.(event);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLAnchorElement> = (
    event,
  ) => {
    gsap.to(underlineRef.current, {
      xPercent: 200,
      duration: 0.7,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    onMouseLeave?.(event);
  };

  return (
    <NextLink
      {...props}
      className={cn("relative inline-block overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <span
        ref={underlineRef}
        className="absolute bottom-0 left-0 h-px w-full bg-current -translate-x-full will-change-transform"
        aria-hidden="true"
      />
    </NextLink>
  );
};

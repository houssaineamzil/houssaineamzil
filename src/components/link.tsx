"use client";

import gsap from "gsap";
import NextLink from "next/link";
import type React from "react";
import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof NextLink>;

/** A link with an underline that sweeps in from the left and out to the right on hover. */
export const Link: React.FC<Props> = ({
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const underlineRef = useRef<HTMLSpanElement | null>(null);

  // The underline rests off-screen left (-100%); one sweep takes it across
  // (0 -> 100%) and out of the right edge (-> 200%).
  const sweep = (xPercent: number) =>
    gsap.to(underlineRef.current, {
      xPercent,
      duration: prefersReducedMotion() ? 0 : 0.7,
      ease: "power2.inOut",
      overwrite: "auto",
    });

  return (
    <NextLink
      {...props}
      className={cn("relative inline-block overflow-hidden", className)}
      onMouseEnter={(event) => {
        gsap.set(underlineRef.current, { xPercent: 0 });
        sweep(100);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        sweep(200);
        onMouseLeave?.(event);
      }}
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

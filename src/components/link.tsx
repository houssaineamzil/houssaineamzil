"use client";

import { cn } from "@/utils";
import gsap from "gsap";
import NextLink from "next/link";
import { useRef } from "react";

type Props = React.ComponentProps<typeof NextLink>;

export const Link: React.FC<Props> = ({
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const underlineRef = useRef<HTMLHRElement | null>(null);

  const handleMouseEnter: React.MouseEventHandler<HTMLAnchorElement> = (
    event,
  ) => {
    gsap.fromTo(
      underlineRef.current,
      {
        xPercent: 0,
      },
      {
        xPercent: 100,
        duration: 0.7,
        ease: "easeInOut",
      },
    );

    onMouseEnter?.(event);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLAnchorElement> = (
    event,
  ) => {
    gsap.fromTo(
      underlineRef.current,
      {
        xPercent: 100,
      },
      {
        xPercent: 200,
        duration: 0.7,
        ease: "easeInOut",
      },
    );

    onMouseLeave?.(event);
  };

  return (
    <NextLink
      className={cn("relative block overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      <hr
        ref={underlineRef}
        className="-left-full absolute bottom-0 w-full bg-current"
      />
    </NextLink>
  );
};

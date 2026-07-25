"use client";

import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useLenis } from "lenis/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib";

gsap.registerPlugin(Draggable, InertiaPlugin);

interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * Lets the page be scrolled by clicking and dragging directly on this
 * element — handy for a tall image trail where a mouse drag feels more
 * natural than the wheel. Mouse-only: touch devices already scroll natively
 * (smoothed by Lenis's syncTouch), and capturing the same vertical gesture
 * here for a "drag" would fight and block that native touch scroll entirely.
 */
export const DragScroll: React.FC<Props> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lenis = useLenis();
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    setIsFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !lenis || !isFinePointer) return;

    const virtualTarget = document.createElement("div");

    // Dragging down should reveal content above, like a native touch scroll.
    // `lenis.stop()` is in effect for the whole drag + inertia glide below,
    // and Lenis silently ignores scrollTo while stopped unless forced.
    const applyDelta = function (this: Draggable) {
      lenis.scrollTo(lenis.scroll - this.deltaY, {
        immediate: true,
        force: true,
      });
    };

    const draggableInstance = Draggable.create(virtualTarget, {
      trigger: container,
      type: "y",
      inertia: true,
      onDragStart() {
        lenis.stop();
      },
      onDrag: applyDelta,
      // GSAP's own inertia/InertiaPlugin drives the post-release glide with
      // real physics-based deceleration — a manual velocity*duration guess
      // stutters and doesn't handle a fast re-drag mid-glide cleanly.
      onThrowUpdate: applyDelta,
      onDragEnd() {
        if (!this.tween) lenis.start();
      },
      onThrowComplete() {
        lenis.start();
      },
    });

    return () => {
      draggableInstance[0]?.kill();
      lenis.start();
    };
  }, [lenis, isFinePointer]);

  return (
    <div
      ref={containerRef}
      className={cn(
        isFinePointer && "cursor-grab touch-none active:cursor-grabbing",
        className,
      )}
    >
      {children}
    </div>
  );
};

"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

const COORDINATES = "34.26101° N, -6.58020°";
const SOUND_PROMPT = "Click for sound";
const LINK_LABEL = "View now";
// Distance of the tail from the pointer, how long it lags behind it, and the
// gap kept to the window edge before it flips to the other side.
const OFFSET = 10;
const EDGE_MARGIN = 8;
const FOLLOW_SECONDS = 0.35;

// What the tail says depends on what's under the pointer: an element (or an
// ancestor) with `data-cursor="…"` wins, then any link/button, then the
// default coordinates. Until the visitor has clicked once the tail asks for
// that click instead, since browsers keep audio locked until a user gesture.
const labelFor = (target: EventTarget | null, soundReady: boolean) => {
  const element = target instanceof Element ? target : null;
  const custom = element?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
  if (custom) return custom;
  if (element?.closest("a, button, [role='button']")) return LINK_LABEL;
  return soundReady ? COORDINATES : SOUND_PROMPT;
};

export const CursorTail: React.FC = () => {
  const tailRef = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState(COORDINATES);

  useEffect(() => {
    // Mouse-like pointers only: on touch there's no cursor to follow.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const tail = tailRef.current;
    if (!tail) return;

    let soundReady = navigator.userActivation?.hasBeenActive ?? false;
    let lastTarget: EventTarget | null = null;
    let shownLabel = "";
    let visible = false;

    // Reading offsetWidth/Height on every pointer move forces a layout while
    // a drag is also scrolling the page, which makes dragging stutter. The
    // tail's size only changes with its label, so keep it cached instead.
    let width = tail.offsetWidth;
    let height = tail.offsetHeight;
    const sizeObserver = new ResizeObserver(([entry]) => {
      const box = entry?.borderBoxSize[0];
      if (!box) return;
      width = box.inlineSize;
      height = box.blockSize;
    });
    sizeObserver.observe(tail);

    const show = (next: string) => {
      if (next === shownLabel) return;
      shownLabel = next;
      setLabel(next);
    };

    const x = gsap.quickTo(tail, "x", {
      duration: FOLLOW_SECONDS,
      ease: "power3.out",
    });
    const y = gsap.quickTo(tail, "y", {
      duration: FOLLOW_SECONDS,
      ease: "power3.out",
    });

    const onMove = (event: PointerEvent) => {
      // Default is below-right of the pointer; flip to the left and/or above
      // when the tail wouldn't fit. The square always stays nearest the
      // pointer, so a left-flipped tail reads right-to-left.
      const flipX =
        event.clientX + OFFSET + width + EDGE_MARGIN > window.innerWidth;
      const flipY =
        event.clientY + OFFSET + height + EDGE_MARGIN > window.innerHeight;
      x(flipX ? event.clientX - OFFSET - width : event.clientX + OFFSET);
      y(flipY ? event.clientY - OFFSET - height : event.clientY + OFFSET);
      tail.style.flexDirection = flipX ? "row-reverse" : "row";
      lastTarget = event.target;
      show(labelFor(event.target, soundReady));
      if (!visible) {
        visible = true;
        gsap.to(tail, { opacity: 1, duration: 0.2, overwrite: "auto" });
      }
    };
    const onLeave = () => {
      visible = false;
      gsap.to(tail, { opacity: 0, duration: 0.2, overwrite: "auto" });
    };
    const onFirstClick = () => {
      soundReady = true;
      show(labelFor(lastTarget, true));
      window.removeEventListener("pointerdown", onFirstClick, true);
    };

    show(labelFor(null, soundReady));
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    if (!soundReady) {
      window.addEventListener("pointerdown", onFirstClick, true);
    }

    return () => {
      sizeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onFirstClick, true);
    };
  }, []);

  return (
    <div
      ref={tailRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-200 flex items-center gap-2 whitespace-nowrap text-[11px] font-medium text-white uppercase opacity-0 mix-blend-difference will-change-transform max-md:hidden"
    >
      <span className="size-2 bg-current" />
      {label}
    </div>
  );
};

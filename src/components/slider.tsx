"use client";

import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Observer } from "gsap/Observer";
import type React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { prefersReducedMotion } from "@/lib/motion";
import type { ProjectSummary } from "@/types";
import { ProjectCard } from "./projectCard";

gsap.registerPlugin(Draggable, Observer);

// The per-item wrap trick only looks seamless when the physical track is at
// least as wide as the viewport — otherwise there aren't enough real cards to
// tile across the screen and a gap shows through. Repeating the project list
// keeps this true no matter how few projects exist, with a comfortable margin.
const MIN_VIEWPORT_MULTIPLE = 2;

// Momentum model: input (wheel / drag-release) sets a velocity in px/s, and
// every frame the track moves by velocity * dt while the velocity decays
// exponentially. Faster input => higher velocity => it both travels faster
// and takes longer to settle (decay time is the same, but it starts from a
// bigger number, so it crosses the stop threshold later).
const FRICTION_SECONDS = 0.5; // velocity falls by a factor of e every 0.5s
const WHEEL_GAIN = 1.4; // px/s of velocity added per px of wheel delta
const MAX_VELOCITY = 7000; // px/s
const STOP_VELOCITY = 4; // px/s: below this the track is considered at rest
// Tick model: like a knob with detents, one tick per TICK_SPACING_PX of
// travel, so the faster the track moves the more ticks per second you get.
// Ticks are rate-limited (a fling can cross 7000 px/s) and play from a small
// pool of audio elements so rapid ticks overlap instead of cutting each other
// off. Louder = faster: volume rises with speed up to TICK_FULL_VOLUME_SPEED.
const TICK_SPACING_PX = 120;
const MIN_TICK_INTERVAL_MS = 25;
const TICK_POOL_SIZE = 6;
const TICK_MIN_VOLUME = 0.12;
const TICK_MAX_VOLUME = 0.5;
const TICK_FULL_VOLUME_SPEED = 3000; // px/s

// A drag that's held still this long before release shouldn't fling.
const DRAG_HOLD_MS = 90;

export const Slider: React.FC<{ projects: ProjectSummary[] }> = ({
  projects,
}) => {
  // Desktop only: below lg the page shows a normal vertical list, so none of
  // the drag/wheel listeners or the tick audio should exist at all.
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop ? <SliderTrack projects={projects} /> : null;
};

const SliderTrack: React.FC<{ projects: ProjectSummary[] }> = ({
  projects,
}) => {
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const tickPoolRef = useRef<HTMLAudioElement[] | null>(null);
  const tickPoolIndexRef = useRef(0);
  const [repeatCount, setRepeatCount] = useState(1);

  // Grow the repeat count until the track comfortably out-spans the viewport.
  useLayoutEffect(() => {
    const container = cardsRef.current;
    if (!container || projects.length === 0) return;

    const measure = () => {
      const singleSetWidth = container.scrollWidth / repeatCount;
      const needed = Math.max(
        1,
        Math.ceil((window.innerWidth * MIN_VIEWPORT_MULTIPLE) / singleSetWidth),
      );

      if (needed !== repeatCount) setRepeatCount(needed);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [repeatCount, projects.length]);

  const items = Array.from({ length: repeatCount }, () => projects).flat();

  // biome-ignore lint/correctness/useExhaustiveDependencies: repeatCount isn't read directly, but the DOM nodes it renders change, so Draggable/Observer need to rebind to the new set
  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;

    // Safely collect currently mounted items
    const trackItems = itemRefs.current.filter(
      (el): el is HTMLAnchorElement => el !== null,
    );
    if (trackItems.length === 0) return;

    // Dragging/scrolling itself stays fully interactive either way — this
    // only removes the eased "catch up" glide and the post-release inertia
    // coast layered on top of it.
    const reducedMotion = prefersReducedMotion();

    // UNIFIED POSITION TRACKER
    // proxy.x holds our continuous, unbounded scroll position
    const proxy = { x: 0 };
    let velocity = 0; // px/s
    let dragging = false;
    let lastDragMoveAt = 0;

    const clampVelocity = (v: number) =>
      Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, v));

    // Travel since the last tick, in px, and when we last ticked / moved.
    let tickTravel = 0;
    let lastTickX = proxy.x;
    let lastTickAt = 0;
    let lastMoveAt = performance.now();

    const playTick = (speed: number) => {
      // Created on the first tick, not on mount: nothing is fetched until
      // the slider actually moves.
      tickPoolRef.current ??= Array.from(
        { length: TICK_POOL_SIZE },
        () => new Audio("/audio/knob_tick.webm"),
      );
      const pool = tickPoolRef.current;
      const audio = pool[tickPoolIndexRef.current % pool.length];
      tickPoolIndexRef.current += 1;
      if (!audio) return;
      const force = Math.min(1, speed / TICK_FULL_VOLUME_SPEED);
      audio.volume =
        TICK_MIN_VOLUME + (TICK_MAX_VOLUME - TICK_MIN_VOLUME) * force;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    // Called on every position update: turns distance travelled into ticks.
    const updateTicks = () => {
      const now = performance.now();
      const moved = Math.abs(proxy.x - lastTickX);
      lastTickX = proxy.x;
      tickTravel += moved;
      const speed = moved / (Math.max(1, now - lastMoveAt) / 1000);
      lastMoveAt = now;

      if (tickTravel < TICK_SPACING_PX) return;
      // One tick per update at most; leftover travel past a tick is dropped
      // so a rate-limited fling doesn't queue up a burst afterwards.
      if (now - lastTickAt >= MIN_TICK_INTERVAL_MS) {
        playTick(speed);
        lastTickAt = now;
      }
      tickTravel %= TICK_SPACING_PX;
    };

    // Layout is measured once (and again when the track resizes), not on
    // every frame: reading offsets between per-card writes would force a
    // reflow per card per frame while the track moves.
    let totalWidth = 0;
    let measured: { el: HTMLAnchorElement; width: number; left: number }[] = [];
    const measure = () => {
      totalWidth = container.scrollWidth;
      measured = trackItems.map((el) => ({
        el,
        width: el.offsetWidth,
        left: el.offsetLeft,
      }));
    };

    // Calculates and updates the loop coordinates dynamically
    const updatePositions = () => {
      for (const { el, width, left } of measured) {
        // Infinite wrapping window tailored to each item's boundary box.
        // It wraps to the right track edge only when completely hidden
        // off-screen left.
        const wrappedX = gsap.utils.wrap(
          -width,
          totalWidth - width,
          left + proxy.x,
        );

        // Apply translation delta relative to its natural CSS position
        gsap.set(el, { x: wrappedX - left });
      }

      updateTicks();

      // --- BROADCAST MOVE EVENT ---
      // Notifies child components that the slider coordinates updated
      window.dispatchEvent(new CustomEvent("slider-move"));
    };

    // Per-frame momentum integrator. Idle (no velocity) costs one comparison.
    const tick = (_time: number, deltaMs: number) => {
      if (dragging || velocity === 0) return;
      if (Math.abs(velocity) < STOP_VELOCITY) {
        velocity = 0;
        return;
      }
      // Cap dt so a stalled frame (background tab) doesn't teleport the track.
      const dt = Math.min(deltaMs, 50) / 1000;
      proxy.x += velocity * dt;
      velocity *= Math.exp(-dt / FRICTION_SECONDS);
      updatePositions();
    };
    gsap.ticker.add(tick);

    // Initialize layout positions on mount, and re-measure on resize
    measure();
    updatePositions();
    const resizeObserver = new ResizeObserver(() => {
      measure();
      updatePositions();
    });
    resizeObserver.observe(container);

    const virtualTarget = document.createElement("div");

    // 1. Drag & Touch Swiping Interaction
    const [draggable] = Draggable.create(virtualTarget, {
      trigger: container,
      type: "x",
      onDragStart() {
        dragging = true;
        velocity = 0;
        lastDragMoveAt = performance.now();
      },
      onDrag() {
        // The track follows the finger 1:1 while dragging; meanwhile a
        // smoothed instantaneous velocity is tracked for the release.
        const now = performance.now();
        const dt = Math.max(1, now - lastDragMoveAt) / 1000;
        lastDragMoveAt = now;
        proxy.x += this.deltaX;
        updatePositions();
        velocity = clampVelocity(velocity * 0.6 + (this.deltaX / dt) * 0.4);
      },
      onDragEnd() {
        dragging = false;
        const heldStill = performance.now() - lastDragMoveAt > DRAG_HOLD_MS;
        if (reducedMotion || heldStill) velocity = 0;
      },
    });

    // 2. Mouse Wheel & Trackpad Interaction
    // Bound to the window (not just the cards container) so scrolling works
    // regardless of cursor position, since the track can be narrower than
    // the viewport once there are only a few projects. Only "wheel" here —
    // GSAP's Observer attaches touch listeners (and preventDefault()s them)
    // for BOTH "touch" and "pointer" types on touch-capable devices, which,
    // bound window-wide, would block native touch scrolling everywhere on
    // the page. The dedicated Draggable above already handles touch
    // swiping on the cards themselves, scoped just to them.
    const wheel = Observer.create({
      target: window,
      type: "wheel",
      onChange: (self) => {
        if (self.isDragging) return;
        const delta =
          Math.abs(self.deltaX) > Math.abs(self.deltaY)
            ? self.deltaX
            : self.deltaY;
        if (reducedMotion) {
          proxy.x -= delta * 0.8;
          updatePositions();
        } else {
          // Accumulate: scrolling harder or longer keeps adding speed.
          velocity = clampVelocity(velocity - delta * WHEEL_GAIN);
        }
      },
    });

    // Cleanup tracks cleanly to prevent SPA memory leaks
    return () => {
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      draggable?.kill();
      wheel.kill();
    };
  }, [repeatCount]);

  return (
    <div
      ref={cardsRef}
      // Lenis listens for touch globally to drive smooth scroll; without this
      // it competes with the Draggable below for the same touch gesture and
      // the horizontal swipe stops working.
      data-lenis-prevent-touch
      data-cursor="Scroll / Drag"
      className="fixed bottom-0 flex select-none touch-none will-change-transform"
    >
      {items.map((project, index) => (
        <ProjectCard
          project={project}
          number={(index % projects.length) + 1}
          // biome-ignore lint/suspicious/noArrayIndexKey: the project list repeats to fill the track, so slug alone collides across copies — index disambiguates them
          key={`${project.slug}-${index}`}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
};

"use client";

import NextImage from "next/image";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/components/link";

interface Props {
  href: string;
  label: string;
  /** Name (and thumbnail) of the project this link leads to. */
  name: string;
  imageUrl: string;
}

/**
 * Prev / next link with a dark tooltip that follows the cursor and says
 * where it goes. Mouse only: touch devices have no hover, so they just get
 * the link (its accessible name already includes the project name).
 */
export const ProjectNavLink: React.FC<Props> = ({
  href,
  label,
  name,
  imageUrl,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = tooltipRef.current;
    if (!el) return;
    // Sit below-right of the cursor, but flip to the other side whenever
    // that would run off the viewport (Prev/Next live at the very bottom of
    // the page, and Next at the far right).
    const gap = 16;
    const { width, height } = el.getBoundingClientRect();
    const x =
      e.clientX + gap + width > window.innerWidth
        ? e.clientX - gap - width
        : e.clientX + gap;
    const y =
      e.clientY + gap + height > window.innerHeight
        ? e.clientY - gap - height
        : e.clientY + gap;
    el.style.transform = `translate(${Math.max(0, x)}px, ${Math.max(0, y)}px)`;
    setVisible(true);
  };

  return (
    <Link
      href={href}
      aria-label={`${label}: ${name}`}
      onPointerEnter={move}
      onPointerMove={move}
      onPointerLeave={() => setVisible(false)}
      onBlur={() => setVisible(false)}
    >
      {label}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            aria-hidden
            className={`pointer-events-none fixed top-0 left-0 z-200 flex items-center gap-3 bg-neutral-900 p-2 pr-3 text-xs text-white shadow-lg transition-opacity duration-150 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            {imageUrl && (
              <NextImage
                alt=""
                src={imageUrl}
                width={40}
                height={40}
                sizes="40px"
                className="size-10 object-cover"
              />
            )}
            <span>{name}</span>
          </div>,
          document.body,
        )}
    </Link>
  );
};

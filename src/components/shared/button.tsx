"use client";

import styles from "@/styles/shared/button.module.css";
import cn from "classnames";
import gsap from "gsap";
import CustomEase from "gsap/dist/CustomEase";
import Link from "next/link";
import { type MouseEvent, forwardRef, useEffect, useRef } from "react";
import { RichText } from "./richText";

import useSound from "use-sound";

gsap.registerPlugin(CustomEase);

interface Props
  extends React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  className?: string;
  children: React.ReactNode;
  href?: string;
  link?: boolean;
  dot?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
}

const Dot = forwardRef<HTMLDivElement, unknown>(function Dot(_, ref) {
  return <div ref={ref} className={styles.dot} />;
});

export const Button: React.FC<Props> = ({
  className,
  children,
  href,
  link,
  target,
  dot = true,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  const [play, { stop }] = useSound("sfx.wav", { volume: 1 });

  useEffect(() => {
    timeline.current = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.3,
      },
      ease: "power5.inOut",
    });

    timeline.current
      .to(
        ref.current,
        {
          background: "var(--color-indigo-100)",
        },
        0,
      )
      .to(
        wrapperRef.current,
        {
          yPercent: -((110 + 5) / 2),
        },
        "<",
      );

    if (dotRef.current)
      timeline.current.to(
        dotRef.current,
        {
          background: "var(--color-indigo-800)",
          duration: 0.01,
        },
        "<",
      );
  }, []);

  const customProps = {
    className: cn(styles.root, className),
    onMouseEnter: (
      event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
      timeline.current?.play();
      onMouseEnter?.(event);
      play();
    },
    onMouseLeave: (
      event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
      timeline.current?.reverse();
      onMouseLeave?.(event);
      stop();
    },
    ...props,
  };

  return link ? (
    href && (
      <Link
        ref={(element: HTMLAnchorElement) => {
          ref.current = element;
        }}
        href={href}
        target={target}
        {...customProps}
      >
        {dot && <Dot ref={dotRef} />}
        <div className={styles.container}>
          <div ref={wrapperRef} className={styles.wrapper}>
            {[...Array(2)].map((_, index) => (
              <RichText key={index} className={styles.label}>
                {children}
              </RichText>
            ))}
          </div>
        </div>
      </Link>
    )
  ) : (
    <button
      ref={(element: HTMLButtonElement) => {
        ref.current = element;
      }}
      {...customProps}
    >
      {dot && <Dot ref={dotRef} />}
      <div className={styles.container}>
        <div ref={wrapperRef} className={styles.wrapper}>
          {[...Array(2)].map((_, index) => (
            <RichText key={index} className={styles.label}>
              {children}
            </RichText>
          ))}
        </div>
      </div>
    </button>
  );
};

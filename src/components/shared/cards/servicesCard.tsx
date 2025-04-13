"use client";

import styles from "@/styles/shared/cards/servicesCard.module.css";
import type { CardType } from "@/types";
import { cn } from "@/utils";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Typewriter from "typewriter-effect";
import { Tag } from "../tag";

interface Props extends CardType {
  className?: string;
}

const services = ["Branding", "Strategy", "Design", "Motion", "Development"];

export const ServicesCard: React.FC<Props> = ({ className, ...card }) => {
  const tag = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    timeline.current = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.25,
      },
      ease: "power5.inOut",
    });

    timeline.current.to(
      tag.current,
      {
        yPercent: -((110 + 5) / 2),
      },
      0,
    );

    return () => {
      timeline.current?.kill();
    };
  }, []);

  return (
    <Link
      href={`works/${card.uid}`}
      className={cn(styles.root, className, {
        [styles[card._variant]]: card._variant,
      })}
      onMouseEnter={() => {
        timeline.current?.play();
      }}
      onMouseLeave={() => {
        timeline.current?.reverse();
      }}
    >
      <Tag ref={tag} tag={card.tag} className={styles.tag} />
      <Typewriter
        options={{
          strings: services,
          autoStart: true,
          loop: true,
        }}
      />
    </Link>
  );
};

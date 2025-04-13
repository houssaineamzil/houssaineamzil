"use client";

import styles from "@/styles/shared/cards/clientsCard.module.css";
import type { CardType } from "@/types";
import { cn } from "@/utils";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Marquee } from "../marquee";
import { Tag } from "../tag";

interface Props extends CardType {
  className?: string;
}

export const ClientsCard: React.FC<Props> = ({ className, ...card }) => {
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
    <div
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
      <div className={styles.marquee}>
        <Marquee>
          <div className={styles.marqueeContent}>
            <img
              src="https://pelostudio-storyblok-assets.b-cdn.net/f/236077/70x40/56b47ea194/charging-cards-chargenow.svg"
              alt=""
              loading="lazy"
              width="96"
              height="auto"
            />
            <img
              src="https://pelostudio-storyblok-assets.b-cdn.net/f/236077/56x40/16e33026fb/charging-cards-charge-map.svg"
              alt=""
              loading="lazy"
              width="96"
              height="auto"
            />
            <img
              src="https://pelostudio-storyblok-assets.b-cdn.net/f/236077/56x40/830e213f6f/charging-cards-izivia.svg"
              alt=""
              loading="lazy"
              width="96"
              height="auto"
            />
            <img
              src="https://pelostudio-storyblok-assets.b-cdn.net/f/236077/56x40/8f898364d8/charging-cards-electromaps.svg"
              alt=""
              loading="lazy"
              width="96"
              height="auto"
            />
          </div>
        </Marquee>
        <div className={styles.marqueeMask} />
      </div>
    </div>
  );
};

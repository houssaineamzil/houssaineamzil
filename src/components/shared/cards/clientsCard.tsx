"use client";

import { clients } from "@/constants";
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
            {clients.map((client) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={client.name}
                width={112}
                src={client.logo}
                alt={client.name}
              />
            ))}
          </div>
        </Marquee>
        <div className={styles.marqueeMask} />
      </div>
    </div>
  );
};

"use client";

import styles from "@/styles/shared/cards/aboutCard.module.css";
import type { CardType } from "@/types";
import { cn } from "@/utils";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Image } from "../image";
import { RichText } from "../richText";
import { Tag } from "../tag";
import { Video } from "../video";

interface Props extends CardType {
  className?: string;
}

export const AboutCard: React.FC<Props> = ({ className, ...card }) => {
  const tag = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
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

    if (overlay.current)
      timeline.current.to(
        overlay.current,
        {
          opacity: 0.2,
        },
        "<",
      );

    return () => {
      timeline.current?.kill();
    };
  }, []);

  return (
    <div
      className={cn(styles.root, className, {
        [styles[card._variant]]: card._variant,
        [styles.black]: !card.background,
      })}
      onMouseEnter={() => {
        timeline.current?.play();
      }}
      onMouseLeave={() => {
        timeline.current?.reverse();
      }}
    >
      {card.background && (
        <div className={styles.background}>
          {card.background._type === "image" && (
            <Image
              alt={(card.title as string) || ""}
              src={card.background.url}
              className={styles.image}
            />
          )}

          {card.background._type === "video" && (
            <Video
              autoPlay
              playsInline
              className={styles.image}
              src={card.background.url}
            />
          )}
          <div ref={overlay} className={styles.overlay} />
        </div>
      )}

      <Tag ref={tag} tag={card.tag} className={styles.tag} />
      {card.title && (
        <RichText as="h2" className={styles.title}>
          {card.title}
        </RichText>
      )}
    </div>
  );
};

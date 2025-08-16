"use client"

import { gsap } from "gsap"
import { memo, useEffect, useRef } from "react"
import { Tag } from "@/components/shared/tag"
import styles from "@/styles/shared/cards/playerCard.module.css"
import type { CardType } from "@/types"
import { cn } from "@/utils"
import { RichText } from "../richText"

interface Props extends CardType {
  className?: string
}

export const PlayerCard: React.FC<Props> = memo(({ className, ...card }) => {
  const tag = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    timeline.current = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.25
      },
      ease: "power5.inOut"
    })

    timeline.current.to(
      tag.current,
      {
        yPercent: -((110 + 5) / 2)
      },
      0
    )

    return () => {
      timeline.current?.kill()
    }
  }, [])

  return (
    <div
      className={cn(styles.root, className, {
        [styles[card.variant]]: card.variant,
        [styles.black]: !card.background
      })}
      onMouseEnter={() => {
        timeline.current?.play()
      }}
      onMouseLeave={() => {
        timeline.current?.reverse()
      }}
    >
      <Tag
        ref={tag}
        tag={["Player", "Mood"]}
        className={styles.tag}
      />
      <div className={styles.title}>
        <RichText as="h2">What sets me on the mood</RichText>
      </div>

      <iframe
        title="Spotify Player"
        src="https://open.spotify.com/embed/playlist/4yXXiO1c0P4WTe4qVXTojz?utm_source=generator&theme=0"
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  )
})

PlayerCard.displayName = "PlayerCard"

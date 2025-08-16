"use client"

import { parseAssetId } from "@sanity/asset-utils"
import { gsap } from "gsap"
import { useRouter } from "next/navigation"
import { memo, useCallback, useEffect, useRef } from "react"
import type { Asset } from "sanity"
import { Image } from "@/components/shared/image"
import { RichText } from "@/components/shared/richText"
import { Tag } from "@/components/shared/tag"
import { Video } from "@/components/shared/video"
import { assetUrl } from "@/sanity/lib/assets"
import styles from "@/styles/shared/cards/workCard.module.css"
import type { CardType } from "@/types"
import { cn } from "@/utils"

interface Props extends CardType {
  className?: string
}

export const WorkCard: React.FC<Props> = memo(({ className, ...card }) => {
  const router = useRouter()
  const tag = useRef<HTMLDivElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
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

    if (overlay.current)
      timeline.current.to(
        overlay.current,
        {
          opacity: 0.2
        },
        "<"
      )

    return () => {
      timeline.current?.kill()
    }
  }, [])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      router.push(`/works/${card.project?.slug}`)
    },
    [card.project?.slug, router]
  )

  return (
    <button
      type="button"
      aria-label={`View project: ${card.project?.title}`}
      onClick={handleClick}
      className={cn(
        styles.root,
        {
          [styles[card.variant]]: card.variant,
          [styles.black]: !card.background
        },
        className
      )}
      onMouseEnter={() => {
        timeline.current?.play()
      }}
      onMouseLeave={() => {
        timeline.current?.reverse()
      }}
    >
      {card.background && (
        <div className={styles.background}>
          {parseAssetId(card.background.asset._ref as string).extension &&
            /(jpe?g|png|gif|webp|bmp)$/i.test(
              parseAssetId(card.background.asset._ref as string).extension
            ) && (
              <Image
                alt=""
                src={assetUrl(card.background.asset as Asset)}
                className={styles.image}
              />
            )}

          {parseAssetId(card.background.asset._ref as string).extension &&
            /(mp4|webm|ogg)$/i.test(
              parseAssetId(card.background.asset._ref as string).extension
            ) && (
              <Video
                autoPlay
                playsInline
                className={styles.image}
                src={assetUrl(card.background.asset as Asset)}
              />
            )}
          <div
            ref={overlay}
            className={styles.overlay}
          />
        </div>
      )}
      <Tag
        ref={tag}
        tag={["Work", "Project"]}
        className={styles.tag}
      />
      <RichText
        as="h2"
        className={styles.title}
      >
        {card.project?.title}
      </RichText>
    </button>
  )
})

WorkCard.displayName = "WorkCard"

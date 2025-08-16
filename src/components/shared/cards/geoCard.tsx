"use client"

import { gsap } from "gsap"
import { memo, useEffect, useRef, useState } from "react"
import { RichText } from "@/components/shared/richText"
import { Tag } from "@/components/shared/tag"
import styles from "@/styles/shared/cards/geoCard.module.css"
import { cn } from "@/utils"

interface Props {
  className?: string
}

export const GeoCard: React.FC<Props> = memo(({ className }) => {
  const tag = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  const [time, setTime] = useState(new Date())
  const country = "Morocco"

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 10)

    return () => {
      clearInterval(interval)
    }
  }, [])

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
      className={cn(styles.root, className)}
      onMouseEnter={() => {
        timeline.current?.play()
      }}
      onMouseLeave={() => {
        timeline.current?.reverse()
      }}
    >
      <Tag
        ref={tag}
        tag={["Geo", "Time"]}
        className={styles.tag}
      />
      <RichText
        as="h2"
        className={styles.title}
      >
        {time.toLocaleString("en-US", {
          timeZone: "Africa/Casablanca",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })}{" "}
        / {country}
      </RichText>
    </div>
  )
})

GeoCard.displayName = "GeoCard"

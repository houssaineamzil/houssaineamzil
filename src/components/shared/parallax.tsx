"use client"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import styles from "@/styles/shared/parallax.module.css"

gsap.registerPlugin(ScrollTrigger)

interface Props {
  children?: React.ReactNode
}

export const Parallax: React.FC<Props> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const maxMove = 13
    const setY = gsap.quickTo(ref.current, "yPercent", {
      duration: 0.6,
      ease: "none"
    })

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const target = (self.progress - 0.5) * 2 * maxMove
        const velocityBoost = self.getVelocity() * 0.005
        setY(target + velocityBoost)
      },
      onRefresh: (self) => {
        const initialTarget = (self.progress - 0.5) * 2 * maxMove
        gsap.set(ref.current, { yPercent: initialTarget })
      }
    })

    return () => trigger.kill()
  }, [])

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div
          ref={ref}
          className={styles.wrapper}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

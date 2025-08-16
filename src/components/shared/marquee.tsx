"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import styles from "@/styles/shared/marquee.module.css"
import { cn } from "@/utils"

gsap.registerPlugin(ScrollTrigger)

interface Props {
  children: React.ReactNode
  className?: string
  speed?: number
  maxVelocity?: number
  velocityFactor?: number
  accelerationDuration?: number
  reverseOnScrollUp?: boolean
  isReversed?: boolean
}

export const Marquee: React.FC<Props> = ({
  children,
  className,
  speed = 75,
  maxVelocity = 1000,
  velocityFactor = 1,
  accelerationDuration = 0.2,
  reverseOnScrollUp = true,
  isReversed = false
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const container = containerRef.current
    const child = container ? container.firstElementChild : null

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => {
        initAnimation()
      })
    })

    if (container) {
      const firstElementChild = container.firstElementChild
      if (firstElementChild) resizeObserver.observe(firstElementChild)
    }

    if (section) {
      resizeObserver.observe(section)
    }

    const initAnimation = () => {
      if (section && container && child) {
        clearAnimation()
        cloneContent(section, container, child)

        const distance = child.clientWidth
        const time = distance / speed

        gsap.set(container.children, {
          flex: "0 0 auto",
          marginLeft: 0,
          marginRight: 0
        })

        const tween = gsap.to(container.children, {
          repeat: -1,
          x: (isReversed ? "+" : "-") + distance,
          ease: "none",
          duration: time,
          onReverseComplete: function () {
            this.totalTime(time * 100 + this.rawTime())
          }
        })

        let lastUpdateTimestamp: number

        const scrollTrigger = ScrollTrigger.create({
          animation: tween,
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const velocity = Math.abs(self.getVelocity())

            if (velocity > 200) {
              const speed = maxVelocity
                ? (velocity >= maxVelocity ? maxVelocity : velocity) *
                  (velocityFactor / 100)
                : 1
              const direction = reverseOnScrollUp ? self.direction : 1
              const timestamp = Date.now()

              gsap.to(tween, {
                duration: accelerationDuration,
                ease: "none",
                timeScale: speed * direction,
                onStart() {
                  lastUpdateTimestamp = timestamp
                },
                onComplete() {
                  if (timestamp === lastUpdateTimestamp) {
                    gsap.to(tween, {
                      duration: accelerationDuration,
                      ease: "none",
                      timeScale: direction
                    })
                  }
                }
              })
            }
          }
        })

        tweenRef.current = tween
        scrollTriggerRef.current = scrollTrigger
      }
    }

    const cloneContent = (
      section: HTMLDivElement,
      container: HTMLDivElement,
      child: Element
    ) => {
      const clones = container.querySelectorAll('[data-is-clone="true"]')
      for (const clone of clones) {
        clone.remove()
      }
      const count = Math.ceil(section.clientWidth / child.clientWidth) + 1

      if (count !== Number.POSITIVE_INFINITY) {
        for (let i = 0; i < count; i++) {
          const clone = child.cloneNode(true) as HTMLElement
          clone.dataset.isClone = "true"
          clone.ariaHidden = "true"
          container.appendChild(clone)
        }
      }
    }

    const clearAnimation = () => {
      if (tweenRef.current) tweenRef.current.progress(0).pause().revert().kill()
      if (scrollTriggerRef.current) scrollTriggerRef.current.kill()
    }

    return () => {
      clearAnimation()
      resizeObserver.disconnect()
      window.removeEventListener("resize", initAnimation)
    }
  })

  return (
    <div
      ref={sectionRef}
      className={cn(styles.root, className)}
    >
      <div
        ref={containerRef}
        className={cn(styles.container, { [styles.reversed]: isReversed })}
      >
        <div className={styles.wrapper}>{children}</div>
      </div>
    </div>
  )
}

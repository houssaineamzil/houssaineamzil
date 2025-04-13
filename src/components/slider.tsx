"use client"

import { projects } from "@/constants"
import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type React from "react"
import { useCallback, useEffect, useRef } from "react"
import { ProjectCard } from "./projectCard"
import { Observer } from "gsap/Observer"

gsap.registerPlugin(ScrollTrigger, Draggable)

export const Slider: React.FC = () => {
	const cardsRef = useRef<HTMLDivElement | null>(null)
	const itemRefs = useRef<HTMLAnchorElement[]>([])

	const loop = useRef<gsap.core.Timeline>(null)

	const horizontalLoop = useCallback(
		(
			config: {
				onComplete?: gsap.Callback
				repeat?: number
				paused?: boolean
				speed?: number
				snap?: number | ((value: number) => number)
				paddingRight?: string
				reversed?: number
			} = {}
		) => {
			const items = gsap.utils.toArray(itemRefs.current) as HTMLElement[]

			const timeline = gsap.timeline({
				onComplete: config.onComplete,
				repeat: config.repeat,
				paused: config.paused,
				defaults: { ease: "none" },
				onReverseComplete: () => {
					timeline.totalTime(timeline.rawTime() + timeline.duration() * 100)
				},
			})

			const length = items.length
			const startX = items[0].offsetLeft
			const times: number[] = []
			const widths: number[] = []
			const xPercents: number[] = []
			let curIndex = 0
			const pixelsPerSecond = (config.speed || 1) * 100

			const snap =
				typeof config.snap === "function"
					? config.snap
					: gsap.utils.snap(config.snap || 1) // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
			let totalWidth: number
			let curX: number
			let distanceToStart: number
			let distanceToLoop: number
			let item: HTMLElement
			let i: number

			gsap.set(items, {
				// convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
				xPercent: (i, el) => {
					widths[i] = Number.parseFloat(
						gsap.getProperty(el, "width", "px") as string
					)
					const w = widths[i]
					xPercents[i] = snap(
						(Number.parseFloat(gsap.getProperty(el, "x", "px") as string) / w) *
							100 +
							Number(gsap.getProperty(el, "xPercent"))
					)
					return xPercents[i]
				}
			})

			gsap.set(items, { x: 0 })
			
			totalWidth =
				items[length - 1].offsetLeft +
				(xPercents[length - 1] / 100) * widths[length - 1] -
				startX +
				items[length - 1].offsetWidth *
					(gsap.getProperty(items[length - 1], "scaleX") as number) +
				(Number.parseFloat(config.paddingRight as string) || 0)
			
				for (i = 0; i < length; i++) {
				item = items[i]
				curX = (xPercents[i] / 100) * widths[i]
				distanceToStart = item.offsetLeft + curX - startX
				distanceToLoop =
					distanceToStart +
					widths[i] * (gsap.getProperty(item, "scaleX") as number)
				timeline
					.to(
						item,
						{
							xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
							duration: distanceToLoop / pixelsPerSecond
						},
						0
					)
					.fromTo(
						item,
						{
							xPercent: snap(
								((curX - distanceToLoop + totalWidth) / widths[i]) * 100
							)
						},
						{
							xPercent: xPercents[i],
							duration:
								(curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
							immediateRender: false
						},
						distanceToLoop / pixelsPerSecond
					)
					.add(`label${i}`, distanceToStart / pixelsPerSecond)
				times[i] = distanceToStart / pixelsPerSecond
			}

			function toIndex(index: number, vars: gsap.TweenVars = {}) {
				if (Math.abs(index - curIndex) > length / 2)
					index += index > curIndex ? -length : length // always go in the shortest direction
				const newIndex = gsap.utils.wrap(0, length, index)
				let time = times[newIndex]
				if (time > timeline.time() !== index > curIndex) {
					// if we're wrapping the timeline's playhead, make the proper adjustments
					vars.modifiers = { time: gsap.utils.wrap(0, timeline.duration()) }
					time += timeline.duration() * (index > curIndex ? 1 : -1)
				}
				curIndex = newIndex
				vars.overwrite = true
				return timeline.tweenTo(time, vars)
			}

			timeline.next = (vars?: gsap.TweenVars) =>
				toIndex(curIndex + 1, vars || {})
			timeline.previous = (vars?: gsap.TweenVars) =>
				toIndex(curIndex - 1, vars || {})
			timeline.current = () => curIndex
			timeline.toIndex = (index: number, vars?: gsap.TweenVars) =>
				toIndex(index, vars || {})
			timeline.times = times
			timeline.progress(1, true).progress(0, true) // pre-render for performance
			if (config.reversed) {
				timeline.vars.onReverseComplete?.()
				timeline.reverse()
			}

			return timeline
		},
		[]
	)

	useEffect(() => {
		// create an infinite loop
		loop.current = horizontalLoop({ repeat: -1 })
		// create a tween that'll always decelerate the timeScale of the timeline back to 0 over the course of 0.5 seconds (or whatever)
		const slow = gsap.to(loop.current, { timeScale: 0, duration: 0.5 })
		// make the loop stopped initially.
		loop.current.timeScale(0)

		// now use an Observer to listen to pointer/touch/wheel events and set the timeScale of the infinite looping timeline accordingly.
		const observerInstance = Observer.create({
			target: cardsRef.current,
			type: "pointer,touch,wheel",
			wheelSpeed: -0.35,
			onChange: (self) => {
				loop.current?.timeScale(
					Math.abs(self.deltaX) > Math.abs(self.deltaY)
						? -self.deltaX
						: -self.deltaY
				) // whichever direction is bigger

				slow.invalidate().restart() // now decelerate
			}
		})
	}, [horizontalLoop])

	return (
		<div ref={cardsRef} className="fixed bottom-0 flex">
			{projects.map((project, index) => (
				<ProjectCard
					index={index}
					key={index.toString().padStart(2, "0")}
					ref={(el: HTMLAnchorElement) => {
						itemRefs.current[index] = el
					}}
					{...project}
				/>
			))}
		</div>
	)
}

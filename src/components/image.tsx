"use client"

import { cn } from "@/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef } from "react"
import NextImage, { type ImageProps } from "next/image"

gsap.registerPlugin(ScrollTrigger)

interface Props extends ImageProps {
	parallax?: boolean
	horizontal?: boolean
}

export const Image: React.FC<Props> = ({
	className,
	fill = false,
	parallax = false,
	horizontal = false,
	...props
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const imageRef = useRef<HTMLImageElement | null>(null)

	useEffect(() => {
		const container = containerRef.current
		const image = imageRef.current

		if (!container || !image) return

		if (parallax) {
			const timeline = gsap.timeline({
				scrollTrigger: {
					trigger: container,
					scrub: true,
					pin: false,
					invalidateOnRefresh: true
				},
				defaults: {
					ease: "none"
				}
			})

			const transformProperty = horizontal ? "xPercent" : "yPercent"
			const transformAmount = horizontal ? 2.5 : 5

			timeline.fromTo(
				image,
				{ [transformProperty]: -1 * transformAmount },
				{
					[transformProperty]: transformAmount,
					ease: "none",
					scrollTrigger: {
						trigger: containerRef.current,
						scrub: 0.5,
						start: "top bottom",
						end: "bottom top",
						horizontal: horizontal
					}
				}
			)
		}
	}, [parallax, horizontal])

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative overflow-hidden",
				className,
				fill && "absolute inset-0 w-full h-full"
			)}>
			<div
				className={cn(
					"absolute inset-0 backface-hidden overflow-hidden",
					horizontal ? "w-[120%] -ml-[10%]" : "h-[140%] -mt-[10%]"
				)}>
				<NextImage ref={imageRef} {...props} fill className="object-cover" />
			</div>
		</div>
	)
}

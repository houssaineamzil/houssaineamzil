import styles from "@/styles/shared/link.module.css"
import cn from "classnames"
import gsap from "gsap"
import CustomEase from "gsap/dist/CustomEase"
import NextLink from "next/link"
import { useEffect, useRef } from "react"
import { RichText } from "./richText"

gsap.registerPlugin(CustomEase)

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
	className?: string
	children: React.ReactNode
	href: string
	target?: React.HTMLAttributeAnchorTarget
}

export const Link: React.FC<Props> = ({
	className,
	children,
	href,
	onMouseEnter,
	onMouseLeave,
	...props
}) => {
	const ref = useRef<HTMLAnchorElement>(null)
	const line = useRef<HTMLDivElement>(null)
	const timeline = useRef<gsap.core.Timeline | null>(null)

	useEffect(() => {
		timeline.current = gsap.timeline({
			paused: true,
			defaults: {
				duration: 0.2
			},
			ease: "power5.inOut"
		})

		timeline.current
			.to(
				ref.current,
				{
					opacity: 1
				},
				0
			)
			.to(
				line.current,
				{
					xPercent: 110,
					duration: 0.3
				},
				"<"
			)

		return () => {
			timeline.current?.kill()
		}
	}, [])

	return (
		<NextLink
			ref={ref}
			className={cn(styles.root, className)}
			href={href}
			tabIndex={0}
			onMouseEnter={(event) => {
				timeline.current?.play()
				onMouseEnter?.(event)
			}}
			onMouseLeave={(event) => {
				timeline.current?.reverse()
				onMouseLeave?.(event)
			}}
			{...props}>
			<RichText className={styles.label}>{children}</RichText>
			<div ref={line} className={styles.line} />
		</NextLink>
	)
}

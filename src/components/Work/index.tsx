import { Card } from "@/components/Card"
import cn from "classnames"
import Link from "next/link"
import { useState } from "react"
import styles from "./styles.module.scss"

interface Props {
	key?: string | number
	bg?: string
	image?: {
		src: string
		alt?: string
	}
	title: string
	description: string
	type: string
	href: string
	size?: "tall" | "wide" | "big"
	[key: string]: any
}

export const CaseStudy = ({
	bg,
	image,
	title,
	type,
	href,
	size,
	...restProps
}: Props) => {
	const [active, setActive] = useState(false)

	return (
		<Card
			size={size}
			image={image}
			className={styles.container}
			onMouseEnter={() => setActive(true)}
			onMouseLeave={() => setActive(false)}
			{...restProps}>
			<div className={styles.typeWrap}>
				<div className={styles.dot} />
				<div className={styles.type}>{type}</div>
			</div>
			<div className={styles.titleWrap}>
				<div className={styles.title}>{title}</div>
			</div>
			<Link
				className={cn(styles.link, active && styles.active)}
				href={href}
				target="_blank">
				<svg
					width="18"
					height="18"
					viewBox="0 0 18 18"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M12.8198 5.28849L5.28784 12.8205M7.53214 5.25049L12.8198 5.28749L12.8578 10.5752"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</Link>
		</Card>
	)
}

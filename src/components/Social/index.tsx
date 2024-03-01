import { Card } from "_components/Card"
import Link from "next/link"
import { cloneElement, type ReactNode } from "react"
import styles from "./styles.module.scss"

export const Social = ({
	icon,
	link,
	...restProps
}: {
	icon: ReactNode
	link: string
	[key: string]: any
}) => {
	return (
		<Card className={styles.container} {...restProps}>
			{cloneElement(icon as React.ReactElement, {
				className: styles.icon,
			})}
			<Link className={styles.link} href={link} target="_blank">
				<svg
					width="18"
					height="18"
					viewBox="0 0 18 18"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M12.8198 5.28849L5.28784 12.8205M7.53214 5.25049L12.8198 5.28749L12.8578 10.5752"
						stroke="#F0F2F8"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</Link>
		</Card>
	)
}

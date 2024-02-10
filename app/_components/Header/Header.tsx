"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import cn from "classnames"
import styles from "./Header.module.scss"

const SayHi = () => {
	const [active, setActive] = useState(false)
	return (
		<motion.a
			href="mailto:houssaineamzil18@gmail.com"
			className={styles.navCTA}
			initial={false}
			animate={{
				width: active ? "auto" : 42,
			}}
			transition={{
				duration: 0.5,
				ease: [0.85, 0, 0.3, 1],
			}}
			onMouseEnter={() => setActive(true)}
			onMouseLeave={() => setActive(false)}>
			<motion.span
				initial={false}
				animate={{
					opacity: active ? 1 : 0,
					x: active ? 0 : -12,
				}}
				transition={{
					duration: 0.3,
					delay: active ? 0.3 : 0,
				}}
				className={styles.label}>
				Say Hi!
			</motion.span>
			<div className={cn(styles.icon)}>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M17.5 3.75H2.5C1.80964 3.75 1.25 4.30964 1.25 5V15C1.25 15.6904 1.80964 16.25 2.5 16.25H17.5C18.1904 16.25 18.75 15.6904 18.75 15V5C18.75 4.30964 18.1904 3.75 17.5 3.75ZM16.125 5L10 9.2375L3.875 5H16.125ZM2.5 15V5.56875L9.64375 10.5125C9.858 10.6611 10.142 10.6611 10.3562 10.5125L17.5 5.56875V15H2.5Z"
						fill="currentColor"
					/>
				</svg>
			</div>
		</motion.a>
	)
}

const GoBackButton = () => {
	const router = useRouter()
	const pathname = usePathname()
	const isHomePage = pathname === "/"
	const [active, setActive] = useState(false)

	const goBack = () => {
		if (router.back && !isHomePage) {
			router.back()
		}
	}

	return !isHomePage ? (
		<motion.button
			className={styles.navCTA}
			onClick={goBack}
			initial={false}
			animate={{
				width: active ? "auto" : 42,
			}}
			transition={{
				duration: 0.5,
				ease: [0.85, 0, 0.3, 1],
			}}
			onMouseEnter={() => setActive(true)}
			onMouseLeave={() => setActive(false)}>
			<motion.span
				initial={false}
				animate={{
					opacity: active ? 1 : 0,
					x: active ? 0 : -12,
				}}
				transition={{
					duration: 0.3,
					delay: active ? 0.3 : 0,
				}}
				className={styles.label}>
				Go Back
			</motion.span>
			<div className={styles.icon}>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M3.75 13.7501L5 13.7501L5 5.88131L15.3687 16.2501L16.25 15.3688L5.88125 5.00006L13.75 5.00006L13.75 3.75006L3.75 3.75006L3.75 13.7501Z"
						fill="currentColor"
					/>
				</svg>
			</div>
		</motion.button>
	) : null
}

const ThemeToggler = () => {
	const [active, setActive] = useState(false)
	const { theme, setTheme } = useTheme()

	const toggleTheme = () => {
		theme === "light" ? setTheme("dark") : setTheme("light")
	}

	return (
		<motion.button
			className={styles.navCTA}
			onClick={toggleTheme}
			initial={false}
			animate={{
				width: active ? "auto" : 42,
			}}
			transition={{
				duration: 0.5,
				ease: [0.85, 0, 0.3, 1],
			}}
			onMouseEnter={() => setActive(true)}
			onMouseLeave={() => setActive(false)}>
			<motion.span
				initial={false}
				animate={{
					opacity: active ? 1 : 0,
					x: active ? 0 : -12,
				}}
				transition={{
					duration: 0.3,
					delay: active ? 0.3 : 0,
				}}
				className={styles.label}>
				Switch Theme
			</motion.span>
			<div className={styles.icon}>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M9.3751 1.875H9.2501C5.08699 2.56484 2.13157 6.30791 2.42624 10.5175C2.72091 14.7271 6.16898 18.0219 10.3876 18.125H10.6938C13.358 18.1266 15.8559 16.8299 17.3876 14.65C17.5166 14.4592 17.5302 14.213 17.423 14.0092C17.3159 13.8054 17.1054 13.677 16.8751 13.675C14.3474 13.4477 12.0686 12.0593 10.7075 9.91722C9.34635 7.77517 9.05728 5.12244 9.9251 2.7375C10.0027 2.54925 9.98368 2.33501 9.87421 2.16334C9.76474 1.99166 9.5785 1.88408 9.3751 1.875Z"
						fill="currentColor"
					/>
				</svg>
			</div>
		</motion.button>
	)
}

export const Header = () => {
	return (
		<div className={styles.header}>
			<div>
				<GoBackButton />
			</div>
			<div className={styles.nav}>
				<ThemeToggler />
				<SayHi />
				{false && (
					<button className={styles.navCTA}>
						<span className={styles.label}>Menu</span>
						<svg
							className={styles.icon}
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path d="M2 16H18" stroke="currentColor" />
							<path d="M2 10H18" stroke="currentColor" />
							<path d="M2 4H18" stroke="currentColor" />
						</svg>
					</button>
				)}
			</div>
		</div>
	)
}

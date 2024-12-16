"use client"

import { type ReactNode, useEffect, useState } from "react"
import cn from "classnames"
import { Bio } from "@/components/Bio"
import { Social } from "@/components/Social"
import { Header } from "@/components/Header"
import { Spotify } from "@/components/Spotify"
import { CaseStudy } from "@/components/Work"
import { projects } from "@/data/projects"
import { socials } from "@/data/shared"
import styles from "./styles.module.scss"
import { QueryClient, QueryClientProvider } from "react-query"

const Page = () => {
	const [filter, setFilter] = useState<"all" | "about" | "projects" | "media">(
		"all"
	)
	const [cards, setCards] = useState<ReactNode[]>([])

	const opacityValue = (section: string) =>
		filter === "all" || section === filter ? 1 : 0.25

	useEffect(() => {
		const caseCards = createCaseStudyCards()
		const socialCards = createSocialCards()
		const mediaCards = createMediaCards()

		// Set the priority order based on the filter value
		const priorityOrder =
			filter === "about"
				? socialCards
				: filter === "projects"
					? caseCards
					: filter === "media"
						? mediaCards
						: []

		// Shuffle the remaining cards
		const otherCards = shuffle(
			[...socialCards, ...caseCards, ...mediaCards].filter(
				(card) => !priorityOrder.includes(card)
			)
		)

		// Combine the priority order and shuffled cards
		const finalCards = [<Bio key="bio" />, ...priorityOrder, ...otherCards]
		setCards(finalCards)
	}, [filter])

	const createSocialCards = () =>
		socials.map((social) => (
			<Social
				key={social.name}
				icon={social.icon}
				link={social.link}
				style={{ opacity: opacityValue("about") }}
			/>
		))

	const createMediaCards = () => [
		<Spotify key="spotify" style={{ opacity: opacityValue("media") }} />
	]

	const createCaseStudyCards = () =>
		projects.map((project) => (
			<CaseStudy
				key={project.title}
				image={project.image}
				title={project.title}
				description={project.description}
				type={project.type}
				href={project.href}
				size={project.size}
				style={{ opacity: opacityValue("projects") }}
			/>
		))

	const shuffle = (array: React.ReactNode[]) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	}

	const client = new QueryClient()

	return (
		<QueryClientProvider client={client}>
			<div className={styles.container}>
				<Header setFilter={setFilter} />
				<div className={cn(styles.GridContainer, styles.list)}>
					{cards.map((card) => card)}
				</div>
			</div>
		</QueryClientProvider>
	)
}

export default Page

"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { modules } from "../modules"

export const Sections = ({ pageType, pageSlug, sections }) => {
	const [data, setData] = useState(sections)

	useEffect(() => {
		const fire = async () => {
			const sections = await axios
				.post("/api/getPageSections", {
					pageType,
					pageSlug
				})
				.then((response) => response.data)

			setData(sections)
		}

		fire()
	}, [])

	return (
		data?.length && (
			<>
				{data.map((section) => {
					const Section = modules[section._type]

					return <Section key={section._type} {...section} />
				})}
			</>
		)
	)
}

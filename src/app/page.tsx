import { HomeScene } from "@/components/global/homeScene"
import { Comp } from "@/components/modules/homeHero"
import axios from "axios"
import { NextPage } from "next"

const getSections = async ({
	pageType,
	pageSlug
}: {
	pageType: string
	pageSlug: string
}) => {
	const data = await axios
		.post("/api/getPageSections", { pageType, pageSlug })
		.then((response) => response.data)

	return data
}

const Page: NextPage<{ params: Promise<{ slug: string }> }> = async ({
	params
}) => {
	const { slug } = await params
	const sections = await getSections({ pageType: "page", pageSlug: slug })
	sections.map(() => {})

	return (
		<div>
			<HomeScene />
			<Comp />
		</div>
	)
}

export default Page

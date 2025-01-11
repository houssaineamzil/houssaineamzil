import { Sections } from "@/components/shared/sections"
import axios from "axios"

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

const Page: React.FC<{
	params: Promise<{ slug: string }>
}> = async ({ params }) => {
	const { slug } = await params
	const sections = await getSections({ pageType: "page", pageSlug: slug })

	return <Sections pageType="page" pageSlug={slug} sections={sections} />
}

export default Page

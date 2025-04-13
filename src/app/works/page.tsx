import { WorkCard } from "@/components/worksCard"
import { projects } from "@/constants"
import type { NextPage } from "next"

const Page: NextPage = () => {
	return (
		<div className="pb-[15%]">
			{projects
				.reduce<ProjectType[][]>((array, item, index) => {
					const chunk = Math.floor(index / 2)

					array[chunk] ??= []
					array[chunk].push(item)

					return array as ProjectType[][]
				}, [])
				.map((pair, index) => (
					<div
						key={`parojects_pair_${String(index).padStart(2, "0")}`}
						className="flex justify-between mt-36">
						{pair.map((project) => (
							<WorkCard
								key={project.name}
								{...project}
								horizontal={project.works.horizontal}
								variant={project.works.variant}
							/>
						))}
					</div>
				))}
		</div>
	)
}

export default Page

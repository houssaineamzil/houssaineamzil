import Link from "next/link"
import React from "react"
import { Image } from "./image"

interface Props
	extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "type">,
		ProjectType {
	index: number
}

export const ProjectCard = React.forwardRef<HTMLAnchorElement, Props>(
	({ index, name, slug, type, labels, image }, ref) => {
		return (
			<Link ref={ref} data-cindex={index} href={`/works/${slug}`}>
				<div className="h-full flex w-96 flex-col cursor-pointer">
					<div className="hidden lg:flex h-52 w-full">
						<div className="ml-5">
							<h1 className="uppercase text-xs mb-13 font-semibold">{name}</h1>
							<p className="text-xs font-normal leading-tight text-muted">
								{labels.map((label, index) => (
									<React.Fragment key={label}>
										{label}
										{index < labels.length - 1 && <br />}
									</React.Fragment>
								))}
							</p>
						</div>
						<p className="mt-7 mr-16 ml-5 text-xs text-muted">{type}</p>
					</div>
					<div className="w-full h-128 relative">
						<Image
							fill
							parallax
							horizontal
							src={image.url}
							alt={image.alt}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
						<h1 className="lg:hidden block absolute z-100 text-neutral-100 top-[22.4rem] left-[10.2rem] text-text-sm">
							{name}
						</h1>
						<h2 className="lg:hidden absolute top-[48%] left-[38%] text-text-sm text-neutral-100 uppercase">
							{type}
						</h2>
						<p className="lg:hidden block absolute z-100 text-neutral-100 top-[37.9rem] left-[2.5rem] text-xs font-normal">
							{labels.map((label, index) => (
								<React.Fragment key={label}>
									<span>
										<span className="inline-block mb-[0.3rem] scale-50 translate-y-[-0.35rem]">
											{String(index).padStart(2, "0")}{" "}
										</span>
										{label}
									</span>
									<br />
								</React.Fragment>
							))}
						</p>
						<p className="lg:hidden block absolute text-neutral-100 top-[37.9rem] right-[4.2rem] text-text-sm underline">
							Discover
						</p>
					</div>
				</div>
			</Link>
		)
	}
)

ProjectCard.displayName = "ProjectCard"

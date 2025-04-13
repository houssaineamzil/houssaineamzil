interface ProjectType {
	name: string
	slug: string
	type: string
	labels: string[]
	description: string
	image: {
		url: string
		alt: string
	}
	works: {
		horizontal?: boolean
		variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
	}
}

import { type SchemaTypeDefinition } from "sanity"

import { project } from "./documents/project"
import { about } from "./singletons/about"
import { home } from "./singletons/home"
import { settings } from "./singletons/settings"

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [
		// Singletons
		home,
		about,
		settings,

		// Documents
		project
	]
}

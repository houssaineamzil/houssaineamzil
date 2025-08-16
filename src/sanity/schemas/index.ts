import type { SchemaTypeDefinition } from "sanity"

import { card } from "./documents/card"
import { client } from "./documents/client"
import { project } from "./documents/project"
import { service } from "./documents/service"
import { social } from "./documents/social"
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
    project,
    client,
    service,
    card,
    social
  ]
}

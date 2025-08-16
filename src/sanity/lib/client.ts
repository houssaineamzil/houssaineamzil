import { createClient } from "next-sanity"

import { apiVersion, dataset, projectId } from "@/sanity/env"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    studioUrl: "/studio",
    logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === "title") {
        return true
      }

      return props.filterDefault(props)
    }
  }
})

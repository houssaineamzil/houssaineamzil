import { UsersIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export const client = defineType({
  name: "client",
  title: "Client",
  type: "document",
  icon: UsersIcon,
  liveEdit: true,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] })
    })
  ],
  preview: {
    select: {
      title: "name"
    }
  }
})

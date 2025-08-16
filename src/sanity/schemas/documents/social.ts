import { defineField, defineType } from "sanity"

export const social = defineType({
  name: "social",
  title: "Social Link",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string"
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url"
    })
  ]
})

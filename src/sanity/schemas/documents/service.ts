import { CaseIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: CaseIcon,
  liveEdit: true,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required()
    })
  ],
  preview: {
    select: {
      title: "title"
    }
  }
})

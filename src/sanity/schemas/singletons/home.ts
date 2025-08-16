import { HomeIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export const home = defineType({
  name: "homepage",
  title: "Home",
  type: "document",
  icon: HomeIcon,
  liveEdit: true,
  fields: [
    defineField({
      name: "pageBuilder",
      title: "Page Builder",
      type: "array",
      of: [{ type: "card" }]
    })
  ],
  preview: {
    select: {
      pageBuilder: "pageBuilder"
    },
    prepare() {
      return {
        title: "Home"
      }
    }
  }
})

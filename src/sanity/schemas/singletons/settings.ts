import { CogIcon, LockIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export const settings = defineType({
  name: "settings",

  title: "Settings",
  type: "document",
  icon: CogIcon,
  liveEdit: true,
  fields: [
    defineField({
      name: "password",
      icon: LockIcon,
      title: "Project Password",
      type: "string",
      description:
        "Password for protected works, make sure this is strong enough."
    })
  ],
  preview: {
    select: {
      password: "password"
    },
    prepare() {
      return {
        title: "Settings"
      }
    }
  }
})

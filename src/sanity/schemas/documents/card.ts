import { defineField, defineType } from "sanity"

export const card = defineType({
  name: "card",
  title: "Card",
  type: "object",
  fields: [
    defineField({
      name: "cardType",
      title: "Card Type",
      type: "string",
      options: {
        list: [
          { title: "Project Card", value: "project" },
          { title: "About Card", value: "about" },
          { title: "Clients Card", value: "clients" },
          { title: "Player Card", value: "player" },
          { title: "Geo Card", value: "geo" },
          { title: "Services Card", value: "services" }
        ],
        layout: "radio"
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "variant",
      title: "Size Variant",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Square", value: "square" }
        ],
        layout: "radio"
      }
    }),
    defineField({
      name: "project",
      title: "Project",
      type: "reference",
      to: [{ type: "project" }],
      hidden: ({ parent }) => parent.cardType !== "project",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          // @ts-expect-error False positive
          if (context.parent?.cardType === "project" && !value) {
            return "A project reference is required for a Project Card."
          }
          return true
        })
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      hidden: ({ parent }) => parent.cardType !== "services",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          // @ts-expect-error False positive
          if (context.parent?.cardType === "services" && !value) {
            return "A services reference is required for a Services Card."
          }
          return true
        })
    }),
    defineField({
      name: "clients",
      title: "Clients",
      type: "array",
      of: [{ type: "reference", to: [{ type: "client" }] }],
      hidden: ({ parent }) => parent.cardType !== "clients",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          // @ts-expect-error False positive
          if (context.parent?.cardType === "clients" && !value) {
            return "A clients reference is required for a Clients Card."
          }
          return true
        })
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      hidden: ({ parent }) => parent.cardType !== "about"
    }),
    defineField({
      name: "background",
      title: "Background",
      type: "file",
      options: {
        accept: "image/*,video/*"
      },
      hidden: ({ parent }) => parent.cardType !== "about"
    })
  ],
  preview: {
    select: {
      cardType: "cardType",
      projectTitle: "project.title",
      title: "title"
    },
    prepare({ cardType, projectTitle, title }) {
      const cardTitle =
        cardType === "project"
          ? projectTitle
          : cardType === "about"
            ? "About"
            : cardType === "services"
              ? "Services"
              : cardType === "clients"
                ? "Clients"
                : cardType === "player"
                  ? "Player"
                  : cardType === "geo"
                    ? "Geo"
                    : title

      return {
        title: cardTitle || "Untitled Card",
        subtitle: `Type: ${cardType.charAt(0).toUpperCase() + cardType.slice(1)} Card`
      }
    }
  }
})

import { InlineSvgPreviewItem } from "@focus-reactive/sanity-plugin-inline-svg-input";
import { BookIcon, LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  icon: BookIcon,
  // Uncomment below to have edits publish automatically as you type
  liveEdit: true,
  fields: [
    defineField({
      name: "bio",
      description: "Enter a short bio about yourself.",
      title: "Bio",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "services",
      title: "Services",
      description: "(Optional) Here you can add a list of services you offer.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "industries",
      title: "Industries",
      description:
        "(Optional) Here you can add a list of industries you have worked with.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "clients",
      title: "Clients",
      description:
        "(Optional) Here you can add a list of clients you have worked with.",
      type: "array",
      of: [
        {
          type: "object",
          name: "client",
          fields: [
            {
              name: "name",
              type: "string",
            },
            {
              name: "icon",
              type: "inlineSvg",
            },
          ],
          preview: {
            select: {
              icon: "icon",
              title: "name",
            },
          },
          components: {
            preview: InlineSvgPreviewItem,
          },
        },
      ],
    }),
    defineField({
      name: "aboutImage",
      title: "About Image",
      description:
        "(Optional) Here you can add an image to display in the About Page.",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "studioImage",
      title: "Studio Image",
      description: "(Optional) Here you can add an image of your studio.",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "aboutLinks",
      title: "External links",
      description:
        "(Optional) Here you can add a list of external links, it will be displayed below your About description text.",
      type: "array",
      of: [
        {
          title: "Link",
          name: "navLink",
          type: "object",
          icon: LinkIcon,
          fields: [
            {
              title: "Title",
              name: "title",
              type: "string",
              description: "Display Text",
            },
            {
              title: "URL",
              name: "url",
              type: "url",
              description: "enter an external URL",
              validation: (Rule) =>
                Rule.uri({
                  scheme: ["http", "https", "mailto", "tel"],
                }),
            },
          ],
          preview: {
            select: {
              title: "title",
              url: "url",
            },
            prepare({ title, url }) {
              return {
                title: title,
                subtitle: url,
                media: LinkIcon,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "About page",
      };
    },
  },
});

import { DocumentIcon, ImageIcon, PlayIcon, TextIcon } from "@sanity/icons"
import { defineArrayMember, defineField, defineType } from "sanity"

const client = defineArrayMember({
  name: "client",
  title: "Client",
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

const person = defineArrayMember({
  name: "person",
  title: "Person",
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

const award = defineArrayMember({
  name: "award",
  title: "Award",
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

export const project = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  icon: DocumentIcon,
  liveEdit: true,
  fields: [
    defineField({
      name: "title",
      description: "The title of your project.",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      description: "The project page name for the URL.",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context)
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "description",
      description:
        "Used for the project subheader and the SEO meta description.",
      title: "Description",
      type: "text",
      validation: (rule) => rule.max(250).required()
    }),
    defineField({
      name: "uid",
      title: "UID",
      description: "(Optional) A unique identifier for the project.",
      type: "string"
    }),
    defineField({
      name: "isProtected",
      title: "Protected",
      description: "Is this a protected project?",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "password",
      title: "Password",
      description: "(Optional) A password to access the project.",
      type: "string",
      hidden: ({ parent }) => !parent?.isProtected,
      initialValue: () => Math.random().toString(36).slice(-10)
    }),
    defineField({
      name: "live",
      title: "Live preview",
      description: "An external link to the live project.",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] })
    }),

    defineField({
      name: "year",
      title: "Year",
      description: "The year the project was completed.",
      type: "string"
    }),

    defineField({
      name: "services",
      title: "Services",
      description: "List the services provided for this project.",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "client",
      title: "Client",
      description: "List the client(s) for this project.",
      type: "array",
      of: [client]
    }),
    defineField({
      name: "design",
      title: "Design (Design Team)",
      description: "List the members of the design team.",
      type: "array",
      of: [person]
    }),
    defineField({
      name: "motion",
      title: "Motion (Motion Team)",
      description: "List the members of the motion team.",
      type: "array",
      of: [person]
    }),
    defineField({
      name: "development",
      title: "Development (Development Team)",
      description: "List the members of the development team.",
      type: "array",
      of: [person]
    }),
    defineField({
      name: "awards",
      title: "Awards",
      description: "List any awards the project has won.",
      type: "array",
      of: [award]
    }),

    defineField({
      name: "cover",
      title: "Cover",
      description:
        "The media used for the project cover on the home page grid.",
      type: "file",
      options: {
        accept: "image/*,video/*"
      },
      validation: (rule) => rule.required()
    }),

    defineField({
      title: "Content builder",
      description:
        "Build the content for your project page using various blocks.",
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({
          name: "image",
          title: "Image",
          type: "image",
          icon: ImageIcon,
          options: { hotspot: true },
          preview: {
            select: { media: "image" },
            prepare: ({ media }) => ({ title: "Image", media })
          }
        }),
        defineArrayMember({
          name: "images",
          title: "Images",
          type: "object",
          icon: ImageIcon,
          fields: [
            defineField({
              name: "leftImage",
              title: "Left Image",
              type: "image",
              options: { hotspot: true }
            }),
            defineField({
              name: "rightImage",
              title: "Right Image",
              type: "image",
              options: { hotspot: true }
            })
          ],
          preview: {
            select: { media: "leftImage" },
            prepare: ({ media }) => ({ title: "Images", media })
          }
        }),
        defineArrayMember({
          name: "textBlock",
          title: "Text",
          type: "object",
          icon: TextIcon,
          fields: [
            defineField({
              name: "content",
              title: "Content",
              type: "array",
              of: [{ type: "block" }]
            })
          ],
          preview: {
            select: { subtitle: "content" },
            prepare: ({ subtitle }) => ({
              title: "Text",
              subtitle: subtitle
                ? `Text block starts with: ${subtitle[0].children[0].text}`
                : ""
            })
          }
        }),
        defineArrayMember({
          name: "video",
          title: "Video",
          type: "file",
          icon: PlayIcon,
          options: {
            accept: "video/*"
          },
          preview: {
            select: { subtitle: "videoUrl" },
            prepare: ({ subtitle }) => ({ title: "Video", subtitle })
          }
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "coverMedia.mediaFile"
    }
  }
})

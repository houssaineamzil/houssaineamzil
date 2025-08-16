import { UserIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  icon: UserIcon,
  liveEdit: true,
  initialValue: {
    name: "Høussaine Amzil",
    bio: "Høussaine Amzil is a multidisciplinary creative with a focus on creating high-level work across a variety of digital medius such as automotive visualization and design. He currently works as a front-end developer at Onclusive.",
    services: [
      "Brand Identity",
      "Motion design",
      "Web design",
      "Copywriting",
      "Strategy",
      "Development"
    ]
  },
  fields: [
    defineField({
      name: "name",
      description: "(Optional) Here you can add your name.",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "bio",
      description: "Enter a short bio about yourself.",
      title: "Bio",
      type: "text",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "(Optional) Here you can add your location."
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description:
        "(Optional) Here you can add your email address, it will be displayed in the footer.",
      validation: (rule) => rule.email()
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      description:
        "(Optional) Here you can add your phone number, it will be displayed in the footer.",
      validation: (rule) =>
        rule.regex(/^\+?\d{1,3}\s?\d{3}-\d{4,9}$/, { name: "phone" })
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      description:
        "(Optional) Here you can add your website URL, it will be displayed in the footer.",
      validation: (rule) =>
        rule.uri({
          scheme: ["http", "https"],
          allowRelative: false
        })
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description:
        "(Optional) Here you can add a short tagline, it will be displayed in the header.",
      validation: (rule) => rule.max(100).warning("Keep it short!")
    }),
    defineField({
      name: "image",
      title: "Main Image",
      description: "This is the primary image of yourself for the about page.",
      type: "image",
      options: {
        hotspot: true
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "services",
      title: "Services",
      description: "(Optional) Here you can add a list of services you offer.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }]
    }),
    defineField({
      name: "industries",
      title: "Industries",
      description:
        "(Optional) Here you can add a list of industries you have worked with.",
      type: "array",
      of: [{ type: "string" }]
    }),
    defineField({
      name: "clients",
      title: "Clients",
      description:
        "(Optional) Here you can add a list of clients you have worked with.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "client" }] }]
    }),
    defineField({
      name: "studio",
      title: "Studio",
      description: "Information about your studio, if applicable.",
      type: "object",
      fields: [
        { name: "name", title: "Studio Name", type: "string" },
        { name: "logo", title: "Studio Logo", type: "image" },
        { name: "website", title: "Studio Website", type: "url" }
      ]
    }),
    defineField({
      name: "socials",
      title: "Social Media Links",
      type: "array",
      of: [{ type: "social" }]
    })
  ],
  preview: {
    prepare() {
      return {
        title: "About page"
      }
    }
  }
})

"use client"

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import { inlineSvgInput } from "@focus-reactive/sanity-plugin-inline-svg-input"
import { colorInput } from "@sanity/color-input"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { presentationTool } from "sanity/presentation"
import { structureTool } from "sanity/structure"
import { media } from "sanity-plugin-media"
import { apiVersion, projectId } from "@/sanity/env"
import * as resolve from "@/sanity/plugins/resolve"
import { pageStructure } from "@/sanity/plugins/settings"
import { schema } from "@/sanity/schemas"
import { about } from "@/sanity/schemas/singletons/about"
import { home } from "@/sanity/schemas/singletons/home"

export default defineConfig({
  projectId,
  name: "Production",
  basePath: "/studio",
  dataset: "production",
  subtitle: "This is the production environment",
  schema,
  plugins: [
    structureTool({
      structure: pageStructure([home, about])
    }),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: "/api/draft"
        }
      }
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    colorInput(),
    media(),
    inlineSvgInput()
  ]
})

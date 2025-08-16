import { buildFileUrl, parseAssetId } from "@sanity/asset-utils"
import type { Asset } from "sanity"
import { dataset, projectId } from "@/sanity/env"

export const assetUrl = (asset: Asset) => {
  return buildFileUrl(parseAssetId(asset._ref as string), {
    projectId,
    dataset
  })
}

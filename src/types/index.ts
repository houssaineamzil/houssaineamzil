import type { Asset } from "sanity"

export interface CardType {
  key: string
  project?: {
    cover: Asset
    slug: string
    title: string
    uid: string
  }
  clients?: string[]
  services?: string[]
  content?: string
  background?: {
    asset: Asset
  }
  type: "project" | "about" | "clients" | "services" | "player" | "geo"
  variant: "small" | "square" | "medium"
}

export interface WorkData {
  id: string
  awards: {
    key: string
    name: string
    url: string
  }[]
  client: {
    key: string
    name: string
    url: string
  }
  coverMedia: Asset
  description: string
  design: {
    key: string
    name: string
    url: string
  }[]
  development: {
    key: string
    name: string
    url: string
  }[]
  isProtected: boolean
  live: string
  motion: {
    key: string
    name: string
    url: string
  }[]
  password: string
  sections: {
    key: string
    type: string
    asset?: Asset
    leftImage?: Asset
    rightImage?: Asset
    content?: string[]
  }[]
  services: string[]
  slug: string
  title: string
  uid: string
  year: string
}

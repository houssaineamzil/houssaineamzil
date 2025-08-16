"use server"
import { client } from "@/sanity/lib/client"
import type { CardType, WorkData } from "@/types"

export const getHomeData = async () => {
  const query = `
		*[_type == "homepage"][0]{
			"cards": pageBuilder[]{
				"key": _key,
				"type": cardType,
				variant,
				cardType == "project" => {
					"project": project->{
						uid,
						title,
						"slug": slug.current,
						cover
					},
					"background": project->cover
				},
				cardType == "services" => {
					"services": services[]->title
				},
				cardType == "clients" => {
					"clients": clients[]->name
				},
				cardType == "about" => {
					content,
					background
				},
				cardType == "player" || cardType == "geo" => {}
			}
		}
	`

  const data = await client.fetch(
    query,
    {},
    {
      next: { revalidate: 60 }
    }
  )
  return data as {
    cards: CardType[]
  }
}

export const getProjectsCardsData = async () => {
  const query = `
		*[_type == "homepage"][0]{
      "cards": pageBuilder[cardType == "project"]|order(_createdAt desc){
          "key": _key,
          "type": cardType,
          variant,
          "project": project->{
              uid,
              title,
              "slug": slug.current,
              cover
          },
          "background": project->cover
      }
  }
	`

  const data = await client.fetch(
    query,
    {},
    {
      next: { revalidate: 60 }
    }
  )
  return data as {
    cards: CardType[]
  }
}

export const getProjectsData = async () => {
  const query = `
		*[_type == "project"]|order(_createdAt desc){
			_id,
			_type,
			title,
			description,
			cover,
			client,
			"slug": slug.current,
		}
	`

  const data = await client.fetch(
    query,
    {},
    {
      next: { revalidate: 60 }
    }
  )
  return data
}

export const getProjectData = async (slug: string) => {
  const query = `
		*[_type == "project" && slug.current == $slug][0]{
				"id": _id,
				title,
				"slug": slug.current,
				description,
				uid,
				isProtected,
				live,
				year,
				services,
				client[]{
					"key": _key,
					name,
					url
				},
				design[]{
					"key": _key,
					name,
					url
				},
				motion[]{
					"key": _key,
					name,
					url
				},
				development[]{
					"key": _key,
					name,
					url
				},
				awards[]{
					"key": _key,
					name,
					url
				},
				coverMedia,
				sections[]{
						"key": _key,
						"type": _type,
						_type == "image" => {
							asset
						},
						_type == "video" => {
							asset
						},
						_type == "images" => {
							leftImage,
							rightImage,
						},
						_type == "textBlok" => {
							content
						}
				}
		}
	`

  const data = await client.fetch(
    query,
    { slug },
    {
      next: { revalidate: 60 }
    }
  )
  return data as WorkData
}

export const getPassword = async (slug: string) => {
  const query = `
		*[_type == "project" && slug.current == $slug][0]{
			password
		}
	`

  const data = await client.fetch(
    query,
    { slug },
    {
      next: { revalidate: 60 }
    }
  )
  return data.password
}

export const getAboutData = async () => {
  const query = `
		*[_type == "about"][0]{
			location,
			socials[]{
				"key": _key,
				name,
				url
			}
		}
	`

  const data = await client.fetch(
    query,
    {},
    {
      next: { revalidate: 60 }
    }
  )
  return data as {
    location: string
    socials: {
      key: string
      name: string
      url: string
    }[]
  }
}

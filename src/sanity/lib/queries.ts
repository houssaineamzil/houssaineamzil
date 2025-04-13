import { groq } from "next-sanity";

export const homePageQuery = groq`
  *[_type == "home"][0]{
    _id,
    _updatedAt,
    overview{
      text,
      displayText,
    },
    customLogo,
    showcaseProjects[]->{
      _type,
      coverImage{
        _type,
        asset,
        "lqip": asset->metadata.lqip,
      },
      overview,
      "slug": slug.current,
      title,
      year,
    },
    title,
  }
`;

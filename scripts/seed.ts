// Seeds the projects table with the original portfolio entries.
// Idempotent: does nothing if the table already has rows.
// Run with: bun run db:seed
import { db } from "@/lib/db/client";
import { projects } from "@/lib/db/schema";

const gallery = [
  {
    url: "/Garonzi_home.mp4",
    alt: "",
    poster: "/aRtNy7pReVYa4jnp_02_Garonzi.avif",
  },
  {
    url: "/Garonzi_transition.mp4",
    alt: "",
    poster: "/aRudtbpReVYa4kql_10_Garonzi.avif",
  },
  {
    url: "/Garonzi_page.mp4",
    alt: "",
    poster: "/aRubz7pReVYa4kpy_09_Garonzi.avif",
  },
];

const bird =
  "In celebration of the post-Covid era, we designed a card that when closed represents a bird in a cage, but when we pull off the paper inside, it reveals a flying bird next to other ones.";

const seed = [
  {
    slug: "voltra",
    name: "Voltra",
    year: "2024",
    role: "Art Director",
    imageUrl: "/aSddBWGnmrmGqX2k_garonzi.avif",
    description:
      "This project captures the elegance of a simple amber bottle through a refined play of light, texture, and composition. Using a mix of still imagery and motion, the visuals highlight the bottle’s sleek design, warm tones, and reflective surfaces.\n\nThe carefully curated angles and lighting create a premium, minimalist aesthetic, emphasizing sophistication and timeless appeal. This study showcases how subtle details can transform a product into a statement of luxury and refinement.",
  },
  {
    slug: "metalab",
    name: "Metalab",
    year: "2023",
    role: "Brand Designer",
    imageUrl: "/aSdgkmGnmrmGqYAh_auge_thumb.avif",
    description: bird,
  },
  {
    slug: "emmaissocial",
    name: "Emma is social",
    year: "2023",
    role: "Designer",
    imageUrl: "/aSnNjXNYClf9nlmw_viru.avif",
    description: bird,
  },
  {
    slug: "synthetictheatre",
    name: "Synthetic Theatre",
    year: "2022",
    role: "Designer",
    imageUrl: "/aSnvgnNYClf9nlyy_rootfood_thumb.avif",
    description: bird,
  },
].map((p, i) => ({
  ...p,
  imageAlt: "",
  gallery,
  horizontal: false,
  sortOrder: i,
}));

const existing = await db.select({ id: projects.id }).from(projects).limit(1);
if (existing.length > 0) {
  console.log("projects table already populated, skipping seed");
} else {
  await db.insert(projects).values(seed);
  console.log(`seeded ${seed.length} projects`);
}
process.exit(0);

# `/admin` live-preview CMS — design spec

Date: 2026-09-25

## Goal

Replace the hardcoded TS content files (`src/constants/projects/*.ts`, the
inline bio copy in `src/app/about/page.tsx`, the inline nav links in
`src/components/navigation.tsx`) with content stored in Postgres, editable
through a password-gated `/admin` area. The editor is not a form-then-preview
CMS (the project previously used Sanity — `NEXT_PUBLIC_SANITY_*` env vars
still exist on Vercel from ~405 days ago but nothing in the current codebase
references them). Instead, `/admin` renders the site's real page components
against in-memory draft state, so edits appear instantly, pixel-identical to
production, with no preview step and no page reload.

## Non-goals

- No multi-user accounts, roles, or permissions — single owner, one shared
  password.
- No autosave/draft-versioning/revision-history table. "Save" is a single
  explicit action; unsaved edits are just React state and are lost on
  navigation away (a confirm-before-leaving prompt is in scope; full draft
  persistence across sessions is not).
- No independent "home page" content. `src/app/page.tsx` renders `<Slider />`,
  which just displays the `projects` list — it has no copy of its own, so
  editing projects (including their order) is sufficient; no separate
  `/admin/pages/home` route is built.
- No dedicated `/admin` route for the `/archive` page: it has no copy of its
  own (`archive/page.tsx` just renders `<ArchiveList projects={projects} />`),
  so it inherits the CMS-backed project list automatically once the data-access
  layer swap is done — no extra work needed.

## Content scope

1. **Projects** (`works/page.tsx`, `works/[slug]/page.tsx`, and indirectly
   the homepage slider): name, type, description, labels, year, role, hero
   image, gallery (ordered list of image/video + alt + poster), the
   `horizontal` layout flag, and manual reordering.
2. **About page** (`about/page.tsx`): the four bio paragraphs and the
   portrait image.
3. **Site-wide settings**: the social links (LinkedIn, Instagram, Behance)
   and email currently hardcoded in `navigation.tsx`, plus the email shown
   in editor footers if applicable.

## Data model

New file `src/lib/db/schema.ts`, Drizzle ORM (`drizzle-kit` is already a
devDependency; add `drizzle-orm` and a Postgres driver, e.g. `postgres` or
`@neondatabase/serverless`).

```ts
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull().default(""),
  description: text("description").notNull().default(""),
  labels: jsonb("labels").$type<string[]>().notNull().default([]),
  year: text("year").notNull().default(""),
  role: text("role").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  imageAlt: text("image_alt").notNull().default(""),
  gallery: jsonb("gallery").$type<MediaType[]>().notNull().default([]),
  horizontal: boolean("horizontal").notNull().default(false),
  sortOrder: integer("sort_order").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(), // fixed row id: "about" | "links"
  content: jsonb("content").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

- `siteSettings` row `"about"`: `{ paragraphs: string[], portrait: MediaType }`.
- `siteSettings` row `"links"`: `{ linkedin: string, instagram: string, behance: string, email: string }`.
- `projects.sortOrder` replaces the hardcoded `rows: {index, column}[][]`
  array in `works/page.tsx`. The works grid layout function changes from
  "look up this fixed index's column" to "alternate columns by array
  position", still consulting each project's `horizontal` flag for the
  wide-card variant. This is a required refactor of `works/page.tsx`, not
  optional — reordering in the editor has no effect otherwise.

## Data-access layer

`src/services/content.ts` (or split into `projects.ts` / `settings.ts`)
exposes `getProjects()`, `getProjectBySlug()`, `getAboutContent()`,
`getSiteLinks()`, plus admin-only mutations (`upsertProject`,
`deleteProject`, `reorderProjects`, `updateAboutContent`,
`updateSiteLinks`). Public pages (`works/page.tsx`, `works/[slug]/page.tsx`,
`about/page.tsx`, `page.tsx`'s `Slider`, `navigation.tsx`) read through this
layer instead of importing `@/constants/projects` directly.

Public routes use Next's `fetch`/`unstable_cache` tagging (or simple
`export const revalidate`) so a save in `/admin` can call
`revalidatePath`/`revalidateTag` and have the public site reflect it on next
request, without a redeploy.

## Auth

- `ADMIN_PASSWORD` and `SESSION_SECRET` env vars (not yet set locally or on
  Vercel — must be added before first use).
- `middleware.ts` matches `/admin/:path*` (excluding `/admin/login`), checks
  for a signed session cookie (HMAC via `jose`, no DB-backed sessions),
  redirects to `/admin/login` if missing/invalid.
- `POST /admin/login` (route handler) compares the submitted password to
  `ADMIN_PASSWORD` (constant-time compare), sets an httpOnly, secure,
  `SameSite=Lax` cookie signed with `SESSION_SECRET`, then redirects to
  `/admin`.
- No password reset flow, no rate limiting beyond what's trivial to add
  (e.g. a short delay/lockout after repeated failures) — acceptable for a
  single-owner tool, but include basic throttling since the login route is
  public.

## Image upload

- `@vercel/blob`'s client-upload helper: the browser requests a signed token
  from a small route handler (`POST /admin/api/upload`, itself behind the
  same session check), then uploads the file directly to Blob, bypassing the
  Next.js server function body-size limit.
- In the editor, the upload target shows the file immediately via
  `URL.createObjectURL()` in the live preview, then swaps to the real Blob
  URL once the upload resolves. Draft state stores whichever URL is current;
  only the final Blob URL is persisted on Save.
- Existing images already committed to `/public` and referenced by today's
  hardcoded project data stay where they are — no bulk migration of existing
  files to Blob is required; the seed script (below) can reference the
  existing `/public` paths as-is. New/replaced images go to Blob going
  forward.

## `/admin` UI

- `/admin` — dashboard: reorderable list of projects (drag handle, thumbnail,
  name), "Add project", and links to `/admin/about` and `/admin/settings`.
- `/admin/projects/new` and `/admin/projects/[id]` — split editor:
  - Form: name, type, description, labels, year, role, hero image upload,
    gallery (ordered list with per-item upload + alt text + remove/reorder),
    `horizontal` toggle, delete project.
  - Live preview: renders the actual `works/[slug]` page component tree,
    supplied with a `ProjectType` built from current draft state instead of
    a DB fetch (component takes props already — no fork of the page needed
    beyond accepting draft props instead of always fetching).
- `/admin/about` — form for the 4 bio paragraphs + portrait upload, preview
  renders the actual `about/page.tsx` tree with draft content.
- `/admin/settings` — form for LinkedIn/Instagram/Behance/email; preview
  shows the actual `Navigation` component with draft links.
- Draft state lives in local React state (`useState`/`useReducer`) per route;
  "Save" calls the relevant service mutation and revalidates the
  corresponding public path(s); "Next" (project editor only) advances to the
  next project in sort order, prompting to save first if the form is dirty.
- Unsaved-changes guard: a `beforeunload`/route-change confirm when draft
  state differs from the last-loaded/saved snapshot.

## Migration

One-off seed script (`scripts/seed-content.ts`, run manually via
`bun run scripts/seed-content.ts`, not part of the app or CI) that imports
today's `src/constants/projects/*.ts` and the about-page paragraph text,
writes them into `projects` and `site_settings` with `sortOrder` matching
current display order. After running it once against the target DB, the
static TS project files and the inline about copy become dead code and are
deleted as part of this feature's implementation (their content now lives in
the DB; keeping both would let them drift).

## Local dev environment

- `docker-compose.yml` adding a `postgres:16-alpine` service on a
  **non-default host port** (5432 is already bound locally by an unrelated
  project's container) — use `5433:5432`. `DATABASE_URL` in `.env.local`
  points at it.
- `drizzle-kit` generates/runs migrations against this local DB
  (`bun run db:generate` / `bun run db:migrate` scripts added to
  `package.json`).

## Production deployment prerequisite (manual, not automated by this work)

Vercel no longer provisions Postgres directly via `vercel storage create`
(that command now only supports `blob`/`global-config`); a Postgres database
is a marketplace integration (e.g. Neon) that requires an interactive
`vercel integration add` flow or the Vercel dashboard, and may have billing
implications. This is out of scope for autonomous execution — before this
feature can go live, the project owner needs to provision a production
Postgres database (e.g. via the Vercel dashboard's Storage tab → Neon) and
set the resulting `DATABASE_URL`, plus `ADMIN_PASSWORD` and `SESSION_SECRET`,
as Production env vars on Vercel. Implementation proceeds against local
Postgres in the meantime; the schema/migrations are portable to whatever
Postgres URL is provided.

## Testing

No test runner currently exists in this repo. Add Vitest (lightweight, fits
Next 16 + Bun) scoped to:
- `src/services/content.ts` mutations/queries (against the local Docker
  Postgres).
- The works-grid column-assignment function (pure function, easy to unit
  test) replacing the hardcoded `rows` array.
No E2E/browser test suite — this is a single-owner internal tool; the
live-preview UX itself is verified manually (`bun dev`, exercise the editor).

## Risks / open edges

- **Video gallery items**: `MediaType` gallery entries can be `.mp4` with a
  `poster` image (see `voltra.ts`). The gallery editor must support
  uploading/setting a poster for video items, not just images — the "UPLOAD
  IMAGE" affordance needs a video-aware variant.
- **`works.horizontal`**: confirmed to be the only per-project layout flag
  (`worksCard.tsx` only reads `horizontal` and `index`/`slug`, both derived
  from array position and the project itself, not from hand-authored layout
  data) — no other layout-index dependencies to carry over.

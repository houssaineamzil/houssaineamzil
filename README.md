# Høussaine Amzil — portfolio

Next.js, Drizzle (Postgres) and a small custom CMS at `/admin`.

## Setup

```sh
bun install
bun dev        # starts Postgres (docker compose), runs migrations, then Next
bun test       # needs the `houssaineamzil_test` database from docker compose
bun run lint
```

Environment variables go in `.env.local` (`vercel env pull .env.local` fills most of them):

| Variable | Used for |
| --- | --- |
| `DATABASE_URL` | Postgres (local default: port 5433, see `docker-compose.yml`) |
| `ADMIN_PASSWORD`, `SESSION_SECRET` | `/admin` login and session cookie |
| `BLOB2_READ_WRITE_TOKEN` | Vercel Blob store for uploaded images and video |

## Content model

Two separate lists, each with its own table, admin section and public pages:
**works** (`/works`, the home slider and grid) and **experiments** (`/playground`).
Both tables share one set of columns (`src/lib/db/schema.ts`) and one
implementation (`src/services/projects.ts`); `src/lib/collections.ts` holds
their routes and labels.

A work can carry **Strategy**, **Result** and **Impact** sections; when it does,
they replace the description on its page.

## Database

```sh
bun run db:generate   # after editing src/lib/db/schema.ts
bun run db:migrate
```

`next build` runs migrations first (`prebuild`), so every Vercel build, preview
ones included, migrates the shared database.

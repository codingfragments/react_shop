# KeyCraft (React)

A demo mechanical keyboard e-commerce shop — product catalog, cart, checkout flow, order tracking, FAQ, and a scripted support chatbot. This is a React port of the original SvelteKit implementation, preserving functionality, styling (Tailwind + Catppuccin palette), and data model 1:1.

## Stack

- **apps/web** — React 19 + Vite + TypeScript, React Router v7, Zustand (with `persist` for cart/checkout state)
- **apps/api** — Express + TypeScript, `better-sqlite3` for storage
- **pnpm workspaces** monorepo (`apps/web`, `apps/api`)

In production, `apps/api` serves both the REST API and the built React app as static files from a single Express process/container.

## Prerequisites

- Node 24.x (pinned via `.node-version` / `volta`)
- pnpm 11.x (`corepack enable && corepack prepare pnpm@11.9.0 --activate`, or via volta)
- A C/C++ toolchain (`python3`, `make`, `g++`) if you need to rebuild the `better-sqlite3` native addon — usually only prebuilt binaries are needed, no manual build step required

## Getting started

```sh
pnpm install
cp .env.example .env   # adjust values if needed
pnpm dev
```

This starts both dev servers in parallel:

- `apps/web` — Vite dev server at `http://localhost:5173` (proxies `/api/*` to the Express server)
- `apps/api` — Express server at `http://localhost:3001` (or `API_PORT`)

The SQLite database is created and seeded automatically on first API startup if it doesn't exist at `DATABASE_PATH`.

### Useful scripts (root `package.json`)

| Script | Description |
| --- | --- |
| `pnpm dev` | Run both `apps/web` and `apps/api` dev servers in parallel |
| `pnpm dev:web` / `pnpm dev:api` | Run just one side |
| `pnpm build` | Build both packages (`web` → static assets, `api` → compiled JS in `dist/`) |
| `pnpm start` | Run the production entrypoint (`scripts/docker-entrypoint.js`) — used by Docker |
| `pnpm preview` | Preview the built web app locally |
| `pnpm db` / `db:init` / `db:wipe` / `db:seed` / `db:export` / `db:reset` | Database utilities (proxied to `apps/api`) |
| `pnpm format` / `pnpm lint` | Prettier write / check |
| `pnpm health` | Curl the running API's `/api/health` endpoint |

### Database scripts

`apps/api`'s scripts live in `apps/api/src/scripts/` so they compile alongside the rest of the API (`tsc -p tsconfig.json`), with no `tsx`/network dependency required at runtime:

- `pnpm db:reset` — wipe + re-init schema + seed (fastest way to get back to a known state)
- `pnpm db:seed` — populate an existing empty schema from `productseed.json` (falls back to randomly-generated data if that file is missing)
- `pnpm db:export` — dump the current database back out to `productseed.json`

If you ever hit a `better-sqlite3` native module ABI mismatch (`NODE_MODULE_VERSION` error) locally, fix it with:

```sh
pnpm rebuild better-sqlite3 --filter api
```

(not `node-gyp rebuild` directly — pnpm runs scripts with its own bundled Node runtime, which can differ from the `node` in your shell PATH.)

## Building for production

```sh
pnpm build
```

- `apps/web/dist` — static React build
- `apps/api/dist` — compiled Express app, including compiled DB scripts (`dist/scripts/`) and `dist/db/schema.sql`

## Docker

The `Dockerfile` builds a single self-contained image: Express serves the compiled API and the static React build from one process, with zero runtime network dependency (DB seed scripts are precompiled, not fetched via `npx`).

```sh
pnpm docker:build          # build the image locally
pnpm docker:run            # run it, reading env vars from .env
```

Or with `docker-compose`:

```sh
docker-compose up -d              # production profile, http://localhost:8081
docker-compose --profile dev up -d # dev profile, http://localhost:3001
```

On first boot (no database file at `DATABASE_PATH`), the container automatically runs a full reset+seed using the compiled scripts, then starts the server. The database lives in a named volume (`data`) so it persists across container restarts.

### Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | Port the Express server listens on |
| `DATABASE_PATH` | `./data/db.sqlite` | SQLite file location |
| `NODE_ENV` | — | `development` / `production` |

## Project structure

```
apps/
  web/                  React app (Vite, React Router v7, Zustand)
    src/components/     Header, Footer, ProductCard, Chatbot, checkout steps, ...
    src/pages/          Route-level pages, incl. src/pages/doc/ (in-app documentation site)
    src/lib/            Stores (cart, checkout), config, eliza.ts (chatbot logic), styles
  api/
    src/index.ts        Express app entrypoint
    src/routes/         REST endpoints (categories, products, search, faqs, motd, health)
    src/db/             better-sqlite3 connection, schema.sql, typed query helpers
    src/scripts/        db-utils / seed-database / export-seed-json (compiled with the rest of the API)
scripts/
  docker-entrypoint.js  Production entrypoint: seed-if-empty, then start the server
Dockerfile               Multi-stage build (builder + runner)
docker-compose.yml        Prod + dev profiles
productseed.json          Seed data snapshot (categories, products, FAQs)
```

# Project

Hono + React SSR boilerplate using Vite, TanStack Router/Query, and TypeScript.
Structure: `src/server` (Hono API + SSR), `src/front` (React SSR), `src/shared` (shared types/client).
Database: Drizzle ORM with PostgreSQL.

## Commands

- dev: `pnpm dev`
- build: `pnpm build`
- start: `pnpm start`
- test: `pnpm test`
- lint: `pnpm lint`
- format: `pnpm format`
- db: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:reset`

## Architecture rules

- `src/server` must not import from `src/front`.
- `src/front` must not import from `src/server`.
- `src/shared` must not import from `src/server` or `src/front`.
- Routes are file-based in `src/front/routes`.
- DB schema lives in `src/server/adaptaters/db/schema/`; generate and migrate after schema changes.

## Verification

- After non-trivial changes, run `pnpm test`.
- When touching TS/TSX or formatting, also run `pnpm lint` and `pnpm format:check`.

## Common pitfalls

- Violating server/front/shared import boundaries.
- Forgetting `pnpm db:generate` and `pnpm db:migrate` after schema edits.
- Running `pnpm start` without a fresh `pnpm build`.

## Editing rules

- Code comments must be in English, short, technical, and explain why (not what).

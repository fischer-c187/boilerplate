# Hono + React SSR Boilerplate

Boilerplate fullstack moderne pour demarrer vite avec Hono, React SSR (TanStack Router) et une separation claire `server/front/shared`.

## Philosophy

- **Backend (src/server/)** : API Hono, services, DB, middleware (Node.js only)
- **Frontend (src/front/)** : React SSR, routes, UI (browser + SSR)
- **Shared (src/shared/)** : code partage (client RPC, i18n, types)

## Stack

### Core

- **Backend** : Hono v4
- **Frontend** : React 19 + SSR
- **Routing** : TanStack Router (file-based)
- **Data fetching** : TanStack Query
- **TypeScript** : strict mode, ESM

### Modules par defaut

- **Database** : Drizzle ORM + PostgreSQL
- **Auth** : Better Auth (email + password, verification)
- **Payments** : Stripe
- **Email** : SMTP (dev) / Resend (prod)
- **Validation** : Zod

## Quick Start

```bash
pnpm install
pnpm dev
```

Ouvre `http://localhost:3000`.

## Commands

### Dev / Build

```bash
pnpm dev      # Dev mode avec hot reload
pnpm build    # Build client + server + types
pnpm start    # Run production build
```

### Database

```bash
pnpm db:generate  # Generer les migrations
pnpm db:migrate   # Appliquer les migrations
pnpm db:studio    # UI Drizzle
pnpm db:reset     # Reset DB (script)
```

Workflow migrations :

1. Modifier un schema dans `src/server/adaptaters/db/schema/`
2. `pnpm db:generate`
3. `pnpm db:migrate`

### Docker (Postgres + Mailpit)

```bash
pnpm docker:up
pnpm docker:down
pnpm docker:logs
```

### Stripe

```bash
pnpm stripe:listen   # Ecoute webhooks localement
pnpm stripe:trigger  # Trigger de test
```

### Qualite

```bash
pnpm lint
pnpm format
pnpm test
```

## Environment Variables

Les variables sont validees par Zod :

- Serveur : `src/server/config/env.ts`
- Client : `src/front/config/env.client.ts`

Variables courantes :

- **Base URL** : `VITE_BASE_URL` (utilisee cote client, validee aussi cote server)
- **DB** : `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- **Mail** : `MAIL_PROVIDER`, `SMTP_*` ou `RESEND_API_KEY`
- **Stripe** : `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_API_VERSION`

## Architecture & SSR

- Serveur Hono : `src/server/index.ts` (monte `/api` + SSR)
- API : `src/server/api.ts`
- SSR : `src/front/entry-server.tsx`
- Hydratation : `src/front/entry-client.tsx`
- Router + QueryClient : `src/front/router.ts`

Flux SSR (resume) : loader -> prefetch query -> rendu HTML -> hydratation avec cache.

## Docs

- `docs/ARCHITECTURE.md` : structure et flux SSR en bref
- `docs/FEATURE_AUTH.md` : auth + verification email
- `docs/FEATURE_STRIPE.md` : checkout, portal, webhooks
- `docs/FEATURE_SSR.md` : usage SSR + Query
- `docs/TANSTACK_QUERY_SSR_GUIDE.md` : guide detaille SSR
- `docs/API_CLIENT.md` : client RPC Hono + format des erreurs API

## Règles d'import

```
OK : src/server -> src/shared
OK : src/front  -> src/shared
OK : src/shared -> src/shared

NO : src/server -> src/front
NO : src/front  -> src/server
NO : src/shared -> src/server | src/front
```

## Next steps

1. Ajouter vos routes API dans `src/server/api/`
2. Etendre le client RPC dans `src/shared/api-client/`
3. Ajouter vos hooks TanStack Query dans `src/front/api/`
4. Builder vos features dans `src/front/features/`
5. Ajouter vos routes dans `src/front/routes/`

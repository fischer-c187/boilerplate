# Hono + React SSR Boilerplate

Boilerplate modulaire pour shipper rapidement des projets fullstack avec Hono, React SSR (TanStack Router), et une architecture flexible pour la couche données.

## Philosophy

Ce boilerplate est conçu pour **connecter un système core à différents modules** selon les besoins du projet :

- **Database agnostic** : Drizzle/PostgreSQL par défaut, mais facilement swappable vers Supabase, MongoDB, etc.
- **Modular architecture** : Chaque domaine (auth, storage, email, etc.) peut utiliser sa propre stack
- **Ship fast** : Configuration minimale, prêt à déployer

## Stack

### Core
- **Backend** : Hono v4 (Node.js)
- **Frontend** : React 18 avec SSR
- **Routing** : TanStack Router (file-based)
- **TypeScript** : Strict mode, ESM

### Modules
- **Database** : Drizzle ORM + PostgreSQL
- **Auth** : Better Auth
- **Payments** : Stripe
- **Email** : Resend
- **Validation** : Zod (shared schemas client/server)
- **Analytics** : PostHog (ou autre à déterminer)

## Quick Start

```bash
pnpm install
pnpm dev
```

Ouvre http://localhost:3000

## Commands

```bash
pnpm dev      # Dev mode avec hot reload
pnpm build    # Build pour production
pnpm start    # Run production build
```

## Structure Modulaire

```
src/
├── index.ts           # Server bootstrap
├── routes/            # TanStack Router routes
├── modules/           # Modules métier
│   ├── auth/          # Better Auth configuration
│   ├── database/      # Drizzle + PostgreSQL
│   ├── payments/      # Stripe webhooks & API
│   ├── email/         # Resend templates & sending
│   └── analytics/     # PostHog tracking
├── lib/               # Shared utilities & Zod schemas
└── core/              # Business logic partagée
```

### Exemple : Swapper la Database

**Drizzle/PostgreSQL** (défaut) :
```typescript
import { db } from './modules/database/drizzle'
```

**Supabase** :
```typescript
import { db } from './modules/database/supabase'
```

Chaque module expose la même interface, le core ne change pas.

## Deployment

Le projet est prêt pour :
- **Vercel** / **Netlify** (Node.js runtime)
- **Railway** / **Render** (PostgreSQL included)
- **Docker** (Dockerfile à ajouter si besoin)

## Next Steps

1. Configurer la database de ton choix dans `src/modules/database/`
2. Ajouter tes routes dans `src/routes/`
3. Builder ton système core dans `src/core/`
4. Connecter les modules nécessaires (auth, storage, etc.)

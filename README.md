# Hono + React SSR Boilerplate

Boilerplate fullstack moderne pour shipper rapidement avec Hono, React SSR (TanStack Router), et une architecture server/front/shared claire et scalable.

## Philosophy

Ce boilerplate sépare clairement :

- **Backend (server/)** : API Hono, database, middlewares (Node.js only)
- **Frontend (front/)** : React SSR, routes, components (Browser + SSR)
- **Shared (shared/)** : Code isomorphique - types, validation, business logic (partout)

Cette séparation garantit :

- **Type-safety end-to-end** avec Hono RPC
- **Pas de code Node.js dans le bundle client**
- **Réutilisation du code** entre server et client
- **Scalabilité** avec une organisation par domaine métier

## Stack

### Core

- **Backend** : Hono v4 (Node.js)
- **Frontend** : React 18 avec SSR
- **Routing** : TanStack Router (file-based)
- **TypeScript** : Strict mode, ESM
- **Type-safety** : Hono RPC client

### Modules par défaut

- **Database** : Drizzle ORM + PostgreSQL
- **Auth** : Better Auth
- **Payments** : Stripe
- **Email** : Resend
- **Validation** : Zod (schemas partagés)
- **Analytics** : PostHog

## Quick Start

```bash
pnpm install
pnpm dev
```

Ouvre http://localhost:3000

## Commands

### Development

```bash
pnpm dev      # Dev mode avec hot reload
pnpm build    # Build pour production
pnpm start    # Run production build
```

### Database

```bash
# Démarrer PostgreSQL avec Docker
docker compose up -d

# Arrêter PostgreSQL
docker compose down

# Arrêter et supprimer les données
docker compose down -v

# Voir les logs de la base de données
docker compose logs -f postgres
```

**Connection string** (dans `.env.dev`):

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/boilerplate_dev
```

## Architecture

```
src/
  server/                    # Backend Hono (Node.js only)
    api/
      users.ts               # API routes + handlers
      auth.ts
      payments.ts
    db/
      client.ts              # Drizzle config
      schema/                # Table definitions
        users.ts
        payments.ts
    middlewares/
      auth.middleware.ts
    index.ts                 # Hono app entry

  front/                     # Frontend React (Browser + SSR)
    routes/                  # TanStack Router routes
      __root.tsx
      index.tsx
      users/
        profile.tsx
    components/
      ui/                    # Design system
      users/                 # User components
      payments/              # Payment components
    api/                     # React Query hooks
      users.query.ts
    hooks/                   # Custom hooks
    layouts/
    entry-server.tsx
    entry-client.tsx

  shared/                    # Code isomorphique (SSR + Client)
    domain/                  # Types + Validation
      users/
        user.types.ts        # TypeScript interfaces
        user.schema.ts       # Zod schemas
      payments/
        payment.types.ts
        payment.schema.ts

    services/                # Business logic pure
      users/
        canAccessAdminPanel.ts
        formatUserName.ts
      payments/
        calculateTax.ts

    api-client/              # Hono RPC client (type-safe)
      client.ts
      users.api.ts
      payments.api.ts

    utils/
    constants/
```

## Règles d'import

```
✅ Autorisé :
server/   → shared/
front/    → shared/
shared/   → shared/

❌ Interdit :
server/   → front/   (backend ne peut pas importer React)
front/    → server/  (frontend ne peut pas importer Node.js)
shared/   → server/  (isomorphique ne peut pas dépendre de Node.js)
shared/   → front/   (isomorphique ne peut pas dépendre de React)
```

## Workflow typique

### 1. Définir le domaine (shared)

```typescript
// shared/domain/users/user.types.ts
export interface User {
  id: string
  email: string
  name: string
}

// shared/domain/users/user.schema.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})
```

### 2. Créer l'API backend (server)

```typescript
// server/api/users.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createUserSchema } from '@/shared/domain/users/user.schema'
import { db } from '@/server/db/client'

const app = new Hono()

app.post('/', zValidator('json', createUserSchema), async (c) => {
  const data = c.req.valid('json')
  const user = await db.insert(users).values(data).returning()
  return c.json(user)
})

export default app
```

### 3. Créer le client type-safe (shared)

```typescript
// shared/api-client/users.api.ts
import { client } from './client'

export const usersApi = {
  createUser: (data: CreateUserInput) => client.users.$post({ json: data }),
}
```

### 4. Utiliser dans React (front)

```typescript
// front/api/users.query.ts
import { usersApi } from '@/shared/api-client/users.api'
import { useMutation } from '@tanstack/react-query'

export const useCreateUser = () => {
  return useMutation({
    mutationFn: usersApi.createUser,
  })
}

// front/components/users/CreateUserForm.tsx
import { useCreateUser } from '@/front/api/users.query'

export function CreateUserForm() {
  const createUser = useCreateUser()
  // ... form logic with full type-safety
}
```

## Avantages de cette architecture

1. **Type-safety complète** : Le type retourné par l'API server est automatiquement inféré côté client
2. **Zod partagé** : Validation identique server + client
3. **Business logic réutilisable** : `shared/services/` fonctionne partout
4. **Pas de duplication** : Types définis une seule fois dans `shared/domain/`
5. **Tree-shaking optimal** : Code server exclu du bundle client
6. **Organisation claire** : Chaque domaine (users, payments) a ses types, schemas, et services

## Deployment

Le projet est prêt pour :

- **Vercel** / **Netlify** (Node.js runtime)
- **Railway** / **Render** (PostgreSQL included)
- **Docker** (Dockerfile à ajouter si besoin)

## Next Steps

1. Définir vos domaines métier dans `shared/domain/`
2. Créer vos API routes dans `server/api/`
3. Configurer votre database dans `server/db/`
4. Builder vos components React dans `front/components/`
5. Ajouter vos routes dans `front/routes/`

Pour plus de détails, voir [CLAUDE.md](CLAUDE.md).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **modular fullstack boilerplate** for shipping projects quickly with:

- **Backend**: Hono v4 on Node.js
- **Frontend**: React 18 with SSR via TanStack Router
- **Architecture**: Separated server/front/shared layers

**Default Stack**:

- Database: Drizzle ORM + PostgreSQL
- Auth: Better Auth
- Payments: Stripe
- Email: Resend
- Validation: Zod
- Analytics: PostHog (TBD)

The philosophy is **separation of concerns**: backend, frontend, and isomorphic code are clearly separated while sharing types and business logic.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development mode with hot reload
pnpm dev  # http://localhost:3000

# Build for production
pnpm build  # TypeScript → dist/

# Run production build
pnpm start
```

**Package Manager**: This project uses **pnpm**. The lockfile is `pnpm-lock.yaml`.

No test runner configured yet. Use `pnpm build` to verify type safety.

## Architecture & File Structure

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
      cors.middleware.ts
    index.ts                 # Hono app entry

  front/                     # Frontend React (Browser + SSR)
    routes/                  # TanStack Router file-based routes
      __root.tsx
      index.tsx
      users/
        profile.tsx
    components/
      ui/                    # Design system components
      users/                 # User feature components
      payments/              # Payment feature components
    layouts/
      RootLayout.tsx
    api/                     # React Query hooks (client-side)
      users.query.ts
    hooks/                   # Custom React hooks
    entry-server.tsx
    entry-client.tsx

  shared/                    # Isomorphic code (SSR + Client)
    domain/                  # Business domain (types + validation)
      users/
        user.types.ts        # TypeScript types
        user.schema.ts       # Zod schemas
      payments/
        payment.types.ts
        payment.schema.ts

    services/                # Pure business logic
      users/
        canAccessAdminPanel.ts
        formatUserName.ts
      payments/
        calculateTax.ts

    api-client/              # Hono RPC client (type-safe)
      client.ts              # Hono client config
      users.api.ts           # Users API calls
      payments.api.ts

    utils/                   # Utility functions
      format.ts
      helpers.ts

    constants/
      app.constants.ts
```

### Key Architectural Principles

1. **Three-Layer Separation**:
   - `server/` → Node.js only code (API, database, middlewares)
   - `front/` → Browser + SSR code (React, routes, components)
   - `shared/` → Isomorphic code that runs everywhere (types, validation, business logic)

2. **Type-Safe End-to-End**: Hono RPC provides full type-safety from server to client. Types are defined once in `shared/domain/` and used everywhere.

3. **Domain-Driven Design**: Code is organized by business domain (users, payments, etc.) rather than technical layers.

4. **Isomorphic Code**: `shared/` contains code that works in both Node.js and browser environments:
   - Zod schemas for validation
   - Business logic functions
   - Type definitions
   - Utility functions

5. **Component Organization**: Components in `front/components/` are grouped by feature (users, payments) or by type (ui for design system).

### Import Rules

```
Allowed import flow:
server/   → shared/  ✅
front/    → shared/  ✅
shared/   → shared/  ✅

Forbidden:
server/   → front/   ❌ (backend can't import React)
front/    → server/  ❌ (frontend can't import Node.js code)
shared/   → server/  ❌ (isomorphic can't depend on Node.js)
shared/   → front/   ❌ (isomorphic can't depend on React)
```

### Module Examples

**Shared Domain (Types + Validation)**:

```typescript
// shared/domain/users/user.types.ts
export interface User {
  id: string
  email: string
  name: string
}

// shared/domain/users/user.schema.ts
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2)
})

// ✅ Used in server API
// server/api/users.ts
import { userSchema } from '@/shared/domain/users/user.schema'
app.post('/users', validate(userSchema), ...)

// ✅ Used in client forms
// front/components/users/UserForm.tsx
import { userSchema } from '@/shared/domain/users/user.schema'
const form = useForm({ schema: zodResolver(userSchema) })
```

**Shared Business Logic**:

```typescript
// shared/services/users/canAccessAdminPanel.ts
import type { User } from '@/shared/domain/users/user.types'

export function canAccessAdminPanel(user: User): boolean {
  return user.role === 'admin' && user.emailVerified
}

// ✅ Used in server middleware
// server/middlewares/admin.middleware.ts
import { canAccessAdminPanel } from '@/shared/services/users/canAccessAdminPanel'

// ✅ Used in client UI
// front/components/AdminButton.tsx
import { canAccessAdminPanel } from '@/shared/services/users/canAccessAdminPanel'
```

**Database Module** (server only):

```typescript
// server/db/client.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool)

// server/db/schema/users.ts
import { pgTable, uuid, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name').notNull(),
})
```

**Hono RPC Client** (type-safe API calls):

```typescript
// shared/api-client/client.ts
import { hc } from 'hono/client'
import type { AppType } from '@/server'

export const client = hc<AppType>('/api')

// shared/api-client/users.api.ts
import { client } from './client'

export const usersApi = {
  getUser: (id: string) => client.users[':id'].$get({ param: { id } }),
  createUser: (data: CreateUserInput) => client.users.$post({ json: data }),
}

// front/api/users.query.ts (React Query hooks)
import { usersApi } from '@/shared/api-client/users.api'
import { useQuery } from '@tanstack/react-query'

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUser(id),
  })
}
```

### Adding Routes

TanStack Router uses file-based routing. Add new route files in `front/routes/`:

```typescript
// front/routes/users/profile.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UserProfile } from '@/front/components/users/UserProfile'

export const Route = createFileRoute('/users/profile')({
  component: UserProfilePage
})

function UserProfilePage() {
  return <UserProfile />
}
```

### Adding API Endpoints

Create new API routes in `server/api/`:

```typescript
// server/api/users.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { userSchema } from '@/shared/domain/users/user.schema'
import { db } from '@/server/db/client'
import { users } from '@/server/db/schema/users'

const app = new Hono()

app.post('/', zValidator('json', userSchema), async (c) => {
  const data = c.req.valid('json')
  const [user] = await db.insert(users).values(data).returning()
  return c.json(user)
})

export default app
```

## Code Style (from AGENTS.md)

- **Imports**: ESM, external packages first, then relative modules
- **Naming**: camelCase (vars/functions), PascalCase (types), UPPER_SNAKE_CASE (env)
- **Indentation**: 2 spaces
- **Route handlers**: Keep pure, return responses directly
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`)

## Configuration

- **Port**: Currently hardcoded to 3000 in [src/index.ts](src/index.ts:12) - should use `process.env.PORT`
- **Secrets**: Use `.env` files (gitignored)
- **Module Selection**: Choose your database/auth/storage modules based on project requirements
- **JSX Runtime**: Configured for Hono JSX (`jsxImportSource: "hono/jsx"`)

## Deployment Targets

- Vercel / Netlify (Node.js runtime)
- Railway / Render (with PostgreSQL)
- Docker (add Dockerfile as needed)

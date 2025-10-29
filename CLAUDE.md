# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **modular fullstack boilerplate** for shipping projects quickly with:
- **Backend**: Hono v4 on Node.js
- **Frontend**: React 18 with SSR via TanStack Router
- **Architecture**: Core system + pluggable modules

**Default Stack**:
- Database: Drizzle ORM + PostgreSQL
- Auth: Better Auth
- Payments: Stripe
- Email: Resend
- Validation: Zod
- Analytics: PostHog (TBD)

The philosophy is **module-first**: the core business logic stays stable while modules can be swapped based on project needs.

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
├── index.ts           # Hono server bootstrap
├── routes/            # TanStack Router file-based routes
├── modules/           # Pluggable modules
│   ├── database/      # Drizzle + PostgreSQL (swappable to Supabase, etc.)
│   ├── auth/          # Better Auth configuration
│   ├── payments/      # Stripe integration (webhooks, API)
│   ├── email/         # Resend (templates & sending)
│   └── analytics/     # PostHog tracking
├── lib/               # Shared utilities & Zod schemas
└── core/              # Business logic that uses modules
```

### Key Architectural Principles

1. **Module Interface Pattern**: Each module (e.g., `database/drizzle.ts`, `database/supabase.ts`) exposes the same interface. The core imports from `./modules/database/` without knowing the implementation.

2. **SSR with TanStack Router**: Routes in `src/routes/` are file-based. Hono serves the React app with server-side rendering.

3. **Core System**: `src/core/` contains domain logic that's independent of module choices. Example: user management logic doesn't care if you're using Drizzle or Supabase.

### Module Examples

**Database Module** (swappable):
```typescript
// src/modules/database/drizzle.ts (default)
export const db = drizzle(pool)
export const query = { users, posts, ... }

// src/modules/database/supabase.ts (alternative)
export const db = createSupabaseClient(...)
export const query = { /* same interface */ }

// src/core/users.ts
import { db } from '../modules/database'  // Works with any DB module
```

**Validation with Zod** (shared schemas):
```typescript
// src/lib/schemas/user.ts
export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2)
})

// Used in both server routes and client forms
```

**Stripe Integration**:
```typescript
// src/modules/payments/stripe.ts
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// src/routes/api/webhooks/stripe.ts
// Handle Stripe webhooks for subscriptions, payments
```

### Adding Routes

TanStack Router uses file-based routing. Add new route files in `src/routes/`:

```typescript
// src/routes/users.tsx
export default function UsersRoute() {
  return <div>Users page</div>
}
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

# Rules — Boilerplate Hono + React + TypeScript + TanStack Router + TanStack Query

You are an expert full-stack developer proficient in TypeScript, React, Hono, TanStack Router, and TanStack Query. Your task is to produce optimized, maintainable, secure code that fits this repository’s architecture and conventions.

## Objective

- Deliver production-grade code with strong typing, clear boundaries between layers, and minimal accidental complexity.
- Favor predictable behavior, testability, and long-term maintainability over “clever” implementations.

## Tech Constraints (Project-Specific)

- Frameworks:
  - Backend: Hono (routes, middleware, handlers)
  - Frontend: React + TanStack Router
  - Data fetching/caching: TanStack Query
  - Validation: Zod (shared schemas whenever possible)
- Do NOT assume Next.js features (no RSC, no Next.js SSR APIs, no `app/` conventions).

## Code Style and Structure

- TypeScript only. Use `strict`-friendly patterns.
- Use functional and declarative style; avoid classes except when required by third-party libs.
- Prefer small pure functions and composition over large functions with side-effects.
- Favor iteration/modularization over duplication (DRY without over-abstracting).
- Use descriptive names with auxiliary verbs (`isLoading`, `hasError`, `canSubmit`).
- Directory naming: lowercase with dashes (e.g., `features/billing-settings`).
- Keep files ordered logically:
  1. exports, 2) types, 3) constants, 4) helpers, 5) main implementation, 6) subcomponents.

## Architecture Boundaries

- Separate concerns strictly:
  - UI components: rendering + local UI state only
  - Data layer: API client + query keys + query/mutation functions
  - Domain logic: pure functions (formatting, mapping, business rules)
  - Server: Hono route handlers + services + repositories (if present)
- No direct network calls inside UI components except through TanStack Query hooks.
- No DB access in route files if a service/repository layer exists; routes should orchestrate only.

## Server Rules (Hono)

- Routes must:
  - Validate inputs (params/query/body) with Zod before using them.
  - Use early returns and guard clauses for invalid state.
  - Return consistent JSON shapes for errors (see “Error Handling”).
- Middleware:
  - Centralize auth/session parsing in middleware; keep handlers clean.
  - Keep middleware small; avoid hidden side effects.
- Never leak internal errors or stack traces to clients.

## Client Rules (React + TanStack Router)

- Routing:
  - Use TanStack Router loaders where appropriate to prefetch query data.
  - Keep route components thin: they should compose feature components and hooks.
- Components:
  - Prefer composition over prop drilling when practical.
  - Keep components focused; split when rendering logic exceeds ~150 LOC.
  - Do not introduce new global state unless justified.

## Data Fetching (TanStack Query)

- All server interactions go through:
  - A typed API client (fetch wrapper), plus
  - Query keys defined in one place per feature/module.
- Rules:
  - Query keys must be stable, typed, and colocated with the feature.
  - Prefer `useQuery`/`useInfiniteQuery`/`useMutation` with explicit `queryKey` and `queryFn`.
  - Invalidate precisely (targeted query keys), not “invalidate everything”.
  - Handle loading/error states explicitly in UI (no silent failures).
- Keep `select` and `staleTime` decisions intentional; document non-obvious choices.

## Validation (Zod)

- Zod is mandatory for:
  - Server request validation (params/query/body)
  - Client-to-server payload shaping (reuse shared schemas when possible)
- Keep schemas:
  - Reusable, exported, and colocated in `shared/` if both client and server use them.
  - Strict: avoid `z.any()` unless absolutely required (must be justified in comment).

## Error Handling

- Use consistent error responses from server:
  - `{ error: { code: string, message: string, details?: unknown } }`
- Use early returns / guard clauses.
- Prefer explicit custom error types on server for predictable mapping to HTTP codes.
- Client:
  - TanStack Query errors should be surfaced via `error` states and rendered clearly.
  - Do not swallow errors in `catch` without rethrowing or returning a typed fallback.

## Security

- Never trust client input. Validate everything server-side.
- Sanitize and constrain:
  - pagination (`limit`, `cursor`), sorting fields, filters
- Avoid leaking sensitive info in logs or responses.
- Ensure auth checks happen before accessing protected resources.

## Performance

- Keep payloads minimal (only required fields).
- Prefer pagination over large lists.
- Avoid unnecessary re-renders:
  - memoize expensive derived values (`useMemo`) only when measured/justified
  - keep query `select` stable
- Use code splitting only if it matches the bundler/tooling used in the repo (no Next.js dynamic import assumptions).

## UI & Styling

- Use the project’s styling system consistently (Tailwind/Shadcn/Radix if present).
- Mobile-first responsive design.
- Reuse existing components before creating new ones.

## Testing & Documentation

- Add tests where logic is non-trivial:
  - Unit tests for pure functions
  - Component tests for complex UI flows
- Comments:
  - Only for non-obvious logic; no redundant comments.
  - Use JSDoc for exported utilities when it improves IntelliSense.

## Delivery Standards

- Provide code that compiles and passes lint/typecheck.
- Do not introduce new dependencies unless absolutely necessary; if added, justify briefly.
- Keep diffs minimal and aligned with existing project patterns.

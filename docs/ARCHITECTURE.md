# Architecture

Ce projet est organise autour de trois couches isomorphiques :

- `src/server/` : backend Hono (API, services, DB, middleware).
- `src/front/` : UI React + SSR (routes, components, features).
- `src/shared/` : code partage (client RPC, i18n).

## Couches et responsabilites

### Server (backend Hono)

- Routes API (`src/server/api/*`) et composition (`src/server/api.ts`).
- Services, repositories, integrations (DB, auth, mail, stripe).
- Middleware et securite (auth, etc.).
- Point d'entree serveur (`src/server/index.ts`) qui monte `/api` + SSR.

Contraintes :

- `src/server/` ne doit pas importer `src/front/`.
- `src/server/` peut importer `src/shared/`.

### Front (React + SSR)

- Routes et loaders TanStack Router (`src/front/routes/`).
- Rendu SSR (`src/front/entry-server.tsx`) et hydratation client (`src/front/entry-client.tsx`).
- Router + QueryClient (`src/front/router.ts`).
- UI : `components/`, `features/`, `providers/`.

Contraintes :

- `src/front/` ne doit pas importer `src/server/`.
- `src/front/` peut importer `src/shared/`.

### Shared (isomorphique)

- Client RPC Hono type-safe (`src/shared/api-client/`).
- i18n (`src/shared/i18n/`).

Contraintes :

- `src/shared/` ne depend jamais de `src/server/` ni `src/front/`.

## Structure rapide

```
src/
  server/
    api/            # Routes Hono (auth, mail, stripe, test)
    adaptaters/     # Integrations (db, auth, mail, stripe)
    services/
    repositories/
    middleware/
    config/

  front/
    routes/         # Routes TanStack Router
    features/       # UI par domaine
    components/
    api/            # Hooks TanStack Query
    entry-server.tsx
    entry-client.tsx
    router.ts

  shared/
    api-client/     # Hono RPC client (type-safe)
    i18n/
```

## Points d'entree

- `src/server/index.ts` : serveur Hono, montage `/api` et SSR.
- `src/server/api.ts` : composition des routes API.
- `src/front/entry-server.tsx` : rendu SSR via TanStack Router.
- `src/front/entry-client.tsx` : hydratation client.
- `src/front/router.ts` : Router + QueryClient + integration SSR.

## Flux SSR (resume)

1. Requete HTTP -> Hono (`src/server/index.ts`).
2. `/api/*` -> routes API.
3. Sinon -> SSR (`src/front/entry-server.tsx`).
4. Loaders + prefetch TanStack Query -> HTML rendu.
5. Hydratation client avec cache precharge.

## Regles d'import (detaillees)

OK :

- `src/server/` -> `src/shared/`
- `src/front/` -> `src/shared/`
- `src/shared/` -> `src/shared/`

NO :

- `src/server/` -> `src/front/`
- `src/front/` -> `src/server/`
- `src/shared/` -> `src/server/` ou `src/front/`

## Pourquoi cette architecture

- Responsabilites claires (backend / front / partage).
- SSR propre et isole du runtime client.
- Reutilisation du code commun sans fuite Node/React.
- Moins d'imports croises et de couplage.

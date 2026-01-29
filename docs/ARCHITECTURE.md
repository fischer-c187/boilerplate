# Architecture

Ce projet est organise autour de trois couches isomorphiques :

- `src/server/` : backend Hono (API, services, DB, middleware).
- `src/front/` : UI React + SSR (routes, components, features).
- `src/shared/` : code partage (client RPC, i18n, types).

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

## Regles d'import (simples)

- `src/server/` et `src/front/` peuvent importer `src/shared/`.
- `src/shared/` ne depend jamais de `src/server/` ni `src/front/`.

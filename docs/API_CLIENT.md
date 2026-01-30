# RPC client (Hono) + erreurs API

## But

Expliquer l'usage du client RPC Hono (`hc`) cote front/SSR et la forme des erreurs renvoyees par l'API.

## Ou ca vit

- Client RPC : `src/shared/api-client/client.ts`
- Types API (Hono) : `src/server/api.ts` (export `AppType`)
- Erreurs API : `src/server/lib/errors.ts`, `src/server/api/stripe.ts`, `src/server/middleware/auth.ts`

## Utilisation du client RPC

Le client Hono est typé a partir de `AppType` et expose les routes `/api/*`.
La base URL depend du contexte :

- SSR (serveur) : `process.env.API_URL` ou `http://localhost:3000`
- Navigateur : URL relative (`''`) pour reutiliser l'origine

Exemple (appel simple) :

```ts
import { client } from '@/shared/api-client/client'

export const getPlans = async () => {
  const res = await client.stripe.plans.$get()
  if (!res.ok) {
    throw new Error('Failed to get plans')
  }
  return res.json()
}
```

## Format des erreurs API

Conventions observees :

- Enveloppe d'erreur :
  - `error.code` (string)
  - `error.message` (string)
  - `error.details` (optionnel)
- Codes HTTP alignes sur `AppError.statusCode` quand l'erreur en est une.

Exemples actuels :

- `requireAuth` renvoie `{ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }` avec HTTP 401.
- Les routes Stripe utilisent un helper `formatError` :
  - `AppError` -> `{ error: { code, message, details } }`
  - Fallback -> `{ error: { code: 'INTERNAL_ERROR', message } }`

Note : ce format est applique sur les routes Stripe et l'auth middleware, mais il n'est pas encore centralise sur toute l'API.

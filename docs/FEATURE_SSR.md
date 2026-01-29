# Feature: SSR

## But

Rendu serveur avec TanStack Router + TanStack Query, puis hydratation client.

## Ou ca vit

- SSR : `src/front/entry-server.tsx`
- Hydratation client : `src/front/entry-client.tsx`
- Router + QueryClient : `src/front/router.ts`

## Utilisation (routes)

Pour les donnees critiques en SSR :

1. Prefetch dans le loader avec `ensureQueryData`.
2. Lire les donnees avec `useSuspenseQuery`.

Exemple (voir `src/front/api/example.query.ts`) :

```ts
export const testQueryOptions = queryOptions({
  queryKey: ['example'],
  queryFn: () => getTest(),
})
```

Et dans la route :

```ts
export const Route = createFileRoute('/example')({
  loader: ({ context }) => context.queryClient.ensureQueryData(testQueryOptions),
})
```

## Notes

- L'integration SSR Query est faite via `setupRouterSsrQueryIntegration`.
- Guide detaille : `docs/TANSTACK_QUERY_SSR_GUIDE.md`.

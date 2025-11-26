# Guide TanStack Query + TanStack Router SSR

Guide complet pour comprendre et utiliser TanStack Query avec TanStack Router en mode SSR (Server-Side Rendering).

---

## 📚 Table des matières

1. [Architecture générale](#architecture-générale)
2. [Les 4 fonctions principales](#les-4-fonctions-principales)
3. [useQuery vs useSuspenseQuery](#usequery-vs-usesuspensequery)
4. [Gestion des erreurs](#gestion-des-erreurs)
5. [Suspense boundaries](#suspense-boundaries)
6. [Patterns recommandés](#patterns-recommandés)
7. [Exemples complets](#exemples-complets)

---

## Architecture générale

### Structure des fichiers

```
src/
  shared/
    api-client/              # Client RPC (isomorphic)
      client.ts              → Configuration Hono RPC
      products.api.ts        → Fonctions API pures
      users.api.ts

  front/
    lib/
      queryClient.ts         → QueryClient centralisé
    api/                     # React Query hooks
      products.query.ts      → Hooks et queryOptions
      users.query.ts
    routes/                  # Routes TanStack Router
      products/
        $id.tsx              → Route avec loader
    components/
      ErrorBoundary.tsx      → Error boundary réutilisable
      ErrorFallback.tsx      → UI d'erreur
```

### Flow SSR complet

```
1. User visite /products/123
   ↓
2. Serveur : Loader s'exécute
   context.queryClient.ensureQueryData(productQueryOptions('123'))
   → Fetch le produit
   → Met en cache
   ↓
3. Serveur : Composant rend
   useSuspenseQuery(productQueryOptions('123'))
   → Lit le cache
   → data existe !
   ↓
4. Serveur : HTML généré
   <h1>iPhone 15</h1>
   <p>999€</p>
   ↓
5. Client : Reçoit HTML avec données
   ↓
6. Client : Hydrate
   useSuspenseQuery → lit cache (hydraté)
   → Pas de re-fetch
   ↓
7. Utilisateur voit les données immédiatement ✅
```

---

## Les 4 fonctions principales

### 1. `useQuery` - Hook pour données optionnelles (client-only)

```typescript
function Reviews({ productId }: { productId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(productId),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{data.reviews.map(...)}</div>
}
```

**Caractéristiques :**

- ✅ Hook React (uniquement dans composants)
- ✅ Gère loading/error automatiquement
- ❌ **Ne fonctionne PAS en SSR** (données fetchées côté client uniquement)
- ⚠️ `data` peut être `undefined`

**Quand utiliser :**

- Données **non critiques** pour le rendu initial
- Widgets optionnels
- Données en temps réel (polling)

---

### 2. `useSuspenseQuery` - Hook pour données garanties (SSR)

```typescript
function ProductDetails({ id }: { id: string }) {
  const { data } = useSuspenseQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
  })

  // ✅ data est TOUJOURS défini (jamais undefined)
  return <div>{data.name}</div>  // Pas de "?"
}
```

**Caractéristiques :**

- ✅ Hook React (uniquement dans composants)
- ✅ **Fonctionne en SSR** (suspend le render jusqu'à data)
- ✅ **`data` garanti** (jamais `undefined`, pas besoin de `?.`)
- ✅ Utilise React Suspense

**Quand utiliser :**

- Données **critiques** pour le rendu initial
- Données **SSR** (doivent être dans le HTML)
- Pages principales, sections importantes

---

### 3. `ensureQueryData` - Fonction pour pre-fetching

```typescript
export const Route = createFileRoute('/products/$id')({
  loader: ({ context, params }) => {
    // ✅ Pre-fetch côté serveur OU client
    return context.queryClient.ensureQueryData({
      queryKey: ['product', params.id],
      queryFn: () => fetchProduct(params.id),
    })
  },
})
```

**Caractéristiques :**

- ✅ Fonction impérative (pas un hook)
- ✅ Fonctionne **côté serveur ET client**
- ✅ **Vérifie le cache d'abord** : si data existe → retourne, sinon → fetch
- ✅ Met en cache pour les composants

**Quand utiliser :**

- Dans les **loaders** TanStack Router
- Pour **pre-fetcher** avant le rendu
- En SSR (côté serveur)

---

### 4. `fetchQuery` - Fonction pour fetching forcé

```typescript
async function handleRefreshButton() {
  // Force un nouveau fetch (ignore cache)
  const data = await queryClient.fetchQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
  })

  console.log(data)
}
```

**Caractéristiques :**

- ✅ Fonction impérative (pas un hook)
- ✅ Fonctionne **côté serveur ET client**
- ❌ **Ne vérifie PAS le cache** : fetch TOUJOURS
- ✅ Met en cache après le fetch

**Quand utiliser :**

- Forcer un refresh (ignorer le cache)
- Event handlers
- Scripts / fonctions utilitaires

---

## Tableau comparatif

| Aspect             | `useQuery` | `useSuspenseQuery` | `ensureQueryData` | `fetchQuery`         |
| ------------------ | ---------- | ------------------ | ----------------- | -------------------- |
| **Type**           | Hook React | Hook React         | Fonction          | Fonction             |
| **Où utiliser**    | Composants | Composants         | Loaders, serveur  | Partout              |
| **SSR**            | ❌ Non     | ✅ Oui             | ✅ Oui            | ✅ Oui               |
| **Vérifie cache**  | ✅ Oui     | ✅ Oui             | ✅ Oui            | ❌ Non (force fetch) |
| **Loading state**  | ✅ Oui     | ❌ Suspend         | ❌ Non            | ❌ Non               |
| **`data` garanti** | ❌ Non     | ✅ Oui             | ✅ Oui            | ✅ Oui               |
| **Auto re-fetch**  | ✅ Oui     | ✅ Oui             | ❌ Non            | ❌ Non               |

---

## useQuery vs useSuspenseQuery

### Problème avec `useQuery` en SSR

```typescript
// ❌ Avec useQuery
export const Route = createFileRoute('/products/$id')({
  loader: ({ context, params }) => {
    // Loader fetch les données
    return context.queryClient.ensureQueryData({
      queryKey: ['product', params.id],
      queryFn: () => fetchProduct(params.id),
    })
  },
  component: ProductPage,
})

function ProductPage() {
  const { id } = Route.useParams()

  // ❌ useQuery ne lit PAS le cache en SSR !
  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
  })

  if (isLoading) return <div>Loading...</div>
  return <div>{data?.name}</div>
}
```

**Problème :**

- ✅ Loader fetch les données côté serveur
- ❌ **MAIS** `useQuery` retourne `isLoading = true` en SSR
- ❌ HTML contient "Loading..." au lieu des vraies données
- ❌ Client re-fetch les données (doublon)

**HTML généré :**

```html
<div>Loading...</div>
```

---

### Solution avec `useSuspenseQuery`

```typescript
// ✅ Avec useSuspenseQuery
export const Route = createFileRoute('/products/$id')({
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      productQueryOptions(params.id)
    )
  },
  component: ProductPage,
})

function ProductPage() {
  const { id } = Route.useParams()

  // ✅ useSuspenseQuery lit le cache en SSR
  const { data } = useSuspenseQuery(productQueryOptions(id))

  return <div>{data.name}</div>
}
```

**Avantages :**

- ✅ Loader fetch les données côté serveur
- ✅ `useSuspenseQuery` lit le cache immédiatement
- ✅ HTML contient les vraies données
- ✅ Pas de re-fetch côté client

**HTML généré :**

```html
<div>iPhone 15</div>
```

---

## Gestion des erreurs

### Problème : `useSuspenseQuery` ne retourne pas `error`

```typescript
// ❌ Ça ne marche PAS
const { data, error } = useSuspenseQuery(...)

if (error) return <div>Error!</div>  // ← error n'existe pas !
```

**Pourquoi ?** `useSuspenseQuery` utilise **React Error Boundaries** !

---

### Solution 1 : Error Boundary globale (route)

```typescript
// front/routes/products/$id.tsx
export const Route = createFileRoute('/products/$id')({
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      productQueryOptions(params.id)
    )
  },
  // ✅ Error Boundary au niveau route
  errorComponent: ({ error, reset }) => (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">Failed to load</h1>
      <p className="text-gray-700 my-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Retry
      </button>
    </div>
  ),
  component: ProductPage,
})
```

**Problème :** Si une erreur survient, **toute la page disparaît** ! Même pour un petit widget.

---

### Solution 2 : Error Boundaries locales (granulaires)

```typescript
import { ErrorBoundary } from '@/front/components/ErrorBoundary'
import { ErrorFallback } from '@/front/components/ErrorFallback'

function ProductPage() {
  const { id } = Route.useParams()

  return (
    <div className="container mx-auto p-6">
      {/* ✅ Error Boundary pour le produit principal */}
      <ErrorBoundary
        fallback={(error, reset) => (
          <ErrorFallback error={error} reset={reset} size="lg" />
        )}
      >
        <ProductDetails id={id} />
      </ErrorBoundary>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ Error Boundary pour les reviews (widget) */}
        <ErrorBoundary
          fallback={(error, reset) => (
            <ErrorFallback error={error} reset={reset} size="sm" />
          )}
        >
          <Reviews productId={id} />
        </ErrorBoundary>

        {/* ✅ Error Boundary pour les recommendations */}
        <ErrorBoundary
          fallback={(error, reset) => (
            <ErrorFallback error={error} reset={reset} size="sm" />
          )}
        >
          <Recommendations productId={id} />
        </ErrorBoundary>
      </div>
    </div>
  )
}
```

**Avantages :**

- ✅ Si Reviews échoue, le produit et recommendations fonctionnent toujours
- ✅ Isolation parfaite des erreurs
- ✅ UX bien meilleure

---

### Solution 3 : `useQuery` pour widgets (pas d'Error Boundary)

```typescript
function Reviews({ productId }: { productId: string }) {
  // ✅ useQuery avec gestion manuelle
  const { data, isLoading, error } = useQuery(reviewsQueryOptions(productId))

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4" />
        <div className="h-4 bg-gray-200 rounded" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
        <p className="text-red-600 font-semibold">Failed to load reviews</p>
        <p className="text-sm text-red-500">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
      {data.reviews.map(review => (
        <div key={review.id}>{review.comment}</div>
      ))}
    </div>
  )
}
```

**Avantages :**

- ✅ Plus simple (pas besoin d'Error Boundary)
- ✅ Gestion d'erreur personnalisée
- ✅ Loading states visibles

---

## Suspense boundaries

### Quand utiliser `<Suspense>` ?

| Scénario                         | Besoin de `<Suspense>` ? | Raison                      |
| -------------------------------- | ------------------------ | --------------------------- |
| **Loader + useSuspenseQuery**    | ❌ Non                   | Data déjà en cache          |
| **useSuspenseQuery sans loader** | ✅ Oui                   | Data pas en cache → suspend |
| **Widgets non critiques**        | ✅ Oui (recommandé)      | Évite de bloquer la page    |

---

### Pattern 1 : Avec loader (pas de `<Suspense>`)

```typescript
export const Route = createFileRoute('/products/$id')({
  // ✅ Loader pre-fetch
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      productQueryOptions(params.id)
    )
  },
  component: ProductPage,
})

function ProductPage() {
  const { id } = Route.useParams()

  // ✅ Pas de <Suspense> nécessaire (data pré-fetchée)
  const { data } = useSuspenseQuery(productQueryOptions(id))

  return <div>{data.name}</div>
}
```

**Pourquoi ça marche sans `<Suspense>` ?**

- Loader a déjà fetché les données
- Cache rempli **avant** le render
- `useSuspenseQuery` lit le cache → pas de suspend !

---

### Pattern 2 : Sans loader, avec `<Suspense>`

```typescript
import { Suspense } from 'react'

function ProductPage() {
  const { id } = Route.useParams()

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent id={id} />
    </Suspense>
  )
}

function ProductContent({ id }: { id: string }) {
  // ✅ Si data pas en cache → suspend → affiche fallback
  const { data } = useSuspenseQuery(productQueryOptions(id))

  return <div>{data.name}</div>
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-24" />
    </div>
  )
}
```

---

### Pattern 3 : Widgets avec `<Suspense>` (recommandé)

```typescript
function ProductPage() {
  const { id } = Route.useParams()

  return (
    <div className="container mx-auto p-6">
      {/* Produit principal : pas de Suspense (pré-fetché) */}
      <ProductDetails id={id} />

      {/* Widgets : avec Suspense (pas pré-fetchés) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<WidgetSkeleton title="Reviews" />}>
          <Reviews productId={id} />
        </Suspense>

        <Suspense fallback={<WidgetSkeleton title="Recommendations" />}>
          <Recommendations productId={id} />
        </Suspense>
      </div>
    </div>
  )
}

function WidgetSkeleton({ title }: { title: string }) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  )
}
```

---

## Patterns recommandés

### Stratégie par type de composant

| Type                   | Hook               | Error Boundary    | Suspense | Raison                     |
| ---------------------- | ------------------ | ----------------- | -------- | -------------------------- |
| **Page principale**    | `useSuspenseQuery` | Route             | ❌ Non   | Critique pour SEO          |
| **Section importante** | `useSuspenseQuery` | Locale            | ❌ Non   | Isole les erreurs          |
| **Widget optionnel**   | `useQuery`         | ❌ Non (manuelle) | ✅ Oui   | Plus simple                |
| **Real-time data**     | `useQuery`         | ❌ Non            | ✅ Oui   | Polling ne doit pas casser |

---

### Pattern complet recommandé

```typescript
// front/api/products.query.ts
import { queryOptions, useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { productsApi } from '@/shared/api-client/products.api'

export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
  })

export const reviewsQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['reviews', id],
    queryFn: () => productsApi.getReviews(id),
  })

// Hook pour données critiques (SSR)
export const useProduct = (id: string) => {
  return useSuspenseQuery(productQueryOptions(id))
}

// Hook pour données optionnelles (client-only)
export const useReviews = (id: string) => {
  return useQuery(reviewsQueryOptions(id))
}
```

```typescript
// front/routes/products/$id.tsx
import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { productQueryOptions, useProduct, useReviews } from '@/front/api/products.query'

export const Route = createFileRoute('/products/$id')({
  // ✅ Pre-fetch seulement les données critiques
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      productQueryOptions(params.id)
    )
  },
  // ✅ Error Boundary au niveau route
  errorComponent: ({ error, reset }) => (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-red-600">Failed to load product</h1>
      <p className="my-4">{error.message}</p>
      <button onClick={reset} className="btn btn-primary">Retry</button>
    </div>
  ),
  component: ProductPage,
})

function ProductPage() {
  const { id } = Route.useParams()

  return (
    <div className="container mx-auto p-6">
      {/* ✅ Données critiques (useSuspenseQuery, pré-fetchées) */}
      <ProductDetails id={id} />

      {/* ✅ Widgets non critiques (useQuery avec Suspense) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<WidgetSkeleton title="Reviews" />}>
          <Reviews productId={id} />
        </Suspense>

        <Suspense fallback={<WidgetSkeleton title="Recommendations" />}>
          <Recommendations productId={id} />
        </Suspense>
      </div>
    </div>
  )
}

// ✅ Données critiques : useSuspenseQuery (SSR)
function ProductDetails({ id }: { id: string }) {
  const { data } = useProduct(id)

  return (
    <div>
      <h1 className="text-4xl font-bold">{data.name}</h1>
      <p className="text-2xl text-green-600">{data.price}€</p>
      <p className="mt-4">{data.description}</p>
    </div>
  )
}

// ✅ Widget optionnel : useQuery (client-only)
function Reviews({ productId }: { productId: string }) {
  const { data, isLoading, error } = useReviews(productId)

  if (isLoading) return <WidgetSkeleton title="Reviews" />

  if (error) {
    return (
      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
        <h2 className="text-xl font-bold mb-2 text-red-600">Reviews</h2>
        <p className="text-red-600">Failed to load reviews</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
      {data.reviews.map(review => (
        <div key={review.id} className="mb-3">
          <p className="font-semibold">{review.author}</p>
          <p className="text-gray-600">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## Exemples complets

### Exemple 1 : Page produit simple

```typescript
// shared/api-client/products.api.ts
export const productsApi = {
  getById: async (id: string) => {
    const res = await client.products[':id'].$get({ param: { id } })
    if (!res.ok) throw new Error('Failed to fetch product')
    return res.json()
  },
}

// front/api/products.query.ts
export const productQueryOptions = (id: string) => queryOptions({
  queryKey: ['product', id],
  queryFn: () => productsApi.getById(id),
})

export const useProduct = (id: string) => {
  return useSuspenseQuery(productQueryOptions(id))
}

// front/routes/products/$id.tsx
export const Route = createFileRoute('/products/$id')({
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      productQueryOptions(params.id)
    )
  },
  component: ProductPage,
})

function ProductPage() {
  const { id } = Route.useParams()
  const { data } = useProduct(id)

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.price}€</p>
    </div>
  )
}
```

---

### Exemple 2 : Page avec widgets

```typescript
// front/routes/products/$id.tsx
import { Suspense } from 'react'

export const Route = createFileRoute('/products/$id')({
  loader: ({ context, params }) => {
    // Pre-fetch seulement le produit (critique)
    return context.queryClient.ensureQueryData(
      productQueryOptions(params.id)
    )
  },
  component: ProductPage,
})

function ProductPage() {
  const { id } = Route.useParams()

  return (
    <div className="container mx-auto p-6">
      {/* Produit principal (SSR) */}
      <ProductDetails id={id} />

      {/* Widgets (client-side) */}
      <div className="mt-8 space-y-6">
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews productId={id} />
        </Suspense>

        <Suspense fallback={<RecommendationsSkeleton />}>
          <Recommendations productId={id} />
        </Suspense>
      </div>
    </div>
  )
}

function ProductDetails({ id }: { id: string }) {
  const { data } = useSuspenseQuery(productQueryOptions(id))
  return <div>{data.name}</div>
}

function Reviews({ productId }: { productId: string }) {
  const { data, isLoading, error } = useQuery(reviewsQueryOptions(productId))

  if (isLoading) return <ReviewsSkeleton />
  if (error) return <ErrorMessage error={error} />

  return <div>{data.reviews.map(...)}</div>
}
```

---

### Exemple 3 : Gestion d'erreur granulaire

```typescript
import { ErrorBoundary } from '@/front/components/ErrorBoundary'
import { ErrorFallback } from '@/front/components/ErrorFallback'

function ProductPage() {
  const { id } = Route.useParams()

  return (
    <div className="container mx-auto p-6">
      {/* Error Boundary pour section critique */}
      <ErrorBoundary
        fallback={(error, reset) => (
          <div className="min-h-screen flex items-center justify-center">
            <ErrorFallback error={error} reset={reset} size="lg" />
          </div>
        )}
      >
        <ProductDetails id={id} />
      </ErrorBoundary>

      {/* Error Boundaries pour widgets */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <ErrorBoundary
          fallback={(error, reset) => (
            <ErrorFallback error={error} reset={reset} size="sm" />
          )}
        >
          <Suspense fallback={<WidgetSkeleton />}>
            <Reviews productId={id} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary
          fallback={(error, reset) => (
            <ErrorFallback error={error} reset={reset} size="sm" />
          )}
        >
          <Suspense fallback={<WidgetSkeleton />}>
            <Recommendations productId={id} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}
```

**Résultat :** Si Reviews échoue, le produit et recommendations continuent de fonctionner ! ✅

---

## Checklist

### ✅ Pour chaque route

- [ ] Définir `queryOptions` dans `front/api/*.query.ts`
- [ ] Créer hook `useSuspenseQuery` pour données critiques
- [ ] Créer hook `useQuery` pour données optionnelles
- [ ] Ajouter `loader` avec `ensureQueryData` pour pre-fetch SSR
- [ ] Ajouter `errorComponent` au niveau route
- [ ] Wrapper widgets avec `<Suspense>` + fallback
- [ ] Ajouter Error Boundaries locales si nécessaire

### ✅ Pour chaque API

- [ ] Fonction pure dans `shared/api-client/*.api.ts`
- [ ] Export `queryOptions` dans `front/api/*.query.ts`
- [ ] Hook `useSuspenseQuery` pour données SSR
- [ ] Hook `useQuery` pour données optionnelles

---

## Ressources

- [TanStack Query SSR Guide](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [TanStack Router + Query Integration](https://tanstack.com/router/latest/docs/integrations/query)
- [React Suspense Documentation](https://react.dev/reference/react/Suspense)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

## TL;DR

1. **Données critiques (SSR)** → `useSuspenseQuery` + loader pre-fetch
2. **Widgets optionnels** → `useQuery` + gestion manuelle ou `<Suspense>`
3. **Toujours** utiliser `ensureQueryData` dans les loaders
4. **Error Boundaries** granulaires pour isoler les erreurs
5. **`<Suspense>`** pour widgets non pré-fetchés

🚀 **Résultat** : SSR performant avec données, UX optimale, isolation des erreurs !

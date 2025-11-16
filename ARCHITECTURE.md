# **ARCHITECTURE**

Ce projet utilise une architecture **isomorphique moderne** composée de trois couches distinctes :

- **server/** : backend applicatif (Hono)
- **front/** : interface utilisateur + SSR React (hébergé par Hono mais séparé logiquement)
- **shared/** : logique commune (types, schémas, services métier, API client)

Cette séparation garantit un code clair, robuste et évolutif, tout en permettant un rendu SSR performant et un frontend dynamique alimenté par une API Hono.

---

## **1. Structure générale**

```
src/
  server/                ← backend strict
    api/
      user.ts
      auth.ts
      posts.ts
    db/
    middlewares/
    index.ts
    router.ts

  front/                 ← logique React (SSR + client)
    routes/              ← TanStack Router
      index.tsx
      user/
        profile.tsx
    components/
    features/            ← UI + hooks UI (jamais de logique métier ici)
    layouts/
    entry-client.tsx     ← hydrateRoot (client)
    entry-server.tsx     ← SSR entry

  shared/                ← code utilisé par front ET server
    domain/
      user/
        user.schema.ts
        user.types.ts
    services/
      user/
        getUser.ts
        updateUser.ts
    api-client/          ← React Query + Hono client
      user.query.ts
    utils/
      dates.ts
      format.ts

```

Chaque dossier a des responsabilités strictes.

---

## **2. Couche SERVER — Backend Hono**

`server/` contient exclusivement la logique backend :

- Routes API REST (`server/api/*`)
- Middlewares Hono
- Sécurité, CORS, compressions, headers
- Accès à la base de données
- Services backend internes
- Configuration du serveur HTTP (Hono)
- Export du routeur backend (`server/router.ts`)
- Bootstrapping backend (`server/index.ts`)

**Contraintes :**

- `server/` ne doit jamais importer du code UI.
- `server/` ne doit jamais importer `api-client`.
- `server/` peut utiliser `shared/domain`, `shared/services` et `shared/utils`.

---

## **3. Couche FRONT — UI React + SSR**

`front/` contient tout ce qui concerne le rendu React :

- `entry-client.tsx` : hydratation côté client
- `entry-server.tsx` : rendu SSR via TanStack Router
- `router.ts` : configuration du routeur front
- `routeTree.gen.ts` : arbre des routes auto-généré
- `routes/` : pages + loaders + actions
- `components/` : composants UI
- `features/` : blocs UI complets (UI + logique UI)
- `layouts/` : layouts et structures visuelles

**Contraintes :**

- `front/` ne doit jamais importer `server/`.
- `front/` peut importer tout ce qui est dans `shared/`.
- `front/` ne contient aucune logique backend (pas de DB, pas de middlewares).
- `front/` contient la logique de routing et de rendu → pas la logique métier.

---

## **4. Couche SHARED — Code commun isomorphique**

`shared/` est une couche neutre importable à la fois :

- par le front (SSR + client)
- par le backend Hono

Elle regroupe tout ce qui est **métier**, **structure**, ou **accès API**.

**Contenu :**

### 4.1 Domain (shared/domain)

- Types TypeScript (User, Product, etc.)
- Schémas Zod
- DTO
- Mappers simples
- Aucune dépendance UI ou réseau

### 4.2 Services métier (shared/services)

- Logique métier pure (calculs, permissions, règles)
- Sans dépendance réseau ou UI
- Exécutables côté serveur et côté frontend

### 4.3 API client (shared/api-client)

- Client Hono typé
- Appels API REST
- Hooks React Query
- Prefetch SSR
- Connexion entre front et backend

### 4.4 Utils / Constants

- Helpers isomorphiques
- Formatters
- Constantes métier

**Contraintes :**

- `shared/` ne doit pas importer `front/` ou `server/`.
- `shared/` reste totalement neutre : compatible SSR + client.
- `shared/` forme la source de vérité métier.

---

## **5. Flux SSR**

### 1. Le navigateur demande une page `/user/profile`

### 2. Hono reçoit la requête

- Applique middlewares (sécurité, CORS, cookies)
- Route `/api/*` → backend
- Sinon → SSR front

### 3. React SSR (TanStack) exécute :

- Loaders
- Prefetch React Query
- API client Hono via `shared/api-client`
- Rendu du HTML

### 4. Retour du HTML au navigateur

### 5. Hydratation React côté client

### 6. Reprise du cache React Query préchargé

---

## **6. Règles strictes d’import**

### server/ peut importer :

- shared/domain
- shared/services
- shared/utils

### front/ peut importer :

- shared/domain
- shared/services
- shared/api-client
- shared/utils

### shared/ NE peut importer que :

- shared/\*

Jamais :

- front/\*
- server/\*

---

## **7. Pourquoi cette architecture ?**

- Clarifie les responsabilités (backend / front / métier)
- Évite les imports circulaires
- Rend SSR propre et isolé
- Permet au front SSR d’appeler proprement l’API backend
- Permet une séparation stricte entre accès DB (server) et UI (front)
- Shared garantit une seule source de vérité pour le domaine
- Scalabilité naturelle du projet
- Conforme aux standards modernes (Next App Router, Remix, TanStack Start)

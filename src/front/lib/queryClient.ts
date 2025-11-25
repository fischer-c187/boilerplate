import { QueryClient } from '@tanstack/react-query'

/**
 * Configuration par défaut pour le QueryClient
 */
const queryConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 1000 * 60 * 60 * 24, // 24 heures
      refetchOnWindowFocus: false,
      retry: false, // Pas de retry (surtout pour SSR)
    },
  },
}

/**
 * Crée un nouveau QueryClient avec la config par défaut
 */
export function makeQueryClient() {
  return new QueryClient(queryConfig)
}

/**
 * Variable pour stocker le QueryClient côté navigateur (singleton)
 */
let browserQueryClient: QueryClient | undefined = undefined

/**
 * Récupère le QueryClient approprié selon l'environnement
 *
 * - SSR (serveur) : Crée un nouveau client par requête (isolation)
 * - Client (navigateur) : Réutilise le même client (singleton)
 */
export function getQueryClient() {
  // Côté serveur : nouveau client par requête HTTP
  if (typeof window === 'undefined') {
    return makeQueryClient()
  }

  // Côté client : singleton réutilisé pendant toute la session
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}

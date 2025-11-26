import type { AppType } from '@/server/api'
import { hc } from 'hono/client'

// Détermine la base URL selon l'environnement
function getBaseURL() {
  // Côté serveur (SSR)
  if (typeof window === 'undefined') {
    // En production, utiliser une variable d'environnement
    return process.env.API_URL || 'http://localhost:3000'
  }
  // Côté client (navigateur)
  return '' // URL relative fonctionne
}

export const client = hc<AppType>(getBaseURL() + '/api')

export const getTest = async () => {
  const res = await client.test.$get()
  if (!res.ok) {
    throw new Error('Failed to get test')
  }
  return res.json()
}

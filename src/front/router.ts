import type { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { getQueryClient } from './lib/queryClient'
import { routeTree } from './routeTree.gen'

export type RouterContext = {
  head: string
  queryClient: QueryClient
}

export function createRouter() {
  // Récupère le QueryClient approprié (nouveau en SSR, singleton en client)
  const queryClient = getQueryClient()

  const router = createTanstackRouter({
    routeTree,
    context: {
      head: '',
      queryClient,
    },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}

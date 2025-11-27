import type { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import type { i18n } from 'i18next'
import { getQueryClient } from './lib/queryClient'
import { routeTree } from './routeTree.gen'

export type RouterContext = {
  head: string
  queryClient: QueryClient
  i18n: i18n
}

export function createRouter(i18nInstance: i18n) {
  const queryClient = getQueryClient()

  const router = createTanstackRouter({
    routeTree,
    context: {
      head: '',
      queryClient,
      i18n: i18nInstance,
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

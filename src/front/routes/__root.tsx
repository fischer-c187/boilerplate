import Header from '@/front/components/Header'
import { clientEnv } from '@/front/config/env.client'
import appCss from '@/front/index.css?url'
import type { RouterContext } from '@/front/router'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'
import { scan } from 'react-scan'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: appCss },
    ],
    meta: [
      {
        title: 'TanStack Router SSR Basic File Based Streaming',
      },
      {
        charSet: 'UTF-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
    ],
    scripts: [
      ...(!clientEnv.PROD
        ? [
            {
              type: 'module',
              children: `import RefreshRuntime from "/@react-refresh"
  								RefreshRuntime.injectIntoGlobalHook(window)
  								window.$RefreshReg$ = () => {}
  								window.$RefreshSig$ = () => (type) => type
  								window.__vite_plugin_react_preamble_installed__ = true`,
            },
            {
              type: 'module',
              src: '/@vite/client',
            },
          ]
        : []),
      {
        type: 'module',
        src: clientEnv.PROD ? '/assets/entry-client.js' : '/src/front/entry-client.tsx',
      },
    ],
  }),
  notFoundComponent: () => (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Page not found</h1>
          </div>
        </div>
      </body>
    </html>
  ),
  errorComponent: ({ error }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{error?.message || 'An unexpected error occurred'}</p>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      </body>
    </html>
  ),
  component: RootComponent,
})

function RootComponent() {
  useEffect(() => {
    // Make sure to run this only after hydration
    scan({
      enabled: true,
    })
  }, [])
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}

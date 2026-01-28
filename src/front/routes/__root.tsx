import { Navigation } from '@/front/components/Navigation'
import { Toaster } from '@/front/components/ui/sonner'
import appCss from '@/front/index.css?url'
import { buildSeoMeta } from '@/front/lib/seo'
import type { RouterContext } from '@/front/router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { scan } from 'react-scan'
import { Footer } from '../components/Footer'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
    meta: buildSeoMeta(),
    scripts: [
      ...(!import.meta.env.PROD
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
        src: import.meta.env.PROD ? '/assets/entry-client.js' : '/src/front/entry-client.tsx',
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
  component: RootComponent,
})

function NotFoundPage() {
  const { i18n } = Route.useRouteContext()
  return (
    <I18nextProvider i18n={i18n}>
      <html lang={i18n.language}>
        <body>
          <div className="min-h-screen flex items-center justify-center bg-red-50">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Page not found</h1>
            </div>
          </div>
        </body>
      </html>
    </I18nextProvider>
  )
}

function ErrorPage({ error }: { error?: Error }) {
  const { i18n } = Route.useRouteContext()
  return (
    <I18nextProvider i18n={i18n}>
      <html lang={i18n.language}>
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="min-h-screen flex items-center justify-center bg-red-50">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
              <p className="text-gray-600 mb-4">
                {error?.message || 'An unexpected error occurred'}
              </p>
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
    </I18nextProvider>
  )
}

function RootComponent() {
  const { i18n } = Route.useRouteContext()

  useEffect(() => {
    // Only run react-scan on client side
    if (typeof window !== 'undefined' && !import.meta.env.PROD) {
      scan({
        enabled: true,
      })
    }
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <html lang={i18n.language} className="scroll-smooth">
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="min-h-screen flex flex-col">
            <header>
              <Navigation />
            </header>
            <Outlet />
            <Footer />
            {!import.meta.env.PROD && (
              <>
                <TanStackRouterDevtools position="bottom-right" />
                <ReactQueryDevtools />
              </>
            )}
            <Scripts />
          </div>
          <Toaster />
        </body>
      </html>
    </I18nextProvider>
  )
}

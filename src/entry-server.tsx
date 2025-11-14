import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import {
  createRequestHandler,
  renderRouterToString,
  RouterServer,
} from '@tanstack/react-router/ssr/server'
import 'dotenv/config'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import testApi from './api/test/test.ts'
import { createRouter } from './router.tsx'

const port = process.env.NODE_SERVER_PORT ? Number.parseInt(process.env.NODE_SERVER_PORT, 10) : 3000
const host = process.env.NODE_SERVER_HOST || 'localhost'

const app = new Hono()

// Security headers
app.use(secureHeaders())

// Logger
app.use(logger())

// CORS - configure via environment variable
const allowedOrigin = process.env.CORS_ORIGIN || '*'
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
)
// Setup API routes
app.route('/api', testApi)

// app.get('/test', testHandler)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(compress())

  app.use(
    '/*',
    serveStatic({
      root: './dist/client',
    })
  )
}

// Handle all other requests with TanStack Router
app.use('*', async (c) => {
  const handler = createRequestHandler({
    request: c.req.raw,
    createRouter: () => {
      const router = createRouter()
      router.update({
        context: {
          ...router.options.context,
        },
      })
      return router
    },
  })

  return await handler(({ responseHeaders, router }) => {
    return renderRouterToString({
      responseHeaders,
      router,
      children: <RouterServer router={router} />,
    })
  })
})

// Serve the app in production
if (process.env.NODE_ENV === 'production') {
  serve(
    {
      fetch: app.fetch,
      port: port,
      hostname: host,
    },
    (info) => {
      console.log(`Production server is running on http://${host}:${info.port}`)
    }
  )
}

export default app

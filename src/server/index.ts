import ssrRoute from '@/front/entry-server'
import apiApp from '@/server/api'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { env } from './config/env'

const port = env.NODE_SERVER_PORT
const host = env.NODE_SERVER_HOST || 'localhost'

const app = new Hono()

// Security headers
app.use(secureHeaders())

// Logger
app.use(logger())

// CORS - configure via environment variable
const allowedOrigin = env.CORS_ORIGIN || '*'
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
)

// Mount API routes under /api
app.route('/api', apiApp)

// Serve static files in production
if (env.NODE_ENV === 'production') {
  app.use(compress())

  app.use(
    '/*',
    serveStatic({
      root: './dist/client',
    })
  )
}

// SSR route (catch-all)
app.route('/', ssrRoute)

// Serve the app in production
if (env.NODE_ENV === 'production') {
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

import auth from '@/server/api/auth'
import mailApi from '@/server/api/mail'
import stripeApi from '@/server/api/stripe'
import testApi from '@/server/api/test'
import { Hono } from 'hono'

// Create API app separately for type inference (no SSR dependencies here)
const apiApp = new Hono()
  .route('/', testApi)
  .route('/', auth)
  .route('/', mailApi)
  .route('/', stripeApi)

export default apiApp
export type AppType = typeof apiApp

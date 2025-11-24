import {
  createRequestHandler,
  renderRouterToString,
  RouterServer,
} from '@tanstack/react-router/ssr/server'
import { Hono } from 'hono'
import { createRouter } from './router'

const ssrRoute = new Hono()

// Handle all SSR requests
ssrRoute.use('*', async (c) => {
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

export default ssrRoute

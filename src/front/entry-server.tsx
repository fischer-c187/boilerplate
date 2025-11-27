import { createI18n, detectLanguage } from '@/shared/i18n/config'
import {
  createRequestHandler,
  renderRouterToString,
  RouterServer,
} from '@tanstack/react-router/ssr/server'
import { Hono } from 'hono'
import { createRouter } from './router'

const ssrRoute = new Hono()

ssrRoute.use('*', async (c) => {
  const language = detectLanguage(c.req.raw)
  const i18nInstance = await createI18n(language)

  const handler = createRequestHandler({
    request: c.req.raw,
    createRouter: () => createRouter(i18nInstance),
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

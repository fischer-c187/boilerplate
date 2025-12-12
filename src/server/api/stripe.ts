import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { getAuthenticatedUser, requireAuth } from '../middleware/auth'
import stripeService from '../services/stripe'

const router = new Hono()
  .post('/stripe/test', requireAuth, (c) => {
    return c.json({ authenticated: true })
  })
  .post(
    '/stripe/checkout',
    requireAuth,
    zValidator(
      'json',
      z.object({
        lineItems: z.array(
          z.object({
            price_data: z.object({
              product_data: z.object({
                name: z.string(),
              }),
              unit_amount: z.number(),
              currency: z.string(),
            }),
            quantity: z.number(),
          })
        ),
      })
    ),
    async (c) => {
      const { lineItems } = c.req.valid('json')
      const session = await stripeService().createCheckoutSession(lineItems)
      if (!session) {
        return c.json({ error: 'Failed to create checkout session' }, 500)
      }
      return c.json(session)
    }
  )
  .post(
    '/stripe/checkout/subscription',
    requireAuth,
    zValidator(
      'json',
      z.object({
        priceId: z.string(),
      })
    ),
    async (c) => {
      const userSession = getAuthenticatedUser(c)
      const { priceId } = c.req.valid('json')
      const session = await stripeService().createSubscriptionCheckout(
        userSession.id,
        userSession.email,
        priceId,
        userSession.name || undefined
      )
      if (!session) {
        return c.json({ error: 'Failed to create subscription checkout' }, 500)
      }
      return c.json(session)
    }
  )
  .post('/stripe/portal', requireAuth, async (c) => {
    const userSession = getAuthenticatedUser(c)
    const session = await stripeService().createPortalSession(userSession.id)
    if (!session) {
      return c.json({ error: 'Failed to create portal session' }, 500)
    }
    return c.json(session)
  })
  .get('/stripe/subscription', requireAuth, async (c) => {
    const userSession = getAuthenticatedUser(c)
    const subscription = await stripeService().getUserSubscription(userSession.id)
    return c.json(subscription)
  })
  .get('/stripe/invoices', requireAuth, async (c) => {
    const userSession = getAuthenticatedUser(c)
    const invoices = await stripeService().getUserInvoices(userSession.id)
    return c.json(invoices)
  })
  .post('/stripe/webhook', async (c) => {
    const signature = c.req.header('stripe-signature')
    const body = await c.req.text()
    if (!signature || !body) {
      return c.json({ error: 'No signature or body' }, 200)
    }
    try {
      const event = stripeService().verifyWebhookSignature(signature, body)
      const shouldProcess = await stripeService().processWebhookEvent(event)
      if (!shouldProcess) {
        return c.json({ received: true, message: 'Already processed' })
      }
      return c.json({ received: true })
    } catch {
      return c.json({ error: 'Failed to verify webhook signature' }, 200)
    }
  })
export default router

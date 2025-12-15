import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import type Stripe from 'stripe'
import { z } from 'zod'
import { getAuthenticatedUser, requireAuth } from '../middleware/auth'
import stripeService from '../services/stripe'

const router = new Hono()
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
      return c.json({ error: 'Failed to create portal session' }, 404)
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
      // we need to return 200 to avoid stripe retries
      return c.json({ error: 'No signature or body' }, 400)
    }
    let event: Stripe.Event | null = null
    try {
      event = stripeService().verifyWebhookSignature(signature, body)
    } catch (error) {
      console.error('Failed to verify webhook signature', error)
      // we need to return 200 to avoid stripe retries
      return c.json({ error: 'Failed to verify webhook signature' }, 400)
    }
    try {
      const shouldProcess = await stripeService().processWebhookEvent(event)
      if (!shouldProcess) {
        return c.json({ received: true, message: 'Already processed' })
      }
      return c.json({ received: true })
    } catch (error) {
      console.error('Failed to process webhook event', error)
      // we need to return 200 to avoid stripe retries
      return c.json({ error: 'Failed to process webhook event' }, 200)
    }
  })
export default router

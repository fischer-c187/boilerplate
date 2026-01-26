import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import type Stripe from 'stripe'
import { z } from 'zod'
import db from '../adaptaters/db/postgres'
import { plans } from '../adaptaters/db/schema/stripe-schema'
import { AppError } from '../lib/errors'
import { getAuthenticatedUser, requireAuth } from '../middleware/auth'
import { checkoutService } from '../services/stripe/checkout.service'
import { invoiceService } from '../services/stripe/invoice.service'
import { subscriptionService } from '../services/stripe/subscription.service'
import { webhookService } from '../services/stripe/webhook.service'

type ApiErrorResponse = {
  error: {
    code: string
    message: string
    details?: unknown
  }
}
// Helper to format error responses
const formatError = (error: unknown): ApiErrorResponse => {
  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    }
  }

  // Fallback for unexpected errors
  return {
    error: {
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    },
  }
}

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
      try {
        const userSession = getAuthenticatedUser(c)
        const { priceId } = c.req.valid('json')

        const session = await checkoutService.createSubscriptionCheckout(
          userSession.id,
          userSession.email,
          priceId,
          userSession.name || undefined
        )

        return c.json(session, 200)
      } catch (error) {
        console.error('[Checkout] Failed to create subscription checkout:', error)
        const errorResponse = formatError(error)
        const statusCode = error instanceof AppError ? error.statusCode : 500
        return c.json(errorResponse, statusCode as 500 | 400 | 404)
      }
    }
  )
  .post('/stripe/portal', requireAuth, async (c) => {
    try {
      const userSession = getAuthenticatedUser(c)
      const session = await checkoutService.createPortalSession(userSession.id)

      return c.json(session, 200)
    } catch (error) {
      console.error('[Portal] Failed to create portal session:', error)
      const errorResponse = formatError(error)
      const statusCode = error instanceof AppError ? error.statusCode : 500
      return c.json(errorResponse, statusCode as 500 | 400 | 404)
    }
  })
  .get('/stripe/subscription', requireAuth, async (c) => {
    try {
      const userSession = getAuthenticatedUser(c)
      const subscription = await subscriptionService.getUserSubscription(userSession.id)

      return c.json(subscription)
    } catch (error) {
      console.error('[Subscription] Failed to get user subscription:', error)
      const errorResponse = formatError(error)
      const statusCode = error instanceof AppError ? error.statusCode : 500
      return c.json(errorResponse, statusCode as 500 | 400 | 404)
    }
  })
  .get('/stripe/invoices', requireAuth, async (c) => {
    try {
      const userSession = getAuthenticatedUser(c)
      const invoices = await invoiceService.getUserInvoices(userSession.id)

      return c.json(invoices, 200)
    } catch (error) {
      console.error('[Invoices] Failed to get user invoices:', error)
      const errorResponse = formatError(error)
      const statusCode = error instanceof AppError ? error.statusCode : 500
      return c.json(errorResponse, statusCode as 500 | 400 | 404)
    }
  })
  .get('/stripe/plans', async (c) => {
    try {
      // Get all active plans from database
      const activePlans = await db.select().from(plans).where(eq(plans.isActive, true))

      return c.json(activePlans, 200)
    } catch (error) {
      console.error('[Plans] Failed to get plans:', error)
      const errorResponse = formatError(error)
      const statusCode = error instanceof AppError ? error.statusCode : 500
      return c.json(errorResponse, statusCode as 500 | 400 | 404)
    }
  })
  .post('/stripe/webhook', async (c) => {
    const signature = c.req.header('stripe-signature')
    const body = await c.req.text()

    if (!signature || !body) {
      return c.json(
        {
          error: {
            code: 'MISSING_DATA',
            message: 'Missing signature or body',
          },
        },
        400
      )
    }

    let event: Stripe.Event | null = null

    try {
      event = webhookService.verifySignature(signature, body)
    } catch (error) {
      console.error('[Webhook] Signature verification failed:', error)
      return c.json(
        {
          error: {
            code: 'INVALID_SIGNATURE',
            message: 'Webhook signature verification failed',
          },
        },
        400
      )
    }

    try {
      const shouldProcess = await webhookService.processEvent(event)

      if (!shouldProcess) {
        return c.json({ received: true, message: 'Already processed' })
      }

      return c.json({ received: true })
    } catch (error) {
      console.error('[Webhook] Failed to process event:', error)
      // Return 200 to avoid Stripe retries on processing errors
      return c.json(
        {
          error: {
            code: 'PROCESSING_ERROR',
            message: 'Failed to process webhook event',
          },
        },
        200
      )
    }
  })
export type StripeType = typeof router
export default router

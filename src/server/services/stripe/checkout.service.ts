import { stripe } from '@/server/adaptaters/stripe'
import { env } from '@/server/config/env'
import db from '@/server/adaptaters/db/postgres'
import { planRepository } from '@/server/repositories/stripe/plan.repository'
import type { DbExecutor } from '@/server/repositories/stripe/types'
import { StripePlanNotFoundError, StripeApiError } from './errors'
import { createCheckoutSchema, createPortalSchema } from './validation'
import { ValidationError } from '@/server/lib/errors'
import { customerService } from './customer.service'

export const checkoutService = {
  /**
   * Create subscription checkout session
   * Creates customer if needed, validates plan, and generates checkout URL
   */
  createSubscriptionCheckout: async (
    userId: string,
    email: string,
    priceId: string,
    name?: string,
    dbExecutor: DbExecutor = db
  ) => {
    // Validate input
    const validationResult = createCheckoutSchema.safeParse({ userId, email, priceId, name })
    if (!validationResult.success) {
      throw new ValidationError('Invalid checkout data', validationResult.error.flatten())
    }

    try {
      // Get or create customer
      const customer = await customerService.getOrCreate(userId, email, name, dbExecutor)

      // Validate plan exists and is active
      const plan = await planRepository.findActiveByPriceId(priceId, dbExecutor)
      if (!plan) {
        throw new StripePlanNotFoundError(priceId)
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customer.stripeCustomerId,
        mode: 'subscription',
        success_url: `${env.VITE_BASE_URL}/success`,
        cancel_url: `${env.VITE_BASE_URL}/cancel`,
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          userId,
        },
      })

      return session
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof StripePlanNotFoundError ||
        error instanceof StripeApiError
      ) {
        throw error
      }
      throw new StripeApiError(
        'Failed to create subscription checkout',
        error instanceof Error ? error.message : error
      )
    }
  },

  /**
   * Create billing portal session
   * Allows customers to manage their subscriptions
   */
  createPortalSession: async (userId: string, dbExecutor: DbExecutor = db) => {
    // Validate input
    const validationResult = createPortalSchema.safeParse({ userId })
    if (!validationResult.success) {
      throw new ValidationError('Invalid portal data', validationResult.error.flatten())
    }

    try {
      // Get customer (throws if not found)
      const customer = await customerService.getByUserId(userId, dbExecutor)

      // Create portal session
      const session = await stripe.billingPortal.sessions.create({
        customer: customer.stripeCustomerId,
        return_url: `${env.VITE_BASE_URL}`,
      })

      return session
    } catch (error) {
      if (error instanceof ValidationError || error instanceof StripeApiError) {
        throw error
      }
      throw new StripeApiError(
        'Failed to create portal session',
        error instanceof Error ? error.message : error
      )
    }
  },
}

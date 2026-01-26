import db from '@/server/adaptaters/db/postgres'
import { stripe } from '@/server/adaptaters/stripe'
import { ValidationError } from '@/server/lib/errors'
import { customerRepository } from '@/server/repositories/stripe/customer.repository'
import { planRepository } from '@/server/repositories/stripe/plan.repository'
import { subscriptionRepository } from '@/server/repositories/stripe/subscription.repository'
import type { DbExecutor } from '@/server/repositories/stripe/types'
import { StripeApiError, StripePlanNotFoundError, StripeSubscriptionNotFoundError } from './errors'
import { getUserSubscriptionSchema, isValidSubscriptionStatus } from './validation'

export const subscriptionService = {
  /**
   * Get user's latest subscription
   * Returns null if not found
   */
  getUserSubscription: async (userId: string, dbExecutor: DbExecutor = db) => {
    // Validate input
    const validationResult = getUserSubscriptionSchema.safeParse({ userId })
    if (!validationResult.success) {
      throw new ValidationError('Invalid user ID', validationResult.error.flatten())
    }

    const subscription = await subscriptionRepository.findLatestByUserId(userId, dbExecutor)
    return subscription
  },

  /**
   * Check if user has active premium subscription
   */
  hasActivePremium: async (userId: string, dbExecutor: DbExecutor = db) => {
    const subscription = await subscriptionService.getUserSubscription(userId, dbExecutor)
    return subscription?.status === 'active'
  },

  /**
   * Sync subscription from Stripe to DB
   * Used by webhooks and manual sync operations
   */
  syncFromStripe: async (subscriptionId: string, dbExecutor: DbExecutor = db) => {
    try {
      // Fetch from Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['items.data.price'],
      })

      if (!stripeSubscription) {
        throw new StripeSubscriptionNotFoundError(subscriptionId)
      }

      // Find customer in DB
      const customer = await customerRepository.findByStripeCustomerId(
        stripeSubscription.customer as string,
        dbExecutor
      )
      if (!customer) {
        throw new StripeApiError(`Customer not found for subscription: ${subscriptionId}`)
      }

      // Get price and find plan
      const priceId = stripeSubscription.items.data[0]?.price.id
      if (!priceId) {
        throw new StripeApiError(`No price found in subscription: ${subscriptionId}`)
      }

      const plan = await planRepository.findActiveByPriceId(priceId, dbExecutor)
      if (!plan) {
        throw new StripePlanNotFoundError(priceId)
      }

      // Validate status
      if (!isValidSubscriptionStatus(stripeSubscription.status)) {
        throw new ValidationError(`Invalid subscription status: ${stripeSubscription.status}`, {
          status: stripeSubscription.status,
        })
      }

      // Detect scheduled cancellation
      // Stripe now uses cancel_at (timestamp) instead of just cancel_at_period_end (boolean)
      const hasScheduledCancellation = !!stripeSubscription.cancel_at

      // Upsert subscription
      const subscriptionData = {
        userId: customer.userId,
        stripeCustomerId: customer.id,
        planId: plan.id,
        stripeSubscriptionId: stripeSubscription.id,
        status: stripeSubscription.status,
        currentPeriodStart: new Date(stripeSubscription.items.data[0].current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.items.data[0].current_period_end * 1000),
        cancelAtPeriodEnd: hasScheduledCancellation || stripeSubscription.cancel_at_period_end,
        canceledAt: stripeSubscription.canceled_at
          ? new Date(stripeSubscription.canceled_at * 1000)
          : hasScheduledCancellation
            ? new Date() // Cancellation requested, effective at cancel_at date
            : null,
        endedAt: stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000) : null,
        trialStart: stripeSubscription.trial_start
          ? new Date(stripeSubscription.trial_start * 1000)
          : null,
        trialEnd: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000)
          : null,
      }

      const synced = await subscriptionRepository.upsert(subscriptionData, dbExecutor)
      return synced
    } catch (error) {
      if (
        error instanceof StripeSubscriptionNotFoundError ||
        error instanceof StripePlanNotFoundError ||
        error instanceof ValidationError ||
        error instanceof StripeApiError
      ) {
        throw error
      }
      throw new StripeApiError(
        `Failed to sync subscription: ${subscriptionId}`,
        error instanceof Error ? error.message : error
      )
    }
  },
}

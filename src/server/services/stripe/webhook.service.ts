import { stripe } from '@/server/adaptaters/stripe'
import { env } from '@/server/config/env'
import db from '@/server/adaptaters/db/postgres'
import { webhookRepository } from '@/server/repositories/stripe/webhook.repository'
import type { DbExecutor } from '@/server/repositories/stripe/types'
import { StripeWebhookError } from './errors'
import { verifyWebhookSchema } from './validation'
import { ValidationError } from '@/server/lib/errors'
import { subscriptionService } from './subscription.service'
import { invoiceService } from './invoice.service'
import type Stripe from 'stripe'

export const webhookService = {
  /**
   * Verify webhook signature
   * Throws if signature is invalid
   */
  verifySignature: (signature: string, body: string): Stripe.Event => {
    // Validate input
    const validationResult = verifyWebhookSchema.safeParse({ signature, body })
    if (!validationResult.success) {
      throw new ValidationError('Invalid webhook data', validationResult.error.flatten())
    }

    try {
      const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
      return event
    } catch (error) {
      throw new StripeWebhookError(
        'Webhook signature verification failed',
        error instanceof Error ? error.message : error
      )
    }
  },

  /**
   * Process webhook event
   * Ensures idempotency and handles different event types
   * Returns true if processed, false if already processed
   */
  processEvent: async (event: Stripe.Event, dbExecutor: DbExecutor = db): Promise<boolean> => {
    try {
      // Check idempotency - return false if already processed
      const existingEvent = await webhookRepository.findById(event.id, dbExecutor)
      if (existingEvent?.processed) {
        console.log(`[WEBHOOK] Event ${event.id} already processed`)
        return false
      }

      // Persist event before processing to track failures
      await webhookRepository.create(
        {
          id: event.id,
          type: event.type,
          data: JSON.stringify(event.data),
        },
        dbExecutor
      )

      // Process based on event type
      try {
        switch (event.type) {
          case 'customer.subscription.created':
          case 'customer.subscription.deleted':
          case 'customer.subscription.updated': {
            console.log(`[WEBHOOK] Processing ${event.type}`)
            const subscription = event.data.object
            await subscriptionService.syncFromStripe(subscription.id, dbExecutor)
            break
          }
          case 'invoice.paid':
          case 'invoice.payment_failed': {
            console.log(`[WEBHOOK] Processing ${event.type}`)
            const invoice = event.data.object
            await invoiceService.syncFromStripe(invoice.id, dbExecutor)
            break
          }
          default:
            console.log(`[WEBHOOK] Unhandled event type: ${event.type}`)
            break
        }

        // Mark as processed successfully
        await webhookRepository.updateProcessingStatus(
          event.id,
          {
            processed: true,
            processedAt: new Date(),
            processingError: null,
          },
          dbExecutor
        )

        return true
      } catch (processingError) {
        // Store error for debugging and retry logic
        const errorMessage =
          processingError instanceof Error ? processingError.message : 'Unknown error'

        await webhookRepository.updateProcessingStatus(
          event.id,
          {
            processed: false,
            processedAt: new Date(),
            processingError: errorMessage,
          },
          dbExecutor
        )

        throw new StripeWebhookError(`Failed to process webhook event: ${event.id}`, errorMessage)
      }
    } catch (error) {
      if (error instanceof StripeWebhookError) {
        throw error
      }
      throw new StripeWebhookError(
        `Webhook processing failed: ${event.id}`,
        error instanceof Error ? error.message : error
      )
    }
  },
}

import { stripe } from '@/server/adaptaters/stripe'
import db from '@/server/adaptaters/db/postgres'
import { invoiceRepository } from '@/server/repositories/stripe/invoice.repository'
import { customerRepository } from '@/server/repositories/stripe/customer.repository'
import { subscriptionRepository } from '@/server/repositories/stripe/subscription.repository'
import type { DbExecutor } from '@/server/repositories/stripe/types'
import { StripeInvoiceNotFoundError, StripeApiError } from './errors'
import { getUserInvoicesSchema } from './validation'
import { ValidationError } from '@/server/lib/errors'
import { customerService } from './customer.service'

export const invoiceService = {
  /**
   * Get all invoices for a user
   */
  getUserInvoices: async (userId: string, dbExecutor: DbExecutor = db) => {
    // Validate input
    const validationResult = getUserInvoicesSchema.safeParse({ userId })
    if (!validationResult.success) {
      throw new ValidationError('Invalid user ID', validationResult.error.flatten())
    }

    // Get customer (throws if not found)
    const customer = await customerService.getByUserId(userId, dbExecutor)

    // Get invoices
    const invoices = await invoiceRepository.findByCustomerId(customer.id, dbExecutor)
    return invoices
  },

  /**
   * Sync invoice from Stripe to DB
   * Used by webhooks and manual sync operations
   */
  syncFromStripe: async (invoiceId: string, dbExecutor: DbExecutor = db) => {
    try {
      // Fetch from Stripe
      const stripeInvoice = await stripe.invoices.retrieve(invoiceId)

      if (!stripeInvoice) {
        throw new StripeInvoiceNotFoundError(invoiceId)
      }

      // Find customer in DB
      const customer = await customerRepository.findByStripeCustomerId(
        stripeInvoice.customer as string,
        dbExecutor
      )
      if (!customer) {
        throw new StripeApiError(`Customer not found for invoice: ${invoiceId}`)
      }

      // Find subscription if exists
      let subscriptionDbId: string | null = null
      if (stripeInvoice.lines.data[0]?.subscription) {
        const sub = await subscriptionRepository.findByStripeSubscriptionId(
          stripeInvoice.lines.data[0].subscription as string,
          dbExecutor
        )
        subscriptionDbId = sub?.id || null
      }

      // Upsert invoice
      const invoiceData = {
        id: stripeInvoice.id,
        subscriptionId: subscriptionDbId,
        stripeCustomerId: customer.id,
        amountPaid: stripeInvoice.amount_paid,
        amountDue: stripeInvoice.amount_due,
        currency: stripeInvoice.currency,
        status: stripeInvoice.status || 'draft',
        hostedInvoiceUrl: stripeInvoice.hosted_invoice_url || null,
        invoicePdf: stripeInvoice.invoice_pdf || null,
        paid: stripeInvoice.status === 'paid',
        periodStart: new Date(stripeInvoice.period_start * 1000),
        periodEnd: new Date(stripeInvoice.period_end * 1000),
      }

      const synced = await invoiceRepository.upsert(invoiceData, dbExecutor)
      return synced
    } catch (error) {
      if (
        error instanceof StripeInvoiceNotFoundError ||
        error instanceof StripeApiError ||
        error instanceof ValidationError
      ) {
        throw error
      }
      throw new StripeApiError(
        `Failed to sync invoice: ${invoiceId}`,
        error instanceof Error ? error.message : error
      )
    }
  },
}

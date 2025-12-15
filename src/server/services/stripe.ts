import db from '@/server/adaptaters/db/postgres'
import {
  invoice,
  plans,
  stripeCustomer,
  subscription,
  webhookEvent,
} from '@/server/adaptaters/db/schema/stripe-schema'
import { stripe } from '@/server/adaptaters/stripe'
import { env } from '@/server/config/env'
import { and, desc, eq } from 'drizzle-orm'
import type Stripe from 'stripe'

type Tx = Parameters<typeof db.transaction>[0] extends (tx: infer T) => any ? T : never

type DbLike = Tx | typeof db

const frontendUrl = 'http://localhost:3000'

const VALID_SUBSCRIPTION_STATUSES = [
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'trialing',
  'unpaid',
] as const

type ValidSubscriptionStatus = (typeof VALID_SUBSCRIPTION_STATUSES)[number]

const isValidSubscriptionStatus = (status: string): status is ValidSubscriptionStatus => {
  return VALID_SUBSCRIPTION_STATUSES.includes(status as ValidSubscriptionStatus)
}

const stripeService = () => {
  const getOrCreateCustomer = async (userId: string, email?: string, name?: string) => {
    try {
      const [existingCustomer] = await db
        .select()
        .from(stripeCustomer)
        .where(eq(stripeCustomer.userId, userId))
        .limit(1)

      if (existingCustomer) {
        return existingCustomer
      }

      if (!email) {
        throw new Error('User does not exist and email is required for creation of customer')
      }

      const customer = await stripe.customers.create({
        email,
        name,
      })

      const [newCustomer] = await db
        .insert(stripeCustomer)
        .values({
          userId,
          email,
          name,
          stripeCustomerId: customer.id,
        })
        .returning()

      return newCustomer
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get or create customer')
    }
  }

  const createSubscriptionCheckout = async (
    userId: string,
    email: string,
    priceId: string,
    name?: string
  ) => {
    const customer = await getOrCreateCustomer(userId, email, name)
    try {
      const price = await getActivePlan(priceId)
      if (!price) {
        throw new Error('Price not found')
      }
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
      console.error(error)
      throw new Error('Failed to create subscription checkout')
    }
  }

  const createPortalSession = async (userId: string) => {
    try {
      const customer = await getOrCreateCustomer(userId)
      if (!customer) {
        throw new Error('customer not found')
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customer.stripeCustomerId,
        return_url: `${frontendUrl}`,
      })

      return session
    } catch (error) {
      console.error('Failed to create portal session', error)
      return null
    }
  }

  const getUserSubscription = async (userId: string) => {
    try {
      const [currentSubscription] = await db
        .select()
        .from(subscription)
        .where(eq(subscription.userId, userId))
        .orderBy(desc(subscription.createdAt))
        .limit(1)
      return currentSubscription
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get user subscription or subscription not found')
    }
  }

  const hasActivePremium = async (userId: string) => {
    const sub = await getUserSubscription(userId)
    return sub?.status === 'active'
  }

  const getUserInvoices = async (userId: string) => {
    const customer = await getOrCreateCustomer(userId)
    if (!customer) {
      throw new Error('customer not found for getting invoices')
    }
    try {
      const invoices = await db
        .select()
        .from(invoice)
        .where(eq(invoice.stripeCustomerId, customer.id))
        .orderBy(desc(invoice.createdAt))
      return invoices
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get user invoices')
    }
  }

  const getActivePlan = async (priceId: string) => {
    try {
      const [plan] = await db
        .select()
        .from(plans)
        .where(and(eq(plans.stripePriceId, priceId), eq(plans.isActive, true)))
        .limit(1)

      return plan || null
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get plan')
    }
  }

  const syncSubscription = async (subscriptionId: string, dbLike: DbLike) => {
    try {
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['items.data.price'],
      })
      if (!stripeSubscription) {
        throw new Error('Subscription not found')
      }
      const [customer] = await dbLike
        .select()
        .from(stripeCustomer)
        .where(eq(stripeCustomer.stripeCustomerId, stripeSubscription.customer as string))
        .limit(1)
      if (!customer) {
        throw new Error('Customer not found')
      }
      const priceId = stripeSubscription.items.data[0]?.price.id
      if (!priceId) {
        throw new Error('No price found in subscription')
      }
      const [plan] = await dbLike
        .select()
        .from(plans)
        .where(eq(plans.stripePriceId, priceId))
        .limit(1)
      if (!plan) {
        throw new Error('Plan not found')
      }

      if (!isValidSubscriptionStatus(stripeSubscription.status)) {
        throw new Error(
          `Invalid subscription status: ${stripeSubscription.status}. Expected one of: ${VALID_SUBSCRIPTION_STATUSES.join(', ')}`
        )
      }

      const subscriptionData = {
        userId: customer.userId,
        stripeCustomerId: customer.id,
        planId: plan.id,
        stripeSubscriptionId: stripeSubscription.id,
        status: stripeSubscription.status,
        currentPeriodStart: new Date(stripeSubscription.items.data[0].current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.items.data[0].current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt: stripeSubscription.canceled_at
          ? new Date(stripeSubscription.canceled_at * 1000)
          : null,
        endedAt: stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000) : null,
        trialStart: stripeSubscription.trial_start
          ? new Date(stripeSubscription.trial_start * 1000)
          : null,
        trialEnd: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000)
          : null,
      }

      const [synced] = await dbLike
        .insert(subscription)
        .values(subscriptionData)
        .onConflictDoUpdate({
          target: subscription.stripeSubscriptionId,
          set: subscriptionData,
        })
        .returning()
      return synced
    } catch (error) {
      console.error(error)
      throw new Error('Failed to sync subscription')
    }
  }

  const syncInvoice = async (invoiceId: string, dbLike: DbLike) => {
    try {
      const stripeInvoice = await stripe.invoices.retrieve(invoiceId)
      if (!stripeInvoice) {
        throw new Error('Invoice not found')
      }

      const [customer] = await dbLike
        .select()
        .from(stripeCustomer)
        .where(eq(stripeCustomer.stripeCustomerId, stripeInvoice.customer as string))
        .limit(1)
      if (!customer) {
        throw new Error('Customer not found')
      }

      let subscriptionDbId: string | null = null
      if (stripeInvoice.lines.data[0]?.subscription) {
        const [sub] = await dbLike
          .select()
          .from(subscription)
          .where(
            eq(
              subscription.stripeSubscriptionId,
              stripeInvoice.lines.data[0].subscription as string
            )
          )
          .limit(1)
        subscriptionDbId = sub?.id || null
      }

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

      const [synced] = await dbLike
        .insert(invoice)
        .values(invoiceData)
        .onConflictDoUpdate({
          target: invoice.id,
          set: invoiceData,
        })
        .returning()
      return synced
    } catch (error) {
      console.error(error)
      throw new Error('Failed to sync invoice')
    }
  }

  const verifyWebhookSignature = (signature: string, body: string) => {
    try {
      const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
      return event
    } catch (error) {
      console.error(error)
      throw new Error('⚠️  Webhook signature verification failed.')
    }
  }

  const getWebhookEvent = async (eventId: string) => {
    try {
      const [existingEvent] = await db
        .select()
        .from(webhookEvent)
        .where(eq(webhookEvent.id, eventId))
        .limit(1)

      return existingEvent ?? null
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get webhook event')
    }
  }

  const createWebhookEvent = async (event: Stripe.Event) => {
    try {
      await db.insert(webhookEvent).values({
        id: event.id,
        type: event.type,
        data: JSON.stringify(event.data),
      })
    } catch (error) {
      // Ignore duplicate key errors to handle webhook retry race conditions
      if (
        error instanceof Error &&
        (error.message?.includes('duplicate key') || error.message?.includes('unique constraint'))
      ) {
        return
      } else {
        console.error(error)
        throw new Error('Failed to create webhook event')
      }
    }
  }

  const markWebhookEventProcessed = async (eventId: string, error?: string) => {
    try {
      await db
        .update(webhookEvent)
        .set({
          processed: !error,
          processedAt: new Date(),
          processingError: error || null,
        })
        .where(eq(webhookEvent.id, eventId))
    } catch (updateError) {
      console.error(updateError)
      throw new Error('Failed to mark webhook event processed')
    }
  }

  const processWebhookEvent = async (event: Stripe.Event) => {
    // Ensure idempotency by checking if event was already processed
    try {
      const existingEvent = await getWebhookEvent(event.id)
      if (existingEvent?.processed) {
        console.log(`Event ${event.id} already processed`)
        return false
      }
    } catch (error) {
      console.error(error)
      throw new Error('Failed to get webhook event')
    }

    // Persist event before processing to track failures
    await createWebhookEvent(event)

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.deleted':
        case 'customer.subscription.updated': {
          console.log(`[WEBHOOK] Received ${event.type}`)
          const subscription = event.data.object
          await syncSubscription(subscription.id, db)
          break
        }
        case 'invoice.paid':
        case 'invoice.payment_failed': {
          console.log(`[WEBHOOK] Received ${event.type}`)
          const invoice = event.data.object
          await syncInvoice(invoice.id, db)
          break
        }
        default:
          console.log(`[WEBHOOK] Unhandled event type: ${event.type}`)
          break
      }

      await markWebhookEventProcessed(event.id)
      return true
    } catch (error) {
      // Store error for debugging and retry logic
      await markWebhookEventProcessed(
        event.id,
        error instanceof Error ? error.message : 'Unknown error'
      )
      console.error(error)
      throw new Error('Failed to process webhook event')
    }
  }

  return {
    getOrCreateCustomer,
    createSubscriptionCheckout,
    createPortalSession,
    getUserSubscription,
    hasActivePremium,
    getUserInvoices,
    processWebhookEvent,
    verifyWebhookSignature,
    getActivePlan,
    syncSubscription,
    syncInvoice,
  }
}

export default stripeService

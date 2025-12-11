import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'trialing',
  'unpaid',
])

export const stripeCustomer = pgTable('stripe_customer', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  email: text('email').notNull(),
  name: text('name'),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const plans = pgTable('plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  stripePriceId: text('stripe_price_id').unique(),
  stripeProductId: text('stripe_product_id'),
  price: integer('price').notNull(),
  currency: text('currency').default('eur').notNull(),
  interval: text('interval'),
  features: text('features'),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const subscription = pgTable('subscription', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  stripeCustomerId: uuid('stripe_customer_id').references(() => stripeCustomer.id, {
    onDelete: 'cascade',
  }),
  planId: text('plan_id')
    .notNull()
    .references(() => plans.id, { onDelete: 'cascade' }),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  status: subscriptionStatusEnum('status').notNull(),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  canceledAt: timestamp('canceled_at'),
  endedAt: timestamp('ended_at'),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const invoice = pgTable('invoice', {
  id: text('id').primaryKey(),
  subscriptionId: uuid('subscription_id').references(() => subscription.id, {
    onDelete: 'cascade',
  }),
  stripeCustomerId: uuid('stripe_customer_id')
    .notNull()
    .references(() => stripeCustomer.id, { onDelete: 'cascade' }),
  amountPaid: integer('amount_paid').notNull(),
  amountDue: integer('amount_due').notNull(),
  currency: text('currency').default('eur').notNull(),
  status: text('status').notNull(),
  hostedInvoiceUrl: text('hosted_invoice_url'),
  invoicePdf: text('invoice_pdf'),
  paid: boolean('paid').notNull(),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const webhookEvent = pgTable('webhook_event', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  processed: boolean('processed').default(false).notNull(),
  processingError: text('processing_error'),
  data: text('data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  processedAt: timestamp('processed_at'),
})

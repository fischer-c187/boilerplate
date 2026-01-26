import { z } from 'zod'

// Valid subscription statuses from Stripe
export const VALID_SUBSCRIPTION_STATUSES = [
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'trialing',
  'unpaid',
] as const

export type ValidSubscriptionStatus = (typeof VALID_SUBSCRIPTION_STATUSES)[number]

// Type guard for subscription status
export const isValidSubscriptionStatus = (status: string): status is ValidSubscriptionStatus => {
  return VALID_SUBSCRIPTION_STATUSES.includes(status as ValidSubscriptionStatus)
}

// Zod Schemas for service validation

export const createCustomerSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  email: z.string().email('Valid email is required').optional(),
  name: z.string().optional(),
})

export const createCheckoutSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  email: z.string().email('Valid email is required'),
  priceId: z.string().min(1, 'Price ID is required'),
  name: z.string().optional(),
})

export const createPortalSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export const getUserSubscriptionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export const getUserInvoicesSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export const verifyWebhookSchema = z.object({
  signature: z.string().min(1, 'Webhook signature is required'),
  body: z.string().min(1, 'Webhook body is required'),
})

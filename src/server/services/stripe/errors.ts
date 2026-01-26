import { AppError, NotFoundError } from '@/server/lib/errors'

// Stripe-specific errors

export class StripeCustomerNotFoundError extends NotFoundError {
  constructor(userId: string) {
    super(`Stripe customer not found for user: ${userId}`, { userId })
  }
}

export class StripeSubscriptionNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Stripe subscription not found: ${identifier}`, { identifier })
  }
}

export class StripeInvoiceNotFoundError extends NotFoundError {
  constructor(identifier: string) {
    super(`Stripe invoice not found: ${identifier}`, { identifier })
  }
}

export class StripePlanNotFoundError extends NotFoundError {
  constructor(priceId: string) {
    super(`Stripe plan not found for price: ${priceId}`, { priceId })
  }
}

export class StripeApiError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'STRIPE_API_ERROR', 500, details)
  }
}

export class StripeWebhookError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'STRIPE_WEBHOOK_ERROR', 400, details)
  }
}

export class StripeCustomerCreationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'STRIPE_CUSTOMER_CREATION_ERROR', 500, details)
  }
}

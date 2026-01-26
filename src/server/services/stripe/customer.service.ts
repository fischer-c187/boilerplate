import { stripe } from '@/server/adaptaters/stripe'
import db from '@/server/adaptaters/db/postgres'
import { customerRepository } from '@/server/repositories/stripe/customer.repository'
import type { DbExecutor } from '@/server/repositories/stripe/types'
import { StripeCustomerCreationError, StripeCustomerNotFoundError } from './errors'
import { createCustomerSchema } from './validation'
import { ValidationError } from '@/server/lib/errors'

export const customerService = {
  /**
   * Get existing customer or create new one
   * Validates input and handles Stripe API + DB operations
   */
  getOrCreate: async (
    userId: string,
    email?: string,
    name?: string,
    dbExecutor: DbExecutor = db
  ) => {
    // Validate input
    const validationResult = createCustomerSchema.safeParse({ userId, email, name })
    if (!validationResult.success) {
      throw new ValidationError('Invalid customer data', validationResult.error.flatten())
    }

    try {
      // Check if customer exists in DB
      const existingCustomer = await customerRepository.findByUserId(userId, dbExecutor)
      if (existingCustomer) {
        return existingCustomer
      }

      // Create new customer requires email
      if (!email) {
        throw new ValidationError('Email is required to create a new Stripe customer')
      }

      // Create customer in Stripe
      const stripeCustomer = await stripe.customers.create({
        email,
        name,
      })

      // Save to DB
      const newCustomer = await customerRepository.create(
        {
          userId,
          email,
          name,
          stripeCustomerId: stripeCustomer.id,
        },
        dbExecutor
      )

      return newCustomer
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error
      }
      throw new StripeCustomerCreationError(
        'Failed to get or create customer',
        error instanceof Error ? error.message : error
      )
    }
  },

  /**
   * Get customer by user ID
   * Throws if not found
   */
  getByUserId: async (userId: string, dbExecutor: DbExecutor = db) => {
    const customer = await customerRepository.findByUserId(userId, dbExecutor)
    if (!customer) {
      throw new StripeCustomerNotFoundError(userId)
    }
    return customer
  },
}

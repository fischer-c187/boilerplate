import db from '@/server/adaptaters/db/postgres'
import { stripeCustomer } from '@/server/adaptaters/db/schema/stripe-schema'
import { eq } from 'drizzle-orm'
import type { DbExecutor } from './types'

export const customerRepository = {
  findByUserId: async (userId: string, dbExecutor: DbExecutor = db) => {
    const [customer] = await dbExecutor
      .select()
      .from(stripeCustomer)
      .where(eq(stripeCustomer.userId, userId))
      .limit(1)

    return customer ?? null
  },

  findByStripeCustomerId: async (stripeCustomerId: string, dbExecutor: DbExecutor = db) => {
    const [customer] = await dbExecutor
      .select()
      .from(stripeCustomer)
      .where(eq(stripeCustomer.stripeCustomerId, stripeCustomerId))
      .limit(1)

    return customer ?? null
  },

  create: async (
    data: {
      userId: string
      email: string
      name?: string
      stripeCustomerId: string
    },
    dbExecutor: DbExecutor = db
  ) => {
    const [customer] = await dbExecutor
      .insert(stripeCustomer)
      .values({
        userId: data.userId,
        email: data.email,
        name: data.name,
        stripeCustomerId: data.stripeCustomerId,
      })
      .returning()

    return customer
  },
}

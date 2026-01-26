import db from '@/server/adaptaters/db/postgres'
import { subscription } from '@/server/adaptaters/db/schema/stripe-schema'
import type { ValidSubscriptionStatus } from '@/server/services/stripe/validation'
import { desc, eq } from 'drizzle-orm'
import type { DbExecutor } from './types'

export const subscriptionRepository = {
  findLatestByUserId: async (userId: string, dbExecutor: DbExecutor = db) => {
    const [sub] = await dbExecutor
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .orderBy(desc(subscription.createdAt))
      .limit(1)

    return sub ?? null
  },

  findByStripeSubscriptionId: async (stripeSubscriptionId: string, dbExecutor: DbExecutor = db) => {
    const [sub] = await dbExecutor
      .select()
      .from(subscription)
      .where(eq(subscription.stripeSubscriptionId, stripeSubscriptionId))
      .limit(1)

    return sub ?? null
  },

  upsert: async (
    data: {
      userId: string
      stripeCustomerId: string
      planId: string
      stripeSubscriptionId: string
      status: ValidSubscriptionStatus
      currentPeriodStart: Date
      currentPeriodEnd: Date
      cancelAtPeriodEnd: boolean
      canceledAt: Date | null
      endedAt: Date | null
      trialStart: Date | null
      trialEnd: Date | null
    },
    dbExecutor: DbExecutor = db
  ) => {
    const [sub] = await dbExecutor
      .insert(subscription)
      .values(data)
      .onConflictDoUpdate({
        target: subscription.stripeSubscriptionId,
        set: data,
      })
      .returning()

    return sub
  },
}

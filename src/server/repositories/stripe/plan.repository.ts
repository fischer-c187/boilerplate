import db from '@/server/adaptaters/db/postgres'
import { plans } from '@/server/adaptaters/db/schema/stripe-schema'
import { and, eq } from 'drizzle-orm'
import type { DbExecutor } from './types'

export const planRepository = {
  findActiveByPriceId: async (priceId: string, dbExecutor: DbExecutor = db) => {
    const [plan] = await dbExecutor
      .select()
      .from(plans)
      .where(and(eq(plans.stripePriceId, priceId), eq(plans.isActive, true)))
      .limit(1)

    return plan ?? null
  },
}

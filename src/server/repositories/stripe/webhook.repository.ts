import db from '@/server/adaptaters/db/postgres'
import { webhookEvent } from '@/server/adaptaters/db/schema/stripe-schema'
import { eq } from 'drizzle-orm'
import type { DbExecutor } from './types'

export const webhookRepository = {
  findById: async (eventId: string, dbExecutor: DbExecutor = db) => {
    const [event] = await dbExecutor
      .select()
      .from(webhookEvent)
      .where(eq(webhookEvent.id, eventId))
      .limit(1)

    return event ?? null
  },

  create: async (
    data: {
      id: string
      type: string
      data: string
    },
    dbExecutor: DbExecutor = db
  ) => {
    try {
      const [event] = await dbExecutor.insert(webhookEvent).values(data).returning()
      return event
    } catch (error) {
      // Handle duplicate key errors for idempotency
      if (
        error instanceof Error &&
        (error.message?.includes('duplicate key') || error.message?.includes('unique constraint'))
      ) {
        return null
      }
      throw error
    }
  },

  updateProcessingStatus: async (
    eventId: string,
    data: {
      processed: boolean
      processedAt: Date
      processingError: string | null
    },
    dbExecutor: DbExecutor = db
  ) => {
    const [event] = await dbExecutor
      .update(webhookEvent)
      .set(data)
      .where(eq(webhookEvent.id, eventId))
      .returning()

    return event
  },
}

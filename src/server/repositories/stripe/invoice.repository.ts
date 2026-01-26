import db from '@/server/adaptaters/db/postgres'
import { invoice } from '@/server/adaptaters/db/schema/stripe-schema'
import { desc, eq } from 'drizzle-orm'
import type { DbExecutor } from './types'

export const invoiceRepository = {
  findByCustomerId: async (stripeCustomerId: string, dbExecutor: DbExecutor = db) => {
    const invoices = await dbExecutor
      .select()
      .from(invoice)
      .where(eq(invoice.stripeCustomerId, stripeCustomerId))
      .orderBy(desc(invoice.createdAt))

    return invoices
  },

  upsert: async (
    data: {
      id: string
      subscriptionId: string | null
      stripeCustomerId: string
      amountPaid: number
      amountDue: number
      currency: string
      status: string
      hostedInvoiceUrl: string | null
      invoicePdf: string | null
      paid: boolean
      periodStart: Date
      periodEnd: Date
    },
    dbExecutor: DbExecutor = db
  ) => {
    const [inv] = await dbExecutor
      .insert(invoice)
      .values(data)
      .onConflictDoUpdate({
        target: invoice.id,
        set: data,
      })
      .returning()

    return inv
  },
}

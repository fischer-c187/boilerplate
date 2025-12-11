import db from '@/server/adaptaters/db/postgres'
import { sql } from 'drizzle-orm'

async function resetDatabase() {
  console.log('🗑️  Truncating all tables...\n')

  try {
    // Disable foreign key checks temporarily
    await db.execute(sql`SET session_replication_role = 'replica'`)

    // Truncate all tables (in any order since FK checks are disabled)
    const tables = [
      'invoice',
      'webhook_event',
      'subscription',
      'stripe_customer',
      'plans',
      'session',
      'verification',
      'account',
      'user',
    ]

    for (const table of tables) {
      try {
        await db.execute(sql.raw(`TRUNCATE TABLE "${table}" CASCADE`))
        console.log(`✅ Truncated table: ${table}`)
      } catch {
        // Table might not exist, that's okay
        console.log(`⚠️  Skipped table: ${table} (might not exist)`)
      }
    }

    // Re-enable foreign key checks
    await db.execute(sql`SET session_replication_role = 'origin'`)

    console.log('\n✅ Database reset complete!')
  } catch (error) {
    console.error('❌ Error resetting database:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

void resetDatabase()

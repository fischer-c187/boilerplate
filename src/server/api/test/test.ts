import { Hono } from 'hono'
import { sql } from 'drizzle-orm'
import db from '@/server/db/postgres'

const testApi = new Hono()

testApi.get('/test', (c) => {
  return c.json({ message: 'Hello, world!' })
})

testApi.get('/db', async (c) => {
  try {
    // Test basic connection
    const result = await db.execute(sql`SELECT NOW() as now, version() as version`)
    const row = result[0]

    return c.json({
      success: true,
      message: 'Database connection successful',
      data: {
        timestamp: row?.now,
        version: row?.version,
      },
    })
  } catch (error) {
    return c.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

export default testApi

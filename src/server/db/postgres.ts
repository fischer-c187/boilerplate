import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const queryClient = postgres({
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  max: 10,
})

const db = drizzle({
  client: queryClient,
})

export default db

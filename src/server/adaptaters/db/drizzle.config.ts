import { env } from '@/server/config/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/adaptaters/db/schema/*.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
})

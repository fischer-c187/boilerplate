import type db from '@/server/adaptaters/db/postgres'

// Extract transaction type from db.transaction callback
export type DbTransaction = Parameters<typeof db.transaction>[0] extends (tx: infer T) => any
  ? T
  : never

// DbExecutor can be either the db instance or a transaction
export type DbExecutor = typeof db | DbTransaction

// Standard repository result with success/error pattern
export type RepositoryResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: unknown }

// Standard repository list result
export type RepositoryListResult<T> = RepositoryResult<T[]>

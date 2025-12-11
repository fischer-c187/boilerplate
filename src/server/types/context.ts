import type { auth } from '../adaptaters/auth/auth'

export type ServerContext = {
  Variables: {
    user?: typeof auth.$Infer.Session.user
  }
}

declare module 'hono' {
  interface ContextVariableMap {
    user?: typeof auth.$Infer.Session.user
  }
}

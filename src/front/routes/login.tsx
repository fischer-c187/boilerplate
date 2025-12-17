import { AuthPage } from '@/front/features/auth/AuthPage'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

const searchSchema = z.object({
  redirectTo: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: searchSchema,
  component: LoginRoute,
})

function LoginRoute() {
  const { redirectTo } = Route.useSearch()

  return <AuthPage redirectTo={redirectTo} />
}

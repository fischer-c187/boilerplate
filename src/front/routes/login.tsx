import { AuthPage } from '@/front/features/auth/AuthPage'
import { buildSeoMeta } from '@/front/lib/seo'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

const searchSchema = z.object({
  redirectTo: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: searchSchema,
  head: () => ({
    meta: buildSeoMeta({
      title: 'Login',
      description: 'Sign in to your account',
      url: '/login',
    }),
  }),
  component: LoginRoute,
})

function LoginRoute() {
  const { redirectTo } = Route.useSearch()

  return <AuthPage redirectTo={redirectTo} />
}

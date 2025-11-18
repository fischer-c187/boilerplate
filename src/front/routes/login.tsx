import { LoginForm } from '@/front/components/form/LoginForm'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

const searchSchema = z.object({
  redirectTo: z.string().optional(),
})
export const Route = createFileRoute('/login')({
  validateSearch: searchSchema,
  component: LoginPage,
})

function LoginPage() {
  const { redirectTo } = Route.useSearch()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm redirectTo={redirectTo} />
    </div>
  )
}

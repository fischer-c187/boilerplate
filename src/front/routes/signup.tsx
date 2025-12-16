import { AuthPage } from '@/front/features/auth/AuthPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: SignupRoute,
})

function SignupRoute() {
  return <AuthPage />
}

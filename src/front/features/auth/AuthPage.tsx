import { AuthCard } from './AuthCard'
import { LoginForm } from '@/front/components/form/LoginForm'
import { SignupForm } from '@/front/components/form/SignupForm'

export function AuthPage({ redirectTo }: { redirectTo?: string }) {
  return (
    <AuthCard>
      {(mode) => (mode === 'login' ? <LoginForm redirectTo={redirectTo} /> : <SignupForm />)}
    </AuthCard>
  )
}

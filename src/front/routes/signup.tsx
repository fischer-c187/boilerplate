import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '@/front/components/form/SignupForm'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignupForm />
    </div>
  )
}

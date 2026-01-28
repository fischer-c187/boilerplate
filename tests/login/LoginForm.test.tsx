import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from '@/front/components/form/LoginForm'

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}))

vi.mock('@/front/features/auth/SocialLoginButtons', () => ({
  SocialLoginButtons: () => <div data-testid="social-login" />,
}))

vi.mock('@/shared/api-client/auth/auth.api', () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
      social: vi.fn(),
    },
  },
}))

describe('LoginForm', () => {
  it('renders basic fields and submit button', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
})

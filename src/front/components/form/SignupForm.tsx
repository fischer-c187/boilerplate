import { SocialLoginButtons } from '@/front/features/auth/SocialLoginButtons'
import { authClient } from '@/shared/api-client/auth/auth.api'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      })

      if (result.error) {
        setError(result.error.message || 'Signup failed')
      } else {
        await navigate({ to: '/dashboard' })
      }
    } catch (err) {
      setError('An error occurred during signup')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SocialLoginButtons />

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-4 animate-in slide-in-from-right-4 duration-300"
      >
        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-medium text-muted uppercase tracking-wider">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-black/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all outline-none placeholder:text-muted/50"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs font-medium text-muted uppercase tracking-wider"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-black/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all outline-none placeholder:text-muted/50"
            placeholder="name@example.com"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-xs font-medium text-muted uppercase tracking-wider"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-black/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all outline-none placeholder:text-muted/50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Creating account...' : 'Create Account'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        By continuing, you agree to our{' '}
        <a href="#" className="text-white hover:underline">
          Terms
        </a>{' '}
        and{' '}
        <a href="#" className="text-white hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </>
  )
}

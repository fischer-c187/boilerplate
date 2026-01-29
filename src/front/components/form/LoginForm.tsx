import { SocialLoginButtons } from '@/front/features/auth/SocialLoginButtons'
import { authClient } from '@/shared/api-client/auth/auth.api'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const EMAIL_VERIFICATION_COOLDOWN_MS = 5 * 60 * 1000
const VERIFICATION_CALLBACK_URL = '/dashboard'

export function LoginForm({ redirectTo = '/dashboard' }: { redirectTo?: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verificationPending, setVerificationPending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  const navigate = useNavigate()

  useEffect(() => {
    if (!cooldownEndsAt) {
      return
    }

    const interval = setInterval(() => setNow(Date.now()), 1000)

    return () => clearInterval(interval)
  }, [cooldownEndsAt])

  const remainingSeconds = useMemo(() => {
    if (!cooldownEndsAt) {
      return 0
    }

    return Math.max(0, Math.ceil((cooldownEndsAt - now) / 1000))
  }, [cooldownEndsAt, now])

  const isCooldown = remainingSeconds > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setVerificationPending(false)
    setResendSuccess('')

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })

      if (result.error) {
        if (result.error.status === 403) {
          setError('Email not verified. Please check your inbox.')
          setVerificationPending(true)
        } else {
          setError(result.error.message || 'Login failed')
        }
      } else {
        await navigate({ to: redirectTo })
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Please enter your email to resend the verification link.')
      return
    }

    setError('')
    setResendSuccess('')
    setResendLoading(true)

    try {
      const result = await authClient.sendVerificationEmail({
        email: trimmedEmail,
        callbackURL: VERIFICATION_CALLBACK_URL,
      })

      if (result.error) {
        setError(result.error.message || 'Unable to send verification email.')
      } else {
        setResendSuccess('Verification email sent. Please check your inbox.')
        setCooldownEndsAt(Date.now() + EMAIL_VERIFICATION_COOLDOWN_MS)
      }
    } catch (err) {
      setError('An error occurred while sending the verification email.')
      console.error(err)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <>
      <SocialLoginButtons />

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-medium text-muted uppercase tracking-wider"
            >
              Password
            </label>
            <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
              Forgot?
            </a>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-black/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all outline-none placeholder:text-muted/50"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {verificationPending && (
          <div className="space-y-2 text-center">
            {resendSuccess && (
              <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg text-sm">
                {resendSuccess}
              </div>
            )}
            <button
              type="button"
              onClick={() => void handleResendVerification()}
              disabled={resendLoading || isCooldown}
              className="w-full border border-white/10 text-white py-2.5 rounded-lg text-sm hover:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading
                ? 'Sending verification...'
                : isCooldown
                  ? `Resend available in ${remainingSeconds}s`
                  : 'Resend verification email'}
            </button>
          </div>
        )}
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

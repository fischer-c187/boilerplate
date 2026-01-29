import { authClient } from '@/shared/api-client/auth/auth.api'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Mail } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import z from 'zod'

const searchSchema = z.object({
  email: z.string().email().optional(),
})

const EMAIL_VERIFICATION_COOLDOWN_MS = 5 * 60 * 1000
const VERIFICATION_CALLBACK_URL = '/dashboard'
const COOLDOWN_STORAGE_KEY = 'email_verification_cooldown'

export const Route = createFileRoute('/verify-email')({
  validateSearch: searchSchema,
  component: VerifyEmailRoute,
})

function VerifyEmailRoute() {
  const { email } = Route.useSearch()

  return <VerifyEmailCard initialEmail={email ?? ''} />
}

function VerifyEmailCard({ initialEmail }: { initialEmail: string }) {
  const [email] = useState(initialEmail)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())

  // Load cooldown from localStorage on mount
  useEffect(() => {
    if (!email.trim()) {
      return
    }

    const storageKey = `${COOLDOWN_STORAGE_KEY}_${email}`
    const stored = localStorage.getItem(storageKey)

    if (stored) {
      const endsAt = parseInt(stored, 10)

      // Only set if still in the future
      if (endsAt > Date.now()) {
        setCooldownEndsAt(endsAt)
      } else {
        // Clean up expired cooldown
        localStorage.removeItem(storageKey)
      }
    }
  }, [email])

  useEffect(() => {
    if (!cooldownEndsAt) {
      return
    }

    const interval = setInterval(() => {
      const currentTime = Date.now()
      setNow(currentTime)

      // Clear cooldown and localStorage when expired
      if (currentTime >= cooldownEndsAt) {
        setCooldownEndsAt(null)
        if (email.trim()) {
          localStorage.removeItem(`${COOLDOWN_STORAGE_KEY}_${email}`)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [cooldownEndsAt, email])

  const remainingSeconds = useMemo(() => {
    if (!cooldownEndsAt) {
      return 0
    }

    return Math.max(0, Math.ceil((cooldownEndsAt - now) / 1000))
  }, [cooldownEndsAt, now])

  const isCooldown = remainingSeconds > 0

  const handleResend = async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('We could not detect your email. Please sign up again.')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await authClient.sendVerificationEmail({
        email: trimmedEmail,
        callbackURL: VERIFICATION_CALLBACK_URL,
      })

      if (result.error) {
        setError(result.error.message || 'Unable to send verification email.')
      } else {
        setSuccess('Verification email sent. Please check your inbox.')
        const endsAt = Date.now() + EMAIL_VERIFICATION_COOLDOWN_MS
        setCooldownEndsAt(endsAt)
        localStorage.setItem(`${COOLDOWN_STORAGE_KEY}_${trimmedEmail}`, endsAt.toString())
      }
    } catch (err) {
      setError('An error occurred while sending the verification email.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-surface/50 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-2 shadow-lg shadow-primary/30">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-muted text-sm">
            We sent a verification link to your inbox. Click it to activate your account.
          </p>
        </div>

        <div className="px-8 pb-8 space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="space-y-2 text-left">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Email</p>
            <p className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-black/20 text-sm">
              {email || 'No email found'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={loading || isCooldown || !email.trim()}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              {loading
                ? 'Sending...'
                : isCooldown
                  ? `Resend available in ${remainingSeconds}s`
                  : 'Resend verification email'}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-xs text-muted text-center">
            Don&apos;t see the email? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  )
}

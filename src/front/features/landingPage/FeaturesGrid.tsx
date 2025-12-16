import { CreditCard, Database, Lock, Mail } from 'lucide-react'

export function FeaturesGrid() {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything included</h2>
          <p className="text-muted text-lg">
            Don&apos;t reinvent the wheel. We&apos;ve handled the boring stuff so you can focus on
            what makes your product unique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Auth */}
          <div className="md:col-span-2 group relative bg-surface border border-white/5 rounded-2xl p-8 overflow-hidden hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Authentication & Users</h3>
              <p className="text-muted mb-8 max-w-md">
                Complete authentication system with secure login, social providers (Google, GitHub),
                email verification, and protected routes. User profile management included.
              </p>

              {/* Mock UI */}
              <div className="bg-background/50 rounded-lg p-4 border border-white/5 flex gap-4 items-center max-w-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                <div className="flex-1">
                  <div className="h-2 w-24 bg-white/20 rounded mb-2" />
                  <div className="h-2 w-32 bg-white/10 rounded" />
                </div>
                <div className="px-3 py-1 rounded-md bg-green-500/20 text-green-500 text-xs font-mono">
                  Active
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Payments */}
          <div className="bg-surface border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent mb-6">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Stripe Payments</h3>
            <p className="text-muted mb-6 text-sm">
              Subscription management, webhooks, and customer portal pre-configured.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm p-2 rounded bg-white/5">
                <span>Pro Plan</span>
                <span className="font-mono text-success">$29/m</span>
              </div>
              <div className="flex items-center justify-between text-sm p-2 rounded bg-white/5">
                <span>Team Plan</span>
                <span className="font-mono text-success">$99/m</span>
              </div>
            </div>
          </div>

          {/* Feature 3: Database */}
          <div className="bg-surface border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Postgres + Drizzle</h3>
            <p className="text-muted text-sm">
              Type-safe database interaction with Drizzle ORM. Automatic migrations and schema
              validation.
            </p>
          </div>

          {/* Feature 4: Emails */}
          <div className="md:col-span-2 bg-surface border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-colors relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500 mb-6">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Transactional Emails</h3>
                <p className="text-muted">
                  Beautiful React-based email templates. Send confirmations, reset passwords, and
                  notifications easily using Resend or SMTP.
                </p>
              </div>
              <div className="w-full md:w-64 bg-white text-black rounded-lg p-4 shadow-xl -rotate-2 transform hover:rotate-0 transition-transform">
                <div className="font-bold text-lg mb-2">Welcome aboard! 🚀</div>
                <p className="text-gray-500 text-xs mb-4">
                  Thanks for joining us. Here is your magic link to sign in...
                </p>
                <div className="w-full h-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-medium">
                  Sign In
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

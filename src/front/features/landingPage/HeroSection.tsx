import { CheckCircle, PlayCircle, UserPlus, Zap } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-mono text-muted">v2.0 is now available</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Ship your next SaaS
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            in days, not months.
          </span>
        </h1>

        <p className="text-xl text-muted max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          The ultimate production-ready boilerplate. Auth, payments, emails, and database
          pre-configured. Stop building infra, start building your product.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <button className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-md font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Get the Boilerplate
          </button>
          <button className="w-full sm:w-auto bg-transparent border border-muted/30 text-foreground px-8 py-4 rounded-md font-semibold text-lg hover:bg-surface hover:border-muted/50 transition-all flex items-center justify-center gap-2">
            <PlayCircle className="w-5 h-5" />
            View Demo
          </button>
        </div>

        {/* Hero Code Preview */}
        <div className="mt-20 relative mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="bg-[#0F1115] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="ml-4 text-xs font-mono text-muted">app/page.tsx</div>
            </div>
            <div className="p-6 overflow-x-auto text-left">
              <pre className="font-mono text-sm leading-relaxed text-muted">
                <code>
                  <span className="text-accent">import</span> {'{ Auth, Database, Stripe }'}{' '}
                  <span className="text-accent">from</span>{' '}
                  <span className="text-green-400">&apos;@boilerplate/core&apos;</span>;{'\n\n'}
                  <span className="text-accent">export default async function</span>{' '}
                  <span className="text-yellow-300">Page</span>() {'{'}
                  {'\n  '}
                  <span className="text-muted">{'// 1. Authenticated User'}</span>
                  {'\n  '}
                  <span className="text-accent">const</span> user ={' '}
                  <span className="text-accent">await</span> Auth.
                  <span className="text-blue-400">getUser</span>();
                  {'\n\n  '}
                  <span className="text-muted">{'// 2. Connected Database'}</span>
                  {'\n  '}
                  <span className="text-accent">const</span> projects ={' '}
                  <span className="text-accent">await</span> Database.
                  <span className="text-blue-400">query</span>(
                  <span className="text-green-400">&apos;projects&apos;</span>).
                  <span className="text-blue-400">where</span>
                  {'({ userId: user.id });'}
                  {'\n\n  '}
                  <span className="text-muted">{'// 3. Payment Status'}</span>
                  {'\n  '}
                  <span className="text-accent">const</span> subscription ={' '}
                  <span className="text-accent">await</span> Stripe.
                  <span className="text-blue-400">getSubscription</span>(user.id);
                  {'\n\n  '}
                  <span className="text-accent">return</span> ({'\n    '}
                  <span className="text-muted">&lt;</span>
                  <span className="text-red-400">Dashboard</span>
                  {'\n      '}
                  {'user={user}'}
                  {'\n      '}
                  {'data={projects}'}
                  {'\n      '}
                  {'plan={subscription.plan}'}
                  {'\n    '}
                  <span className="text-muted">/&gt;</span>
                  {'\n  '}
                  );
                  {'\n}'}
                </code>
              </pre>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -right-8 top-20 bg-surface/80 backdrop-blur border border-white/10 p-4 rounded-xl shadow-xl animate-bounce duration-[3000ms]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-muted">Payment Received</div>
                <div className="text-sm font-bold">$49.00</div>
              </div>
            </div>
          </div>

          <div className="absolute -left-8 bottom-20 bg-surface/80 backdrop-blur border border-white/10 p-4 rounded-xl shadow-xl animate-bounce duration-[4000ms]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-muted">New User</div>
                <div className="text-sm font-bold">+12 today</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

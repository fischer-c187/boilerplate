import { Link } from '@tanstack/react-router'

import { LandingIcon } from './icons'

const heroCodeHtml = String.raw`<span class="text-accent">import</span> { Auth, Database, Stripe } <span class="text-accent">from</span> <span class="text-green-400">'@boilerplate/core'</span>;

<span class="text-accent">export default async function</span> <span class="text-yellow-300">Page</span>() {
  <span class="text-muted">// 1. Authenticated User</span>
  <span class="text-accent">const</span> user = <span class="text-accent">await</span> Auth.<span class="text-blue-400">getUser</span>();

  <span class="text-muted">// 2. Connected Database</span>
  <span class="text-accent">const</span> projects = <span class="text-accent">await</span> Database.<span class="text-blue-400">query</span>(<span class="text-green-400">'projects'</span>).<span class="text-blue-400">where</span>({ userId: user.id });

  <span class="text-muted">// 3. Payment Status</span>
  <span class="text-accent">const</span> subscription = <span class="text-accent">await</span> Stripe.<span class="text-blue-400">getSubscription</span>(user.id);

  <span class="text-accent">return</span> (
    <span class="text-muted">&lt;</span><span class="text-red-400">Dashboard</span> 
      user={user} 
      data={projects}
      plan={subscription.plan} 
    <span class="text-muted">/&gt;</span>
  );
}`

function TestingIcon() {
  return (
    <svg
      className="w-3 h-3"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z" />
    </svg>
  )
}

function LandingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-lg">
            B
          </div>
          <span className="font-bold text-lg tracking-tight">boilerPPPPLATE</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#stack" className="hover:text-foreground transition-colors">
            Tech Stack
          </a>
          <a href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </a>
          <Link
            to="/secret"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <span>Dash</span>
            <LandingIcon name="layout-dashboard" className="w-3 h-3" />
          </Link>
          <Link
            to="/client"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <span>Testing</span>
            <TestingIcon />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="hidden md:block text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}

function LandingFooter() {
  return (
    <footer className="border-t border-white/5 py-12 mt-20 bg-surface/30">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-xs font-bold">
              B
            </div>
            <span className="font-bold tracking-tight">boilerPPPPLATE</span>
          </div>
          <p className="text-muted text-sm">Ship your SaaS in days, not months.</p>
        </div>

        <div className="flex gap-8 text-sm text-muted">
          <a href="#" className="hover:text-foreground transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Discord
          </a>
        </div>

        <p className="text-muted text-xs">© 2024 boilerPPPPLATE. All rights reserved.</p>
      </div>
    </footer>
  )
}

function TechMarqueeRow() {
  return (
    <>
      <span className="text-xl font-bold flex items-center gap-2">
        <LandingIcon name="box" className="w-5 h-5 text-[#61DAFB]" /> React 19
      </span>
      <span className="text-xl font-bold flex items-center gap-2">
        <LandingIcon name="wind" className="w-5 h-5 text-[#06B6D4]" /> Tailwind
      </span>
      <span className="text-xl font-bold flex items-center gap-2">
        <LandingIcon name="database" className="w-5 h-5 text-[#336791]" /> PostgreSQL
      </span>
      <span className="text-xl font-bold flex items-center gap-2">
        <LandingIcon name="credit-card" className="w-5 h-5 text-[#635BFF]" /> Stripe
      </span>
      <span className="text-xl font-bold flex items-center gap-2">
        <LandingIcon name="mail" className="w-5 h-5 text-[#F59E0B]" /> Resend
      </span>
      <span className="text-xl font-bold flex items-center gap-2">
        <LandingIcon name="shield" className="w-5 h-5 text-white" /> NextAuth
      </span>
      <span className="text-xl font-bold flex items-center gap-2">
        <LandingIcon name="bar-chart-2" className="w-5 h-5 text-[#FF7636]" /> PostHog
      </span>
      <span className="text-xl font-bold flex items-center gap-2">
        <LandingIcon name="globe" className="w-5 h-5 text-white" /> i18n
      </span>
    </>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />

      <main className="flex-grow pt-16">
        <section className="relative pt-20 pb-32 overflow-hidden">
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
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-md font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <LandingIcon name="zap" className="w-5 h-5" />
                Get the Boilerplate
              </Link>
              <Link
                to="/client"
                className="w-full sm:w-auto bg-transparent border border-muted/30 text-foreground px-8 py-4 rounded-md font-semibold text-lg hover:bg-surface hover:border-muted/50 transition-all flex items-center justify-center gap-2"
              >
                <LandingIcon name="play-circle" className="w-5 h-5" />
                View Demo
              </Link>
            </div>

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
                    <code dangerouslySetInnerHTML={{ __html: heroCodeHtml }} />
                  </pre>
                </div>
              </div>

              <div className="absolute -right-8 top-20 bg-surface/80 backdrop-blur border border-white/10 p-4 rounded-xl shadow-xl animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <LandingIcon name="check-circle" className="w-6 h-6" />
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
                    <LandingIcon name="user-plus" className="w-6 h-6" />
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

        <section id="stack" className="py-12 border-y border-white/5 bg-surface/30">
          <div className="max-w-6xl mx-auto px-6 mb-8 text-center">
            <p className="text-sm font-mono text-muted uppercase tracking-widest">
              Powered by modern technologies
            </p>
          </div>
          <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee flex gap-16 items-center min-w-full px-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <TechMarqueeRow />
            </div>
            <div className="absolute top-0 animate-marquee2 flex gap-16 items-center min-w-full px-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <TechMarqueeRow />
            </div>
          </div>
        </section>

        <section id="features" className="py-32 relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything included</h2>
              <p className="text-muted text-lg">
                Don&apos;t reinvent the wheel. We&apos;ve handled the boring stuff so you can focus
                on what makes your product unique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 group relative bg-surface border border-white/5 rounded-2xl p-8 overflow-hidden hover:border-primary/30 transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-6">
                    <LandingIcon name="lock" className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Authentication & Users</h3>
                  <p className="text-muted mb-8 max-w-md">
                    Complete authentication system with secure login, social providers (Google,
                    GitHub), email verification, and protected routes. User profile management
                    included.
                  </p>

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

              <div className="bg-surface border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent mb-6">
                  <LandingIcon name="credit-card" className="w-6 h-6" />
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

              <div className="bg-surface border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 mb-6">
                  <LandingIcon name="database" className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Postgres + Drizzle</h3>
                <p className="text-muted text-sm">
                  Type-safe database interaction with Drizzle ORM. Automatic migrations and schema
                  validation.
                </p>
              </div>

              <div className="md:col-span-2 bg-surface border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-colors relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="flex-1">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500 mb-6">
                      <LandingIcon name="mail" className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Transactional Emails</h3>
                    <p className="text-muted">
                      Beautiful React-based email templates. Send confirmations, reset passwords,
                      and notifications easily using Resend or SMTP.
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

        <section id="pricing" className="py-24 border-t border-white/5 bg-[#0D0D0D]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-muted">Pay once, own it forever. No monthly fees.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-surface border border-white/5 rounded-xl p-8 flex flex-col hover:border-white/10 transition-colors">
                <h3 className="text-xl font-medium mb-2">Starter</h3>
                <div className="text-3xl font-bold mb-6">$99</div>
                <p className="text-muted text-sm mb-8">
                  Perfect for hobby projects and experiments.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-muted">
                    <LandingIcon name="check" className="w-4 h-4 text-foreground" /> Single Project
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted">
                    <LandingIcon name="check" className="w-4 h-4 text-foreground" /> Authentication
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted">
                    <LandingIcon name="check" className="w-4 h-4 text-foreground" /> Database Setup
                  </li>
                </ul>
                <button
                  type="button"
                  className="w-full bg-surface border border-white/10 py-2 rounded-md font-medium text-sm hover:bg-white/5 transition-colors"
                >
                  Buy Starter
                </button>
              </div>

              <div className="bg-surface/50 border border-primary/50 rounded-xl p-8 flex flex-col relative shadow-lg shadow-primary/10 scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Best Value
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Pro Bundle</h3>
                <div className="text-4xl font-bold mb-6">$149</div>
                <p className="text-muted text-sm mb-8">
                  Everything you need to build a serious SaaS.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm">
                    <LandingIcon name="check" className="w-4 h-4 text-primary" /> Unlimited Projects
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <LandingIcon name="check" className="w-4 h-4 text-primary" />{' '}
                    <strong>Lifetime Updates</strong>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <LandingIcon name="check" className="w-4 h-4 text-primary" /> All Integrations
                    Included
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <LandingIcon name="check" className="w-4 h-4 text-primary" /> Premium Support
                  </li>
                </ul>
                <button
                  type="button"
                  className="w-full bg-primary text-white py-3 rounded-md font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                >
                  Get Pro Bundle
                </button>
              </div>

              <div className="bg-surface border border-white/5 rounded-xl p-8 flex flex-col hover:border-white/10 transition-colors">
                <h3 className="text-xl font-medium mb-2">Agency</h3>
                <div className="text-3xl font-bold mb-6">$299</div>
                <p className="text-muted text-sm mb-8">
                  For agencies and teams building multiple products.
                </p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-muted">
                    <LandingIcon name="check" className="w-4 h-4 text-foreground" /> Unlimited
                    Developers
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted">
                    <LandingIcon name="check" className="w-4 h-4 text-foreground" /> Commercial
                    License
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted">
                    <LandingIcon name="check" className="w-4 h-4 text-foreground" /> Priority
                    Support
                  </li>
                </ul>
                <button
                  type="button"
                  className="w-full bg-surface border border-white/10 py-2 rounded-md font-medium text-sm hover:bg-white/5 transition-colors"
                >
                  Buy Agency
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <details className="group bg-surface border border-white/5 rounded-lg open:border-primary/30 transition-all">
                <summary className="flex justify-between items-center cursor-pointer p-6 font-medium">
                  What frameworks do you use?
                  <LandingIcon
                    name="chevron-down"
                    className="w-5 h-5 text-muted group-open:rotate-180 transition-transform"
                  />
                </summary>
                <div className="px-6 pb-6 text-muted text-sm leading-relaxed">
                  We use the latest stable versions of React (Next.js), Tailwind CSS for styling,
                  and Node.js (Hono) for the backend. The database is PostgreSQL managed via Drizzle
                  ORM.
                </div>
              </details>

              <details className="group bg-surface border border-white/5 rounded-lg open:border-primary/30 transition-all">
                <summary className="flex justify-between items-center cursor-pointer p-6 font-medium">
                  Can I use this for client projects?
                  <LandingIcon
                    name="chevron-down"
                    className="w-5 h-5 text-muted group-open:rotate-180 transition-transform"
                  />
                </summary>
                <div className="px-6 pb-6 text-muted text-sm leading-relaxed">
                  Yes! The Agency license allows you to build unlimited projects for your clients.
                  The Starter and Pro plans are for your own personal or business projects.
                </div>
              </details>

              <details className="group bg-surface border border-white/5 rounded-lg open:border-primary/30 transition-all">
                <summary className="flex justify-between items-center cursor-pointer p-6 font-medium">
                  Do you offer refunds?
                  <LandingIcon
                    name="chevron-down"
                    className="w-5 h-5 text-muted group-open:rotate-180 transition-transform"
                  />
                </summary>
                <div className="px-6 pb-6 text-muted text-sm leading-relaxed">
                  Due to the nature of digital products (you get the full code immediately), we
                  generally do not offer refunds. However, if you have a technical issue we
                  can&apos;t solve, we&apos;ll happily refund you.
                </div>
              </details>

              <details className="group bg-surface border border-white/5 rounded-lg open:border-primary/30 transition-all">
                <summary className="flex justify-between items-center cursor-pointer p-6 font-medium">
                  How do I deploy this?
                  <LandingIcon
                    name="chevron-down"
                    className="w-5 h-5 text-muted group-open:rotate-180 transition-transform"
                  />
                </summary>
                <div className="px-6 pb-6 text-muted text-sm leading-relaxed">
                  The boilerplate is optimized for Vercel, Railway, or any Docker-compatible
                  hosting. We include a comprehensive deployment guide in the documentation.
                </div>
              </details>
            </div>
          </div>
        </section>

        <section className="py-24 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
              Stop wasting time on{' '}
              <span className="text-muted line-through decoration-danger decoration-4">
                boilerplate
              </span>
              .
            </h2>
            <p className="text-xl text-muted mb-10">Start building your profitable SaaS today.</p>
            <Link
              to="/signup"
              className="inline-block bg-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/30 hover:scale-105 transition-transform"
            >
              Get Instant Access
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}

import {
  CreditCard,
  LayoutDashboard,
  Mail,
  Play,
  Radar,
  Send,
  Server,
  ShoppingCart,
  Terminal,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { useDashLogs, type LogType } from './useDashLogs'

export function DashboardPage() {
  const { logs, addLog, clearLogs } = useDashLogs()

  return (
    <div className="p-6 md:p-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dash</h1>
            <p className="text-muted text-sm mt-1">
              Quick playground to test your boilerplate integrations
            </p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="glass rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted">Sandbox UI · actions are safe</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono text-muted">
            <span className="px-2 py-1 rounded-md border border-white/10 bg-black/20 flex items-center gap-2">
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </span>
            <span className="px-2 py-1 rounded-md border border-white/10 bg-black/20 flex items-center gap-2">
              <CreditCard className="w-3 h-3" />
              <span>Stripe</span>
            </span>
            <span className="px-2 py-1 rounded-md border border-white/10 bg-black/20 flex items-center gap-2">
              <Server className="w-3 h-3" />
              <span>API</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmailTestCard addLog={addLog} />
          <StripeTestCard addLog={addLog} />
          <ApiQuickTestsCard addLog={addLog} />
        </div>

        {/* Right: Logs + custom runner */}
        <div className="lg:col-span-1 space-y-6">
          <LogsPanel logs={logs} clearLogs={clearLogs} />
          <ApiRunnerCard addLog={addLog} />
        </div>
      </div>
    </div>
  )
}

// Email Test Card
function EmailTestCard({ addLog }: { addLog: (type: LogType, message: string) => void }) {
  const [result, setResult] = useState<{ type: LogType; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const to = formData.get('to') as string
    const template = formData.get('template') as string

    addLog('info', `Sending ${template} email to ${to}...`)

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ to, template }),
      })

      if (response.status === 404) throw new Error('Email endpoint not found')

      const text = await response.text()
      if (!response.ok) {
        addLog('error', `Email API error (${response.status})`)
        setResult({ type: 'error', message: text || `Request failed (${response.status})` })
        return
      }

      addLog('success', 'Email request accepted')
      setResult({ type: 'success', message: text || `✓ Email queued for ${to}` })
    } catch {
      addLog('warning', 'No backend detected, simulating send…')
      setTimeout(() => {
        const success = Math.random() > 0.15
        if (success) {
          addLog('success', `Email sent (simulated) to ${to}`)
          setResult({ type: 'success', message: `✓ ${template} delivered to ${to} (simulated)` })
        } else {
          addLog('error', `Email failed (simulated) to ${to}`)
          setResult({
            type: 'error',
            message: '✗ Email delivery failed. Check SMTP configuration.',
          })
        }
      }, 900)
    }
  }

  return (
    <div className="glass rounded-xl p-6 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Email</h3>
            <p className="text-xs text-muted">Send a test email payload</p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-mono bg-success/10 text-success border border-success/20 rounded">
          Ready
        </span>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wider">
            Recipient
          </label>
          <input
            type="email"
            name="to"
            placeholder="test@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-black/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all outline-none placeholder:text-muted/50"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wider">
            Template
          </label>
          <select
            name="template"
            className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-black/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all outline-none text-foreground"
          >
            <option value="welcome">welcome</option>
            <option value="reset-password">reset-password</option>
            <option value="invoice">invoice</option>
            <option value="notification">notification</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2.5 rounded-lg font-medium shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>

      {result && <ResultMessage type={result.type} message={result.message} />}
    </div>
  )
}

// Stripe Test Card
function StripeTestCard({ addLog }: { addLog: (type: LogType, message: string) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null)
  const [result, setResult] = useState<{ type: LogType; message: string } | null>(null)

  const plans = [
    { name: 'hobby', price: 29 },
    { name: 'pro', price: 79 },
    { name: 'agency', price: 199 },
  ]

  const handleSelectPlan = (plan: { name: string; price: number }) => {
    setSelectedPlan(plan)
    addLog('info', `Selected ${plan.name} plan ($${plan.price}/mo)`)
  }

  const handleCheckout = async () => {
    if (!selectedPlan) return

    addLog('info', `Creating Stripe checkout for ${selectedPlan.name}...`)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan.name }),
      })

      if (response.status === 404) throw new Error('Stripe checkout endpoint not found')

      const text = await response.text()
      if (!response.ok) {
        addLog('error', `Stripe API error (${response.status})`)
        setResult({ type: 'error', message: text || `Request failed (${response.status})` })
        return
      }

      addLog('success', 'Checkout session created')
      setResult({
        type: 'success',
        message: text || `✓ Checkout URL generated for ${selectedPlan.name}`,
      })
    } catch {
      addLog('warning', 'No backend detected, simulating checkout…')
      setTimeout(() => {
        addLog('success', 'Checkout session created (simulated)')
        setResult({
          type: 'success',
          message: `✓ Checkout URL generated for ${selectedPlan.name} ($${selectedPlan.price}/mo) (simulated)`,
        })
      }, 800)
    }
  }

  const handleWebhook = () => {
    addLog('info', 'Triggering Stripe webhook test…')
    setTimeout(() => {
      addLog('success', 'Webhook processed: payment_intent.succeeded')
      setResult({ type: 'success', message: '✓ Webhook processed successfully' })
    }, 700)
  }

  const handlePortal = () => {
    addLog('info', 'Opening customer portal…')
    setTimeout(() => {
      addLog('success', 'Portal URL generated (simulated)')
      setResult({ type: 'info', message: '✓ Portal URL generated (simulated)' })
    }, 600)
  }

  return (
    <div className="glass rounded-xl p-6 hover:border-accent/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent/20 transition-all">
            <CreditCard className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Stripe</h3>
            <p className="text-xs text-muted">Create a checkout session</p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-mono bg-warning/10 text-warning border border-warning/20 rounded">
          Test Mode
        </span>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wider">Plan</label>
          <div className="grid grid-cols-3 gap-2">
            {plans.map((plan) => (
              <button
                key={plan.name}
                type="button"
                onClick={() => handleSelectPlan(plan)}
                className={`px-3 py-2 rounded-lg border transition-all text-center ${
                  selectedPlan?.name === plan.name
                    ? 'border-accent bg-accent/10'
                    : 'border-white/10 bg-black/20 hover:border-accent/50'
                }`}
              >
                <div className="text-sm font-semibold capitalize">{plan.name}</div>
                <div className="text-xs text-muted">${plan.price}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => void handleCheckout()}
          disabled={!selectedPlan}
          className="w-full bg-accent text-white py-2.5 rounded-lg font-medium shadow-md shadow-accent/20 hover:bg-accent/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Open Checkout</span>
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleWebhook}
            className="flex-1 bg-surface border border-white/10 text-muted py-2 rounded-lg text-sm hover:border-accent/30 hover:text-accent transition-all"
          >
            Test webhook
          </button>
          <button
            type="button"
            onClick={handlePortal}
            className="flex-1 bg-surface border border-white/10 text-muted py-2 rounded-lg text-sm hover:border-accent/30 hover:text-accent transition-all"
          >
            Customer portal
          </button>
        </div>
      </div>

      {result && <ResultMessage type={result.type} message={result.message} />}
    </div>
  )
}

// API Quick Tests Card
function ApiQuickTestsCard({ addLog }: { addLog: (type: LogType, message: string) => void }) {
  const [result, setResult] = useState<{ type: LogType; message: string } | null>(null)

  const runRequest = async (method: string, path: string, body?: unknown) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    addLog('info', `${method} ${normalizedPath}`)

    try {
      const options: RequestInit = { method, headers: {} }
      if (body && method !== 'GET' && method !== 'HEAD') {
        options.headers = { 'content-type': 'application/json' }
        options.body = JSON.stringify(body)
      }

      const response = await fetch(normalizedPath, options)
      const text = await response.text()

      addLog(response.ok ? 'success' : 'error', `${method} → ${response.status}`)
      setResult({
        type: response.ok ? 'success' : 'error',
        message: text || `${response.status} ${response.statusText}`,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      addLog('error', 'Request failed (no backend?)')
      setResult({ type: 'error', message })
    }
  }

  return (
    <div className="glass rounded-xl p-6 hover:border-primary/30 transition-all group md:col-span-2">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">API Quick Tests</h3>
            <p className="text-xs text-muted">Ping common endpoints</p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-mono bg-success/10 text-success border border-success/20 rounded">
          Runner
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => void runRequest('GET', '/api/health')}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-white/10 bg-black/20 hover:border-success/50 transition-all text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>GET /api/health</span>
          </div>
          <Play className="w-3 h-3 text-muted" />
        </button>
        <button
          type="button"
          onClick={() => void runRequest('GET', '/api/status')}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-white/10 bg-black/20 hover:border-success/50 transition-all text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>GET /api/status</span>
          </div>
          <Play className="w-3 h-3 text-muted" />
        </button>
        <button
          type="button"
          onClick={() =>
            void runRequest('POST', '/api/webhooks/stripe', { event: 'payment_intent.succeeded' })
          }
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-white/10 bg-black/20 hover:border-accent/50 transition-all text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>POST /api/webhooks/stripe</span>
          </div>
          <Play className="w-3 h-3 text-muted" />
        </button>
      </div>

      {result && <ResultMessage type={result.type} message={result.message} />}
    </div>
  )
}

// Logs Panel
function LogsPanel({
  logs,
  clearLogs,
}: {
  logs: Array<{ id: string; type: LogType; message: string; timestamp: string }>
  clearLogs: () => void
}) {
  const colorMap: Record<LogType, string> = {
    success: 'text-success',
    error: 'text-danger',
    info: 'text-primary',
    warning: 'text-warning',
  }

  return (
    <div className="glass rounded-xl p-6 hover:border-muted/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted/20 border border-muted/30 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-muted" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Logs</h3>
            <p className="text-xs text-muted">Dash activity output</p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearLogs}
          className="px-3 py-1.5 text-xs font-medium text-muted hover:text-danger border border-white/10 rounded-lg hover:border-danger/30 transition-all"
        >
          Clear
        </button>
      </div>

      <div className="h-56 overflow-y-auto bg-black/40 border border-white/5 rounded-lg p-4 font-mono text-xs space-y-1 no-scrollbar">
        {logs.map((log) => (
          <div key={log.id} className="text-muted">
            <span className={colorMap[log.type]}>[{log.type.toUpperCase()}]</span> {log.timestamp} -{' '}
            {log.message}
          </div>
        ))}
      </div>
    </div>
  )
}

// API Runner Card
function ApiRunnerCard({ addLog }: { addLog: (type: LogType, message: string) => void }) {
  const [result, setResult] = useState<{ type: LogType; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const method = (formData.get('method') as string).toUpperCase()
    const path = formData.get('path') as string
    const bodyText = (formData.get('body') as string).trim()

    let body: unknown
    if (bodyText) {
      try {
        body = JSON.parse(bodyText)
      } catch {
        setResult({ type: 'warning', message: 'Body is not valid JSON. Sending as raw text.' })
      }
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    addLog('info', `${method} ${normalizedPath}`)

    try {
      const options: RequestInit = { method, headers: {} }
      if (bodyText && method !== 'GET' && method !== 'HEAD') {
        options.headers = { 'content-type': 'application/json' }
        options.body = typeof body === 'string' ? body : JSON.stringify(body ?? bodyText)
      }

      const response = await fetch(normalizedPath, options)
      const text = await response.text()

      addLog(response.ok ? 'success' : 'error', `${method} → ${response.status}`)
      setResult({
        type: response.ok ? 'success' : 'error',
        message: text || `${response.status} ${response.statusText}`,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      addLog('error', 'Request failed (no backend?)')
      setResult({ type: 'error', message })
    }
  }

  return (
    <div className="glass rounded-xl p-6 hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Radar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">API Runner</h3>
            <p className="text-xs text-muted">Run a custom request</p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <select
            name="method"
            className="col-span-1 w-full px-3 py-2.5 rounded-lg border border-white/10 bg-black/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all outline-none text-foreground font-mono text-xs"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input
            name="path"
            placeholder="/api/health"
            className="col-span-2 w-full px-3 py-2.5 rounded-lg border border-white/10 bg-black/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all outline-none placeholder:text-muted/50 font-mono text-xs"
            required
          />
        </div>

        <textarea
          name="body"
          rows={4}
          placeholder='{"hello":"world"} (optional)'
          className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-black/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all outline-none placeholder:text-muted/50 font-mono text-xs"
        />

        <button
          type="submit"
          className="w-full bg-foreground text-background py-2.5 rounded-lg font-medium hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          <span>Run</span>
        </button>
      </form>

      {result && <ResultMessage type={result.type} message={result.message} />}
    </div>
  )
}

// Result Message Component
function ResultMessage({ type, message }: { type: LogType; message: string }) {
  const variants: Record<LogType, string> = {
    success: 'bg-success/10 border-success/30 text-success',
    error: 'bg-danger/10 border-danger/30 text-danger',
    info: 'bg-primary/10 border-primary/30 text-primary',
    warning: 'bg-warning/10 border-warning/30 text-warning',
  }

  return (
    <div
      className={`mt-4 p-3 rounded-lg border text-sm ${variants[type]} animate-in fade-in slide-in-from-top-2`}
    >
      {message}
    </div>
  )
}

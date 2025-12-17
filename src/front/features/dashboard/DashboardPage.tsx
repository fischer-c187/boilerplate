import { LayoutDashboard, Mail, CreditCard, Server } from 'lucide-react'
import { useDashLogs } from './hooks/useDashLogs'
import { EmailTestCard } from './components/EmailTestCard'
import { StripeTestCard } from './components/StripeTestCard'
import { ApiQuickTestsCard } from './components/ApiQuickTestsCard'
import { LogsPanel } from './components/LogsPanel'
import { ApiRunnerCard } from './components/ApiRunnerCard'

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

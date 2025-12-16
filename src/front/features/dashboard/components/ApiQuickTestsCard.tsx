import { Play, Zap } from 'lucide-react'
import { useState } from 'react'
import type { LogType } from '../hooks/useDashLogs'
import { ResultMessage } from './ResultMessage'

export function ApiQuickTestsCard({
  addLog,
}: {
  addLog: (type: LogType, message: string) => void
}) {
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

import { Play, Radar } from 'lucide-react'
import { useState } from 'react'
import type { LogType } from '../hooks/useDashLogs'
import { ResultMessage } from './ResultMessage'

export function ApiRunnerCard({ addLog }: { addLog: (type: LogType, message: string) => void }) {
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

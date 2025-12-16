import { Terminal } from 'lucide-react'
import type { LogType } from '../hooks/useDashLogs'

export function LogsPanel({
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

import type { LogType } from '../hooks/useDashLogs'

export function ResultMessage({ type, message }: { type: LogType; message: string }) {
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

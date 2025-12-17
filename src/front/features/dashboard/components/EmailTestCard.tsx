import { Mail, Send } from 'lucide-react'
import { useState } from 'react'
import type { LogType } from '../hooks/useDashLogs'
import { ResultMessage } from './ResultMessage'

export function EmailTestCard({ addLog }: { addLog: (type: LogType, message: string) => void }) {
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

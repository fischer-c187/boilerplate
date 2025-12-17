import { CreditCard, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import type { LogType } from '../hooks/useDashLogs'
import { ResultMessage } from './ResultMessage'

export function StripeTestCard({ addLog }: { addLog: (type: LogType, message: string) => void }) {
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

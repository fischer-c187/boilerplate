import { client } from '@/shared/api-client/client'
import { CreditCard, ExternalLink, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { LogType } from '../hooks/useDashLogs'
import { ResultMessage } from './ResultMessage'

interface Plan {
  id: string
  name: string
  stripePriceId: string | null
  price: number
  currency: string
  interval: string | null
  isActive: boolean
}

export function StripeTestCard({ addLog }: { addLog: (type: LogType, message: string) => void }) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [result, setResult] = useState<{ type: LogType; message: string; url?: string } | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)

  // Load plans on mount
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await client.stripe.plans.$get()
        if (response.ok) {
          const data = (await response.json()) as Plan[]
          setPlans(data.filter((p: Plan) => p.isActive && p.stripePriceId))
          addLog('info', `Loaded ${data.length} plan(s) from database`)
        }
      } catch {
        addLog('warning', 'Could not load plans, using fallback')
        // Fallback plans for testing
        setPlans([
          {
            id: 'test-1',
            name: 'Test Plan',
            stripePriceId: 'price_test',
            price: 1000,
            currency: 'eur',
            interval: 'month',
            isActive: true,
          },
        ])
      }
    }
    void loadPlans()
  }, [addLog])

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan)
    setResult(null)
    addLog(
      'info',
      `Selected ${plan.name} (${(plan.price / 100).toFixed(2)} ${plan.currency}/${plan.interval})`
    )
  }

  const handleCheckout = async () => {
    if (!selectedPlan || !selectedPlan.stripePriceId) return

    setIsLoading(true)
    addLog('info', `Creating Stripe checkout for ${selectedPlan.name}...`)

    try {
      const response = await client.stripe.checkout.subscription.$post({
        json: { priceId: selectedPlan.stripePriceId },
      })

      if (response.status !== 200) {
        const data = await response.json()
        addLog('error', `Stripe API error: ${data.error?.message || 'Unknown error'}`)
        setResult({ type: 'error', message: `✗ ${data.error?.message || 'Unknown error'}` })
        return
      }

      const data = await response.json()
      addLog('success', `Checkout session created: ${data.id}`)
      setResult({
        type: 'success',
        message: `✓ Checkout session ready for ${selectedPlan.name}`,
        url: data.url as string,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      addLog('error', `Failed to create checkout: ${errorMessage}`)
      setResult({ type: 'error', message: `✗ ${errorMessage}` })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePortal = async () => {
    setIsLoading(true)
    addLog('info', 'Creating customer portal session...')

    try {
      const response = await client.stripe.portal.$post()

      if (response.status !== 200) {
        const data = await response.json()
        const errorMessage = data.error?.message || 'Unknown error'
        addLog('error', `Portal error: ${errorMessage}`)
        setResult({ type: 'error', message: `✗ ${errorMessage}` })
        return
      }

      const data = await response.json()
      if (data.url) {
        addLog('success', 'Portal session created')
        setResult({
          type: 'success',
          message: '✓ Portal session ready',
          url: data.url,
        })
      } else {
        addLog('warning', 'Portal created but no URL returned')
        setResult({ type: 'warning', message: '✓ Portal created (no URL)' })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      addLog('error', `Failed to create portal: ${errorMessage}`)
      setResult({ type: 'error', message: `✗ ${errorMessage}` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank')
    addLog('info', 'Opened Stripe URL in new tab')
  }

  return (
    <div className="glass rounded-xl p-6 hover:border-accent/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-accent/20 transition-all">
            <CreditCard className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Stripe Integration</h3>
            <p className="text-xs text-muted">Test checkout and portal</p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-mono bg-warning/10 text-warning border border-warning/20 rounded">
          Live
        </span>
      </div>

      <div className="space-y-4">
        {/* Plans selection */}
        {plans.length > 0 ? (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted uppercase tracking-wider">
              Select Plan
            </label>
            <div className="grid grid-cols-2 gap-2">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  className={`px-3 py-2 rounded-lg border transition-all text-left ${
                    selectedPlan?.id === plan.id
                      ? 'border-accent bg-accent/10'
                      : 'border-white/10 bg-black/20 hover:border-accent/50'
                  }`}
                >
                  <div className="text-sm font-semibold">{plan.name}</div>
                  <div className="text-xs text-muted">
                    {(plan.price / 100).toFixed(2)} {plan.currency}/{plan.interval}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted text-center py-4">
            Loading plans... Run{' '}
            <code className="text-xs bg-black/40 px-1 rounded">pnpm plan:init</code> to create plans
          </div>
        )}

        {/* Checkout button */}
        <button
          onClick={() => void handleCheckout()}
          disabled={!selectedPlan || isLoading}
          className="w-full bg-accent text-white py-2.5 rounded-lg font-medium shadow-md shadow-accent/20 hover:bg-accent/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isLoading ? 'Creating...' : 'Create Checkout Session'}</span>
        </button>

        {/* Portal button */}
        <button
          type="button"
          onClick={() => void handlePortal()}
          disabled={isLoading}
          className="w-full bg-surface border border-white/10 text-muted py-2 rounded-lg text-sm hover:border-accent/30 hover:text-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Open Customer Portal'}
        </button>
      </div>

      {/* Result with optional URL */}
      {result && (
        <div className="mt-4">
          <ResultMessage type={result.type} message={result.message} />
          {result.url && (
            <button
              type="button"
              onClick={() => handleOpenUrl(result.url!)}
              className="mt-2 w-full bg-accent/10 border border-accent/30 text-accent py-2 rounded-lg text-sm hover:bg-accent/20 transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Stripe Page</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

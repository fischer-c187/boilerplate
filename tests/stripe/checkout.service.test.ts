import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkoutService } from '@/server/services/stripe/checkout.service'
import { planRepository } from '@/server/repositories/stripe/plan.repository'
import { customerService } from '@/server/services/stripe/customer.service'
import { ValidationError } from '@/server/lib/errors'
import { StripeApiError, StripePlanNotFoundError } from '@/server/services/stripe/errors'

const stripeCheckoutCreate = vi.hoisted(() => vi.fn())
const stripePortalCreate = vi.hoisted(() => vi.fn())

vi.mock('@/server/config/env', () => ({
  env: {
    VITE_BASE_URL: 'http://example.com',
  },
}))

vi.mock('@/server/adaptaters/db/postgres', () => ({
  default: {},
}))

vi.mock('@/server/repositories/stripe/plan.repository', () => ({
  planRepository: {
    findActiveByPriceId: vi.fn(),
  },
}))

vi.mock('@/server/services/stripe/customer.service', () => ({
  customerService: {
    getOrCreate: vi.fn(),
    getByUserId: vi.fn(),
  },
}))

vi.mock('@/server/adaptaters/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: stripeCheckoutCreate,
      },
    },
    billingPortal: {
      sessions: {
        create: stripePortalCreate,
      },
    },
  },
}))

describe('checkoutService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws ValidationError when input is invalid', async () => {
    await expect(
      checkoutService.createSubscriptionCheckout('', 'bad', '', undefined)
    ).rejects.toBeInstanceOf(ValidationError)
  })

  it('throws StripePlanNotFoundError when plan is missing', async () => {
    ;(customerService.getOrCreate as ReturnType<typeof vi.fn>).mockResolvedValue({
      stripeCustomerId: 'cus_1',
    })
    ;(planRepository.findActiveByPriceId as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    await expect(
      checkoutService.createSubscriptionCheckout('user_1', 'user@example.com', 'price_1')
    ).rejects.toBeInstanceOf(StripePlanNotFoundError)
  })

  it('creates a checkout session when inputs are valid', async () => {
    const session = { id: 'sess_1' }

    ;(customerService.getOrCreate as ReturnType<typeof vi.fn>).mockResolvedValue({
      stripeCustomerId: 'cus_1',
    })
    ;(planRepository.findActiveByPriceId as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'plan_1',
    })
    stripeCheckoutCreate.mockResolvedValue(session)

    const result = await checkoutService.createSubscriptionCheckout(
      'user_1',
      'user@example.com',
      'price_1',
      'Test User'
    )

    expect(result).toBe(session)
    expect(stripeCheckoutCreate).toHaveBeenCalledWith({
      customer: 'cus_1',
      mode: 'subscription',
      success_url: 'http://example.com/success',
      cancel_url: 'http://example.com/cancel',
      line_items: [{ price: 'price_1', quantity: 1 }],
      metadata: { userId: 'user_1' },
    })
  })

  it('wraps unexpected errors in StripeApiError', async () => {
    ;(customerService.getOrCreate as ReturnType<typeof vi.fn>).mockResolvedValue({
      stripeCustomerId: 'cus_1',
    })
    ;(planRepository.findActiveByPriceId as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'plan_1',
    })
    stripeCheckoutCreate.mockRejectedValue(new Error('boom'))

    await expect(
      checkoutService.createSubscriptionCheckout('user_1', 'user@example.com', 'price_1')
    ).rejects.toBeInstanceOf(StripeApiError)
  })

  it('creates a billing portal session', async () => {
    const session = { id: 'portal_1' }

    ;(customerService.getByUserId as ReturnType<typeof vi.fn>).mockResolvedValue({
      stripeCustomerId: 'cus_1',
    })
    stripePortalCreate.mockResolvedValue(session)

    const result = await checkoutService.createPortalSession('user_1')

    expect(result).toBe(session)
    expect(stripePortalCreate).toHaveBeenCalledWith({
      customer: 'cus_1',
      return_url: 'http://example.com',
    })
  })

  it('throws ValidationError for invalid portal input', async () => {
    await expect(checkoutService.createPortalSession('')).rejects.toBeInstanceOf(ValidationError)
  })

  it('wraps portal errors in StripeApiError', async () => {
    ;(customerService.getByUserId as ReturnType<typeof vi.fn>).mockResolvedValue({
      stripeCustomerId: 'cus_1',
    })
    stripePortalCreate.mockRejectedValue(new Error('fail'))

    await expect(checkoutService.createPortalSession('user_1')).rejects.toBeInstanceOf(
      StripeApiError
    )
  })
})

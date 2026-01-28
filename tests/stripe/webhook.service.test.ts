import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/server/config/env', () => ({
  env: {
    STRIPE_WEBHOOK_SECRET: 'whsec_test',
  },
}))

vi.mock('@/server/adaptaters/db/postgres', () => ({
  default: {},
}))

vi.mock('@/server/repositories/stripe/webhook.repository', () => ({
  webhookRepository: {
    findById: vi.fn(),
    create: vi.fn(),
    updateProcessingStatus: vi.fn(),
  },
}))

vi.mock('@/server/services/stripe/subscription.service', () => ({
  subscriptionService: {
    syncFromStripe: vi.fn(),
  },
}))

vi.mock('@/server/services/stripe/invoice.service', () => ({
  invoiceService: {
    syncFromStripe: vi.fn(),
  },
}))

vi.mock('@/server/adaptaters/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}))

import { webhookService } from '@/server/services/stripe/webhook.service'
import { stripe } from '@/server/adaptaters/stripe'
import { webhookRepository } from '@/server/repositories/stripe/webhook.repository'
import { subscriptionService } from '@/server/services/stripe/subscription.service'
import { invoiceService } from '@/server/services/stripe/invoice.service'
import { ValidationError } from '@/server/lib/errors'
import { StripeWebhookError } from '@/server/services/stripe/errors'

describe('webhookService.verifySignature', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws ValidationError when input is invalid', () => {
    expect(() => webhookService.verifySignature('', '')).toThrow(ValidationError)
  })

  it('returns event when signature is valid', () => {
    const event = { id: 'evt_1', type: 'test' }
    ;(stripe.webhooks.constructEvent as ReturnType<typeof vi.fn>).mockReturnValue(event)

    const result = webhookService.verifySignature('sig', 'body')

    expect(result).toBe(event)
  })

  it('wraps stripe errors in StripeWebhookError', () => {
    ;(stripe.webhooks.constructEvent as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('bad signature')
    })

    expect(() => webhookService.verifySignature('sig', 'body')).toThrow(StripeWebhookError)
  })
})

describe('webhookService.processEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns false when event already processed', async () => {
    ;(webhookRepository.findById as ReturnType<typeof vi.fn>).mockResolvedValue({
      processed: true,
    })

    const result = await webhookService.processEvent({
      id: 'evt_1',
      type: 'customer.subscription.created',
      data: { object: { id: 'sub_1' } },
    } as any)

    expect(result).toBe(false)
    expect(webhookRepository.create).not.toHaveBeenCalled()
  })

  it('processes subscription events and marks processed', async () => {
    ;(webhookRepository.findById as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(webhookRepository.create as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)
    ;(subscriptionService.syncFromStripe as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)
    ;(webhookRepository.updateProcessingStatus as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined
    )

    const result = await webhookService.processEvent({
      id: 'evt_2',
      type: 'customer.subscription.created',
      data: { object: { id: 'sub_2' } },
    } as any)

    expect(result).toBe(true)
    expect(subscriptionService.syncFromStripe).toHaveBeenCalledWith('sub_2', expect.anything())
    expect(webhookRepository.updateProcessingStatus).toHaveBeenCalledWith(
      'evt_2',
      expect.objectContaining({ processed: true }),
      expect.anything()
    )
  })

  it('processes invoice events', async () => {
    ;(webhookRepository.findById as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(webhookRepository.create as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)
    ;(invoiceService.syncFromStripe as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)
    ;(webhookRepository.updateProcessingStatus as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined
    )

    const result = await webhookService.processEvent({
      id: 'evt_3',
      type: 'invoice.paid',
      data: { object: { id: 'inv_1' } },
    } as any)

    expect(result).toBe(true)
    expect(invoiceService.syncFromStripe).toHaveBeenCalledWith('inv_1', expect.anything())
  })

  it('stores error and throws StripeWebhookError on processing failure', async () => {
    ;(webhookRepository.findById as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    ;(webhookRepository.create as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)
    ;(subscriptionService.syncFromStripe as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('fail')
    )
    ;(webhookRepository.updateProcessingStatus as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined
    )

    await expect(
      webhookService.processEvent({
        id: 'evt_4',
        type: 'customer.subscription.updated',
        data: { object: { id: 'sub_4' } },
      } as any)
    ).rejects.toBeInstanceOf(StripeWebhookError)

    expect(webhookRepository.updateProcessingStatus).toHaveBeenCalledWith(
      'evt_4',
      expect.objectContaining({ processed: false }),
      expect.anything()
    )
  })
})

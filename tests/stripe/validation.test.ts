import { describe, expect, it } from 'vitest'
import { isValidSubscriptionStatus } from '@/server/services/stripe/validation'

describe('stripe validation', () => {
  it('accepts valid subscription statuses', () => {
    expect(isValidSubscriptionStatus('active')).toBe(true)
  })

  it('rejects invalid subscription statuses', () => {
    expect(isValidSubscriptionStatus('not-a-status')).toBe(false)
  })
})

import { describe, expect, it, vi } from 'vitest'

const getSession = vi.hoisted(() => vi.fn())

vi.mock('@/server/adaptaters/auth/auth', () => ({
  auth: {
    api: {
      getSession,
    },
  },
}))

import { getAuthenticatedUser, requireAuth } from '@/server/middleware/auth'

describe('requireAuth middleware', () => {
  it('sets user and calls next when session exists', async () => {
    getSession.mockResolvedValue({ user: { id: 'user_1' } })

    const ctx = {
      req: { raw: new Request('http://localhost') },
      set: vi.fn(),
      json: vi.fn(),
    } as unknown as Parameters<typeof requireAuth>[0]

    const next = vi.fn()

    await requireAuth(ctx, next)

    expect(ctx.set).toHaveBeenCalledWith('user', { id: 'user_1' })
    expect(next).toHaveBeenCalled()
  })

  it('returns 401 and does not call next when no user session', async () => {
    getSession.mockResolvedValue(null)

    const ctx = {
      req: { raw: new Request('http://localhost') },
      set: vi.fn(),
      json: vi.fn(),
    } as unknown as Parameters<typeof requireAuth>[0]

    const next = vi.fn()

    await requireAuth(ctx, next)

    expect(ctx.json).toHaveBeenCalledWith(
      { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
      401
    )
    expect(next).not.toHaveBeenCalled()
  })
})

describe('getAuthenticatedUser', () => {
  it('throws when user is missing in context', () => {
    const ctx = { get: vi.fn().mockReturnValue(undefined) } as unknown as Parameters<
      typeof getAuthenticatedUser
    >[0]

    expect(() => getAuthenticatedUser(ctx)).toThrow('User not found in context')
  })
})

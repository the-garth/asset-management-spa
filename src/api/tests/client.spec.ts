import { describe, it, expect, afterEach, vi } from 'vitest'
import { apiGet, ApiError } from '../client'

describe('apiGet', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).fetch
  })

  it('resolves with parsed JSON when response is ok', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    vi.stubGlobal('fetch', mockFetch)

    const res = await apiGet<{ success: boolean }>('/ping')

    expect(res).toEqual({ success: true })
    expect(mockFetch).toHaveBeenCalledWith('/ping')
  })

  it('rejects with ApiError containing status and message from body when response is not ok', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: () => Promise.resolve('no body'),
    })

    vi.stubGlobal('fetch', mockFetch)

    const p = apiGet('/missing')
    await expect(p).rejects.toBeInstanceOf(ApiError)
    await expect(p).rejects.toMatchObject({ status: 404, message: 'no body' })
  })
})
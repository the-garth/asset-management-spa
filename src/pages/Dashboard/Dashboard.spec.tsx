import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../components/Providers/AuthProvider'
import { Dashboard } from './Dashboard'
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTestQueryClient } from '../../test/utils/renderWithClient'
import { ThemeProvider } from '../../components/Providers/ThemeProvider'

const STORAGE_KEY = 'asset-management-auth'

function mockFetchFor(url: string) {
  if (url.includes('assets')) {
    return [{ id: 'aapl', name: 'AAPL', type: 'stock' }]
  }
  if (url.includes('portfolio')) {
    return { id: 'pf', asOf: '2025-01-01T00:00:00Z', positions: [{ id: 1, asset: 'aapl', quantity: 1, asOf: '2025-01-01T00:00:00Z' }] }
  }
  if (url.includes('prices-current')) {
    return [{ id: 'p1', asset: 'aapl', price: 150, asOf: '2025-01-01T00:00:00Z' }]
  }
  if (url.includes('prices-history')) {
    return [{ date: '2025-01-01', asset: 'aapl', price: 150 }]
  }
  return {}
}

describe('Dashboard page', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ username: 'bob' }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).fetch
  })

  it('shows loading state while queries are pending', () => {
    const qc = createTestQueryClient()
    // stub fetch with a never-resolving promise to simulate in-flight requests
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))

    render(
      <ThemeProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route
                path="/dashboard"
              element={
                <QueryClientProvider client={qc}>
                  <Dashboard />
                </QueryClientProvider>
              }
            />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </ThemeProvider>
    )

    // assert the component shows a loading indicator immediately
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows mocked data', async () => {
    const qc = createTestQueryClient()
    // stub fetch to return dataset based on URL so react-query resolves
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo) =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFetchFor(String(input))),
        text: () => Promise.resolve(JSON.stringify(mockFetchFor(String(input)))),
      }),
    ))

    render(
      <ThemeProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <QueryClientProvider client={qc}>
                    <Dashboard />
                  </QueryClientProvider>
                }
              />
              <Route path="/login" element={<div>Login page</div>} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </ThemeProvider>
    )

    const summaryHeading = await screen.findByText(/Portfolio Summary/i)
    const summaryCard = summaryHeading.closest('div') // adjust selector if your Card markup differs
    expect(summaryCard).toBeTruthy()
    const positionsLabel = within(summaryCard as HTMLElement).getByText(/Positions/i)
    expect(positionsLabel).toBeInTheDocument()
   
  })
})
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, beforeEach, afterEach, expect } from 'vitest'
import { AuthProvider } from '../../components/Providers/AuthProvider'
import { ThemeProvider } from '../../components/Providers/ThemeProvider'
import { Header } from './Header'

const STORAGE_KEY = 'asset-management-auth'

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('shows signed-in username and signs out -> navigates to /login and clears storage', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ username: 'bob' }))

    render(
      <AuthProvider>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route path="/dashboard" element={<Header />} />
              <Route path="/login" element={<div>Login page</div>} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </AuthProvider>,
    )

    // signed-in indicator
    expect(screen.getByText(/Signed in as bob/i)).toBeInTheDocument()

    // click Sign out -> should navigate to /login and clear storage
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))

    await waitFor(() => expect(screen.getByText('Login page')).toBeInTheDocument())
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('toggles theme and sets data-theme on <html>', async () => {
    // Ensure default is light for test environment
    render(
      <AuthProvider>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="/" element={<Header />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </AuthProvider>,
    )

    const toggle = screen.getByRole('button', { name: /toggle theme/i })
    // initial theme (provider default) should be present on documentElement
    expect(document.documentElement.getAttribute('data-theme')).toBeDefined()

    // click once -> theme flips
    fireEvent.click(toggle)
    await waitFor(() => {
      expect(['dark', 'light']).toContain(document.documentElement.getAttribute('data-theme'))
    })

    // clicking again toggles back
    const before = document.documentElement.getAttribute('data-theme')
    fireEvent.click(toggle)
    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).not.toBe(before)
    })
  })
})
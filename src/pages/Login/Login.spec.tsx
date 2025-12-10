import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../../components/Providers/AuthProvider'
import { Login } from './Login'

describe('Login page', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.useRealTimers())

  it('submits, signs in and navigates to /dashboard', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'john')
    const button = screen.getByRole('button', { name: /sign in/i })
    await userEvent.click(button)

    // allow the real 400ms fake-auth timeout to complete; give a bit more time
    await waitFor(() => expect(screen.getByText('Dashboard')).toBeInTheDocument(), { timeout: 2000 })
    expect(localStorage.getItem('asset-management-auth')).toBe(JSON.stringify({ username: 'john' }))
  })

  it('shows validation error when submitting with no username', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )

    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: /sign in/i })

    // button should be disabled when username is empty
    expect(button).toBeDisabled()

    // submit the form programmatically to exercise validation path
    const form = input.closest('form') as HTMLFormElement
    fireEvent.submit(form)

    // validation error shown and no localStorage entry or navigation
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/please enter a username/i))
    expect(localStorage.getItem('asset-management-auth')).toBeNull()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })
})
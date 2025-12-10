import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../../components/Providers/AuthProvider'
import { Login } from './Login'

const mockSignin = vi.fn()

vi.mock('../../components/Providers/AuthProvider', () => {
  return {
    // pass-through provider so tests can render <AuthProvider> wrapper
    AuthProvider: ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    // mocked hook used by the Login component
    useAuth: () => ({
      signin: mockSignin,
    }),
  }
})


describe('Login page', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.useRealTimers())

  it('submits username, calls signin and navigates to /dashboard', async () => {
    mockSignin.mockResolvedValueOnce(undefined)

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

    fireEvent.change(screen.getByRole('textbox', { name: /username/i }), { target: { value: 'alice' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    // signin called with username
    expect(mockSignin).toHaveBeenCalledWith('alice')

    // navigation to dashboard (rendered placeholder)
    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
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
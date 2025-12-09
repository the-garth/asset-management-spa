import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../components/Providers/AuthProvider'
import { Dashboard } from './Dashboard'
import { describe, beforeEach, it, expect } from 'vitest'

const STORAGE_KEY = 'asset-management-auth'

describe('Dashboard page', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ username: 'bob' }))
  })

  it('shows username and signs out to /login', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )

    expect(screen.getByText(/Welcome, bob/i)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Sign out'))
    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/Providers/AuthProvider'
import { Card } from '../../components/layout/Card'

type LocationState = {
  from?: { pathname: string }
}

export const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LocationState) || {}
  const from = state.from?.pathname ?? '/dashboard'

  // enforce light theme for the login page while it's mounted
  useEffect(() => {
    const root = document.documentElement
    const previous = root.getAttribute('data-theme')
    root.setAttribute('data-theme', 'light')
    return () => {
      if (previous) root.setAttribute('data-theme', previous)
      else root.removeAttribute('data-theme')
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = username.trim()
    if (!trimmed) {
      setError('Please enter a username')
      return
    }

    setLoading(true)
    try {
      await auth.signin(trimmed)
      navigate(from, { replace: true })
    } catch (err) {
      setError((err as Error)?.message ?? 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          <h2
            className="text-2xl font-semibold text-center w-full"
            style={{ color: 'var(--color-heading)' }}
          >
            Sign in
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm" style={{ color: 'var(--color-muted)' }}>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
              className="mt-2 block w-full rounded-md px-3 py-2 text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </label>

          {error ? (
            <div id="login-error" role="alert" style={{ color: 'var(--color-brand)', marginTop: 4 }}>
              {error}
            </div>
          ) : null}

          <div className="flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="px-4 py-2 rounded-md font-medium text-center w-full"
              style={{
                backgroundColor: 'var(--color-brand)',
                color: '#fff',
                border: '1px solid transparent',
                opacity: loading || !username.trim() ? 0.6 : 1,
                cursor: loading || !username.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="text-sm text-center w-full" style={{ color: 'var(--color-muted)' }}>
              Need an account? <span style={{ color: 'var(--color-brand)' }}>Contact admin</span>
            </div>
          </div>
        </form>
      </Card>
    </main>
  )
}
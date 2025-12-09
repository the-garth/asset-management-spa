import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/Providers/AuthProvider'

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
      // provider may reject; show a generic error
      setError((err as Error)?.message ?? 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? 'login-error' : undefined}
          />
        </label>
        {error ? (
          <div id="login-error" role="alert" style={{ color: 'red', marginTop: 8 }}>
            {error}
          </div>
        ) : null}
        <button type="submit" disabled={loading || !username.trim()}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
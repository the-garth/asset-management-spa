import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/Providers/AuthProvider'

type LocationState = {
  from?: { pathname: string }
}

export const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LocationState) || {}
  const from = state.from?.pathname ?? '/dashboard'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await auth.signin(username || 'guest')
    setLoading(false)
    navigate(from, { replace: true })
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
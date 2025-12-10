import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/Providers/AuthProvider'
import { useTheme } from '../../components/Providers/ThemeProvider'

export const Header: React.FC = () => {
  const { user, signout } = useAuth()
  const { theme, toggle } = useTheme()
  const nav = useNavigate()

  const handleLogout = () => {
    signout()
    nav('/login', { replace: true })
  }

  return (
    <header className="w-full flex items-center justify-between py-3 px-4 border-b" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
      <div className="flex items-center space-x-3">
        <div className="text-lg font-semibold">Asset Management</div>
        {user ? <div className="text-sm text-slate-500">Signed in as {user.username}</div> : null}
      </div>
      <div className="flex items-center gap-3">
        <button
          aria-label="Toggle theme"
          onClick={() => toggle()}
          className="px-3 py-1 rounded text-sm"
          style={{
            backgroundColor: theme === 'dark' ? 'var(--color-brand)' : 'transparent',
            color: theme === 'dark' ? '#fff' : 'var(--color-text)',
            border: '1px solid var(--color-border)',
          }}
        >
          {theme === 'dark' ? 'Dark' : 'Light'}
        </button>
        {user ? (
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded text-sm"
            style={{
              border: '1px solid var(--color-border)' ,
              color: 'var(--color-text)', // ensure visible in both themes
              backgroundColor: 'transparent',
            }}
          >
            Sign out
          </button>
        ) : null}
      </div>
    </header>
  )
}
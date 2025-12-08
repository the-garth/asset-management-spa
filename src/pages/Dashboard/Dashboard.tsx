import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/Providers/AuthProvider'

export const Dashboard: React.FC = () => {
  const { user, signout } = useAuth()
  const nav = useNavigate()
  const handleLogout = () => {
    signout()
    nav('/login', { replace: true })
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.username ?? 'unknown'}!</p>
      <button onClick={handleLogout}>Sign out</button>
    </main>
  )
}
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'

export type User = { username: string }

type AuthContextType = {
  user: User | null
  signin: (username: string) => Promise<void>
  signout: () => void
}

const STORAGE_KEY = 'asset-management-auth'
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    // Keep localStorage in sync if needed elsewhere
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const signin = (username: string) =>
    new Promise<void>((resolve) => {
      // fake async auth (replace with real call)
      setTimeout(() => {
        const u: User = { username }
        setUser(u)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
        resolve()
      }, 400)
    })

  const signout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return <AuthContext.Provider value={{ user, signin, signout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
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
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  // validate username — do not default to "guest"
  const signin = (username: string) =>
    new Promise<void>((resolve, reject) => {
      const trimmed = username.trim()
      if (!trimmed) {
        reject(new Error('username required'))
        return
      }

      // fake async auth (replace with real call)
      setTimeout(() => {
        const u: User = { username: trimmed }
        setUser(u)
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
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Login } from './pages/Login/Login'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { useAuth } from './components/Providers/AuthProvider'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const location = useLocation()
  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

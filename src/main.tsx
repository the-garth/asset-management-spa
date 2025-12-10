import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './components/Providers/AuthProvider.tsx'
import { ThemeProvider } from './components/Providers/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
          <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)

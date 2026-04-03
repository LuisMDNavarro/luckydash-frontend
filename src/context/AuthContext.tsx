import { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '../api/auth'
import { setAuthSetter } from '../api/authStore'

interface AuthContextType {
  isAuthenticated: boolean | null
  setIsAuthenticated: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    setAuthSetter(setIsAuthenticated)
    const checkAuth = async () => {
      try {
        await getMe()
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}

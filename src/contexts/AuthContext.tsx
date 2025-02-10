import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Verifica se existe uma sessão válida
      const { data: { session } } = await supabase.auth.getSession()
      
      // Verifica o token no localStorage como fallback
      const token = localStorage.getItem('admin_token')
      
      setIsAuthenticated(!!session || !!token)
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (password: string) => {
    const correctPassword = import.meta.env.VITE_PASSWORD
    
    if (password === correctPassword) {
      try {
        // Cria uma sessão anônima no Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com',
          password: correctPassword
        })

        if (error) throw error

        // Salva o token no localStorage
        localStorage.setItem('admin_token', data.session?.access_token || 'token_secreto')
        setIsAuthenticated(true)
        return true
      } catch (error) {
        console.error('Erro ao fazer login:', error)
        return false
      }
    }
    return false
  }

  const logout = async () => {
    try {
      // Encerra a sessão no Supabase
      await supabase.auth.signOut()
      
      // Remove o token do localStorage
      localStorage.removeItem('admin_token')
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
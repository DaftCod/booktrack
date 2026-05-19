import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { loginUser, registerUser } from '../api/auth'

interface User {
  token: string
  userId: string
  username: string
  role: 'Admin' | 'Guest'
}

interface AuthContextValue {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'bt_auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const id = axios.interceptors.request.use(config => {
      if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
      return config
    })
    return () => axios.interceptors.request.eject(id)
  }, [user])

  const persist = (u: User) => {
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  }

  const login = async (username: string, password: string) => {
    const r = await loginUser(username, password)
    persist({ token: r.token, userId: r.userId, username: r.username, role: r.role as User['role'] })
  }

  const register = async (username: string, password: string) => {
    const r = await registerUser(username, password)
    persist({ token: r.token, userId: r.userId, username: r.username, role: r.role as User['role'] })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'Admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

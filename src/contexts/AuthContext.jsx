/**
 * AUTH CONTEXT
 * -----------
 * Manages authentication state across the application.
 * Ready for Supabase integration — replace the mock login
 * function with supabase.auth.signInWithPassword() when needed.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ─── Role definitions ─────────────────────────────────────────────────────────
export const ROLES = {
  ADMIN:  'Administrador',
  SALES:  'Ventas',
  HR:     'Recursos Humanos',
  SUPPORT:'Soporte',
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

// ─── Mock users (replace with Supabase Auth) ─────────────────────────────────
const MOCK_USERS = [
  { id: '1', username: 'admin',   password: 'admin123',  name: 'Carlos Méndez',   role: ROLES.ADMIN,   avatar: null },
  { id: '2', username: 'ventas',  password: 'ventas123', name: 'Sofía Ramírez',   role: ROLES.SALES,   avatar: null },
  { id: '3', username: 'rrhh',    password: 'rrhh123',   name: 'Andrés Torres',   role: ROLES.HR,      avatar: null },
  { id: '4', username: 'soporte', password: 'soporte123',name: 'Laura Vásquez',   role: ROLES.SUPPORT, avatar: null },
]

const SESSION_KEY = 'mi_marca_session'

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)   // initial session restore

  /* Restore session from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      if (stored) setUser(JSON.parse(stored))
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  /**
   * login()
   * -------
   * @param {string} username
   * @param {string} password
   * @returns {{ success: boolean, error?: string }}
   *
   * TODO: Replace with Supabase:
   *   const { data, error } = await supabase.auth.signInWithPassword({ email, password })
   */
  const login = useCallback(async (username, password) => {
    await new Promise(r => setTimeout(r, 900)) // simulate network latency

    const found = MOCK_USERS.find(
      u => u.username === username.trim() && u.password === password
    )

    if (!found) return { success: false, error: 'Usuario o contraseña incorrectos.' }

    const session = {
      id:       found.id,
      username: found.username,
      name:     found.name,
      role:     found.role,
      avatar:   found.avatar,
    }
    setUser(session)
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { success: true }
  }, [])

  /**
   * logout()
   * --------
   * TODO: Add supabase.auth.signOut() here.
   */
  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  /** hasRole() — check if current user has a specific role */
  const hasRole = useCallback((role) => user?.role === role, [user])

  /** isAdmin() shorthand */
  const isAdmin = useCallback(() => user?.role === ROLES.ADMIN, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

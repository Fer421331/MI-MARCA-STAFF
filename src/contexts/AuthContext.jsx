/**
 * AUTH CONTEXT
 * -----------
 * Manages authentication state using Supabase Auth.
 * Provides login, logout, session persistence, and role-based access.
 *
 * ALL mock/demo authentication has been REMOVED.
 * The only auth source is Supabase Auth + PostgreSQL.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  ROLES,
  loginWithUsername,
  fetchCurrentUserProfile,
  logout as logoutService,
  getDefaultRoute,
  onAuthStateChange,
} from '../services/authService'

// ─── Re-export ROLES for backward compatibility ──────────────────────────────
export { ROLES }

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)   // initial session restore

  /**
   * Restore session on mount.
   * Checks if Supabase has a persisted session and rebuilds the user profile.
   */
  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      try {
        const result = await fetchCurrentUserProfile()
        if (!cancelled && result.success) {
          setUser(result.user)
        }
      } catch (err) {
        console.error('Session restore failed:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    restoreSession()

    // Subscribe to auth state changes (token refresh, sign-out from another tab, etc.)
    const subscription = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Session refreshed, user stays logged in
      } else if (event === 'SIGNED_IN' && session && !user) {
        // New sign-in detected (e.g., from another tab)
        const result = await fetchCurrentUserProfile()
        if (result.success) setUser(result.user)
      }
    })

    return () => {
      cancelled = true
      subscription?.unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * login()
   * -------
   * @param {string} username
   * @param {string} password
   * @returns {{ success: boolean, user?: object, error?: string, redirectTo?: string }}
   */
  const login = useCallback(async (username, password) => {
    const result = await loginWithUsername(username, password)

    if (result.success) {
      setUser(result.user)
      return {
        success: true,
        user: result.user,
        redirectTo: getDefaultRoute(result.user.role),
      }
    }

    return { success: false, error: result.error }
  }, [])

  /**
   * logout()
   * --------
   * Signs out from Supabase and clears local state.
   */
  const logout = useCallback(async () => {
    await logoutService()
    setUser(null)
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

/**
 * PROTECTED ROUTE
 * ---------------
 * Wraps routes that require authentication.
 * Redirects to /login if not authenticated.
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-surface-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-surface-400 text-sm">Verificando sesión…</p>
      </div>
    </div>
  )

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

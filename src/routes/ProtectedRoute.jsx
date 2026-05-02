/**
 * PROTECTED ROUTE
 * ---------------
 * Route guard that:
 *   1. Redirects unauthenticated users to /login
 *   2. Restricts access by role (optional allowedRoles prop)
 *   3. Shows unauthorized state for wrong roles
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>             — any authenticated user
 *   <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SALES]} />}>  — role restricted
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShieldAlert } from 'lucide-react'

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // ── Loading: show enterprise spinner ────────────────────────
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-surface-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
        <p className="text-surface-400 text-sm">Verificando sesión…</p>
      </div>
    </div>
  )

  // ── Not authenticated: redirect to login ────────────────────
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // ── Role check (if allowedRoles specified) ──────────────────
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-950">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-red-950 border border-red-800 flex items-center justify-center">
            <ShieldAlert size={28} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Acceso Restringido</h2>
          <p className="text-surface-400 text-sm">
            No tienes permisos para acceder a esta sección.
            Contacta al administrador si crees que esto es un error.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    )
  }

  // ── Authorized: render nested routes ────────────────────────
  return <Outlet />
}

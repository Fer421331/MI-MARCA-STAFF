/**
 * usePermissions hook
 * -------------------
 * Returns permission helpers based on current user's role.
 * Extend this when Supabase RBAC is wired.
 */

import { useAuth, ROLES } from '../contexts/AuthContext'
import { useMemo } from 'react'

export function usePermissions() {
  const { user } = useAuth()

  return useMemo(() => ({
    canAccessReservaciones: [ROLES.ADMIN, ROLES.SALES].includes(user?.role),
    canAccessInventario:    [ROLES.ADMIN, ROLES.SALES].includes(user?.role),
    canAccessVentas:        [ROLES.ADMIN, ROLES.SALES].includes(user?.role),
    canAccessRRHH:          [ROLES.ADMIN, ROLES.HR].includes(user?.role),
    canAccessSoporte:       [ROLES.ADMIN, ROLES.SUPPORT].includes(user?.role),
    canAccessReportes:      [ROLES.ADMIN].includes(user?.role),
    canAccessConfiguracion: [ROLES.ADMIN].includes(user?.role),
    isAdmin:                user?.role === ROLES.ADMIN,
    role:                   user?.role,
  }), [user?.role])
}

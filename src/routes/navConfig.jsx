/**
 * NAVIGATION CONFIG
 * -----------------
 * Central definition of sidebar links, roles, and icons.
 * Each route entry lists which roles can see it.
 * Use this when Supabase roles are wired up.
 */

import {
  LayoutDashboard,
  CalendarDays,
  Package2,
  ShoppingCart,
  Users2,
  HeadphonesIcon,
  BarChart3,
  Settings2,
} from 'lucide-react'
import { ROLES } from '../services/authService'

export const NAV_ITEMS = [
  {
    group: 'Principal',
    items: [
      {
        id:    'dashboard',
        label: 'Dashboard',
        path:  '/dashboard',
        icon:  LayoutDashboard,
        roles: [ROLES.ADMIN, ROLES.SALES, ROLES.HR, ROLES.SUPPORT],
      },
    ],
  },
  {
    group: 'Operaciones',
    items: [
      {
        id:    'reservaciones',
        label: 'Reservaciones',
        path:  '/reservaciones',
        icon:  CalendarDays,
        roles: [ROLES.ADMIN, ROLES.SALES],
      },
      {
        id:    'inventario',
        label: 'Inventario',
        path:  '/inventario',
        icon:  Package2,
        roles: [ROLES.ADMIN, ROLES.SALES],
      },
      {
        id:    'ventas',
        label: 'Ventas',
        path:  '/ventas',
        icon:  ShoppingCart,
        roles: [ROLES.ADMIN, ROLES.SALES],
      },
    ],
  },
  {
    group: 'Gestión',
    items: [
      {
        id:    'rrhh',
        label: 'Recursos Humanos',
        path:  '/rrhh',
        icon:  Users2,
        roles: [ROLES.ADMIN, ROLES.HR],
      },
      {
        id:    'soporte',
        label: 'Soporte',
        path:  '/soporte',
        icon:  HeadphonesIcon,
        roles: [ROLES.ADMIN, ROLES.SUPPORT],
      },
    ],
  },
  {
    group: 'Análisis',
    items: [
      {
        id:    'reportes',
        label: 'Reportes',
        path:  '/reportes',
        icon:  BarChart3,
        roles: [ROLES.ADMIN],
      },
    ],
  },
  {
    group: 'Sistema',
    items: [
      {
        id:    'configuracion',
        label: 'Configuración',
        path:  '/configuracion',
        icon:  Settings2,
        roles: [ROLES.ADMIN],
      },
    ],
  },
]

/** Filter nav items by user role */
export function filterNavByRole(role) {
  return NAV_ITEMS.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(role)),
  })).filter(group => group.items.length > 0)
}

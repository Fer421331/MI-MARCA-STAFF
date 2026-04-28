/**
 * SIDEBAR COMPONENT
 * -----------------
 * Collapsible sidebar with role-filtered navigation.
 * Supports desktop collapse and mobile overlay drawer.
 */

import { NavLink, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../contexts/AuthContext'
import { useUI }   from '../../contexts/UIContext'
import { filterNavByRole } from '../../routes/navConfig'
import MiMarcaLogo from '../ui/MiMarcaLogo'

export default function Sidebar() {
  const { user } = useAuth()
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, closeMobileSidebar } = useUI()
  const location = useLocation()

  const navGroups = filterNavByRole(user?.role)

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ── Logo ─────────────────────────────────────────────── */}
      <div className={clsx(
        'flex items-center border-b border-surface-700 shrink-0 transition-all duration-300',
        sidebarCollapsed ? 'justify-center px-3 py-4' : 'justify-between px-5 py-4'
      )}>
        {!sidebarCollapsed && (
          <div className="animate-fade-in">
            <MiMarcaLogo size="sm" />
          </div>
        )}
        {sidebarCollapsed && (
          <div className="animate-fade-in">
            <MiMarcaLogo iconOnly />
          </div>
        )}

        {/* Collapse toggle — desktop only */}
        <button
          onClick={toggleSidebar}
          className={clsx(
            'hidden lg:flex btn-icon shrink-0',
            sidebarCollapsed && 'mx-auto'
          )}
          title={sidebarCollapsed ? 'Expandir' : 'Colapsar'}
        >
          {sidebarCollapsed
            ? <ChevronRight size={16} />
            : <ChevronLeft  size={16} />}
        </button>
      </div>

      {/* ── Nav ──────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navGroups.map(group => (
          <div key={group.group}>
            {!sidebarCollapsed && (
              <p className="section-title mt-3 first:mt-0">{group.group}</p>
            )}
            {sidebarCollapsed && <div className="divider mx-1" />}

            {group.items.map(item => {
              const Icon = item.icon
              const isActive = location.pathname === item.path ||
                               location.pathname.startsWith(item.path + '/')
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={clsx(
                    'nav-item',
                    isActive && 'active',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon size={18} className="shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="truncate animate-fade-in">{item.label}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── User mini card ────────────────────────────────────── */}
      {!sidebarCollapsed && (
        <div className="border-t border-surface-700 px-3 py-3 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-surface-900 animate-fade-in">
            <UserAvatar name={user?.name} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-surface-400 truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      )}
      {sidebarCollapsed && (
        <div className="border-t border-surface-700 px-2 py-3 flex justify-center shrink-0">
          <UserAvatar name={user?.name} size="sm" />
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* ── Desktop Sidebar ──────────────────────────────────── */}
      <aside className={clsx(
        'hidden lg:flex flex-col bg-surface-900 border-r border-surface-700 shadow-sidebar',
        'transition-all duration-300 ease-smooth shrink-0',
        sidebarCollapsed ? 'w-[60px]' : 'w-[240px]'
      )}>
        {sidebarContent}
      </aside>

      {/* ── Mobile Overlay ───────────────────────────────────── */}
      {sidebarMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobileSidebar}
          />
          {/* Drawer */}
          <aside className="relative w-[260px] bg-surface-900 border-r border-surface-700 shadow-sidebar animate-slide-in-left flex flex-col">
            {/* Close btn */}
            <button
              onClick={closeMobileSidebar}
              className="absolute top-4 right-4 btn-icon"
            >
              <X size={18} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}

/* ── Avatar helper ───────────────────────────────────────────────────────────── */
function UserAvatar({ name, size = 'sm' }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
  return (
    <div className={clsx(
      'rounded-full bg-brand-900 border border-brand-700 flex items-center justify-center',
      'font-semibold text-brand-300 shrink-0', dim
    )}>
      {initials}
    </div>
  )
}

/**
 * TOPBAR COMPONENT
 * ----------------
 * Top navigation with search, notifications, user profile, and logout.
 */

import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Menu, Search, Bell, ChevronDown, LogOut,
  User, Settings, ShieldCheck,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../contexts/AuthContext'
import { useUI }   from '../../contexts/UIContext'
import { NAV_ITEMS } from '../../routes/navConfig'

/* Map path → label for breadcrumb */
const PATH_LABELS = NAV_ITEMS.flatMap(g => g.items).reduce((acc, item) => {
  acc[item.path] = item.label
  return acc
}, {})

export default function TopBar() {
  const { user, logout }           = useAuth()
  const { toggleMobileSidebar }    = useUI()
  const navigate                   = useNavigate()
  const location                   = useLocation()

  const [userMenuOpen,  setUserMenuOpen]  = useState(false)
  const [notifOpen,     setNotifOpen]     = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const userMenuRef  = useRef(null)
  const notifRef     = useRef(null)

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const currentLabel = PATH_LABELS[location.pathname] ?? 'Portal Interno'
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="h-14 bg-surface-900 border-b border-surface-700 shadow-topbar flex items-center px-4 gap-3 shrink-0 z-30">
      {/* ── Mobile hamburger ─────────────────────────────────── */}
      <button
        id="topbar-mobile-menu"
        onClick={toggleMobileSidebar}
        className="lg:hidden btn-icon"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* ── Breadcrumb ───────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-white truncate">{currentLabel}</h1>
      </div>

      {/* ── Search ───────────────────────────────────────────── */}
      <div className={clsx(
        'hidden md:flex items-center gap-2 bg-surface-800 border rounded-lg px-3 py-1.5',
        'transition-all duration-200',
        searchFocused ? 'border-brand-700 ring-1 ring-brand-700 w-60' : 'border-surface-600 w-44'
      )}>
        <Search size={14} className="text-surface-400 shrink-0" />
        <input
          type="text"
          placeholder="Buscar…"
          className="bg-transparent text-sm text-white placeholder-surface-500 outline-none w-full"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* ── Role badge ───────────────────────────────────────── */}
      <div className="hidden sm:flex items-center gap-1.5 badge-brand">
        <ShieldCheck size={11} />
        <span>{user?.role}</span>
      </div>

      {/* ── Notifications ────────────────────────────────────── */}
      <div ref={notifRef} className="relative">
        <button
          id="topbar-notifications"
          onClick={() => setNotifOpen(v => !v)}
          className="btn-icon relative"
          aria-label="Notificaciones"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-600 rounded-full ring-1 ring-surface-900" />
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 card shadow-card-hover z-50 overflow-hidden animate-slide-in-up">
            <div className="px-4 py-3 border-b border-surface-700 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Notificaciones</p>
              <span className="badge-brand text-[10px]">3 nuevas</span>
            </div>
            {MOCK_NOTIFS.map(n => (
              <div key={n.id} className="px-4 py-3 border-b border-surface-700 hover:bg-surface-700 cursor-pointer transition-colors">
                <p className="text-sm text-white">{n.title}</p>
                <p className="text-xs text-surface-400 mt-0.5">{n.time}</p>
              </div>
            ))}
            <div className="px-4 py-2.5">
              <button className="text-xs text-brand-500 hover:text-brand-400 transition-colors">
                Ver todas las notificaciones
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── User menu ────────────────────────────────────────── */}
      <div ref={userMenuRef} className="relative">
        <button
          id="topbar-user-menu"
          onClick={() => setUserMenuOpen(v => !v)}
          className="flex items-center gap-2 hover:bg-surface-700 rounded-lg px-2 py-1.5 transition-all duration-200 group"
          aria-label="Menú de usuario"
        >
          <div className="w-7 h-7 rounded-full bg-brand-900 border border-brand-700 flex items-center justify-center text-xs font-semibold text-brand-300">
            {initials}
          </div>
          <span className="hidden sm:block text-sm text-white font-medium max-w-[100px] truncate">
            {user?.name?.split(' ')[0]}
          </span>
          <ChevronDown size={14} className={clsx(
            'text-surface-400 transition-transform duration-200',
            userMenuOpen && 'rotate-180'
          )} />
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 card shadow-card-hover z-50 overflow-hidden animate-slide-in-up">
            {/* User info */}
            <div className="px-4 py-3 border-b border-surface-700">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-surface-400">@{user?.username}</p>
            </div>
            {/* Menu items */}
            <div className="py-1">
              <MenuOption icon={User}    label="Mi Perfil"     onClick={() => setUserMenuOpen(false)} />
              <MenuOption icon={Settings} label="Configuración" onClick={() => { navigate('/configuracion'); setUserMenuOpen(false) }} />
            </div>
            <div className="border-t border-surface-700 py-1">
              <MenuOption
                icon={LogOut}
                label="Cerrar Sesión"
                onClick={handleLogout}
                danger
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function MenuOption({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-150',
        danger
          ? 'text-brand-400 hover:bg-brand-950/60 hover:text-brand-300'
          : 'text-surface-200 hover:bg-surface-700 hover:text-white'
      )}
    >
      <Icon size={15} />
      {label}
    </button>
  )
}

const MOCK_NOTIFS = [
  { id: 1, title: 'Nueva reservación #1042 asignada',        time: 'Hace 5 min' },
  { id: 2, title: 'Reporte mensual generado exitosamente',   time: 'Hace 1 hora' },
  { id: 3, title: 'Inventario bajo en artículo "Producto A"',time: 'Hace 2 horas' },
]

/**
 * UI CONTEXT
 * ----------
 * Global UI state: sidebar collapsed, notifications, mobile overlay.
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)

  const toggleSidebar = useCallback(() => setSidebarCollapsed(v => !v), [])
  const toggleMobileSidebar = useCallback(() => setSidebarMobileOpen(v => !v), [])
  const closeMobileSidebar = useCallback(() => setSidebarMobileOpen(false), [])

  /* Auto-collapse on small screens */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    const handle = (e) => { if (e.matches) setSidebarCollapsed(true) }
    handle(mq)
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [])

  return (
    <UIContext.Provider value={{
      sidebarCollapsed,
      sidebarMobileOpen,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar,
    }}>
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}

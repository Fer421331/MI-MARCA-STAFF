/**
 * APP SHELL LAYOUT
 * ----------------
 * The master layout used by all authenticated routes.
 * Composes: Sidebar + TopBar + main content slot (Outlet).
 */

import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import TopBar  from '../components/layout/TopBar'
import { useUI } from '../contexts/UIContext'
import clsx from 'clsx'

export default function AppShell() {
  const { sidebarCollapsed } = useUI()

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Right column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <TopBar />

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto bg-surface-950 p-4 md:p-6"
        >
          <div className="max-w-screen-xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

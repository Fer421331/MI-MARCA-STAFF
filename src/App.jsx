/**
 * APP.JSX — Root router configuration
 * ------------------------------------
 * React Router v6 with nested protected routes.
 * AuthProvider + UIProvider wrap the entire tree.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UIProvider }  from './contexts/UIContext'

import ProtectedRoute    from './routes/ProtectedRoute'
import AppShell         from './layouts/AppShell'

import LoginPage        from './pages/LoginPage'
import DashboardPage    from './pages/DashboardPage'
import ReservacionesPage from './pages/ReservacionesPage'
import InventarioPage   from './pages/InventarioPage'
import VentasPage       from './pages/VentasPage'
import RRHHPage         from './pages/RRHHPage'
import SoportePage      from './pages/SoportePage'
import ReportesPage     from './pages/ReportesPage'
import ConfiguracionPage from './pages/ConfiguracionPage'
import NotFoundPage     from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated shell */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard"     element={<DashboardPage />} />
                <Route path="/reservaciones" element={<ReservacionesPage />} />
                <Route path="/inventario"    element={<InventarioPage />} />
                <Route path="/ventas"        element={<VentasPage />} />
                <Route path="/rrhh"          element={<RRHHPage />} />
                <Route path="/soporte"       element={<SoportePage />} />
                <Route path="/reportes"      element={<ReportesPage />} />
                <Route path="/configuracion" element={<ConfiguracionPage />} />
                <Route path="*"              element={<NotFoundPage />} />
              </Route>
            </Route>

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

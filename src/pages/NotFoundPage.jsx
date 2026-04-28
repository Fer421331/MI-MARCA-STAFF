/**
 * NOT FOUND PAGE
 */

import { useNavigate } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-brand-950 border border-brand-800 flex items-center justify-center">
        <AlertTriangle size={36} className="text-brand-400" />
      </div>
      <div>
        <h2 className="text-5xl font-bold text-gradient-brand">404</h2>
        <p className="text-xl font-semibold text-white mt-2">Página no encontrada</p>
        <p className="text-surface-400 text-sm mt-1">La ruta que buscas no existe o no tienes acceso.</p>
      </div>
      <button onClick={() => navigate('/dashboard')} className="btn-primary">
        <Home size={16} />
        Ir al Dashboard
      </button>
    </div>
  )
}

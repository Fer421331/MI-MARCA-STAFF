/**
 * UpcomingEvents — Shows next upcoming reservations as cards
 */
import clsx from 'clsx'
import { CalendarDays, MapPin, Users, Clock, ArrowRight } from 'lucide-react'
import { StatusBadge } from './StatusBadge'

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-HN', { day: '2-digit', month: 'short' })
}

function daysUntil(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Mañana'
  return `En ${diff} días`
}

export default function UpcomingEvents({ reservations, loading, onSelect }) {
  const upcoming = reservations
    .filter(r => {
      const d = new Date(r.fechaInicio)
      const now = new Date()
      return d >= now && r.estado !== 'Cancelada'
    })
    .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
    .slice(0, 4)

  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-5 w-44 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <CalendarDays size={16} className="text-brand-500" />
          Próximos Eventos
        </h3>
        <span className="text-xs text-surface-400">{upcoming.length} próximos</span>
      </div>

      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <CalendarDays size={32} className="text-surface-500 mb-2" />
          <p className="text-sm text-surface-400">No hay eventos próximos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {upcoming.map(r => {
            const urgency = daysUntil(r.fechaInicio)
            const isUrgent = urgency === 'Hoy' || urgency === 'Mañana'
            return (
              <div
                key={r.id}
                onClick={() => onSelect(r)}
                className={clsx(
                  'group p-4 rounded-xl border transition-all duration-200 cursor-pointer',
                  'bg-surface-800/60 hover:bg-surface-800',
                  isUrgent ? 'border-amber-800/50 hover:border-amber-700' : 'border-surface-700 hover:border-surface-600',
                  'hover:-translate-y-0.5 hover:shadow-lg'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={clsx(
                      'w-10 h-10 rounded-xl flex flex-col items-center justify-center text-center border',
                      isUrgent ? 'bg-amber-950 border-amber-800 text-amber-400' : 'bg-surface-700 border-surface-600 text-surface-300'
                    )}>
                      <span className="text-[10px] font-bold leading-none">{formatShortDate(r.fechaInicio).split(' ')[0]}</span>
                      <span className="text-[9px] uppercase leading-none mt-0.5">{formatShortDate(r.fechaInicio).split(' ')[1]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">{r.tipoEvento}</p>
                      <p className="text-xs text-surface-400">{r.cliente.nombre}</p>
                    </div>
                  </div>
                  <span className={clsx(
                    'text-[10px] font-semibold rounded-full px-2 py-0.5',
                    isUrgent ? 'bg-amber-950 text-amber-400' : 'bg-surface-700 text-surface-400'
                  )}>
                    {urgency}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-surface-400 mt-2">
                  <span className="flex items-center gap-1"><MapPin size={11} />{r.ciudad}</span>
                  <span className="flex items-center gap-1"><Users size={11} />{r.invitados}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{r.horaInicio}</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <StatusBadge status={r.estado} />
                  <ArrowRight size={14} className="text-surface-500 group-hover:text-brand-400 transition-colors" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

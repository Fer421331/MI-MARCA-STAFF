/**
 * ReservationTimeline — Visual horizontal timeline of reservation dates
 */
import clsx from 'clsx'
import { STATUS_CONFIG } from '../../mock/reservationsData'

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-HN', { day: '2-digit', month: 'short' })
}

export default function ReservationTimeline({ reservations, loading, onSelect }) {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-5 w-48 rounded mb-4" />
        <div className="skeleton h-24 rounded-xl" />
      </div>
    )
  }

  const upcoming = reservations
    .filter(r => r.estado !== 'Cancelada')
    .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
    .slice(0, 8)

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-500">
          <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
        Línea de Tiempo
      </h3>

      {upcoming.length === 0 ? (
        <p className="text-sm text-surface-400 text-center py-6">Sin eventos en la línea de tiempo</p>
      ) : (
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <div className="flex items-start gap-0 min-w-max">
            {upcoming.map((r, i) => {
              const cfg = STATUS_CONFIG[r.estado]
              return (
                <div key={r.id} className="flex items-start">
                  {/* Node */}
                  <div
                    onClick={() => onSelect(r)}
                    className="flex flex-col items-center cursor-pointer group w-28"
                  >
                    {/* Dot */}
                    <div className={clsx(
                      'w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-125 z-10',
                      cfg?.dot || 'bg-surface-400',
                      cfg?.border || 'border-surface-600'
                    )} />

                    {/* Card */}
                    <div className="mt-2 p-2 rounded-lg bg-surface-800 border border-surface-700 group-hover:border-surface-500 transition-all w-full text-center">
                      <p className="text-[10px] font-mono text-brand-400 mb-0.5">{r.codigo}</p>
                      <p className="text-xs text-white font-medium truncate">{r.tipoEvento}</p>
                      <p className="text-[10px] text-surface-400 mt-0.5">{formatShortDate(r.fechaInicio)}</p>
                      <p className="text-[10px] text-surface-500 truncate">{r.cliente.nombre}</p>
                    </div>
                  </div>

                  {/* Connector line */}
                  {i < upcoming.length - 1 && (
                    <div className="flex items-center mt-[7px]">
                      <div className="w-8 h-px bg-surface-600" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

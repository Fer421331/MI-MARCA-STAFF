/**
 * AlertsPanel — Operational alerts for inventory, conflicts, and scheduling
 */
import clsx from 'clsx'
import {
  AlertTriangle, Package, CalendarClock, CreditCard,
  AlertCircle, CheckCircle2, Info,
} from 'lucide-react'

const ICON_MAP = {
  inventory: Package,
  conflict: AlertTriangle,
  schedule: CalendarClock,
  payment: CreditCard,
}

const LEVEL_STYLES = {
  high:   { container: 'border-red-800/50',    dot: 'bg-red-400',    icon: 'text-red-400',    bg: 'bg-red-950/30' },
  medium: { container: 'border-amber-800/50',  dot: 'bg-amber-400',  icon: 'text-amber-400',  bg: 'bg-amber-950/30' },
  low:    { container: 'border-sky-800/50',    dot: 'bg-sky-400',    icon: 'text-sky-400',    bg: 'bg-sky-950/30' },
}

export default function AlertsPanel({ alerts, loading }) {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-5 w-40 rounded mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl mb-2" />
        ))}
      </div>
    )
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <AlertTriangle size={16} className="text-brand-500" />
          Alertas Operativas
        </h3>
        <span className="text-xs text-surface-400">{alerts.length} alertas</span>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <CheckCircle2 size={32} className="text-emerald-400 mb-2" />
          <p className="text-sm text-surface-400">Sin alertas activas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map(alert => {
            const style = LEVEL_STYLES[alert.level] || LEVEL_STYLES.low
            const Icon = ICON_MAP[alert.type] || Info
            return (
              <div
                key={alert.id}
                className={clsx(
                  'flex items-start gap-3 p-3 rounded-xl border transition-all hover:border-surface-500 cursor-pointer',
                  'bg-surface-800',
                  style.container
                )}
              >
                <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', style.bg)}>
                  <Icon size={14} className={style.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{alert.title}</p>
                  <p className="text-xs text-surface-400 mt-0.5 line-clamp-2">{alert.message}</p>
                </div>
                <span className="text-[10px] text-surface-500 whitespace-nowrap shrink-0">{alert.time}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

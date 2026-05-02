/**
 * ActivityPanel — Recent reservation activity feed
 */
import {
  Activity, RefreshCw, CheckCircle2, AlertTriangle, Info, Zap,
} from 'lucide-react'

const TYPE_ICONS = {
  success: <CheckCircle2 size={14} className="text-emerald-400" />,
  warning: <AlertTriangle size={14} className="text-amber-400" />,
  info:    <Info size={14} className="text-sky-400" />,
  brand:   <Zap size={14} className="text-brand-400" />,
}

export default function ActivityPanel({ activity, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-5 w-40 rounded mb-4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-10 rounded mb-2" />
        ))}
      </div>
    )
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Activity size={16} className="text-brand-500" />
          Actividad Reciente
        </h3>
        <button onClick={onRefresh} className="btn-ghost text-xs py-1 px-2">
          <RefreshCw size={12} />
          Actualizar
        </button>
      </div>

      <div className="space-y-1">
        {activity.map(a => (
          <div
            key={a.id}
            className="flex items-start gap-3 py-2.5 border-b border-surface-700/50 last:border-0 group hover:bg-surface-800/40 rounded-lg px-2 -mx-2 transition-colors"
          >
            <span className="mt-0.5 shrink-0">{TYPE_ICONS[a.type] ?? TYPE_ICONS.info}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-surface-200 group-hover:text-white transition-colors">{a.description}</p>
            </div>
            <span className="text-[11px] text-surface-500 whitespace-nowrap shrink-0">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

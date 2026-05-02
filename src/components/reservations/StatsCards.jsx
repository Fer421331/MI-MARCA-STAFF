/**
 * StatsCards — Reservation dashboard KPI cards
 */
import clsx from 'clsx'
import {
  Clock, CheckCircle2, XCircle, CalendarDays, DollarSign,
  ArrowUpRight, TrendingUp, Loader2,
} from 'lucide-react'

const STAT_DEFS = [
  { key: 'pendientes',       label: 'Pendientes',         icon: Clock,        color: 'amber',   trend: '+3',  trendUp: true  },
  { key: 'confirmadas',      label: 'Confirmadas',        icon: CheckCircle2, color: 'sky',     trend: '+12%', trendUp: true  },
  { key: 'canceladas',       label: 'Canceladas',         icon: XCircle,      color: 'red',     trend: '-2',  trendUp: false },
  { key: 'proximosEventos',  label: 'Eventos Próximos',   icon: CalendarDays, color: 'violet',  trend: '30d', trendUp: null  },
  { key: 'ingresosEstimados',label: 'Ingresos Estimados', icon: DollarSign,   color: 'emerald', trend: '+18%',trendUp: true  },
]

const COLOR_MAP = {
  amber:   { bg: 'bg-amber-950',   border: 'border-amber-800',   text: 'text-amber-400',   iconBg: 'bg-amber-900/50'   },
  sky:     { bg: 'bg-sky-950',     border: 'border-sky-800',     text: 'text-sky-400',     iconBg: 'bg-sky-900/50'     },
  red:     { bg: 'bg-red-950',     border: 'border-red-800',     text: 'text-red-400',     iconBg: 'bg-red-900/50'     },
  violet:  { bg: 'bg-violet-950',  border: 'border-violet-800',  text: 'text-violet-400',  iconBg: 'bg-violet-900/50'  },
  emerald: { bg: 'bg-emerald-950', border: 'border-emerald-800', text: 'text-emerald-400', iconBg: 'bg-emerald-900/50' },
}

function formatCurrency(n) {
  return `L. ${n.toLocaleString('es-HN')}`
}

export default function StatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="skeleton h-10 w-10 rounded-xl mb-3" />
            <div className="skeleton h-7 w-20 mb-2 rounded" />
            <div className="skeleton h-4 w-28 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {STAT_DEFS.map(def => {
        const c = COLOR_MAP[def.color]
        const Icon = def.icon
        const value = def.key === 'ingresosEstimados'
          ? formatCurrency(stats[def.key])
          : stats[def.key]

        return (
          <div
            key={def.key}
            className={clsx(
              'group relative overflow-hidden rounded-xl border p-5 transition-all duration-300',
              'bg-surface-800 border-surface-700',
              'hover:border-surface-600 hover:-translate-y-0.5 hover:shadow-card-hover cursor-default'
            )}
          >
            {/* Subtle accent gradient */}
            <div className={clsx('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500', c.bg)} />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center border', c.bg, c.border, c.text)}>
                  <Icon size={18} />
                </div>
                {def.trendUp !== null && (
                  <span className={clsx(
                    'flex items-center gap-0.5 text-[10px] font-semibold rounded-full px-2 py-0.5',
                    def.trendUp ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'
                  )}>
                    {def.trendUp ? <ArrowUpRight size={10} /> : <TrendingUp size={10} />}
                    {def.trend}
                  </span>
                )}
                {def.trendUp === null && (
                  <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 text-surface-400 bg-surface-700">
                    {def.trend}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-surface-400 mt-1">{def.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * DASHBOARD PAGE
 * --------------
 * Welcome screen with stat cards, recent activity, quick actions.
 * Uses skeleton placeholders ready for real data.
 */

import { useAuth } from '../contexts/AuthContext'
import {
  TrendingUp, CalendarCheck2, Package, Users,
  ArrowUpRight, ArrowDownRight, Clock, Plus, FileText,
  RefreshCw, AlertTriangle, CheckCircle2, Activity,
} from 'lucide-react'
import clsx from 'clsx'

export default function DashboardPage() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="space-y-6">
      {/* ── Welcome header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {greeting},{' '}
            <span className="text-gradient-brand">{user?.name?.split(' ')[0]}</span> 👋
          </h2>
          <p className="text-surface-400 text-sm mt-1">
            Aquí tienes un resumen de la actividad reciente.
          </p>
        </div>
        <div className="flex items-center gap-2 text-surface-500 text-xs bg-surface-800 border border-surface-700 rounded-lg px-3 py-2">
          <Clock size={13} />
          <span>{new Date().toLocaleDateString('es-SV', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* ── KPI Stats ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => <StatCard key={s.id} {...s} />)}
      </div>

      {/* ── Middle row: Activity + Quick actions ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity feed */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Activity size={16} className="text-brand-500" />
              Actividad Reciente
            </h3>
            <button className="btn-ghost text-xs py-1 px-2">
              <RefreshCw size={12} />
              Actualizar
            </button>
          </div>
          <div className="space-y-1">
            {ACTIVITY.map(a => <ActivityRow key={a.id} {...a} />)}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Plus size={16} className="text-brand-500" />
            Acciones Rápidas
          </h3>
          <div className="space-y-2">
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.id}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-900 hover:bg-surface-700 border border-surface-700 hover:border-surface-500 transition-all duration-200 group text-left"
              >
                <span className="w-8 h-8 rounded-lg bg-surface-800 group-hover:bg-surface-700 border border-surface-600 flex items-center justify-center shrink-0 transition-colors">
                  <a.icon size={15} className="text-brand-400" />
                </span>
                <span className="text-sm text-surface-200 group-hover:text-white transition-colors font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row: Chart placeholder + alerts ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart placeholder */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-500" />
              Resumen de Ventas
            </h3>
            <span className="badge-info text-[10px]">Este mes</span>
          </div>
          <ChartPlaceholder />
        </div>

        {/* Alerts */}
        <div className="card p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-brand-500" />
            Alertas del Sistema
          </h3>
          <div className="space-y-2">
            {ALERTS.map(a => <AlertRow key={a.id} {...a} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── StatCard ─────────────────────────────────────────────────────────────────── */
function StatCard({ label, value, change, trend, icon: Icon, color }) {
  const up = trend === 'up'
  return (
    <div className="stat-card card-hover group cursor-default">
      <div className="flex items-start justify-between">
        <div className={clsx(
          'w-10 h-10 rounded-xl flex items-center justify-center border',
          color === 'brand' ? 'bg-brand-950 border-brand-800 text-brand-400' :
          color === 'green' ? 'bg-emerald-950 border-emerald-800 text-emerald-400' :
          color === 'blue'  ? 'bg-sky-950 border-sky-800 text-sky-400' :
                              'bg-amber-950 border-amber-800 text-amber-400'
        )}>
          <Icon size={18} />
        </div>
        <span className={clsx(
          'flex items-center gap-0.5 text-xs font-semibold rounded-full px-2 py-0.5',
          up ? 'text-emerald-400 bg-emerald-950' : 'text-brand-400 bg-brand-950'
        )}>
          {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {change}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-surface-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

/* ── ActivityRow ─────────────────────────────────────────────────────────────── */
function ActivityRow({ type, description, time, status }) {
  const icons = {
    success: <CheckCircle2 size={14} className="text-emerald-400" />,
    warning: <AlertTriangle size={14} className="text-amber-400" />,
    info:    <Activity size={14} className="text-sky-400" />,
    brand:   <CheckCircle2 size={14} className="text-brand-400" />,
  }
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-surface-700 last:border-0">
      <span className="mt-0.5 shrink-0">{icons[type] ?? icons.info}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-surface-200 truncate">{description}</p>
      </div>
      <span className="text-xs text-surface-500 whitespace-nowrap shrink-0">{time}</span>
    </div>
  )
}

/* ── AlertRow ────────────────────────────────────────────────────────────────── */
function AlertRow({ level, message }) {
  const s = {
    high:   'bg-brand-950 border-brand-800 text-brand-300',
    medium: 'bg-amber-950 border-amber-800 text-amber-300',
    low:    'bg-sky-950 border-sky-800 text-sky-300',
    ok:     'bg-emerald-950 border-emerald-800 text-emerald-300',
  }
  const dot = {
    high: 'bg-brand-500', medium: 'bg-amber-500', low: 'bg-sky-500', ok: 'bg-emerald-500'
  }
  return (
    <div className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm', s[level])}>
      <span className={clsx('w-2 h-2 rounded-full shrink-0', dot[level])} />
      {message}
    </div>
  )
}

/* ── Chart placeholder ───────────────────────────────────────────────────────── */
function ChartPlaceholder() {
  const bars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50]
  return (
    <div className="flex items-end gap-1.5 h-32">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-gradient-to-t from-brand-800 to-brand-600 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          style={{ height: `${h}%` }}
          title={`$${(h * 120).toLocaleString()}`}
        />
      ))}
    </div>
  )
}

/* ── Mock data ───────────────────────────────────────────────────────────────── */
const STATS = [
  { id: 1, label: 'Reservaciones Hoy',    value: '24',    change: '12%',  trend: 'up',   icon: CalendarCheck2, color: 'brand' },
  { id: 2, label: 'Ventas del Día',        value: '$4,820', change: '8%',  trend: 'up',   icon: TrendingUp,     color: 'green' },
  { id: 3, label: 'Artículos en Inventario',value: '1,340', change: '3%',  trend: 'down', icon: Package,        color: 'blue'  },
  { id: 4, label: 'Empleados Activos',     value: '38',    change: '2%',   trend: 'up',   icon: Users,          color: 'amber' },
]

const ACTIVITY = [
  { id: 1, type: 'success', description: 'Reservación #1042 confirmada — Carlos Pérez',    time: 'Hace 3 min'  },
  { id: 2, type: 'brand',   description: 'Venta #0892 procesada exitosamente — $320.00',   time: 'Hace 12 min' },
  { id: 3, type: 'warning', description: 'Stock bajo detectado en Producto "Artículo A"',  time: 'Hace 38 min' },
  { id: 4, type: 'info',    description: 'Nuevo ticket de soporte #305 creado',            time: 'Hace 1 hora' },
  { id: 5, type: 'success', description: 'Reporte mensual generado correctamente',         time: 'Hace 2 horas'},
  { id: 6, type: 'info',    description: 'Empleado Sofía Ramírez — marcó asistencia',      time: 'Hace 3 horas'},
]

const QUICK_ACTIONS = [
  { id: 1, label: 'Nueva Reservación',    icon: CalendarCheck2 },
  { id: 2, label: 'Registrar Venta',      icon: TrendingUp     },
  { id: 3, label: 'Agregar Producto',     icon: Package        },
  { id: 4, label: 'Generar Reporte',      icon: FileText       },
]

const ALERTS = [
  { id: 1, level: 'high',   message: 'Inventario crítico en 3 productos'  },
  { id: 2, level: 'medium', message: '5 tickets de soporte sin responder'  },
  { id: 3, level: 'low',    message: 'Actualización del sistema disponible'},
  { id: 4, level: 'ok',     message: 'Backup diario completado correctamente'},
]

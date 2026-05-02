/**
 * ReservationDetail — Slide-over panel showing full reservation details
 */
import { useState } from 'react'
import clsx from 'clsx'
import {
  X, User, MapPin, Calendar, Clock, CreditCard,
  FileText, MessageSquare, Users, ChevronDown,
  Package, ArrowRight, CheckCircle2, AlertTriangle,
  Building2, Phone, Mail, Hash,
} from 'lucide-react'
import { StatusBadge, PriorityBadge } from './StatusBadge'
import { RESERVATION_STATUSES } from '../../mock/reservationsData'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-HN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatCurrency(n) {
  return `L. ${n.toLocaleString('es-HN')}`
}

export default function ReservationDetail({ reservation, open, onClose }) {
  const [activeTab, setActiveTab] = useState('info')
  const [statusDropdown, setStatusDropdown] = useState(false)
  const r = reservation

  if (!r) return null

  const tabs = [
    { id: 'info', label: 'Información' },
    { id: 'products', label: 'Productos' },
    { id: 'payments', label: 'Pagos' },
    { id: 'timeline', label: 'Historial' },
    { id: 'notes', label: 'Notas' },
  ]

  const paymentProgress = r.total > 0 ? Math.round((r.abono / r.total) * 100) : 0

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/60 z-40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={clsx(
          'fixed top-0 right-0 h-full w-full max-w-2xl bg-surface-900 z-50 shadow-2xl transition-transform duration-300 ease-smooth flex flex-col',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-700 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center shrink-0">
              <Hash size={18} className="text-brand-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white truncate">{r.codigo}</h2>
              <p className="text-xs text-surface-400">{r.tipoEvento} · {r.ciudad}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={r.estado} />
            <button onClick={onClose} className="btn-icon ml-2">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-700 px-6 gap-1 shrink-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-4 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap',
                activeTab === tab.id
                  ? 'text-brand-400 border-brand-500'
                  : 'text-surface-400 border-transparent hover:text-white hover:border-surface-500'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="animate-fade-in">
            {activeTab === 'info' && <InfoTab r={r} statusDropdown={statusDropdown} setStatusDropdown={setStatusDropdown} />}
            {activeTab === 'products' && <ProductsTab r={r} />}
            {activeTab === 'payments' && <PaymentsTab r={r} paymentProgress={paymentProgress} />}
            {activeTab === 'timeline' && <TimelineTab r={r} />}
            {activeTab === 'notes' && <NotesTab r={r} />}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-surface-700 px-6 py-4 flex items-center gap-3 shrink-0 bg-surface-900">
          <button className="btn-primary text-sm flex-1">
            <FileText size={14} />
            Generar Cotización
          </button>
          <button className="btn-secondary text-sm">
            Editar
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Info Tab ─────────────────────────────────────────── */
function InfoTab({ r, statusDropdown, setStatusDropdown }) {
  return (
    <div className="space-y-6">
      {/* Customer */}
      <Section icon={User} title="Información del Cliente">
        <InfoRow icon={User} label="Nombre" value={r.cliente.nombre} />
        {r.cliente.empresa && <InfoRow icon={Building2} label="Empresa" value={r.cliente.empresa} />}
        <InfoRow icon={Mail} label="Email" value={r.cliente.email} />
        <InfoRow icon={Phone} label="Teléfono" value={r.cliente.telefono} />
      </Section>

      {/* Event */}
      <Section icon={Calendar} title="Información del Evento">
        <InfoRow icon={Calendar} label="Tipo" value={r.tipoEvento} />
        <InfoRow icon={MapPin} label="Ubicación" value={r.ubicacion} />
        <InfoRow icon={MapPin} label="Ciudad" value={r.ciudad} />
        <InfoRow icon={Calendar} label="Fecha" value={formatDate(r.fechaInicio)} />
        <InfoRow icon={Clock} label="Horario" value={`${r.horaInicio} — ${r.horaFin}`} />
        <InfoRow icon={Users} label="Invitados" value={r.invitados} />
      </Section>

      {/* Assignment */}
      <Section icon={Users} title="Asignación">
        <InfoRow icon={User} label="Responsable" value={r.responsable} />
        <div className="flex items-center gap-3 py-2">
          <span className="text-xs text-surface-400 w-24">Prioridad</span>
          <PriorityBadge priority={r.prioridad} />
        </div>
        <div className="flex items-center gap-3 py-2">
          <span className="text-xs text-surface-400 w-24">Estado</span>
          <div className="relative">
            <button
              onClick={() => setStatusDropdown(v => !v)}
              className="flex items-center gap-2 bg-surface-800 border border-surface-600 rounded-lg px-3 py-1.5 hover:border-surface-500 transition-colors"
            >
              <StatusBadge status={r.estado} />
              <ChevronDown size={12} className="text-surface-400" />
            </button>
            {statusDropdown && (
              <div className="absolute left-0 top-full mt-1 z-30 w-48 bg-surface-800 border border-surface-600 rounded-xl shadow-xl py-1 animate-fade-in">
                {Object.values(RESERVATION_STATUSES).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusDropdown(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-700 transition-colors"
                  >
                    <StatusBadge status={s} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ── Products Tab ────────────────────────────────────── */
function ProductsTab({ r }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-white">Productos y Servicios Reservados</h4>
        <span className="text-xs text-surface-400">{r.productos.length} items</span>
      </div>
      <div className="space-y-2">
        {r.productos.map((p, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-800 border border-surface-700 hover:border-surface-600 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-700 border border-surface-600 flex items-center justify-center">
                <Package size={14} className="text-surface-300" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{p.nombre}</p>
                <p className="text-xs text-surface-400">Cantidad: {p.cantidad}</p>
              </div>
            </div>
            <p className="text-sm text-white font-semibold">{formatCurrency(p.precio * p.cantidad)}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-brand-950/50 border border-brand-800">
        <span className="text-sm font-semibold text-white">Total</span>
        <span className="text-lg font-bold text-brand-400">{formatCurrency(r.total)}</span>
      </div>
    </div>
  )
}

/* ── Payments Tab ────────────────────────────────────── */
function PaymentsTab({ r, paymentProgress }) {
  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="p-4 rounded-xl bg-surface-800 border border-surface-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-surface-300">Progreso de Pago</span>
          <span className="text-sm font-bold text-white">{paymentProgress}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-surface-700 overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-700',
              paymentProgress >= 100 ? 'bg-emerald-500' : paymentProgress >= 50 ? 'bg-sky-500' : 'bg-amber-500'
            )}
            style={{ width: `${paymentProgress}%` }}
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-surface-800 border border-surface-700 text-center">
          <p className="text-xs text-surface-400 mb-1">Total</p>
          <p className="text-base font-bold text-white">{formatCurrency(r.total)}</p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-center">
          <p className="text-xs text-emerald-400 mb-1">Abonado</p>
          <p className="text-base font-bold text-emerald-400">{formatCurrency(r.abono)}</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-center">
          <p className="text-xs text-amber-400 mb-1">Saldo</p>
          <p className="text-base font-bold text-amber-400">{formatCurrency(Math.abs(r.saldo))}</p>
        </div>
      </div>

      {/* Payment placeholder */}
      <div className="p-4 rounded-xl bg-surface-800 border border-surface-700 text-center">
        <CreditCard size={24} className="text-surface-500 mx-auto mb-2" />
        <p className="text-sm text-surface-400">Historial de pagos disponible con Supabase</p>
        <p className="text-xs text-surface-500 mt-1">Integración próximamente</p>
      </div>
    </div>
  )
}

/* ── Timeline Tab ────────────────────────────────────── */
function TimelineTab({ r }) {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-semibold text-white mb-4">Historial de la Reservación</h4>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-surface-700" />
        {r.timeline.map((entry, i) => (
          <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
            <div className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border',
              i === r.timeline.length - 1
                ? 'bg-brand-950 border-brand-700 text-brand-400'
                : 'bg-surface-800 border-surface-600 text-surface-400'
            )}>
              <CheckCircle2 size={14} />
            </div>
            <div className="pt-1 min-w-0">
              <p className="text-sm text-white">{entry.accion}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-surface-500">{formatDate(entry.fecha)}</span>
                <span className="text-xs text-surface-500">·</span>
                <span className="text-xs text-surface-400">{entry.usuario}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Notes Tab ───────────────────────────────────────── */
function NotesTab({ r }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-white">Notas Internas</h4>
      <div className="p-4 rounded-xl bg-surface-800 border border-surface-700">
        <div className="flex items-start gap-3">
          <MessageSquare size={16} className="text-surface-400 mt-0.5 shrink-0" />
          <p className="text-sm text-surface-300 leading-relaxed">{r.notas}</p>
        </div>
      </div>
      {/* Add note placeholder */}
      <div>
        <textarea
          placeholder="Agregar una nota interna..."
          className="w-full bg-surface-800 border border-surface-600 rounded-xl px-4 py-3 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-brand-700 focus:ring-1 focus:ring-brand-700 transition-all resize-none h-24"
        />
        <div className="flex justify-end mt-2">
          <button className="btn-primary text-sm py-2">
            <MessageSquare size={14} />
            Guardar Nota
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Helpers ─────────────────────────────────────────── */
function Section({ icon: Icon, title, children }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
        <Icon size={15} className="text-brand-400" />
        {title}
      </h4>
      <div className="bg-surface-800 border border-surface-700 rounded-xl p-4 space-y-1">
        {children}
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs text-surface-500 w-24 shrink-0">{label}</span>
      <span className="text-sm text-surface-200">{value}</span>
    </div>
  )
}

/**
 * ReservationsTable — Enterprise data table with full features
 */
import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import {
  Search, Filter, ChevronDown, ChevronUp, ChevronsUpDown,
  ChevronLeft, ChevronRight, MoreHorizontal, Eye, Edit3,
  Trash2, CheckSquare, Square, X, Download, Printer,
} from 'lucide-react'
import { StatusBadge, PriorityBadge } from './StatusBadge'
import { RESERVATION_STATUSES, CITIES, EVENT_TYPES } from '../../mock/reservationsData'

const COLUMNS = [
  { key: 'codigo',      label: 'Código',        sortable: true,  width: 'w-28'   },
  { key: 'cliente',     label: 'Cliente',       sortable: true,  width: 'min-w-[160px]' },
  { key: 'tipoEvento',  label: 'Tipo de Evento',sortable: true,  width: 'w-36'   },
  { key: 'ciudad',      label: 'Ciudad',        sortable: true,  width: 'w-32'   },
  { key: 'fechaInicio', label: 'Fecha Inicio',  sortable: true,  width: 'w-28'   },
  { key: 'fechaFin',    label: 'Fecha Fin',     sortable: true,  width: 'w-28'   },
  { key: 'estado',      label: 'Estado',        sortable: true,  width: 'w-32'   },
  { key: 'total',       label: 'Total',         sortable: true,  width: 'w-28'   },
  { key: 'responsable', label: 'Responsable',   sortable: true,  width: 'w-32'   },
  { key: 'prioridad',   label: 'Prioridad',     sortable: true,  width: 'w-24'   },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatCurrency(n) {
  return `L. ${n.toLocaleString('es-HN')}`
}

export default function ReservationsTable({
  reservations, loading, search, setSearch,
  statusFilter, setStatusFilter, cityFilter, setCityFilter,
  eventTypeFilter, setEventTypeFilter, priorityFilter, setPriorityFilter,
  clearFilters, hasActiveFilters,
  sortField, sortDir, handleSort,
  currentPage, setCurrentPage, totalPages, totalResults, pageSize,
  selectedIds, toggleSelect, toggleSelectAll,
  openDetail,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [actionMenuId, setActionMenuId] = useState(null)
  const actionMenuRef = useRef(null)

  // Close action menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActionMenuId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronsUpDown size={13} className="text-surface-500" />
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="text-brand-400" />
      : <ChevronDown size={13} className="text-brand-400" />
  }

  return (
    <div className="card overflow-hidden">
      {/* ── Toolbar ──────────────────────────────────── */}
      <div className="p-4 border-b border-surface-700">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Buscar por código, cliente, evento, ciudad..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-surface-900 border border-surface-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-surface-500 focus:outline-none focus:border-brand-700 focus:ring-1 focus:ring-brand-700 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle + bulk actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className={clsx(
                'btn-secondary text-sm py-2.5',
                filtersOpen && 'bg-surface-600 border-surface-500'
              )}
            >
              <Filter size={14} />
              Filtros
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-brand-500 ml-1" />
              )}
            </button>

            {selectedIds.size > 0 && (
              <div className="flex gap-2 items-center">
                <span className="text-xs text-surface-400">{selectedIds.size} seleccionados</span>
                <button className="btn-secondary text-sm py-2.5">
                  <Download size={14} />
                  Exportar
                </button>
                <button className="btn-secondary text-sm py-2.5">
                  <Printer size={14} />
                  Imprimir
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Filters row ────────────────────────────── */}
        {filtersOpen && (
          <div className="mt-3 flex flex-wrap gap-3 pt-3 border-t border-surface-700 animate-fade-in">
            <FilterSelect label="Estado" value={statusFilter} onChange={setStatusFilter}
              options={Object.values(RESERVATION_STATUSES)} />
            <FilterSelect label="Ciudad" value={cityFilter} onChange={setCityFilter}
              options={CITIES} />
            <FilterSelect label="Tipo" value={eventTypeFilter} onChange={setEventTypeFilter}
              options={EVENT_TYPES} />
            <FilterSelect label="Prioridad" value={priorityFilter} onChange={setPriorityFilter}
              options={['Alta', 'Media', 'Baja']} />
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-ghost text-xs text-brand-400 hover:text-brand-300">
                <X size={12} />
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Table ────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-700">
              <th className="w-10 px-4 py-3">
                <button onClick={toggleSelectAll} className="text-surface-400 hover:text-white transition-colors">
                  {selectedIds.size === reservations.length && reservations.length > 0
                    ? <CheckSquare size={16} className="text-brand-400" />
                    : <Square size={16} />}
                </button>
              </th>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-400',
                    col.width,
                    col.sortable && 'cursor-pointer hover:text-surface-200 select-none transition-colors'
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon field={col.key} />}
                  </span>
                </th>
              ))}
              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700/50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={COLUMNS.length + 2} className="px-4 py-4">
                    <div className="skeleton h-8 rounded" />
                  </td>
                </tr>
              ))
            ) : reservations.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 2} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center">
                      <Search size={24} className="text-surface-500" />
                    </div>
                    <p className="text-surface-400 text-sm">No se encontraron reservaciones</p>
                    {hasActiveFilters && (
                      <button onClick={clearFilters} className="btn-ghost text-xs text-brand-400">
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              reservations.map(r => (
                <tr
                  key={r.id}
                  className={clsx(
                    'group transition-colors hover:bg-surface-800/60 cursor-pointer',
                    selectedIds.has(r.id) && 'bg-brand-950/30'
                  )}
                  onClick={() => openDetail(r)}
                >
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(r.id)} className="text-surface-400 hover:text-white transition-colors">
                      {selectedIds.has(r.id)
                        ? <CheckSquare size={16} className="text-brand-400" />
                        : <Square size={16} />}
                    </button>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-brand-400 font-semibold">{r.codigo}</td>
                  <td className="px-3 py-3">
                    <div>
                      <p className="text-white font-medium text-sm">{r.cliente.nombre}</p>
                      {r.cliente.empresa && (
                        <p className="text-surface-500 text-xs">{r.cliente.empresa}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-surface-300">{r.tipoEvento}</td>
                  <td className="px-3 py-3 text-surface-300">{r.ciudad}</td>
                  <td className="px-3 py-3 text-surface-300 whitespace-nowrap">{formatDate(r.fechaInicio)}</td>
                  <td className="px-3 py-3 text-surface-300 whitespace-nowrap">{formatDate(r.fechaFin)}</td>
                  <td className="px-3 py-3"><StatusBadge status={r.estado} /></td>
                  <td className="px-3 py-3 text-white font-semibold whitespace-nowrap">{formatCurrency(r.total)}</td>
                  <td className="px-3 py-3 text-surface-300">{r.responsable}</td>
                  <td className="px-3 py-3"><PriorityBadge priority={r.prioridad} /></td>
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <div className="relative" ref={actionMenuId === r.id ? actionMenuRef : null}>
                      <button
                        onClick={() => setActionMenuId(prev => prev === r.id ? null : r.id)}
                        className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {actionMenuId === r.id && (
                        <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-surface-800 border border-surface-600 rounded-xl shadow-xl py-1 animate-fade-in">
                          <button onClick={() => { openDetail(r); setActionMenuId(null) }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-300 hover:text-white hover:bg-surface-700 transition-colors">
                            <Eye size={14} /> Ver Detalle
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-300 hover:text-white hover:bg-surface-700 transition-colors">
                            <Edit3 size={14} /> Editar
                          </button>
                          <div className="border-t border-surface-700 my-1" />
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-colors">
                            <Trash2 size={14} /> Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────── */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-surface-700 gap-3">
          <p className="text-xs text-surface-400">
            Mostrando {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, totalResults)} de {totalResults} reservaciones
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="btn-icon disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={clsx(
                  'w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all',
                  page === currentPage
                    ? 'bg-brand-700 text-white'
                    : 'text-surface-400 hover:bg-surface-700 hover:text-white'
                )}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="btn-icon disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Filter dropdown ─────────────────────────────────── */
function FilterSelect({ label, value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={clsx(
        'bg-surface-900 border rounded-lg px-3 py-2 text-sm transition-all cursor-pointer appearance-none',
        'focus:outline-none focus:border-brand-700 focus:ring-1 focus:ring-brand-700',
        value ? 'border-brand-700 text-white' : 'border-surface-600 text-surface-400'
      )}
    >
      <option value="">{label}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  )
}

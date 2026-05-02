/**
 * RESERVATIONS SERVICE
 * --------------------
 * Service layer for reservations CRUD operations.
 * Currently uses mock data — prepared for Supabase integration.
 *
 * TODO: Replace mock implementations with:
 *   const { data, error } = await supabase.from('reservations').select(...)
 */

import { MOCK_RESERVATIONS, MOCK_ALERTS, MOCK_RECENT_ACTIVITY } from '../mock/reservationsData'

// Simulate network latency
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

/**
 * Fetch all reservations with optional filters.
 */
export async function fetchReservations({ search, status, city, eventType, priority } = {}) {
  await delay()
  let results = [...MOCK_RESERVATIONS]

  if (search) {
    const q = search.toLowerCase()
    results = results.filter(r =>
      r.codigo.toLowerCase().includes(q) ||
      r.cliente.nombre.toLowerCase().includes(q) ||
      r.tipoEvento.toLowerCase().includes(q) ||
      r.ciudad.toLowerCase().includes(q) ||
      (r.cliente.empresa && r.cliente.empresa.toLowerCase().includes(q))
    )
  }
  if (status) results = results.filter(r => r.estado === status)
  if (city) results = results.filter(r => r.ciudad === city)
  if (eventType) results = results.filter(r => r.tipoEvento === eventType)
  if (priority) results = results.filter(r => r.prioridad === priority)

  return results
}

/**
 * Fetch a single reservation by ID.
 */
export async function fetchReservationById(id) {
  await delay(300)
  return MOCK_RESERVATIONS.find(r => r.id === id) || null
}

/**
 * Update reservation status.
 */
export async function updateReservationStatus(id, newStatus) {
  await delay(500)
  const reservation = MOCK_RESERVATIONS.find(r => r.id === id)
  if (reservation) {
    reservation.estado = newStatus
    return { success: true, reservation }
  }
  return { success: false, error: 'Reservation not found' }
}

/**
 * Fetch dashboard statistics.
 */
export async function fetchReservationStats() {
  await delay(300)
  const all = MOCK_RESERVATIONS
  return {
    pendientes: all.filter(r => r.estado === 'Pendiente').length,
    confirmadas: all.filter(r => r.estado === 'Confirmada').length,
    enProceso: all.filter(r => r.estado === 'En Proceso').length,
    completadas: all.filter(r => r.estado === 'Completada').length,
    canceladas: all.filter(r => r.estado === 'Cancelada').length,
    totalReservations: all.length,
    ingresosEstimados: all.filter(r => r.estado !== 'Cancelada').reduce((sum, r) => sum + r.total, 0),
    ingresosCobrados: all.reduce((sum, r) => sum + r.abono, 0),
    proximosEventos: all.filter(r => {
      const d = new Date(r.fechaInicio)
      const now = new Date()
      const diff = (d - now) / (1000 * 60 * 60 * 24)
      return diff > 0 && diff <= 30 && r.estado !== 'Cancelada'
    }).length,
  }
}

/**
 * Fetch operational alerts.
 */
export async function fetchAlerts() {
  await delay(200)
  return MOCK_ALERTS
}

/**
 * Fetch recent activity feed.
 */
export async function fetchRecentActivity() {
  await delay(200)
  return MOCK_RECENT_ACTIVITY
}

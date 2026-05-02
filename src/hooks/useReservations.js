/**
 * useReservations Hook
 * --------------------
 * Manages reservation list state, filtering, pagination, and selection.
 * Prepared for Supabase realtime subscriptions.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchReservations, fetchReservationStats, fetchAlerts, fetchRecentActivity } from '../services/reservationsService'

const PAGE_SIZE = 8

export function useReservations() {
  const [reservations, setReservations] = useState([])
  const [stats, setStats] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  // Sorting
  const [sortField, setSortField] = useState('fechaInicio')
  const [sortDir, setSortDir] = useState('asc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Selection
  const [selectedIds, setSelectedIds] = useState(new Set())

  // Detail panel
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [res, st, al, act] = await Promise.all([
        fetchReservations({ search, status: statusFilter, city: cityFilter, eventType: eventTypeFilter, priority: priorityFilter }),
        fetchReservationStats(),
        fetchAlerts(),
        fetchRecentActivity(),
      ])
      setReservations(res)
      setStats(st)
      setAlerts(al)
      setActivity(act)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, cityFilter, eventTypeFilter, priorityFilter])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
    setSelectedIds(new Set())
  }, [search, statusFilter, cityFilter, eventTypeFilter, priorityFilter])

  // Sorted data
  const sortedData = useMemo(() => {
    const sorted = [...reservations]
    sorted.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      if (sortField === 'total') { aVal = Number(aVal); bVal = Number(bVal) }
      if (sortField === 'cliente') { aVal = a.cliente.nombre; bVal = b.cliente.nombre }
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase() }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [reservations, sortField, sortDir])

  // Pagination
  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE)
  const paginatedData = sortedData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSort = useCallback((field) => {
    setSortDir(prev => sortField === field ? (prev === 'asc' ? 'desc' : 'asc') : 'asc')
    setSortField(field)
  }, [sortField])

  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(prev =>
      prev.size === paginatedData.length
        ? new Set()
        : new Set(paginatedData.map(r => r.id))
    )
  }, [paginatedData])

  const openDetail = useCallback((reservation) => {
    setSelectedReservation(reservation)
    setDetailOpen(true)
  }, [])

  const closeDetail = useCallback(() => {
    setDetailOpen(false)
    setTimeout(() => setSelectedReservation(null), 300)
  }, [])

  const clearFilters = useCallback(() => {
    setSearch('')
    setStatusFilter('')
    setCityFilter('')
    setEventTypeFilter('')
    setPriorityFilter('')
  }, [])

  const hasActiveFilters = search || statusFilter || cityFilter || eventTypeFilter || priorityFilter

  return {
    // Data
    reservations: paginatedData,
    allReservations: sortedData,
    stats,
    alerts,
    activity,
    loading,
    error,
    // Filters
    search, setSearch,
    statusFilter, setStatusFilter,
    cityFilter, setCityFilter,
    eventTypeFilter, setEventTypeFilter,
    priorityFilter, setPriorityFilter,
    clearFilters,
    hasActiveFilters,
    // Sort
    sortField, sortDir, handleSort,
    // Pagination
    currentPage, setCurrentPage, totalPages, pageSize: PAGE_SIZE,
    totalResults: sortedData.length,
    // Selection
    selectedIds, toggleSelect, toggleSelectAll,
    // Detail
    selectedReservation, detailOpen, openDetail, closeDetail,
    // Actions
    refresh: loadData,
  }
}

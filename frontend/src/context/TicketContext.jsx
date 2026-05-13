import React, { createContext, useContext, useState, useCallback } from 'react'
import { ticketAPI } from '../services/api'

const TicketContext = createContext(null)

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    domain: '', priority: '', status: '', search: ''
  })

  const fetchTickets = useCallback(async (activeFilters) => {
    setLoading(true)
    setError(null)
    try {
      const res = await ticketAPI.getAll(activeFilters || filters)
      setTickets(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setIsInitializing(false)
    }
  }, [filters])

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true)
    try {
      const res = await ticketAPI.getSummary()
      setSummary(res.data)
    } catch {
      // non-critical
    } finally {
      setSummaryLoading(false)
      setIsInitializing(false)
    }
  }, [])

  const createTicket = async (data) => {
    const res = await ticketAPI.create(data)
    setTickets(prev => [res.data, ...prev])
    fetchSummary()
    return res.data
  }

  const updateTicket = async (id, data) => {
    const res = await ticketAPI.update(id, data)
    setTickets(prev => prev.map(t => t.id === Number(id) ? res.data : t))
    fetchSummary()
    return res.data
  }

  const deleteTicket = async (id) => {
    const originalTickets = [...tickets]
    // Optimistic update
    setTickets(prev => prev.filter(t => t.id !== Number(id)))
    
    try {
      await ticketAPI.delete(id)
      fetchSummary()
    } catch (err) {
      // Rollback on error
      setTickets(originalTickets)
      throw err
    }
  }

  const getTicket = useCallback(async (id) => {
    try {
      const res = await ticketAPI.getById(id)
      return res.data
    } catch (err) {
      throw err
    }
  }, [])

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters)
    fetchTickets(newFilters)
  }, [fetchTickets])

  return (
    <TicketContext.Provider value={{
      tickets,
      summary,
      loading,
      summaryLoading,
      isInitializing,
      error,
      filters,
      fetchTickets,
      fetchSummary,
      getTicket,
      createTicket,
      updateTicket,
      deleteTicket,
      applyFilters,
      setFilters,
    }}>
      {children}
    </TicketContext.Provider>
  )
}

export function useTickets() {
  const ctx = useContext(TicketContext)
  if (!ctx) throw new Error('useTickets must be used within TicketProvider')
  return ctx
}

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTickets } from '../context/TicketContext'
import TicketCard from '../components/TicketCard'
import FilterBar from '../components/FilterBar'
import SummaryCards from '../components/SummaryCards'
import { DashboardSkeleton } from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../components/Toast'
import TicketTable from '../components/TicketTable'

const EMPTY_FILTERS = { domain: '', priority: '', status: '', search: '' }

function DashboardInner() {
  const navigate = useNavigate()
  const toast = useToast()
  const {
    tickets,
    summary,
    loading,
    summaryLoading,
    isInitializing,
    error,
    filters,
    applyFilters,
    fetchTickets,
    fetchSummary,
    deleteTicket,
  } = useTickets()

  const [deleteId, setDeleteId] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showWakeupMessage, setShowWakeupMessage] = useState(false)

  useEffect(() => {
    fetchTickets()
    fetchSummary()

    // Show wakeup message if still loading after 3 seconds
    const timer = setTimeout(() => {
      if (isInitializing) setShowWakeupMessage(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const hasFilters = !!(filters.domain || filters.priority || filters.status || filters.search)

  const handleDeleteRequest = (id) => {
    setDeleteId(id)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId || isDeleting) return
    const idToDelete = deleteId
    setDeleteId(null)
    setIsDeleting(true)
    try {
      await deleteTicket(idToDelete)
      toast('Ticket deleted successfully', 'success')
    } catch (err) {
      toast(err.message || 'Failed to delete ticket', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteId(null)
  }

  const handleReset = () => applyFilters(EMPTY_FILTERS)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-2">
            Ticket <span className="text-gradient-primary">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl">
            Track and manage mission-critical issues across all organizational domains with real-time analytics.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/create')}
            className="btn-premium group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} loading={summaryLoading} />

      {/* Filter Bar & View Toggle */}
      <div className="space-y-4">
        <FilterBar filters={filters} onChange={applyFilters} onReset={handleReset} />

        {!loading && !error && tickets.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
              Showing <span className="text-indigo-400">{tickets.length}</span> results
              {hasFilters && <span className="text-slate-600 ml-1">(filtered)</span>}
            </p>

            {/* Grid / List Toggle */}
            <div className="flex bg-white/[0.03] border border-white/[0.08] rounded-xl p-1 gap-1">
              {[
                {
                  mode: 'grid',
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>
                  ),
                },
                {
                  mode: 'list',
                  icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  ),
                },
              ].map(({ mode, icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === mode
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content States */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {showWakeupMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Backend is waking up...</p>
                  <p className="text-indigo-300/70 text-xs font-medium">Render free tier services sleep after inactivity. This usually takes 30-60 seconds.</p>
                </div>
              </motion.div>
            )}
            <DashboardSkeleton />
          </motion.div>
        ) : error ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorMessage message={error} onRetry={fetchTickets} />
          </motion.div>
        ) : tickets.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState filtered={hasFilters} />
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
          >
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tickets.map((ticket, i) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    index={i}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </div>
            ) : (
              <TicketTable
                tickets={tickets}
                onDelete={handleDeleteRequest}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Confirm Deletion"
        message={`This will permanently remove ticket #${deleteId}. This action is irreversible and will be logged in the audit trail.`}
        confirmLabel="Confirm Delete"
        confirmStyle="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </motion.div>
  )
}

export default function Dashboard() {
  return <DashboardInner />
}

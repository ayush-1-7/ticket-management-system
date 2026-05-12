import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTickets } from '../context/TicketContext'
import TicketCard from '../components/TicketCard'
import FilterBar from '../components/FilterBar'
import SummaryCards from '../components/SummaryCards'
import { DashboardSkeleton } from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../components/Toast'
import { PriorityBadge, StatusBadge, DomainBadge } from '../components/Badge'
import TicketTable from '../components/TicketTable'

const EMPTY_FILTERS = { domain: '', priority: '', status: '', search: '' }

// List row component — no dynamic require, plain imports

// Inner component that uses toast (must be inside ToastProvider)
function DashboardInner() {
  const navigate = useNavigate()
  const toast = useToast()
  const {
    tickets,
    summary,
    loading,
    summaryLoading,
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

  useEffect(() => {
    fetchTickets()
    fetchSummary()
  }, [])

  const hasFilters = !!(filters.domain || filters.priority || filters.status || filters.search)

  // This is called when user clicks delete icon on a card
  const handleDeleteRequest = (id) => {
    setDeleteId(id)
  }

  // This is called when user confirms in the dialog
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
    <div style={{ animation: 'fadeIn 300ms ease-out' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px',
        flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: '6px',
          }}>
            Ticket Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Track and manage issues across all organizational domains
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/create')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
              transition: 'all var(--transition-fast)',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,130,246,0.4)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Ticket
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} loading={summaryLoading} />

      {/* Filter Bar */}
      <FilterBar filters={filters} onChange={applyFilters} onReset={handleReset} />

      {/* Ticket Count + View Toggle */}
      {!loading && !error && tickets.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {tickets.length}
            </span>
            {' '}ticket{tickets.length !== 1 ? 's' : ''} found
            {hasFilters && (
              <span style={{ color: 'var(--color-text-tertiary)' }}> (filtered)</span>
            )}
          </p>

          {/* Grid / List Toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--color-bg-tertiary)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '3px',
            gap: '2px',
          }}>
            {[
              {
                mode: 'grid',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                ),
              },
              {
                mode: 'list',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                style={{
                  padding: '5px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === mode ? 'var(--color-bg-card)' : 'transparent',
                  color: viewMode === mode ? 'var(--color-brand)' : 'var(--color-text-tertiary)',
                  boxShadow: viewMode === mode ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* States */}
      {loading && <DashboardSkeleton />}
      {error && !loading && <ErrorMessage message={error} onRetry={fetchTickets} />}
      {!loading && !error && tickets.length === 0 && <EmptyState filtered={hasFilters} />}

      {/* Ticket Grid */}
      {!loading && !error && tickets.length > 0 && viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {tickets.map((ticket, i) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              index={i}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {/* Ticket Table View */}
      {!loading && !error && tickets.length > 0 && viewMode === 'list' && (
        <TicketTable 
          tickets={tickets} 
          onDelete={handleDeleteRequest} 
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Ticket"
        message={`Are you sure you want to permanently delete ticket #${deleteId}? This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        confirmStyle="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}

// Wrap with ToastProvider so useToast works
export default function Dashboard() {
  return <DashboardInner />
}

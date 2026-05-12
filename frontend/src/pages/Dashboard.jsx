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

const EMPTY_FILTERS = { domain: '', priority: '', status: '', search: '' }

// Live Clock Component showing IST
function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const options = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }

  const formattedTime = new Intl.DateTimeFormat('en-IN', options).format(time)
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(time)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '2px',
      padding: '8px 16px',
      background: 'var(--color-bg-tertiary)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      minWidth: '140px'
    }}>
      <span style={{ 
        fontSize: '11px', 
        fontWeight: 700, 
        color: 'var(--color-brand)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        IST Time
      </span>
      <span style={{ 
        fontSize: '18px', 
        fontWeight: 800, 
        color: 'var(--color-text-primary)',
        fontFamily: 'monospace'
      }}>
        {formattedTime}
      </span>
      <span style={{ 
        fontSize: '11px', 
        color: 'var(--color-text-tertiary)',
        fontWeight: 500
      }}>
        {formattedDate}
      </span>
    </div>
  )
}

// List row component — no dynamic require, plain imports
function ListRow({ ticket, onDeleteClick, onViewClick, index }) {
  const [hovered, setHovered] = useState(false)
  const PRIORITY_ACCENTS = {
    Low: '#10b981', Medium: '#f59e0b', High: '#f97316', Critical: '#ef4444'
  }
  const accent = PRIORITY_ACCENTS[ticket.priority] || '#3b82f6'

  return (
    <div
      className="card animate-slide-up"
      style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animationDelay: `${index * 30}ms`,
        cursor: 'default',
        borderLeft: `3px solid ${hovered ? accent : 'var(--color-border)'}`,
        transition: 'all var(--transition-base)',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        flexWrap: 'wrap',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        fontSize: '11px',
        color: 'var(--color-text-tertiary)',
        fontFamily: 'monospace',
        width: '32px',
        flexShrink: 0,
      }}>
        #{ticket.id}
      </span>

      <span style={{
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minWidth: '120px',
      }}>
        {ticket.title}
      </span>

      <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap' }}>
        <DomainBadge domain={ticket.domain} />
        <PriorityBadge priority={ticket.priority} />
        <StatusBadge status={ticket.status} />
      </div>

      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <button
          onClick={() => onViewClick(ticket.id)}
          style={{
            padding: '5px 12px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '7px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-brand)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--color-brand)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg-tertiary)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'var(--color-border)' }}
        >
          View
        </button>
        <button
          onClick={() => onDeleteClick(ticket.id)}
          style={{
            padding: '5px 12px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '7px',
            border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.08)',
            color: '#ef4444',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

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
          <LiveClock />
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

      {/* Ticket List */}
      {!loading && !error && tickets.length > 0 && viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tickets.map((ticket, i) => (
            <ListRow
              key={ticket.id}
              ticket={ticket}
              index={i}
              onDeleteClick={handleDeleteRequest}
              onViewClick={(id) => navigate(`/tickets/${id}`)}
            />
          ))}
        </div>
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

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ticketAPI } from '../services/api'
import { useTickets } from '../context/TicketContext'
import { PriorityBadge, StatusBadge, DomainBadge } from '../components/Badge'
import { useToast } from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import ErrorMessage from '../components/ErrorMessage'

const STATUSES = ['Open', 'In Progress', 'Closed']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

const STATUS_STEPS = ['Open', 'In Progress', 'Closed']
const STATUS_COLORS = {
  'Open': '#3b82f6',
  'In Progress': '#8b5cf6',
  'Closed': '#10b981',
}
const PRIORITY_COLORS = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
}

function SkeletonDetail() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', animation: 'fadeIn 300ms' }}>
      <div className="skeleton" style={{ height: '14px', width: '200px', marginBottom: '28px' }} />
      <div className="card" style={{ padding: '28px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[80, 90, 80].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: `${w}px`, height: '22px', borderRadius: '20px' }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: '26px', width: '70%', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '20px' }} />
        <div className="skeleton" style={{ height: '80px', borderRadius: '10px' }} />
      </div>
      <div className="card" style={{ padding: '28px', marginBottom: '16px' }}>
        <div className="skeleton" style={{ height: '18px', width: '140px', marginBottom: '20px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '44px', borderRadius: '10px' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusTimeline({ currentStatus }) {
  const currentIdx = STATUS_STEPS.indexOf(currentStatus)
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx
        const active = idx === currentIdx
        const color = STATUS_COLORS[step]
        return (
          <React.Fragment key={step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: done ? color : 'var(--color-bg-tertiary)',
                border: `2px solid ${done ? color : 'var(--color-border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-base)',
                boxShadow: active ? `0 0 0 4px ${color}30` : 'none',
              }}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--color-border-strong)',
                  }} />
                )}
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: active ? 700 : 500,
                color: done ? color : 'var(--color-text-tertiary)',
                whiteSpace: 'nowrap',
              }}>
                {step}
              </span>
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div style={{
                flex: 2,
                height: '2px',
                marginBottom: '20px',
                background: idx < currentIdx
                  ? `linear-gradient(90deg,${STATUS_COLORS[STATUS_STEPS[idx]]},${STATUS_COLORS[STATUS_STEPS[idx + 1]]})`
                  : 'var(--color-border)',
                transition: 'background var(--transition-slow)',
              }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function TicketDetailInner() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const { deleteTicket } = useTickets()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [dirty, setDirty] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    ticketAPI.getById(id)
      .then(res => {
        if (!cancelled) {
          setTicket(res.data)
          setStatus(res.data.status)
          setPriority(res.data.priority)
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (ticket) {
      setDirty(status !== ticket.status || priority !== ticket.priority)
    }
  }, [status, priority, ticket])

  const handleUpdate = async () => {
    if (!dirty || updating) return
    setUpdating(true)
    try {
      const res = await ticketAPI.update(id, { status, priority })
      setTicket(res.data)
      setDirty(false)
      toast('Ticket updated successfully', 'success')
    } catch (err) {
      toast(err.message || 'Update failed', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteConfirm = async () => {
    setDeleteOpen(false)
    if (deleting) return
    setDeleting(true)
    try {
      await deleteTicket(id)
      toast('Ticket deleted successfully', 'success')
      navigate('/')
    } catch (err) {
      toast(err.message || 'Delete failed', 'error')
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => setDeleteOpen(false)

  const formatIST = (dateStr) => {
    if (!dateStr) return { full: '—', relative: '—' }
    
    // Robustly parse UTC from server (append Z if missing to avoid local time parsing)
    let date = new Date(dateStr)
    if (typeof dateStr === 'string' && !dateStr.includes('Z') && !dateStr.includes('+')) {
      date = new Date(dateStr + 'Z')
    }

    if (isNaN(date.getTime())) return { full: 'Invalid Date', relative: 'Invalid' }

    const full = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date) + ' IST'

    // Relative time calculation
    const now = new Date()
    const diffMs = Math.abs(now - date)
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    let relative = ''
    if (diffMins < 1) relative = 'Just now'
    else if (diffMins < 60) relative = `${diffMins}m ago`
    else if (diffHours < 24) relative = `${diffHours}h ago`
    else relative = `${diffDays}d ago`

    return { full, relative }
  }

  if (loading) return <SkeletonDetail />
  if (error) return <ErrorMessage message={error} onRetry={() => navigate('/')} />
  if (!ticket) return null

  const priorityColor = PRIORITY_COLORS[ticket.priority] || '#3b82f6'

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', animation: 'fadeIn 300ms ease-out' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link
          to="/"
          style={{
            fontSize: '13px',
            color: 'var(--color-text-tertiary)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-brand)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
          Dashboard
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span style={{ fontSize: '13px', color: 'var(--color-text-primary)', fontWeight: 600 }}>
          Ticket #{ticket.id}
        </span>
      </div>

      {/* Main Info Card */}
      <div className="card" style={{ marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ height: '4px', background: `linear-gradient(90deg,${priorityColor},${priorityColor}60)` }} />
        <div style={{ padding: '28px' }}>

          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            <DomainBadge domain={ticket.domain} />
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            marginBottom: '24px',
          }}>
            {ticket.title}
          </h1>

          {/* Status Timeline */}
          <StatusTimeline currentStatus={ticket.status} />

          {/* Description */}
          <div style={{
            background: 'var(--color-bg-tertiary)',
            borderRadius: '12px',
            padding: '18px',
            marginBottom: '20px',
            border: '1px solid var(--color-border)',
          }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
            }}>
              Description
            </p>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.75,
            }}>
              {ticket.description}
            </p>
          </div>

          {/* Meta Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: 'Ticket ID', full: `#${ticket.id}`, relative: 'Ticket Unique Identifier' },
              { label: 'Domain', full: ticket.domain, relative: 'Business Domain' },
              { label: 'Created', ...formatIST(ticket.created_at) },
              { label: 'Last Updated', ...(ticket.updated_at ? formatIST(ticket.updated_at) : { full: '—', relative: '—' }) },
            ].map(({ label, full, relative }) => (
              <div
                key={label}
                style={{
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <p style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '5px',
                }}>
                  {label}
                </p>
                <p data-tooltip={relative} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', cursor: 'help' }}>
                  {full}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Update Card */}
      <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
        <h2 style={{
          fontSize: '15px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Update Ticket
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {/* Status Selector */}
          <div>
            <label style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: '10px',
            }}>
              Status
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {STATUSES.map(s => {
                const isSelected = status === s
                const color = STATUS_COLORS[s]
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: `1.5px solid ${isSelected ? color : 'var(--color-border)'}`,
                      background: isSelected ? `${color}15` : 'var(--color-bg-secondary)',
                      color: isSelected ? color : 'var(--color-text-secondary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isSelected ? color : 'var(--color-border-strong)',
                      flexShrink: 0,
                    }} />
                    {s}
                    {isSelected && (
                      <svg style={{ marginLeft: 'auto' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Priority Selector */}
          <div>
            <label style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: '10px',
            }}>
              Priority
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {PRIORITIES.map(p => {
                const isSelected = priority === p
                const color = PRIORITY_COLORS[p]
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: `1.5px solid ${isSelected ? color : 'var(--color-border)'}`,
                      background: isSelected ? `${color}15` : 'var(--color-bg-secondary)',
                      color: isSelected ? color : 'var(--color-text-secondary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isSelected ? color : 'var(--color-border-strong)',
                      flexShrink: 0,
                    }} />
                    {p}
                    {isSelected && (
                      <svg style={{ marginLeft: 'auto' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Save / Discard */}
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid var(--color-border)',
        }}>
          <button
            onClick={handleUpdate}
            disabled={!dirty || updating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '10px',
              border: 'none',
              background: dirty ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'var(--color-bg-tertiary)',
              color: dirty ? 'white' : 'var(--color-text-tertiary)',
              cursor: dirty ? 'pointer' : 'not-allowed',
              boxShadow: dirty ? '0 2px 8px rgba(59,130,246,0.35)' : 'none',
              transition: 'all var(--transition-fast)',
              opacity: !dirty ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (dirty) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(59,130,246,0.5)' } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = dirty ? '0 2px 8px rgba(59,130,246,0.35)' : 'none' }}
          >
            {updating ? (
              <>
                <div style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Saving...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>

          {dirty && (
            <button
              onClick={() => { setStatus(ticket.status); setPriority(ticket.priority) }}
              style={{
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              Discard
            </button>
          )}

          {!dirty && (
            <span style={{
              fontSize: '12px',
              color: 'var(--color-text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              No unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{
        padding: '24px',
        borderColor: 'rgba(239,68,68,0.25)',
        background: 'rgba(239,68,68,0.03)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#dc2626',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Danger Zone
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', lineHeight: 1.5 }}>
              Permanently delete ticket #{ticket.id}. This action cannot be undone.
            </p>
          </div>

          <button
            onClick={() => setDeleteOpen(true)}
            disabled={deleting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '10px',
              border: '1px solid rgba(239,68,68,0.35)',
              background: deleting ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.1)',
              color: '#ef4444',
              cursor: deleting ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-fast)',
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (!deleting) { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)' } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)' }}
          >
            {deleting ? (
              <>
                <div style={{
                  width: '13px',
                  height: '13px',
                  border: '2px solid rgba(239,68,68,0.3)',
                  borderTopColor: '#ef4444',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Deleting...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Ticket
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteOpen}
        title={`Delete Ticket #${ticket.id}?`}
        message={`"${ticket.title}" will be permanently deleted. There is no way to recover it after deletion.`}
        confirmLabel="Yes, Delete Permanently"
        confirmStyle="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}

export default function TicketDetail() {
  return <TicketDetailInner />
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PriorityBadge, StatusBadge, DomainBadge } from './Badge'

const PRIORITY_ACCENTS = {
  Low: '#10b981', Medium: '#f59e0b', High: '#f97316', Critical: '#ef4444'
}

function formatIST(dateStr) {
  const date = new Date(dateStr)
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  const parts = formatter.formatToParts(date)
  const day = parts.find(p => p.type === 'day').value
  const month = parts.find(p => p.type === 'month').value
  const year = parts.find(p => p.type === 'year').value
  const hour = parts.find(p => p.type === 'hour').value
  const minute = parts.find(p => p.type === 'minute').value
  const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value || ''

  const fullTime = `${day} ${month} ${year}, ${hour}:${minute} ${dayPeriod} IST`

  // Relative time for tooltip
  const relative = getRelativeTime(date)
  
  return { fullTime, relative }
}

function getRelativeTime(date) {
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default function TicketCard({ ticket, onDelete, index = 0 }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const accent = PRIORITY_ACCENTS[ticket.priority] || '#3b82f6'
  const { fullTime, relative } = formatIST(ticket.created_at)

  return (
    <div className="card animate-slide-up" style={{
      padding: '0', overflow: 'hidden', cursor: 'default',
      animationDelay: `${index * 40}ms`,
      transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      boxShadow: hovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      borderColor: hovered ? accent + '40' : 'var(--color-border)',
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    >
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${accent}, ${accent}60)` }} />

      <div style={{ padding: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'monospace', background: 'var(--color-bg-tertiary)', padding: '1px 6px', borderRadius: '4px' }}>
              #{ticket.id}
            </span>
            <DomainBadge domain={ticket.domain} />
          </div>
          <span 
            data-tooltip={fullTime}
            style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', cursor: 'help' }}
          >
            {relative}
          </span>
        </div>

        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: hovered ? accent : 'var(--color-text-primary)' }}>
          {ticket.title}
        </h3>

        <p className="line-clamp-2" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
          {ticket.description}
        </p>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>

        <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
          <button onClick={() => navigate(`/tickets/${ticket.id}`)} className="btn" style={{ flex: 1, fontSize: '12.5px' }}>
            View Details →
          </button>
          <button onClick={() => onDelete(ticket.id)} className="btn btn-ghost" title="Delete ticket">
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}

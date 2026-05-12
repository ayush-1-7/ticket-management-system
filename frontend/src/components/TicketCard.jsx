import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PriorityBadge, StatusBadge, DomainBadge } from './Badge'

function formatIST(dateStr) {
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
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date) + ' IST'

  const relative = getRelativeTime(date)

  return { full, relative }
}

function getRelativeTime(date) {
  const now = new Date()
  const diffMs = Math.abs(now - date)
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
  const accent = { Low: '#10b981', Medium: '#f59e0b', High: '#f97316', Critical: '#ef4444' }[ticket.priority] || '#6366f1'
  const { full, relative } = formatIST(ticket.created_at)

  return (
    <div className="card animate-slide-up" style={{
      padding: '0', cursor: 'default',
      animationDelay: `${index * 40}ms`,
      transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      boxShadow: hovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      borderColor: hovered ? accent + '40' : 'var(--color-border)',
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    >
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${accent}, ${accent}60)`, borderRadius: '12px 12px 0 0' }} />

      <div style={{ padding: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'monospace', background: 'var(--color-bg-tertiary)', padding: '1px 6px', borderRadius: '4px' }}>
              #{ticket.id}
            </span>
            <DomainBadge domain={ticket.domain} />
          </div>
          <span data-tooltip={full} style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', cursor: 'help' }}>
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
          <button 
            className="btn-highlight"
            onClick={() => navigate(`/tickets/${ticket.id}`)} 
            style={{ 
              flex: 1, 
              padding: '8px', 
              fontSize: '12.5px', 
              fontWeight: 600, 
              borderRadius: '8px', 
              background: hovered ? accent + '15' : 'var(--color-bg-tertiary)', 
              border: `1.5px solid ${hovered ? accent : 'var(--color-border)'}`,
              color: hovered ? accent : 'var(--color-text-primary)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            View Details →
          </button>
          <button 
            className="btn-highlight"
            onClick={() => onDelete(ticket.id)} 
            style={{ 
              padding: '8px 12px', 
              borderRadius: '8px', 
              background: 'var(--color-bg-tertiary)', 
              border: '1.5px solid #f8717160', 
              color: '#f87171',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '1.5px solid #f87171';
              e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '1.5px solid #f8717160';
              e.currentTarget.style.background = 'var(--color-bg-tertiary)';
            }}
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}

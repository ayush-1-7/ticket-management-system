import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PriorityBadge, StatusBadge, DomainBadge } from './Badge'

const PRIORITY_ACCENTS = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TicketCard({ ticket, onDelete, index = 0 }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const accent = PRIORITY_ACCENTS[ticket.priority] || '#3b82f6'

  const handleDeleteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof onDelete === 'function') {
      onDelete(ticket.id)
    }
  }

  const handleViewClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/tickets/${ticket.id}`)
  }

  return (
    <div
      className="card animate-slide-up"
      style={{
        padding: '0',
        overflow: 'hidden',
        cursor: 'default',
        animationDelay: `${index * 40}ms`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        borderColor: hovered ? accent + '40' : 'var(--color-border)',
        transition: 'all var(--transition-base)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Priority accent bar */}
      <div style={{
        height: '3px',
        background: `linear-gradient(90deg, ${accent}, ${accent}60)`,
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity var(--transition-base)',
      }} />

      <div style={{ padding: '18px' }}>
        {/* Header Row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--color-text-tertiary)',
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '2px 7px',
              fontFamily: 'monospace',
              letterSpacing: '0.03em',
            }}>
              #{ticket.id}
            </span>
            <DomainBadge domain={ticket.domain} />
          </div>
          <span style={{
            fontSize: '11px',
            color: 'var(--color-text-tertiary)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {formatDate(ticket.created_at)}
          </span>
        </div>

        {/* Title */}
        <h3
          className="line-clamp-1"
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: hovered ? accent : 'var(--color-text-primary)',
            marginBottom: '8px',
            lineHeight: 1.4,
            transition: 'color var(--transition-fast)',
          }}
        >
          {ticket.title}
        </h3>

        {/* Description */}
        <p
          className="line-clamp-2"
          style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '14px',
          }}
        >
          {ticket.description}
        </p>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '8px',
          paddingTop: '14px',
          borderTop: '1px solid var(--color-border)',
        }}>
          {/* View Button */}
          <button
            onClick={handleViewClick}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '8px',
              border: `1px solid ${hovered ? 'var(--color-brand)' : 'var(--color-border)'}`,
              background: hovered ? 'var(--color-brand)' : 'var(--color-bg-tertiary)',
              color: hovered ? 'white' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: hovered ? '0 2px 8px rgba(59,130,246,0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            View Details
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            title="Delete ticket"
            style={{
              width: '36px',
              height: '36px',
              padding: '0',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
              e.currentTarget.style.color = '#ef4444'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--color-bg-tertiary)'
              e.currentTarget.style.color = 'var(--color-text-tertiary)'
              e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

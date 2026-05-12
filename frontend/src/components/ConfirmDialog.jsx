import React, { useEffect } from 'react'

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmStyle = 'danger',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter') onConfirm()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onConfirm, onCancel])

  if (!isOpen) return null

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '24px',
        animation: 'fadeIn 150ms ease-out',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '420px',
          width: '100%',
          padding: '28px',
          animation: 'scaleIn var(--transition-spring) forwards',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: confirmStyle === 'danger'
            ? 'rgba(239,68,68,0.12)'
            : 'var(--color-brand-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          border: confirmStyle === 'danger'
            ? '1px solid rgba(239,68,68,0.2)'
            : '1px solid var(--color-border)',
        }}>
          {confirmStyle === 'danger' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>

        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '10px',
          lineHeight: 1.3,
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          marginBottom: '28px',
          lineHeight: 1.65,
        }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '10px',
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-hover)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg-tertiary)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            autoFocus
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '10px',
              border: 'none',
              background: confirmStyle === 'danger'
                ? 'linear-gradient(135deg,#ef4444,#dc2626)'
                : 'linear-gradient(135deg,#3b82f6,#2563eb)',
              color: 'white',
              cursor: 'pointer',
              boxShadow: confirmStyle === 'danger'
                ? '0 2px 8px rgba(239,68,68,0.4)'
                : '0 2px 8px rgba(59,130,246,0.4)',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = confirmStyle === 'danger' ? '0 4px 16px rgba(239,68,68,0.5)' : '0 4px 16px rgba(59,130,246,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = confirmStyle === 'danger' ? '0 2px 8px rgba(239,68,68,0.4)' : '0 2px 8px rgba(59,130,246,0.4)' }}
          >
            {confirmStyle === 'danger' && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

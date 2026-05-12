import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PriorityBadge, StatusBadge, DomainBadge } from './Badge';

export default function TicketTable({ tickets, onDelete }) {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/tickets/${id}`);
  };

  const handleDelete = (id) => {
    // Relying on Dashboard's ConfirmDialog for a consistent UX
    onDelete(id);
  };

  return (
    <div className="card" style={{ overflowX: 'auto', padding: '0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', borderRight: '1px solid var(--color-border)' }}>#</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', borderRight: '1px solid var(--color-border)' }}>Title</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', borderRight: '1px solid var(--color-border)' }}>Domain</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', borderRight: '1px solid var(--color-border)' }}>Priority</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', borderRight: '1px solid var(--color-border)' }}>Status</th>
            <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', width: '140px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr
              key={ticket.id}
              style={{
                borderBottom: '1px solid var(--color-border)',
                background: index % 2 === 0 ? 'transparent' : 'var(--color-bg-tertiary)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'var(--color-bg-tertiary)'}
            >
              <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-tertiary)', borderRight: '1px solid var(--color-border)' }}>
                #{ticket.id}
              </td>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-primary)', maxWidth: '280px', borderRight: '1px solid var(--color-border)' }}>
                <div className="line-clamp-1">{ticket.title}</div>
              </td>
              <td style={{ padding: '14px 16px', borderRight: '1px solid var(--color-border)' }}>
                <DomainBadge domain={ticket.domain} />
              </td>
              <td style={{ padding: '14px 16px', borderRight: '1px solid var(--color-border)' }}>
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td style={{ padding: '14px 16px', borderRight: '1px solid var(--color-border)' }}>
                <StatusBadge status={ticket.status} />
              </td>
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <button
                  onClick={() => handleView(ticket.id)}
                  style={{
                    padding: '6px 14px',
                    marginRight: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(ticket.id)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

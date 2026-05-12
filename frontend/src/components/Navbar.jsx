import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function LiveISTClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })

      const parts = formatter.formatToParts(new Date())
      const hour = parts.find(p => p.type === 'hour').value.padStart(2, '0')
      const minute = parts.find(p => p.type === 'minute').value
      const second = parts.find(p => p.type === 'second').value
      const dayPeriod = parts.find(p => p.type === 'dayPeriod').value.toLowerCase()
      const day = parts.find(p => p.type === 'day').value
      const month = parts.find(p => p.type === 'month').value
      const year = parts.find(p => p.type === 'year').value

      setTime(`${hour}:${minute}:${second} ${dayPeriod} | ${day} ${month} ${year}`)
    }

    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      fontSize: '12.5px',
      fontWeight: 500,
      color: '#a5b4fc',
      background: 'rgba(165, 180, 252, 0.08)',
      padding: '6px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(165, 180, 252, 0.15)',
      whiteSpace: 'nowrap',
      textAlign: 'center',
      minWidth: '180px',
    }}>
      {time}
    </div>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'var(--color-nav-bg)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--color-nav-border)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '20px' }}>T</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>TicketFlow</div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '-3px' }}>MULTI-DOMAIN MANAGEMENT</div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', background: 'var(--color-bg-tertiary)', borderRadius: '12px', padding: '4px', border: '1px solid var(--color-border)' }}>
          <NavLink to="/" end style={({ isActive }) => ({
            padding: '8px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '13.5px',
            background: isActive ? 'var(--color-bg-card)' : 'transparent',
            color: isActive ? '#6366f1' : 'var(--color-text-secondary)',
          })}>Dashboard</NavLink>
          <NavLink to="/create" style={({ isActive }) => ({
            padding: '8px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '13.5px',
            background: isActive ? 'var(--color-bg-card)' : 'transparent',
            color: isActive ? '#6366f1' : 'var(--color-text-secondary)',
          })}>Create Ticket</NavLink>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LiveISTClock />

          <button onClick={toggleTheme} style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button onClick={() => navigate('/create')} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
            + New Ticket
          </button>
        </div>
      </div>
    </nav>
  )
}

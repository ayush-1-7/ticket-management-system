import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useTickets } from '../context/TicketContext'

function LiveISTClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      setTime(now)
    }

    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      fontSize: '12px',
      fontWeight: 500,
      color: 'var(--color-text-tertiary)',
      textAlign: 'right',
      lineHeight: 1.2,
      marginRight: '12px',
      userSelect: 'none',
    }}>
      <div style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: 600 }}>IST TIME</div>
      <div>{time}</div>
    </div>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { tickets } = useTickets()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openCount = tickets.filter(t => t.status === 'Open').length

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'var(--color-nav-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--color-nav-border)' : 'none',
      transition: 'all var(--transition-base)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '18px' }}>T</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '17px', letterSpacing: '-0.02em' }}>TicketFlow</div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '-2px' }}>MULTI-DOMAIN MANAGEMENT</div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', background: 'var(--color-bg-tertiary)', borderRadius: '12px', padding: '4px', border: '1px solid var(--color-border)' }}>
          <NavLink to="/" end style={({ isActive }) => ({
            padding: '8px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '13.5px',
            background: isActive ? 'var(--color-bg-card)' : 'transparent',
            color: isActive ? '#6366f1' : 'var(--color-text-secondary)',
          })}>Dashboard</NavLink>
          <NavLink to="/create" style={({ isActive }) => ({
            padding: '8px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '13.5px',
            background: isActive ? 'var(--color-bg-card)' : 'transparent',
            color: isActive ? '#6366f1' : 'var(--color-text-secondary)',
          })}>Create Ticket</NavLink>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LiveISTClock />

          {openCount > 0 && (
            <div style={{ background: '#312e81', color: '#a5b4fc', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700 }}>
              {openCount} Open
            </div>
          )}

          <button onClick={toggleTheme} style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button onClick={() => navigate('/create')} className="btn btn-primary" style={{ padding: '10px 18px' }}>
            + New Ticket
          </button>
        </div>
      </div>
    </nav>
  )
}

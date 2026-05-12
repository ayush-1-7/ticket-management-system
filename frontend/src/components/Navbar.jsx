import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useTickets } from '../context/TicketContext'

function LiveISTClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        day: 'numeric',
        month: 'short',
      })
      setTime(now.replace(',', ' •'))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      fontSize: '12px',
      fontWeight: 500,
      color: '#a5b4fc',
      background: 'rgba(165,180,252,0.08)',
      padding: '5px 10px',
      borderRadius: '8px',
      border: '1px solid rgba(165,180,252,0.15)',
      whiteSpace: 'nowrap',
      minWidth: '135px',
      textAlign: 'center',
    }}>
      {time} IST
    </div>
  )
}

export default function Navbar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { tickets } = useTickets()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openCount = tickets.filter(t => t.status === 'Open').length

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: scrolled ? 'var(--color-nav-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
      borderBottom: scrolled ? '1px solid var(--color-nav-border)' : 'none',
      transition: 'all var(--transition-base)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '21px' }}>T</span>
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>TicketFlow</div>
            <div style={{ fontSize: '9px', color: '#64748b', marginTop: '-4px' }}>MULTI-DOMAIN</div>
          </div>
        </div>

        {/* Center Navigation */}
        <div style={{ display: 'flex', background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '4px' }}>
          <NavLink to="/" end style={({ isActive }) => ({
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: 600,
            color: isActive ? '#6366f1' : 'var(--color-text-secondary)',
            background: isActive ? 'var(--color-bg-card)' : 'transparent',
          })}>Dashboard</NavLink>
          <NavLink to="/create" style={({ isActive }) => ({
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: 600,
            color: isActive ? '#6366f1' : 'var(--color-text-secondary)',
            background: isActive ? 'var(--color-bg-card)' : 'transparent',
          })}>Create Ticket</NavLink>
        </div>

        {/* Right Side - Compact Layout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
          
          {/* Live IST Clock */}
          <LiveISTClock />

          {/* Open Count */}
          {openCount > 0 && (
            <div style={{
              background: '#312e81',
              color: '#c4d0ff',
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
            }}>
              {openCount} Open
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0,
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* New Ticket Button */}
          <button
            onClick={() => navigate('/create')}
            className="btn btn-primary"
            style={{ padding: '9px 18px', fontSize: '13.5px', whiteSpace: 'nowrap' }}
          >
            + New Ticket
          </button>
        </div>
      </div>
    </nav>
  )
}

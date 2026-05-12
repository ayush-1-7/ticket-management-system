import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
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
      background: scrolled ? 'var(--color-nav-bg)' : 'rgba(10, 12, 20, 0.8)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid var(--color-border)',
      transition: 'all var(--transition-base)',
    }}>
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0 20px', 
        height: '72px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '20px' 
      }}>

        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '22px' }}>T</span>
          </div>
          <div className="hidden sm:block">
            <div style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>TicketFlow</div>
            <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '-4px', fontWeight: 700 }}>MULTI-DOMAIN</div>
          </div>
        </div>

        {/* Center Navigation - Hidden on very small screens */}
        <div style={{ 
          display: 'flex', 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid var(--border-glass)', 
          borderRadius: '14px', 
          padding: '4px',
          margin: '0 auto'
        }}>
          <NavLink to="/" end style={({ isActive }) => ({
            padding: '8px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            color: isActive ? '#818cf8' : 'var(--text-muted)',
            background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
            transition: 'all 0.2s'
          })}>Dashboard</NavLink>
          <NavLink to="/create" style={({ isActive }) => ({
            padding: '8px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            color: isActive ? '#818cf8' : 'var(--text-muted)',
            background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
            transition: 'all 0.2s'
          })}>Create Ticket</NavLink>
        </div>

        {/* Right Side - Optimized for no overlap */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          
          <div className="hidden lg:block">
            <LiveISTClock />
          </div>

          {openCount > 0 && (
            <div className="badge" style={{ background: 'rgba(124, 77, 255, 0.15)', color: '#a78bfa', border: '1px solid rgba(124, 77, 255, 0.2)' }}>
              {openCount} Open
            </div>
          )}



          <button
            onClick={() => navigate('/create')}
            className="btn btn-primary"
            style={{ 
              padding: '10px 18px', 
              fontSize: '14px', 
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
            <span className="hidden md:inline">New Ticket</span>
            <span className="md:hidden">New</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

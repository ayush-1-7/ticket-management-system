import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTickets } from '../context/TicketContext'
import { Clock, LayoutDashboard, PlusCircle, Ticket, Zap } from 'lucide-react'

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
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[12px] font-medium text-indigo-300/80 backdrop-blur-md">
      <Clock className="w-3.5 h-3.5 text-indigo-400" />
      <span className="tabular-nums">{time} IST</span>
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08] py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:-rotate-6">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tighter text-white group-hover:text-indigo-400 transition-colors">
              Ticket<span className="text-indigo-500">Flow</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase leading-none">
              Systems Enterprise
            </p>
          </div>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center bg-white/[0.03] border border-white/[0.05] rounded-2xl p-1 backdrop-blur-md">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `
              flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300
              ${isActive 
                ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
            `}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/create" 
            className={({ isActive }) => `
              flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300
              ${isActive 
                ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
            `}
          >
            <PlusCircle className="w-4 h-4" />
            Create
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden lg:block">
            <LiveISTClock />
          </div>

          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

          {openCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-bold animate-pulse">
              <Zap className="w-3 h-3 fill-amber-500" />
              {openCount} ACTIVE
            </div>
          )}

          <button
            onClick={() => navigate('/create')}
            className="btn-premium !px-4 sm:!px-6"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Ticket</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

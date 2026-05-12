import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-dark-800/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 opacity-90 group-hover:opacity-100 transition-opacity" />
              <svg className="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">Ticket<span className="gradient-text">Flow</span></span>
              <span className="hidden sm:block text-[10px] text-slate-500 font-medium -mt-0.5 tracking-wide uppercase">Multi-Domain Management</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 shadow-glow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/create"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 shadow-glow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              Create Ticket
            </NavLink>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/create')}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-semibold hover:from-indigo-400 hover:to-violet-400 transition-all duration-200 shadow-glow-sm hover:shadow-glow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Ticket
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 py-3 space-y-1 animate-slide-down">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Dashboard</NavLink>
            <NavLink to="/create" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Create Ticket</NavLink>
          </div>
        )}
      </div>
    </nav>
  )
}

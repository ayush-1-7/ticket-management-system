import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PriorityBadge, StatusBadge, DomainBadge } from './Badge'
import { Calendar, Trash2, ArrowUpRight, Hash } from 'lucide-react'
import GlassCard from './ui/GlassCard'
import { motion } from 'framer-motion'

function formatIST(dateStr) {
  if (!dateStr) return { full: '—', relative: '—' }
  
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
  const priorityColor = { 
    Low: 'border-emerald-500/20', 
    Medium: 'border-amber-500/20', 
    High: 'border-rose-500/20', 
    Critical: 'border-red-600/30' 
  }[ticket.priority] || 'border-white/10'
  
  const accentGradient = { 
    Low: 'from-emerald-500/20 to-transparent', 
    Medium: 'from-amber-500/20 to-transparent', 
    High: 'from-rose-500/20 to-transparent', 
    Critical: 'from-red-600/20 to-transparent' 
  }[ticket.priority] || 'from-indigo-500/20 to-transparent'

  const { full, relative } = formatIST(ticket.created_at)

  return (
    <GlassCard 
      tilt 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        ease: [0.23, 1, 0.32, 1]
      }}
      className={`group overflow-hidden border-t-2 ${priorityColor} p-0`}
    >
      {/* Accent Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

      <div className="p-5 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/[0.05] px-2 py-0.5 rounded-md border border-white/[0.05]">
              <Hash className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] font-black text-slate-300 tracking-tighter">
                {ticket.id}
              </span>
            </div>
            <DomainBadge domain={ticket.domain} />
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider" title={full}>
            <Calendar className="w-3 h-3" />
            {relative}
          </div>
        </div>

        <h3 className="text-base font-black text-white group-hover:text-indigo-400 transition-colors mb-2 leading-tight tracking-tight">
          {ticket.title}
        </h3>

        <p className="line-clamp-2 text-xs text-slate-400 font-medium mb-5 leading-relaxed">
          {ticket.description}
        </p>

        <div className="flex items-center gap-2 mb-6">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-white/[0.05]">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/tickets/${ticket.id}`)} 
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/[0.05] hover:bg-indigo-500 text-indigo-400 hover:text-white border border-indigo-500/30 hover:border-indigo-500 text-[12px] font-black uppercase tracking-[0.1em] transition-all duration-300"
          >
            Details
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(ticket.id)} 
            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </GlassCard>
  )
}

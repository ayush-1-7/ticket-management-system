import React from 'react'
import { Ticket, Mail, Zap, Flame, BarChart3 } from 'lucide-react'
import GlassCard from './ui/GlassCard'

function StatCard({ label, value, color, icon: Icon, subtext, index }) {
  const colorMap = {
    blue: { 
      icon: 'bg-indigo-500 shadow-indigo-500/20 text-white', 
      value: 'text-indigo-400',
      accent: 'bg-indigo-500/10'
    },
    violet: { 
      icon: 'bg-purple-500 shadow-purple-500/20 text-white', 
      value: 'text-purple-400',
      accent: 'bg-purple-500/10'
    },
    red: { 
      icon: 'bg-rose-500 shadow-rose-500/20 text-white', 
      value: 'text-rose-400',
      accent: 'bg-rose-500/10'
    },
    amber: { 
      icon: 'bg-amber-500 shadow-amber-500/20 text-white', 
      value: 'text-amber-400',
      accent: 'bg-amber-500/10'
    },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <GlassCard 
      tilt 
      className="p-5 group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <p className={`text-3xl font-black ${c.value} tracking-tighter tabular-nums`}>
              {value}
            </p>
          </div>
          {subtext && <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wide">{subtext}</p>}
        </div>
        <div className={`w-10 h-10 ${c.icon} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${c.accent} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
    </GlassCard>
  )
}

function DomainBar({ domain, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  const colors = {
    Engineering: 'from-indigo-500 to-blue-400',
    DevOps: 'from-cyan-500 to-teal-400',
    HR: 'from-pink-500 to-rose-400',
    IT: 'from-emerald-500 to-teal-400',
    Finance: 'from-amber-500 to-yellow-400',
  }
  return (
    <div className="space-y-1.5 group">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-indigo-400 transition-colors">{domain}</span>
        <span className="text-[11px] font-black text-slate-300 tabular-nums">{count} <span className="text-slate-500 font-medium">({pct}%)</span></span>
      </div>
      <div className="bg-white/[0.03] rounded-full h-1.5 border border-white/[0.05] overflow-hidden">
        <div
          className={`bg-gradient-to-r ${colors[domain] || 'from-indigo-500 to-indigo-400'} h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(99,102,241,0.3)]`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function SummaryCards({ summary }) {
  if (!summary) return null
  const { total_tickets, tickets_per_domain, tickets_per_status, high_priority_count } = summary

  return (
    <div className="mb-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard index={0} label="Total Tickets" value={total_tickets} color="blue" icon={Ticket} subtext="All time" />
        <StatCard index={1} label="Open Items" value={tickets_per_status?.Open || 0} color="amber" icon={Mail} subtext="Awaiting action" />
        <StatCard index={2} label="In Progress" value={tickets_per_status?.['In Progress'] || 0} color="violet" icon={Zap} subtext="Being resolved" />
        <StatCard index={3} label="Urgent/Critical" value={high_priority_count} color="red" icon={Flame} subtext="High Priority" />
      </div>

      <GlassCard className="p-6 relative overflow-hidden group">
        <div className="flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-4">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-[0.1em]">Domain Analytics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
          {Object.entries(tickets_per_domain || {}).map(([domain, count]) => (
            <DomainBar key={domain} domain={domain} count={count} total={total_tickets} />
          ))}
        </div>
        
        {/* Subtle background glow */}
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      </GlassCard>
    </div>
  )
}

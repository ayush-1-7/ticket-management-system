import React from 'react'

function StatCard({ label, value, color, icon, subtext }) {
  const colorMap = {
    blue: { bg: 'from-indigo-500/10 to-blue-500/5', border: 'border-indigo-500/10', icon: 'from-indigo-500 to-blue-500', value: 'text-indigo-400' },
    violet: { bg: 'from-violet-500/10 to-purple-500/5', border: 'border-violet-500/10', icon: 'from-violet-500 to-purple-500', value: 'text-violet-400' },
    emerald: { bg: 'from-emerald-500/10 to-green-500/5', border: 'border-emerald-500/10', icon: 'from-emerald-500 to-green-500', value: 'text-emerald-400' },
    red: { bg: 'from-red-500/10 to-rose-500/5', border: 'border-red-500/10', icon: 'from-red-500 to-rose-500', value: 'text-red-400' },
    amber: { bg: 'from-amber-500/10 to-yellow-500/5', border: 'border-amber-500/10', icon: 'from-amber-500 to-yellow-500', value: 'text-amber-400' },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <div className={`glass-card glass-card-hover bg-gradient-to-br ${c.bg} border ${c.border} p-5 transition-all duration-300 group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-1.5 ${c.value} animate-counter`}>{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className={`w-10 h-10 bg-gradient-to-br ${c.icon} rounded-xl flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
          <span className="text-lg filter drop-shadow-sm">{icon}</span>
        </div>
      </div>
    </div>
  )
}

function DomainBar({ domain, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  const colors = {
    Engineering: 'from-indigo-500 to-indigo-400',
    DevOps: 'from-cyan-500 to-cyan-400',
    HR: 'from-pink-500 to-pink-400',
    IT: 'from-teal-500 to-teal-400',
    Finance: 'from-amber-500 to-amber-400',
  }
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-xs text-slate-400 w-24 shrink-0 font-medium group-hover:text-slate-300 transition-colors">{domain}</span>
      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${colors[domain] || 'from-indigo-500 to-indigo-400'} h-2 rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-300 w-8 text-right tabular-nums">{count}</span>
    </div>
  )
}

export default function SummaryCards({ summary }) {
  if (!summary) return null
  const { total_tickets, tickets_per_domain, tickets_per_status, high_priority_count } = summary

  return (
    <div className="mb-8 animate-slide-up">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Tickets" value={total_tickets} color="blue" icon="🎫" subtext="All time" />
        <StatCard label="Open" value={tickets_per_status?.Open || 0} color="amber" icon="📬" subtext="Awaiting action" />
        <StatCard label="In Progress" value={tickets_per_status?.['In Progress'] || 0} color="violet" icon="⚡" subtext="Being resolved" />
        <StatCard label="High Priority" value={high_priority_count} color="red" icon="🔥" subtext="High + Critical" />
      </div>

      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Tickets by Domain</h3>
        <div className="space-y-3">
          {Object.entries(tickets_per_domain).map(([domain, count]) => (
            <DomainBar key={domain} domain={domain} count={count} total={total_tickets} />
          ))}
        </div>
      </div>
    </div>
  )
}

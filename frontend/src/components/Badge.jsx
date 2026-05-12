import React from 'react'

const PRIORITY_STYLES = {
  Low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  High: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  Critical: 'bg-red-500/10 text-red-400 border border-red-500/20',
}

const STATUS_STYLES = {
  'Open': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'In Progress': 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  'Closed': 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
}

const DOMAIN_STYLES = {
  Engineering: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  DevOps: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
  HR: 'bg-pink-500/10 text-pink-400 border border-pink-500/20',
  IT: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
  Finance: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
}

const PRIORITY_DOTS = {
  Low: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  High: 'bg-orange-400',
  Critical: 'bg-red-400',
}

const STATUS_DOTS = {
  'Open': 'bg-blue-400',
  'In Progress': 'bg-violet-400 animate-pulse',
  'Closed': 'bg-slate-500',
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_STYLES[priority] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOTS[priority] || 'bg-slate-400'} ${priority === 'Critical' ? 'glow-dot animate-pulse' : ''}`} />
      {priority}
    </span>
  )
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status] || 'bg-slate-400'}`} />
      {status}
    </span>
  )
}

export function DomainBadge({ domain }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${DOMAIN_STYLES[domain] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
      {domain}
    </span>
  )
}

import React from 'react'

const DOMAINS = ['Engineering', 'DevOps', 'HR', 'IT', 'Finance']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']
const STATUSES = ['Open', 'In Progress', 'Closed']

export default function FilterBar({ filters, onChange, onReset }) {
  const hasActive = filters.domain || filters.priority || filters.status || filters.search
  const activeCount = [filters.domain, filters.priority, filters.status, filters.search].filter(Boolean).length

  const selectBase = "text-sm bg-dark-800 border border-white/10 rounded-xl px-3 py-2.5 text-slate-300 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 cursor-pointer transition-all duration-200 hover:border-white/20 appearance-none"

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tickets..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-dark-800 border border-white/10 rounded-xl text-slate-300 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-200 hover:border-white/20"
          />
        </div>

        {/* Domain */}
        <select
          value={filters.domain}
          onChange={(e) => onChange({ ...filters, domain: e.target.value })}
          className={selectBase}
        >
          <option value="">All Domains</option>
          {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Priority */}
        <select
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          className={selectBase}
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className={selectBase}
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Clear */}
        {hasActive && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all duration-200 font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear {activeCount > 1 ? `(${activeCount})` : ''}
          </button>
        )}
      </div>
    </div>
  )
}

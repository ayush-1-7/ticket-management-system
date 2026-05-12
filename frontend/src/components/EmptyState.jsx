import React from 'react'
import { Link } from 'react-router-dom'

export default function EmptyState({ filtered = false }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/10 rounded-2xl flex items-center justify-center mb-5 animate-float">
        <svg className="w-10 h-10 text-indigo-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">
        {filtered ? 'No matching tickets' : 'No tickets yet'}
      </h3>
      <p className="text-slate-500 text-sm text-center max-w-xs mb-6">
        {filtered
          ? 'Try clearing your filters or adjusting your search criteria.'
          : 'Create your first ticket to start tracking issues across teams.'}
      </p>
      {!filtered && (
        <Link
          to="/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-sm font-semibold hover:from-indigo-400 hover:to-violet-400 transition-all duration-200 shadow-glow-sm hover:shadow-glow"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create First Ticket
        </Link>
      )}
    </div>
  )
}

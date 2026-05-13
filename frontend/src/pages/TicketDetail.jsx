import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTickets } from '../context/TicketContext'
import { useToast } from '../components/Toast'

const STATUS_STEPS = ['Open', 'In Progress', 'Closed']
const DOMAINS = ['Engineering', 'DevOps', 'HR', 'IT', 'Finance']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

const PRIORITY_THEMES = {
  Low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  High: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  Critical: 'text-red-400 bg-red-400/10 border-red-400/20'
}

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTicket, updateTicket, deleteTicket, loading, error: contextError } = useTickets()
  const toast = useToast()

  const [ticket, setTicket] = useState(null)
  const [form, setForm] = useState({ domain: '', priority: '', status: '' })
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicket(id)
        if (data) {
          setTicket(data)
          setForm({ domain: data.domain, priority: data.priority, status: data.status })
        }
      } catch (err) {
        setLocalError('Ticket not found or access denied.')
      }
    }
    fetchTicket()
  }, [id, getTicket])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setLocalError(null)
    try {
      const updated = await updateTicket(id, form)
      setTicket(updated)
      toast('Ticket updated successfully', 'success')
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you absolutely sure? This action cannot be undone.')) return
    setDeleting(true)
    try {
      await deleteTicket(id)
      toast('Ticket deleted permanently', 'success')
      navigate('/')
    } catch (err) {
      setLocalError(err.message)
      setDeleting(false)
    }
  }

  if (loading && !ticket) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-slate-500 font-medium animate-pulse">Retrieving ticket details...</p>
    </div>
  )

  if (localError || contextError) return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
      <p className="text-slate-400 mb-8">{localError || contextError}</p>
      <Link to="/" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-white font-bold hover:bg-white/10 transition-all">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>
    </div>
  )

  if (!ticket) return null

  const currentStepIndex = STATUS_STEPS.indexOf(ticket.status)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header & Breadcrumbs */}
      <nav className="flex items-center gap-3 mb-8 text-sm text-slate-500 font-medium">
        <Link to="/" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Dashboard
        </Link>
        <span className="text-slate-700">/</span>
        <span className="text-slate-200">Ticket #{String(ticket.id).slice(0, 8)}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <section className="bg-[#0A0A0B]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32" />
            
            <header className="relative space-y-4 mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${PRIORITY_THEMES[ticket.priority]}`}>
                  {ticket.priority} Priority
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-400">
                  {ticket.domain}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {ticket.title}
              </h1>
            </header>

            <div className="relative space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </h3>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
                {ticket.description}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/[0.05]">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Created By</p>
                <p className="text-sm font-bold text-slate-200">System User</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Created At</p>
                <p className="text-sm font-bold text-slate-200">{new Date(ticket.created_at).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ticket ID</p>
                <p className="text-sm font-mono font-bold text-slate-400">#{String(ticket.id).slice(0, 8)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Activity</p>
                <p className="text-sm font-bold text-slate-200">Just now</p>
              </div>
            </div>
          </section>

          {/* Status Timeline */}
          <section className="bg-[#0A0A0B]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lifecycle Progress
            </h3>
            <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 sm:gap-4 px-4">
              {/* Connector Line */}
              <div className="absolute left-[19px] sm:left-0 top-0 sm:top-5 bottom-0 sm:bottom-auto w-[2px] sm:w-full h-full sm:h-[2px] bg-white/[0.05]" />
              <div 
                className="absolute left-[19px] sm:left-0 top-0 sm:top-5 h-0 sm:h-[2px] w-[2px] sm:w-0 bg-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                style={{ 
                  width: window.innerWidth > 640 ? `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` : '2px',
                  height: window.innerWidth > 640 ? '2px' : `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`
                }}
              />

              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex
                const isActive = idx === currentStepIndex
                return (
                  <div key={step} className="relative z-10 flex sm:flex-col items-center gap-4 sm:gap-3 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                      isActive 
                        ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-110' 
                        : isCompleted 
                          ? 'bg-indigo-900/50 border-indigo-500' 
                          : 'bg-dark-800 border-white/10 group-hover:border-white/30'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-slate-400 transition-colors" />
                      )}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-500 ${
                      isActive ? 'text-indigo-400' : isCompleted ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Sidebar / Actions */}
        <aside className="w-full lg:w-80 space-y-8">
          <section className="bg-[#0A0A0B]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Update Details</h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Domain</label>
                <select 
                  value={form.domain}
                  onChange={(e) => setForm({...form, domain: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all"
                >
                  {DOMAINS.map(d => <option key={d} value={d} className="bg-[#0A0A0B]">{d}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Priority</label>
                <select 
                  value={form.priority}
                  onChange={(e) => setForm({...form, priority: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all"
                >
                  {PRIORITIES.map(p => <option key={p} value={p} className="bg-[#0A0A0B]">{p}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Status</label>
                <select 
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all"
                >
                  {STATUS_STEPS.map(s => <option key={s} value={s} className="bg-[#0A0A0B]">{s}</option>)}
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={updating}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-xl text-sm font-bold shadow-xl hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {updating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
              </motion.button>
            </form>
          </section>

          <section className="bg-red-500/[0.02] backdrop-blur-xl border border-red-500/10 rounded-[2rem] p-8 shadow-2xl">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4">Danger Zone</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Once deleted, a ticket cannot be recovered. All associated data will be purged.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDelete}
              disabled={deleting}
              className="w-full bg-red-500/10 border border-red-500/20 text-red-400 py-3 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              {deleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Delete Ticket'}
            </motion.button>
          </section>
        </aside>
      </div>
    </motion.div>
  )
}

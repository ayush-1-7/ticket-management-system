import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTickets } from '../context/TicketContext'
import { useToast } from '../components/Toast'

const DOMAINS = ['Engineering', 'DevOps', 'HR', 'IT', 'Finance']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

const PRIORITY_INFO = {
  Low: { color: 'text-emerald-400', desc: 'Minor issue, no urgency' },
  Medium: { color: 'text-amber-400', desc: 'Should be addressed soon' },
  High: { color: 'text-orange-400', desc: 'Needs prompt attention' },
  Critical: { color: 'text-red-400', desc: 'Immediate action required' },
}

const INITIAL = { title: '', description: '', domain: '', priority: '', status: 'Open' }

export default function CreateTicket() {
  const navigate = useNavigate()
  const { createTicket } = useTickets()
  const toast = useToast()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    else if (form.title.trim().length < 3) e.title = 'At least 3 characters required'
    else if (form.title.trim().length > 255) e.title = 'Max 255 characters'
    if (!form.description.trim()) e.description = 'Description is required'
    else if (form.description.trim().length < 10) e.description = 'At least 10 characters required'
    if (!form.domain) e.domain = 'Please select a domain'
    if (!form.priority) e.priority = 'Please select a priority'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (apiError) setApiError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErrors(v); return }
    setSubmitting(true)
    setApiError(null)
    try {
      await createTicket(form)
      toast('Ticket created successfully', 'success')
      navigate('/')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputBase = 'w-full bg-white/[0.03] border rounded-2xl px-5 py-3.5 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:outline-none transition-all duration-300'
  const inputOk = `${inputBase} border-white/[0.08] focus:ring-indigo-500/30 focus:border-indigo-500/40 hover:bg-white/[0.05] hover:border-white/[0.12]`
  const inputErr = `${inputBase} border-red-500/30 focus:ring-red-500/20 bg-red-500/5`

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 mb-10 text-sm text-slate-500 font-medium">
        <Link to="/" className="hover:text-indigo-400 transition-colors flex items-center gap-2 group">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Dashboard
        </Link>
        <span className="text-slate-700">/</span>
        <span className="text-slate-200">Create New Ticket</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">
          Create New Ticket
        </h1>
        <p className="text-slate-400 text-lg mt-3 font-medium">
          Submit a technical issue or request to the domain experts.
        </p>
      </header>

      <div className="relative group">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-[#0A0A0B]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-2xl">
          {/* Animated top border */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              {apiError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 flex items-start gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl"
                >
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-400">Submission Error</h3>
                    <p className="text-sm text-red-400/80 mt-1 leading-relaxed">{apiError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Section */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-bold text-slate-300 ml-1">
                  <span>Title <span className="text-indigo-400 ml-1">*</span></span>
                  <span className={`text-[10px] uppercase tracking-wider font-bold transition-colors ${form.title.length > 250 ? 'text-red-400' : 'text-slate-600'}`}>
                    {form.title.length} / 255
                  </span>
                </label>
                <motion.input
                  whileFocus={{ scale: 1.005 }}
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Memory leak in background worker service"
                  className={errors.title ? inputErr : inputOk}
                />
                {errors.title && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xs font-semibold text-red-400 ml-1">
                    {errors.title}
                  </motion.p>
                )}
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 ml-1">
                  Description <span className="text-indigo-400 ml-1">*</span>
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.005 }}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed breakdown of the issue, steps to reproduce, and any relevant logs..."
                  rows={6}
                  className={errors.description ? inputErr : inputOk}
                />
                {errors.description && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xs font-semibold text-red-400 ml-1">
                    {errors.description}
                  </motion.p>
                )}
              </div>

              {/* Domain & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-300 ml-1">
                    Domain <span className="text-indigo-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="domain"
                      value={form.domain}
                      onChange={handleChange}
                      className={`${errors.domain ? inputErr : inputOk} appearance-none cursor-pointer`}
                    >
                      <option value="" disabled className="bg-[#0A0A0B]">Select Domain</option>
                      {DOMAINS.map(d => <option key={d} value={d} className="bg-[#0A0A0B]">{d}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.domain && <p className="text-xs font-semibold text-red-400 ml-1">{errors.domain}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-300 ml-1">
                    Priority <span className="text-indigo-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className={`${errors.priority ? inputErr : inputOk} appearance-none cursor-pointer`}
                    >
                      <option value="" disabled className="bg-[#0A0A0B]">Select Priority</option>
                      {PRIORITIES.map(p => <option key={p} value={p} className="bg-[#0A0A0B]">{p}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.priority && <p className="text-xs font-semibold text-red-400 ml-1">{errors.priority}</p>}
                  <AnimatePresence>
                    {form.priority && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 mt-2 ml-1"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${PRIORITY_INFO[form.priority]?.color.replace('text-', 'bg-')}`} />
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${PRIORITY_INFO[form.priority]?.color}`}>
                          {PRIORITY_INFO[form.priority]?.desc}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Form Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="flex-1 relative group/btn"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-30 group-hover/btn:opacity-60 transition duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 px-8 rounded-2xl text-sm font-bold shadow-xl transition-all duration-300 group-hover/btn:from-indigo-500 group-hover/btn:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Submit Ticket</span>
                      </>
                    )}
                  </div>
                </motion.button>
                
                <Link
                  to="/"
                  className="px-8 py-4 bg-white/[0.03] border border-white/[0.08] text-slate-400 rounded-2xl text-sm font-bold hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] transition-all duration-300 flex items-center justify-center"
                >
                  Discard
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center">
        <p className="text-slate-600 text-xs font-medium flex items-center justify-center gap-2">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Tickets are automatically assigned to the domain team for review.
        </p>
      </footer>
    </motion.div>
  )
}

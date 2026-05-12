import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTickets } from '../context/TicketContext'
import { useToast } from '../components/Toast'

const DOMAINS = ['Engineering', 'DevOps', 'HR', 'IT', 'Finance']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

const PRIORITY_INFO = {
  Low: { color: 'text-emerald-400', desc: 'Minor issue, no urgency' },
  Medium: { color: 'text-amber-400', desc: 'Should be resolved soon' },
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

  const inputBase = 'w-full bg-dark-800 border rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-2 transition-all duration-200'
  const inputOk = `${inputBase} border-white/10 focus:ring-indigo-500/40 focus:border-indigo-500/50 hover:border-white/20`
  const inputErr = `${inputBase} border-red-500/40 focus:ring-red-500/30 bg-red-500/5`

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-indigo-400 transition-colors">Dashboard</Link>
        <span className="text-slate-600">›</span>
        <span className="text-slate-300 font-medium">Create Ticket</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Create New Ticket</h1>
        <p className="text-slate-500 text-sm mt-1">Submit a ticket to the appropriate domain team</p>
      </div>

      <div className="glass-card overflow-hidden">
        {/* Gradient header bar */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />

        <div className="p-6">
          {/* API Error */}
          {apiError && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-400">Submission Failed</p>
                <p className="text-sm text-red-400/80 mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Server CPU Spike in Production"
                className={errors.title ? inputErr : inputOk}
              />
              <div className="flex justify-between mt-1">
                {errors.title
                  ? <p className="text-xs text-red-400">{errors.title}</p>
                  : <span />
                }
                <span className="text-xs text-slate-600">{form.title.length}/255</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail — what happened, when, impact..."
                rows={5}
                className={errors.description ? inputErr : inputOk}
              />
              {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
            </div>

            {/* Domain + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Domain <span className="text-red-400">*</span>
                </label>
                <select
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                  className={errors.domain ? inputErr : inputOk}
                >
                  <option value="">Select Domain</option>
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.domain && <p className="text-xs text-red-400 mt-1">{errors.domain}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Priority <span className="text-red-400">*</span>
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className={errors.priority ? inputErr : inputOk}
                >
                  <option value="">Select Priority</option>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.priority && <p className="text-xs text-red-400 mt-1">{errors.priority}</p>}
                {form.priority && (
                  <p className={`text-xs mt-1 font-medium ${PRIORITY_INFO[form.priority]?.color}`}>
                    {PRIORITY_INFO[form.priority]?.desc}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white py-3 px-6 rounded-xl text-sm font-semibold hover:from-indigo-400 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-glow-sm hover:shadow-glow"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Ticket
                  </>
                )}
              </button>
              <Link
                to="/"
                className="px-5 py-3 border border-white/10 text-slate-400 rounded-xl text-sm font-semibold hover:bg-white/5 hover:text-white transition-all duration-200"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

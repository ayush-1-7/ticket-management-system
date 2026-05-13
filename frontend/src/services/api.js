import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60 seconds — handles Render cold start
})

// Retry helper
async function withRetry(fn, retries = 3, delayMs = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      return await fn()
    } catch (err) {
      const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout')
      const isNetwork = !err.response || err.response?.status >= 500
      const isLast = i === retries

      if (isLast || (!isTimeout && !isNetwork)) throw err

      console.warn(`[API] Attempt ${i} failed. Retrying in ${delayMs * i}ms...`)
      await new Promise(r => setTimeout(r, delayMs * i))
    }
  }
}

api.interceptors.response.use(
  res => res,
  error => {
    let message = 'An unexpected error occurred'

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message = 'Request timed out. Backend is waking up — please try again in 30 seconds.'
    } else if (!error.response) {
      message = 'Cannot reach server. Please check your connection and try again.'
    } else if (error.response.status === 503) {
      message = 'Server is starting up. Please wait and try again.'
    } else if (error.response.status === 404) {
      message = error.response.data?.detail || 'Resource not found.'
    } else if (error.response?.data?.errors) {
      message = error.response.data.errors.map(e => `${e.field}: ${e.message}`).join(', ')
    } else if (error.response?.data?.detail) {
      message = error.response.data.detail
    }

    return Promise.reject(new Error(message))
  }
)

export const ticketAPI = {
  getAll: (filters = {}) => {
    const params = {}
    if (filters.domain) params.domain = filters.domain
    if (filters.priority) params.priority = filters.priority
    if (filters.status) params.status = filters.status
    if (filters.search) params.search = filters.search
    return withRetry(() => api.get('/tickets/', { params }))
  },

  getById: (id) => withRetry(() => api.get(`/tickets/${id}`)),

  create: (data) => withRetry(() => api.post('/tickets/', data), 2, 5000),

  update: (id, data) => withRetry(() => api.put(`/tickets/${id}`, data), 2, 3000),

  delete: (id) => withRetry(() => api.delete(`/tickets/${id}`), 2, 3000),

  getSummary: () => withRetry(() => api.get('/tickets/summary')),

  healthCheck: () => withRetry(() => api.get('/health'), 5, 5000),
}

export default api

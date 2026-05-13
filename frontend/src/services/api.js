import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60 seconds — handles Render cold start
})

// Retry helper with exponential backoff and jitter
async function withRetry(fn, retries = 5, delayMs = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      return await fn()
    } catch (err) {
      const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout')
      const isNetwork = !err.response || [502, 503, 504].includes(err.response?.status)
      const isLast = i === retries

      if (isLast || (!isTimeout && !isNetwork)) throw err

      // Increase delay progressively: 2s, 4s, 8s, 16s...
      const currentDelay = delayMs * Math.pow(2, i - 1)
      console.warn(`[API] Attempt ${i} failed (${err.message}). Retrying in ${currentDelay}ms...`)
      await new Promise(r => setTimeout(r, currentDelay))
    }
  }
}

api.interceptors.response.use(
  res => {
    const processTime = res.headers['x-process-time']
    if (processTime) {
      console.log(`[API] ${res.config.url} took ${processTime}s (backend)`)
    }
    return res
  },
  error => {
    let message = 'An unexpected error occurred'

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message = 'Backend is waking up (Cold Start). Please wait a few seconds...'
    } else if (!error.response) {
      message = 'Cannot reach server. It might be spinning up — please wait.'
    } else if ([502, 503, 504].includes(error.response?.status)) {
      message = 'Gateway is waking up the backend. Hang tight...'
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

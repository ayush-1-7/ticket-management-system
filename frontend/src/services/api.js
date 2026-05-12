import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.data?.errors) {
      const msgs = error.response.data.errors
        .map(e => `${e.field}: ${e.message}`)
        .join(', ')
      return Promise.reject(new Error(msgs))
    }
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
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
    return api.get('/tickets/', { params })
  },
  getById: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post('/tickets/', data),
  update: (id, data) => api.put(`/tickets/${id}`, data),
  delete: (id) => api.delete(`/tickets/${id}`),
  getSummary: () => api.get('/tickets/summary'),
}

export default api

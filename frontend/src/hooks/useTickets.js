import { useState, useEffect } from 'react'
import { ticketAPI } from '../services/api'

export function useTicket(id) {
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    ticketAPI.getById(id)
      .then(res => setTicket(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return { ticket, loading, error, setTicket }
}

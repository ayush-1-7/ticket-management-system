import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PriorityBadge, DomainBadge } from './Badge'
import { useTickets } from '../context/TicketContext'

export default function TicketTable({ tickets, onRefresh }) {
  const navigate = useNavigate()
  const { deleteTicket, updateTicket } = useTickets()
  const [deletingId, setDeletingId] = React.useState(null)

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this ticket?')) return
    setDeletingId(id)
    try {
      await deleteTicket(id)
      if (onRefresh) onRefresh()
    } catch (err) {
      alert('Failed to delete ticket: ' + err.message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleStatusChange = async (e, ticket) => {
    e.stopPropagation()
    try {
      await updateTicket(ticket.id, { status: e.target.value })
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['ID', 'Title', 'Domain', 'Priority', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-500">#{ticket.id}</td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{ticket.title}</p>
                </td>
                <td className="px-4 py-3"><DomainBadge domain={ticket.domain} /></td>
                <td className="px-4 py-3"><PriorityBadge priority={ticket.priority} /></td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <select
                    value={ticket.status}
                    onChange={e => handleStatusChange(e, ticket)}
                    className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{formatDate(ticket.created_at)}</td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={e => handleDelete(e, ticket.id)}
                    disabled={deletingId === ticket.id}
                    className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 transition-colors"
                  >
                    {deletingId === ticket.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

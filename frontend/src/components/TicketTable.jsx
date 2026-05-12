import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PriorityBadge, StatusBadge, DomainBadge } from './Badge';
import { cn } from '../utils/cn';

export default function TicketTable({ tickets, onDelete }) {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/tickets/${id}`);
  };

  return (
    <div className="premium-card overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-white/[0.04]">#</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-white/[0.04]">Title</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-white/[0.04]">Domain</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-white/[0.04]">Priority</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-white/[0.04]">Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[180px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {tickets.map((ticket, index) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={ticket.id}
                className="group hover:bg-white/[0.04] transition-colors duration-200"
              >
                <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-400 border-r border-white/[0.04]">
                  #{ticket.id}
                </td>
                <td className="px-6 py-4 border-r border-white/[0.04]">
                  <div className="max-w-[300px]">
                    <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1">
                      {ticket.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-r border-white/[0.04]">
                  <DomainBadge domain={ticket.domain} />
                </td>
                <td className="px-6 py-4 border-r border-white/[0.04]">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-6 py-4 border-r border-white/[0.04]">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleView(ticket.id)}
                      className="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDelete(ticket.id)}
                      className="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


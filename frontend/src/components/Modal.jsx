import React from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card shadow-2xl max-w-lg w-full mx-4 p-6 z-10 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-xl leading-none transition-colors w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

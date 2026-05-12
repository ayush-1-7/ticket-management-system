import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastContext = createContext(null)

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const styles = {
    success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
    error: 'bg-red-500/20 border-red-500/30 text-red-300',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium shadow-xl backdrop-blur-xl border animate-slide-up ${styles[type]}`}>
      <span className="text-base">{icons[type]}</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">✕</button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const show = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  const hide = useCallback(() => {
    setToast(null)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

import React from 'react'

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-white/5"></div>
        <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin absolute inset-0"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-indigo-500/30 animate-pulse"></div>
        </div>
      </div>
      <p className="text-slate-500 text-sm mt-5 font-medium">{message}</p>
    </div>
  )
}

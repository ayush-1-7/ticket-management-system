import React from 'react'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-dark-800 rounded-2xl" />
        ))}
      </div>
      <div className="h-12 bg-dark-800 rounded-xl w-full" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-dark-800 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="h-48 bg-dark-800 rounded-2xl animate-pulse" />
  )
}

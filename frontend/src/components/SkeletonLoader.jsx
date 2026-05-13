import React from 'react'

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Summary Skeletons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white/[0.03] border border-white/[0.05] rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-14 bg-white/[0.03] border border-white/[0.05] rounded-2xl w-full" />

      {/* Content Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-white/[0.02] border border-white/[0.05] rounded-3xl" />
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

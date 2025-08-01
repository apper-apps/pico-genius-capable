import React from "react"

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="space-y-4">
        <div className="skeleton h-8 w-3/4 rounded-lg"></div>
        <div className="skeleton h-4 w-1/2 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-4">
          <div className="skeleton h-6 w-1/3 rounded"></div>
          <div className="skeleton h-32 w-full rounded-lg"></div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-6 w-1/3 rounded"></div>
          <div className="skeleton h-32 w-full rounded-lg"></div>
        </div>
      </div>
      
      <div className="space-y-3 mt-8">
        <div className="skeleton h-4 w-full rounded"></div>
        <div className="skeleton h-4 w-5/6 rounded"></div>
        <div className="skeleton h-4 w-4/5 rounded"></div>
        <div className="skeleton h-4 w-3/4 rounded"></div>
      </div>
      
      <div className="flex space-x-4 mt-8">
        <div className="skeleton h-10 w-24 rounded-lg"></div>
        <div className="skeleton h-10 w-20 rounded-lg"></div>
      </div>
    </div>
  )
}

export default Loading
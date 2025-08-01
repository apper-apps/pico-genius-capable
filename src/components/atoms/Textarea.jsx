import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Textarea = forwardRef(({ 
  placeholder,
  error,
  rows = 4,
  className = "",
  ...props 
}, ref) => {
  const baseClasses = "w-full bg-gray-800 border text-white placeholder-gray-400 rounded-lg px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-1 resize-vertical"
  
  const stateClasses = error 
    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
    : "border-gray-600 focus:border-primary-500 focus:ring-primary-500 focus:shadow-glow-sm"

  return (
    <div>
      <textarea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        className={cn(baseClasses, stateClasses, className)}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = "Textarea"

export default Textarea
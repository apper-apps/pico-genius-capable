import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Input = forwardRef(({ 
  type = "text",
  placeholder,
  error,
  icon,
  iconPosition = "left",
  className = "",
  ...props 
}, ref) => {
  const baseClasses = "w-full bg-gray-800 border text-white placeholder-gray-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-1"
  
  const stateClasses = error 
    ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
    : "border-gray-600 focus:border-primary-500 focus:ring-primary-500 focus:shadow-glow-sm"
    
  const paddingClasses = icon 
    ? iconPosition === "left" ? "pl-10 pr-4 py-3" : "pl-4 pr-10 py-3"
    : "px-4 py-3"

  return (
    <div className="relative">
      {icon && iconPosition === "left" && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
        </div>
      )}
      
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={cn(baseClasses, stateClasses, paddingClasses, className)}
        {...props}
      />
      
      {icon && iconPosition === "right" && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input
import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "medium", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className = "",
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white focus:ring-primary-500 shadow-lg hover:shadow-glow-sm",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-gray-500 focus:ring-gray-500",
    ghost: "text-gray-300 hover:text-white hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-lg"
  }
  
  const sizes = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-2.5 text-sm",
    large: "px-6 py-3 text-base"
  }
  
  const iconSizes = {
    small: "w-4 h-4",
    medium: "w-4 h-4", 
    large: "w-5 h-5"
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={cn("animate-spin", iconSizes[size], children ? "mr-2" : "")} 
        />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon 
          name={icon} 
          className={cn(iconSizes[size], children ? "mr-2" : "")} 
        />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon 
          name={icon} 
          className={cn(iconSizes[size], children ? "ml-2" : "")} 
        />
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button
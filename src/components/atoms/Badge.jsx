import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ 
  children, 
  variant = "secondary", 
  size = "medium",
  className = "",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full"
  
  const variants = {
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }
  
  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-2.5 py-0.5 text-xs",
    large: "px-3 py-1 text-sm"
  }

  return (
    <span
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
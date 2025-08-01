import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ 
  children, 
  className = "",
  hover = true,
  gradient = false,
  ...props 
}, ref) => {
  const baseClasses = "bg-gray-800 border border-gray-700 rounded-xl shadow-card transition-all duration-200"
  const hoverClasses = hover ? "hover:shadow-card-hover hover:border-gray-600 transform hover:scale-[1.02]" : ""
  const gradientClasses = gradient ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600" : ""

  return (
    <div
      ref={ref}
      className={cn(baseClasses, hoverClasses, gradientClasses, className)}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card
import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data available",
  description = "Get started by creating your first item.",
  actionLabel = "Get Started",
  onAction,
  icon = "Database",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 shadow-lg hover:shadow-glow-sm"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default Empty
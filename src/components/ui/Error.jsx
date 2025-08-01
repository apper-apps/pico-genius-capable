import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  )
}

export default Error
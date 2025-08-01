import React from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const SerpPreview = ({ results, loading, className = "" }) => {
  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <div className="skeleton w-6 h-6 rounded mr-3"></div>
          <div className="skeleton h-6 w-32 rounded"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-5 w-3/4 rounded"></div>
              <div className="skeleton h-4 w-1/2 rounded"></div>
              <div className="skeleton h-3 w-full rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <ApperIcon name="Globe" className="w-5 h-5 text-primary-400 mr-3" />
        <h3 className="text-lg font-semibold text-white">SERP Preview</h3>
      </div>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={result.position} className="border-l-2 border-gray-700 pl-4 pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" size="small">
                  #{result.position}
                </Badge>
                <span className="text-xs text-gray-500">{result.url}</span>
              </div>
            </div>
            
            <h4 className="text-blue-400 hover:text-blue-300 cursor-pointer mb-1 line-clamp-2">
              {result.title}
            </h4>
            
            <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
              {result.snippet}
            </p>
            
            {result.entities && result.entities.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {result.entities.slice(0, 3).map((entity, i) => (
                  <Badge key={i} variant="primary" size="small">
                    {entity}
                  </Badge>
                ))}
                {result.entities.length > 3 && (
                  <Badge variant="secondary" size="small">
                    +{result.entities.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default SerpPreview